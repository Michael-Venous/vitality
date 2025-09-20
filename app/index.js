import { useRouter } from "expo-router";
import { Button, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const navigateToLogin = () => {
    router.replace("/tabs");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.tagline, { color: theme.colors.text }]}>
        vitalityAI
      </Text>
      <Text style={[styles.quote, { color: theme.colors.text }]}>
        "Build your Vitality with AI precision"
      </Text>
      <Button
        title="Get Started"
        color={theme.colors.primary}
        onPress={navigateToLogin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tagline: {
    fontSize: 24,
    margin: 20,
  },
  quote: {
    fontSize: 16,
    marginBottom: 20,
  },
});
