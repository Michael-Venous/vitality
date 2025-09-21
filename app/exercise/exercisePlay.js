import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import Svg, { Circle, Line } from "react-native-svg";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { useTheme } from "../../context/ThemeContext";
import { useSitupCounter } from "../../hooks/useSitupCounter";

const MODEL_INPUT_WIDTH = 192;
const MODEL_INPUT_HEIGHT = 192;
const CONFIDENCE_THRESHOLD = 0.3;
const TARGET_FPS = 24;

// Keypoint Names and Skeleton Connections
const KEYPOINT_NAMES = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
];

const SKELETON_CONNECTIONS = [
  // Torso
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  // Left Arm
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  // Right Arm
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  // Left Leg
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  // Right Leg
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

export default function PoseDetectionCamera() {
  const router = useRouter();
  const theme = useTheme();
  const [facing, setFacing] = useState("front");
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);
  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 1280, height: 720 } },
    { fps: TARGET_FPS },
  ]);
  const { resize } = useResizePlugin();

  const [keypoints, setKeypoints] = useState([]);
  const pushupCount = useSitupCounter(keypoints);
  const [cameraViewDimensions, setCameraViewDimensions] = useState({
    width: 0,
    height: 0,
  });

  const onKeypointsDetected = useCallback((newKeypoints) => {
    setKeypoints(newKeypoints);
  }, []);

  const onKeypointsDetectedJS = useMemo(
    () => Worklets.createRunOnJS(onKeypointsDetected),

    [onKeypointsDetected]
  );

  const findKeypoint = (name) => keypoints.find((kp) => kp.name === name);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const movenetTflite = useTensorflowModel(require("../../assets/ml/4.tflite"));
  const model = useMemo(
    () => (movenetTflite.state === "loaded" ? movenetTflite.model : undefined),
    [movenetTflite.state]
  );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (!model) return;
      try {
        const resized = resize(frame, {
          scale: { width: MODEL_INPUT_WIDTH, height: MODEL_INPUT_HEIGHT },
          pixelFormat: "rgb",
          dataType: "uint8",
        });
        const outputs = model.runSync([resized]);
        const keypointsTensor = outputs[0];
        const parsedKeypoints = [];
        for (let i = 0; i < KEYPOINT_NAMES.length; i++) {
          const offset = i * 3;
          const y = keypointsTensor[offset];
          const x = keypointsTensor[offset + 1];
          const confidence = keypointsTensor[offset + 2];

          if (confidence > CONFIDENCE_THRESHOLD) {
            parsedKeypoints.push({ name: KEYPOINT_NAMES[i], x, y });
          }
        }
        onKeypointsDetectedJS(parsedKeypoints);
      } catch (e) {
        console.error("Error in frame processor:", e);
      }
    },
    [model, resize, onKeypointsDetectedJS]
  );

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }

  const { width: viewWidth, height: viewHeight } = cameraViewDimensions;
  const boxSize = Math.min(viewWidth, viewHeight);
  const offsetX = (viewWidth - boxSize) / 2;
  const offsetY = (viewHeight - boxSize) / 2;

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setCameraViewDimensions({ width, height });
      }}
    >
      <Camera
        style={StyleSheet.absoluteFill}
        format={format}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={12}
      />

      {viewWidth > 0 && viewHeight > 0 && (
        <>
          <View
            style={[
              styles.overlay,
              { top: 0, left: 0, height: offsetY, width: "100%" },
            ]}
          />
          <View
            style={[
              styles.overlay,
              { bottom: 0, left: 0, height: offsetY, width: "100%" },
            ]}
          />
          <View
            style={[
              styles.overlay,
              { top: 0, left: 0, height: "100%", width: offsetX },
            ]}
          />
          <View
            style={[
              styles.overlay,
              { top: 0, right: 0, height: "100%", width: offsetX },
            ]}
          />
        </>
      )}

      <Svg style={StyleSheet.absoluteFill}>
        {viewWidth > 0 && (
          <>
            {SKELETON_CONNECTIONS.map(([startName, endName], index) => {
              const start = findKeypoint(startName);
              const end = findKeypoint(endName);
              if (start && end) {
                return (
                  <Line
                    key={`line-${index}`}
                    x1={(1 - start.y) * boxSize + offsetX}
                    y1={(1 - start.x) * boxSize + offsetY}
                    x2={(1 - end.y) * boxSize + offsetX}
                    y2={(1 - end.x) * boxSize + offsetY}
                    stroke={theme.colors.primary}
                    strokeWidth="5"
                  />
                );
              }
              return null;
            })}

            {keypoints.map((kp, index) => (
              <Circle
                key={`circle-${index}`}
                cx={(1 - kp.y) * boxSize + offsetX}
                cy={(1 - kp.x) * boxSize + offsetY}
                r="8"
                fill={theme.colors.orange}
              />
            ))}
          </>
        )}
      </Svg>
      <View style={styles.buttonContainer}>
        <Button
          title="Done"
          color={theme.primary}
          onPress={() => {
            router.push("/tabs/results");
          }}
        />
        <Text style={styles.text}>Pushups: {pushupCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: { flex: 1, alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
});
