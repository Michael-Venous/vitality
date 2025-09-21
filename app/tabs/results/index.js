import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/headerComponent";
import CompletedWorkouts from "../../../components/resultsComponents/completedWorkouts";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exercises";

const exerciseDetailsMap = new Map(EXERCISES.map((ex) => [ex.id, ex]));

const completedWorkoutsLog = [
  { id: "1", text: "Pushups: 50 reps in 1:37", imageKey: "pushup" },
  { id: "2", text: "Squats: 70 reps in 2:02", imageKey: "squat" },
  { id: "3", text: "Situps: 50 reps in 0:58", imageKey: "situp" },
];

const completedWorkoutsData = completedWorkoutsLog.map((workout) => {
  const details = exerciseDetailsMap.get(workout.imageKey);
  return {
    ...workout,
    imageSource: details ? details.image : null,
  };
});

// temp data
const weeklySummaryData = {
  progress: 75,
  workoutsCompleted: 5,
  totalWorkouts: 6,
  caloriesBurned: 3200,
};

// component for weekly summary stats
const SummaryIconCard = ({ icon, text, subtext, theme, iconColor }) => (
  <View style={styles.summaryIconCard}>
    <Ionicons name={icon} size={24} color={iconColor} />
    <Text style={[styles.summaryIconText, { color: theme.colors.text }]}>
      {text}
    </Text>
    {subtext && (
      <Text
        style={[
          styles.summaryIconSubtext,
          { color: theme.colors.secondaryText },
        ]}
      >
        {subtext}
      </Text>
    )}
  </View>
);

export default function ResultsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Header />
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Results
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.secondaryText }]}
            >
              Great work this week!
            </Text>
          </View>
        </View>

        {/* Weekly Summary Card */}
        <View style={styles.cardContainer}>
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
            Weekly Summary
          </Text>
          <View style={styles.weeklySummaryCard}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    height: `${weeklySummaryData.progress}%`,
                    backgroundColor: "#52d874",
                  },
                ]}
              />
            </View>
            <View style={styles.summaryContent}>
              <View>
                <Text
                  style={[styles.progressText, { color: theme.colors.text }]}
                >{`${weeklySummaryData.progress}%`}</Text>
                <Text
                  style={[
                    styles.progressSubtitle,
                    { color: theme.colors.secondaryText },
                  ]}
                >
                  Complete
                </Text>
              </View>
              <View style={styles.summaryStats}>
                <SummaryIconCard
                  icon="barbell-outline"
                  text={`${weeklySummaryData.workoutsCompleted}/${weeklySummaryData.totalWorkouts}`}
                  subtext="Workouts"
                  theme={theme}
                  iconColor="#e10c0cff"
                />
                <SummaryIconCard
                  icon="flash-outline"
                  text={`${weeklySummaryData.caloriesBurned} kcal`}
                  subtext="Calories Burned"
                  theme={theme}
                  iconColor="#FFD700"
                />
              </View>
            </View>
          </View>
        </View>

        <CompletedWorkouts workouts={completedWorkoutsData} />

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
  cardContainer: {
    width: "90%",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  weeklySummaryCard: {
    backgroundColor: "#1A2A3A",
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    height: 160,
  },
  progressBarContainer: {
    width: 25,
    height: 120,
    backgroundColor: "#3a3a3a",
    borderRadius: 12,
    marginRight: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  progressBarFill: {
    width: "100%",
  },
  summaryContent: {
    flex: 1,
    justifyContent: "space-between",
    height: 120,
  },
  progressText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  progressSubtitle: {
    fontSize: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryIconCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryIconText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  summaryIconSubtext: {
    fontSize: 12,
  },
});