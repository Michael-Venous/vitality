import { Stack } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";

export default function HomeLayout() {
  const theme = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
