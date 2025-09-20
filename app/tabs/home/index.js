import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.iconContainer}>
        <AntDesign name="fire" size={120} color="orange" />
        <Text style={styles.streakNumber}>3</Text>
      </View>
      <View style={styles.separatorContainer}>
        <View
          style={[
            styles.separatorLine,
            { backgroundColor: theme.colors.border },
          ]}
        />
        {/* left line*/}
        <Text style={[styles.separatorText, { color: theme.colors.text }]}>
          Exercises
        </Text>
        <View
          style={[
            styles.separatorLine,
            { backgroundColor: theme.colors.border },
          ]}
        />
        {/* right line*/}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.tagline, { color: theme.colors.text }]}>
          buttfart
        </Text>
        <Text style={[styles.quote, { color: theme.colors.text }]}>"lul"</Text>
        <Button
          title="Get Started"
          color={theme.colors.primary}
          onPress={() => {
            router.push("/exercise/exerciseSelect");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 40,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  streakNumber: {
    position: "absolute",
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    top: 45,
  },
});
