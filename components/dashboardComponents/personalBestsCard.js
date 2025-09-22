import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const PersonalBestsCard = ({ personalBests }) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.cardHeader}>
        <FontAwesome5 name="star" size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Personal Bests
        </Text>
      </View>
      {personalBests.length > 0 ? (
        personalBests.map((best, index) => (
          <View style={styles.contentRow} key={index}>
            <Text style={[styles.mainText, { color: theme.colors.text }]}>
              {best.title}
            </Text>
            <Text
              style={[styles.repsText, { color: theme.colors.secondaryText }]}
            >
              {best.reps} reps
            </Text>
          </View>
        ))
      ) : (
        <Text style={[styles.mainText, { color: theme.colors.secondaryText }]}>
          No workouts completed yet.
        </Text>
      )}
    </View>
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
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  mainText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  repsText: {
    fontSize: 18,
  },
});

export default PersonalBestsCard;
