import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

export default function ExerciseDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams();

  const exercise = EXERCISES.find((ex) => ex.id === exerciseId);

  if (!exercise) {
    return (
      <SafeAreaView>
        <Text>Exercise not found!</Text>
        <Link href="/tabs/exercises">Go Back</Link>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {exercise.title}
        </Text>

        <Image source={exercise.gif} style={styles.gif} />

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push(`../../exercise/exercisePlay`)} //change this so it routes (put in this folder) to dynamic page once finished with exercisePlay
        >
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>

        <Text style={[styles.description, { color: theme.colors.text }]}>
          {exercise.description}
        </Text>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Muscle Groups
          </Text>
          <Text
            style={[styles.infoContent, { color: theme.colors.secondaryText }]}
          >
            {exercise.muscleGroups.join(", ")}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
            Difficulty
          </Text>
          <Text
            style={[styles.infoContent, { color: theme.colors.secondaryText }]}
          >
            {exercise.difficulty}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  gif: {
    width: "100%",
    height: 300,
    borderRadius: 15,
  },
  playButton: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginVertical: 20,
  },
  playButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: "#1c1c1e",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoContent: {
    fontSize: 16,
  },
});