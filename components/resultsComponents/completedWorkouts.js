import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const CompletedWorkoutCard = ({ workout, theme }) => (
  <View
    style={[
      styles.completedWorkoutCard,
      { backgroundColor: theme.colors.card },
    ]}
  >
    <Image
      source={workout.imageSource}
      style={styles.workoutImage}
    />
    <Text style={[styles.completedWorkoutText, { color: theme.colors.text }]}>
      {workout.text}
    </Text>
  </View>
);

export default function CompletedWorkouts({ workouts = [] }) {
  const theme = useTheme();

  return (
    <View style={styles.cardContainer}>
      <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
        Completed Workouts
      </Text>
      <View style={styles.completedWorkoutsRow}>
        {workouts.map((workout) => (
          <CompletedWorkoutCard
            key={workout.id}
            workout={workout}
            theme={theme}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  completedWorkoutsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  completedWorkoutCard: {
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 10,
  },
  workoutImage: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  completedWorkoutText: {
    fontSize: 14,
    flexShrink: 1,
  },
});