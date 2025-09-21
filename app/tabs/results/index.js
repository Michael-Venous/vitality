import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../../../components/GradientBackground";
import Header from "../../../components/headerComponent";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

const exerciseDetailsMap = new Map(EXERCISES.map((ex) => [ex.id, ex]));

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
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [weeklySummaryData, setWeeklySummaryData] = useState({
    progress: 0,
    workoutsCompleted: 0,
    totalWorkouts: 6, // This can be a goal from AsyncStorage
    caloriesBurned: 0,
  });

  const loadWorkouts = async () => {
    try {
      const workoutsJson = await AsyncStorage.getItem("completedWorkouts");
      if (workoutsJson !== null) {
        const workouts = JSON.parse(workoutsJson).map((workout) => {
          const details = exerciseDetailsMap.get(workout.exerciseId);
          return {
            ...workout,
            imageSource: details ? details.image : null,
            title: details ? details.title : "Workout",
          };
        });
        setCompletedWorkouts(workouts);
        calculateWeeklySummary(workouts);
      }
    } catch (e) {
      console.error("Failed to load workouts.", e);
    }
  };

  const calculateWeeklySummary = (workouts) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyWorkouts = workouts.filter((w) => new Date(w.id) >= oneWeekAgo);
    const workoutsCompleted = weeklyWorkouts.length;
    const totalWorkoutsGoal = 6;
    const progress = Math.round((workoutsCompleted / totalWorkoutsGoal) * 100);
    const caloriesBurned = weeklyWorkouts.reduce((acc, workout) => {
      // Very basic calorie calculation, can be improved
      const caloriesPerRep = 1.5;
      return acc + workout.reps * caloriesPerRep;
    }, 0);

    setWeeklySummaryData({
      progress,
      workoutsCompleted,
      totalWorkouts: totalWorkoutsGoal,
      caloriesBurned: Math.round(caloriesBurned),
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <GradientBackground>
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

          <View style={styles.cardContainer}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
              Completed Workouts
            </Text>
            {completedWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutCard}
                onPress={() =>
                  router.push(
                    `/tabs/results/reviewResult?reps=${workout.reps}&time=${workout.time}&exerciseId=${workout.exerciseId}&isReviewing=true`
                  )
                }
              >
                <Image
                  source={workout.imageSource}
                  style={styles.workoutImage}
                />
                <View style={styles.workoutTextContainer}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.workoutSubtitle}>
                    {workout.reps} reps in{" "}
                    {`${Math.floor(workout.time / 60)
                      .toString()
                      .padStart(2, "0")}:${(workout.time % 60)
                      .toString()
                      .padStart(2, "0")}`}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreValue}>{workout.score}</Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </GradientBackground>
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
    color: "white",
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
    color: "white",
  },
  progressSubtitle: {
    fontSize: 16,
    color: "grey",
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
    color: "white",
  },
  summaryIconSubtext: {
    fontSize: 12,
    color: "grey",
  },
  workoutCard: {
    backgroundColor: "#1A2A3A",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  workoutImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  workoutTextContainer: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  workoutSubtitle: {
    fontSize: 14,
    color: "grey",
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: "center",
    marginLeft: 15,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#52d874",
  },
  scoreLabel: {
    fontSize: 12,
    color: "grey",
  },
});
