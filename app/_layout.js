import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider as CustomThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen name="exercise" options={{ headerShown: false }} />
        </Stack>
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}
