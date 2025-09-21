import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const goalLabels = {
  streak: "Streak Goal",
  endurance: "Endurance Goal",
  pb: "Personal Best Goal",
  calories: "Calories Burned Goal",
};

export default function GoalCard({ goal, onLongPress }) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.card },
      ]}
      onLongPress={onLongPress}
    >
      <View>
        <Text style={[styles.title, { color: theme.colors.secondaryText }]}>
          {goalLabels[goal.category] || "Goal"}
        </Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {goal.value} {goal.unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
});