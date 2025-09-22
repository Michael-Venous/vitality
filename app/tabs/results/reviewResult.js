// app/tabs/results/reviewResult.js
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientBackground from "../../../components/GradientBackground";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

export default function ReviewResultScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { reps, time, exerciseId, isReviewing } = useLocalSearchParams();

  const numericReps = parseInt(reps, 10);
  const numericTime = parseInt(time, 10);

  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);
  const formattedTime = `${Math.floor(numericTime / 60)
    .toString()
    .padStart(2, "0")}:${(numericTime % 60).toString().padStart(2, "0")}`;

  const score =
    numericTime > 0 ? Math.round((numericReps * numericReps) / numericTime) : 0;

  const saveWorkout = async () => {
    try {
      const newWorkout = {
        id: new Date().toISOString(),
        text: `${
          exercise?.title || "Workout"
        }: ${numericReps} reps in ${formattedTime}`,
        imageKey: exerciseId,
        reps: numericReps,
        time: numericTime,
        exerciseId: exerciseId,
        score: score,
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
    if (isReviewing) {
      router.back();
    } else {
      router.replace("/tabs/home");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
      <GradientBackground>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Workout Complete!
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.secondaryText }]}
          >
            {exercise?.title || "Exercise"}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {numericReps}
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

          {!isReviewing && (
            <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
              <Text style={styles.saveButtonText}>Save and Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </GradientBackground>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 10,
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
    marginBottom: 60,
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
  saveButton: {
    backgroundColor: "#52d874",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
