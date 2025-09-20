import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function ExerciseLayout() {
  const theme = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="exerciseSelect" />

        <Stack.Screen name="exercisePlay" />
      </Stack>
    </>
  );
}
