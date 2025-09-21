import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";

import EnduranceCard from "../../../components/dashboardComponents/enduranceCard";
import PersonalBestsCard from "../../../components/dashboardComponents/personalBestsCard";
import Header from "../../../components/headerComponent";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Header />
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Goals</Text>
            <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>Keep up the hard work!</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.streakGoalContainer}>
            <View style={styles.fireIconWrapper}>
              <AntDesign name="fire" size={120} color="orange" />
              <Text style={styles.streakNumber}>3</Text>
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.streakText}>
                Streak goal
                <Text style={styles.streakTextBold}> 43% </Text>
                complete. Complete 4 more days to meet your goal!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.separatorContainer}>
          <View
            style={[
              styles.separatorLine,
              { backgroundColor: theme.colors.border },
            ]}
          />
          <Text style={[styles.separatorText, { color: theme.colors.text }]}>
            Goals
          </Text>
          <View
            style={[
              styles.separatorLine,
              { backgroundColor: theme.colors.border },
            ]}
          />
        </View>

        <EnduranceCard />
        <PersonalBestsCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
  },
  headerTextContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  tagline: {
    fontSize: 24,
    margin: 20,
  },
  quote: {
    fontSize: 16,
    marginBottom: 20,
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
    marginTop: 30,
    backgroundColor: "#143048ff",
    height: 225,
    width: "90%",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  streakGoalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fireIconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textColumn: {
    marginLeft: 20,
    flexShrink: 1,
  },
  streakNumber: {
    position: "absolute",
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -25 }],
  },
  streakText: {
    fontSize: 20,
    color: "white",
  },
  streakTextBold: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
});