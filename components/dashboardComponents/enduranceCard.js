import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const EnduranceCard = ({ goal, onPress }) => {
  const theme = useTheme();

  const progressPercent =
    goal && goal.value > 0 ? ((goal.progress || 0) / goal.value) * 100 : 0;
  const milesLeft = goal ? goal.value - (goal.progress || 0) : 0;

  const subtitleText = goal
    ? milesLeft > 0
      ? `${milesLeft.toFixed(1)} Miles left`
      : "Goal Complete!"
    : "Set an endurance goal!"; //turnerary for subtitle based on status

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <FontAwesome5 name="running" size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Endurance
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progressPercent}%`,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>
      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
        {subtitleText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 5,
    marginBottom: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default EnduranceCard;