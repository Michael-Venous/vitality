import { useEffect, useMemo, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { useTheme } from "../../context/ThemeContext";

// --- Model & Drawing Configuration ---
const MODEL_INPUT_WIDTH = 192;
const MODEL_INPUT_HEIGHT = 192;
const CONFIDENCE_THRESHOLD = 0.5;
const TARGET_FPS = 30;

export default function App() {
  const theme = useTheme();
  const [facing, setFacing] = useState("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(facing);
  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 1920, height: 1080 } },
    { fps: TARGET_FPS },
  ]);
  const { resize } = useResizePlugin();

  // Auto calls requestPermission
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return <Text>Requesting camera permission...</Text>;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Load model
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
        const keypointCount = keypointsTensor.length / 3;
        const parsedKeypoints = [];

        for (let i = 0; i < keypointCount; i++) {
          const offset = i * 3;
          const y = keypointsTensor[offset];
          const x = keypointsTensor[offset + 1];
          const confidence = keypointsTensor[offset + 2];

          if (confidence > CONFIDENCE_THRESHOLD) {
            parsedKeypoints.push({ x, y, confidence });
          }
        }
        console.log(parsedKeypoints);
      } catch (e) {
        console.error("Error in frame processor:", e);
      }
    },
    [model, resize]
  );

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        format={format}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <Button
          title="Done"
          color={theme.colors.primary}
          onPress={() => {
            router.push("/tabs/results");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
