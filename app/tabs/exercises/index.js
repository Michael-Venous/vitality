import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/headerComponent";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

export default function ExercisesScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Header />
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Exercises
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.secondaryText }]}
            >
              Choose an exercise to begin!
            </Text>
          </View>
        </View>

        {/* exercise list */}
        <View style={styles.listContainer}>
          {EXERCISES.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.exerciseCard,
                { backgroundColor: theme.colors.card },
              ]}
              onPress={() => router.push(`/tabs/exercises/${exercise.id}`)}
            >
              <Image source={exercise.image} style={styles.exerciseImage} />
              <View style={styles.textContainer}>
                <Text
                  style={[styles.exerciseTitle, { color: theme.colors.text }]}
                >
                  {exercise.title}
                </Text>
                <Text
                  style={[
                    styles.exerciseDescription,
                    { color: theme.colors.secondaryText },
                  ]}
                  numberOfLines={2}
                >
                  {exercise.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 20,
    marginTop: 52,
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
  listContainer: {
    width: "90%",
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});
