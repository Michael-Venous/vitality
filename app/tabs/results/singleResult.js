import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

export default function ResultsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.tagline, { color: theme.colors.text }]}>
        This exercise result
      </Text>
      <Text style={[styles.quote, { color: theme.colors.text }]}>"lul"</Text>
      <Button
        title="Done"
        color={theme.colors.primary}
        onPress={() => {
          router.back();
        }}
      />
    </View>
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
