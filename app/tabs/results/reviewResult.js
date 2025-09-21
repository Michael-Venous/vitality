// app/tabs/results/reviewResult.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

export default function ReviewResultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { reps, time, exerciseId, isReviewing } = useLocalSearchParams();

  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);
  const formattedTime = `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

  // Calculate score
  const score = time > 0 ? Math.round((reps * reps) / time) : 0;

  const saveWorkout = async () => {
    try {
      const newWorkout = {
        id: new Date().toISOString(),
        text: `${
          exercise?.title || "Workout"
        }: ${reps} reps in ${formattedTime}`,
        imageKey: exerciseId,
        reps: parseInt(reps),
        time: parseInt(time),
        exerciseId: exerciseId,
        score: score, // Save the score
      };
      const existingWorkouts = JSON.parse(
        (await AsyncStorage.getItem("completedWorkouts")) || "[]"
      );
      const updatedWorkouts = [newWorkout, ...existingWorkouts];
      await AsyncStorage.setItem(
        "completedWorkouts",
        JSON.stringify(updatedWorkouts)
      );
      router.replace("/tabs/results");
    } catch (e) {
      console.error("Failed to save workout.", e);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Workout Complete!
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
        {exercise?.title || "Exercise"}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {reps}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Reps
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {formattedTime}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Time
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.colors.primary }]}>
            {score}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Score
          </Text>
        </View>
      </View>

      {isReviewing ? (
        <Button
          title="Back to Results"
          color={theme.colors.primary}
          onPress={handleBack}
        />
      ) : (
        <Button
          title="Save and Finish"
          color={theme.colors.primary}
          onPress={saveWorkout}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 48,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    marginTop: 5,
  },
});
