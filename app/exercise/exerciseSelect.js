import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function exerciseSelect() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.tagline, { color: theme.colors.text }]}>
        exerciseSelect
      </Text>
      <Text style={[styles.quote, { color: theme.colors.text }]}>"test"</Text>
      <Button
        title="Play"
        color={theme.colors.primary}
        onPress={() => {
          router.push("/exercise/exercisePlay");
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
