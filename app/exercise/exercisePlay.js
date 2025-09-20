import { useRouter } from "expo-router";
import { Button, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function exercisePlay() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Button title="Done" color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
