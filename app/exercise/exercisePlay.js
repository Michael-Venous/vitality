import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import { EXERCISES } from "../../data/exerciseData";
import { usePushupCounter } from "../../hooks/usePushupCounter";
import { useSitupCounter } from "../../hooks/useSitupCounter";
import { useSquatCounter } from "../../hooks/useSquatCounter";

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

const COUNTER_MAP = {
  situp: useSitupCounter,
  pushup: usePushupCounter,
  squat: useSquatCounter,
};

export default function PoseDetectionCamera() {
  const router = useRouter();
  const theme = useTheme();
  const { exerciseId } = useLocalSearchParams();
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
  const [cameraViewDimensions, setCameraViewDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Timer logic
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleDone = () => {
    clearInterval(timerRef.current);
    router.replace(
      `/exercise/reviewResult?reps=${repCount}&time=${elapsedTime}&exerciseId=${exerciseId}`
    );
  };

  // select the correct counter
  const CounterHook = COUNTER_MAP[exerciseId];
  const repCount = CounterHook(keypoints);

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

  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);

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
      <View style={styles.topContainer}>
        <Text style={styles.exerciseName}>{exercise?.title || "Workout"}</Text>
        <Text style={styles.timerText}>{`${Math.floor(elapsedTime / 60)
          .toString()
          .padStart(2, "0")}:${(elapsedTime % 60)
          .toString()
          .padStart(2, "0")}`}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.repText}>Reps: {repCount}</Text>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
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
  topContainer: {
    position: "absolute",
    top: 60,
    width: "100%",
    alignItems: "center",
    zIndex: 2,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    alignItems: "center",
    zIndex: 2,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  timerText: {
    fontSize: 24,
    color: "white",
    marginTop: 5,
  },
  repText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#52d874",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doneButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
