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
import CircularProgress from "react-native-circular-progress-indicator";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../../../components/GradientBackground";
import Header from "../../../components/headerComponent";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

const exerciseDetailsMap = new Map(EXERCISES.map((ex) => [ex.id, ex]));

const SummaryIconCard = ({ icon, text, subtext, theme, iconColor }) => (
  <View style={styles.summaryIconCard}>
    <Ionicons name={icon} size={28} color={iconColor} />
    <View style={styles.summaryIconTextContainer}>
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
  </View>
);

export default function ResultsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [weeklySummaryData, setWeeklySummaryData] = useState({
    progress: 0,
    workoutsCompleted: 0,
    totalWorkouts: 6,
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
      } else {
        setCompletedWorkouts([]);
        calculateWeeklySummary([]);
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
    const totalWorkoutsGoal = 7;
    const progress =
      totalWorkoutsGoal > 0
        ? Math.round((workoutsCompleted / totalWorkoutsGoal) * 100)
        : 0;
    const caloriesBurned = weeklyWorkouts.reduce((acc, workout) => {
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
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
            <View
              style={[
                styles.weeklySummaryCard,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View style={styles.progressCircleContainer}>
                <CircularProgress
                  value={weeklySummaryData.progress}
                  radius={85}
                  duration={1000}
                  progressValueColor={theme.colors.text}
                  activeStrokeColor={theme.colors.primary}
                  inActiveStrokeColor={theme.colors.border}
                  inActiveStrokeOpacity={0.5}
                  inActiveStrokeWidth={18}
                  activeStrokeWidth={18}
                  valueSuffix={"%"}
                  titleStyle={{
                    fontWeight: "bold",
                    color: theme.colors.text,
                    fontSize: 18,
                  }}
                />
              </View>
              <View style={styles.summaryStats}>
                <SummaryIconCard
                  icon="barbell"
                  text={`${weeklySummaryData.workoutsCompleted}/${weeklySummaryData.totalWorkouts}`}
                  subtext="Workouts"
                  theme={theme}
                  iconColor="#e10c0cff"
                />
                <SummaryIconCard
                  icon="flash"
                  text={`${weeklySummaryData.caloriesBurned} kcal`}
                  subtext="Calories"
                  theme={theme}
                  iconColor="#FFD700"
                />
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
              Completed Workouts
            </Text>
            {completedWorkouts.length > 0 ? (
              completedWorkouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={[
                    styles.workoutCard,
                    { backgroundColor: theme.colors.card },
                  ]}
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
              ))
            ) : (
              <View
                style={[
                  styles.emptyStateContainer,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={[styles.emptyStateText, { color: theme.colors.text }]}
                >
                  No workouts completed yet.
                </Text>
                <Text
                  style={[
                    styles.emptyStateSubtext,
                    { color: theme.colors.secondaryText },
                  ]}
                >
                  Go to the Exercises tab to get started!
                </Text>
              </View>
            )}
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
  },
  weeklySummaryCard: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  progressCircleContainer: {},
  summaryStats: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 25,
  },
  summaryIconCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  summaryIconTextContainer: {
    marginLeft: 12,
  },
  summaryIconText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryIconSubtext: {
    fontSize: 14,
  },
  workoutCard: {
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
  emptyStateContainer: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 5,
  },
});
