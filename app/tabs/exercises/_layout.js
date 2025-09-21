import { Stack } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

export default function ExercisesLayout() {
  const theme = useTheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[exerciseId]" />
    </Stack>
  );
}