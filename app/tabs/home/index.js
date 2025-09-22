import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGoalModal from "../../../components/dashboardComponents/addGoalModal";
import EnduranceCard from "../../../components/dashboardComponents/enduranceCard";
import EnduranceProgressModal from "../../../components/dashboardComponents/enduranceProgressModal";
import GoalCard from "../../../components/dashboardComponents/goalCard";
import PersonalBestsCard from "../../../components/dashboardComponents/personalBestsCard";
import GradientBackground from "../../../components/GradientBackground";
import Header from "../../../components/headerComponent";
import { useTheme } from "../../../context/ThemeContext";
import { EXERCISES } from "../../../data/exerciseData";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [addGoalModalVisible, setAddGoalModalVisible] = useState(false);
  const [enduranceProgressModalVisible, setEnduranceProgressModalVisible] =
    useState(false);
  const [allGoals, setAllGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [streak, setStreak] = useState(0);
  const [personalBests, setPersonalBests] = useState([]);

  const enduranceGoal = allGoals.find((goal) => goal.category === "endurance");

  const loadData = async () => {
    try {
      const goalsJson = await AsyncStorage.getItem("userGoals");
      const savedGoals = goalsJson ? JSON.parse(goalsJson) : [];
      setAllGoals(savedGoals);

      const workoutsJson = await AsyncStorage.getItem("completedWorkouts");
      if (workoutsJson !== null) {
        const workouts = JSON.parse(workoutsJson);
        calculateStreak(workouts);
        calculatePersonalBests(workouts);
      }
    } catch (e) {
      console.error("Failed to load data.", e);
    }
  };

  const calculateStreak = (workouts) => {
    if (workouts.length === 0) {
      setStreak(0);
      return;
    }
    const sortedWorkouts = workouts.sort(
      (a, b) => new Date(b.id) - new Date(a.id)
    );
    let currentStreak = 1;
    let lastDate = new Date(sortedWorkouts[0].id);
    lastDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < sortedWorkouts.length; i++) {
      let currentDate = new Date(sortedWorkouts[i].id);
      currentDate.setHours(0, 0, 0, 0);
      let diff =
        (lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
      if (diff === 1) {
        currentStreak++;
        lastDate = currentDate;
      } else if (diff > 1) {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const calculatePersonalBests = (workouts) => {
    const bests = {};
    workouts.forEach((workout) => {
      if (
        !bests[workout.exerciseId] ||
        workout.reps > bests[workout.exerciseId].reps
      ) {
        bests[workout.exerciseId] = workout;
      }
    });
    const bestsArray = Object.values(bests).map((workout) => {
      const exerciseDetails = EXERCISES.find(
        (ex) => ex.id === workout.exerciseId
      );
      return {
        ...workout,
        title: exerciseDetails ? exerciseDetails.title : "Unknown Workout",
      };
    });
    setPersonalBests(bestsArray);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleEnduranceCardPress = () => {
    if (enduranceGoal) {
      setSelectedGoal(enduranceGoal);
      setEnduranceProgressModalVisible(true);
    } else {
      Alert.alert(
        "No Endurance Goal Set",
        "Please add an endurance goal first using the 'Add Goal' button."
      );
    }
  };

  const handleSaveProgress = async (newProgress) => {
    if (!selectedGoal) return;

    const updatedGoals = allGoals.map((g) => {
      if (
        g.category === selectedGoal.category &&
        g.value === selectedGoal.value
      ) {
        return {
          ...g,
          progress: (g.progress || 0) + parseFloat(newProgress),
        };
      }
      return g;
    });

    try {
      await AsyncStorage.setItem("userGoals", JSON.stringify(updatedGoals));
      setAllGoals(updatedGoals);
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  const handleDeleteGoal = (goalIndex) => {
    const goalToDelete = allGoals[goalIndex];
    const goalType =
      goalToDelete.category.charAt(0).toUpperCase() +
      goalToDelete.category.slice(1);

    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete your ${goalType} goal?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedGoals = allGoals.filter(
                (_, index) => index !== goalIndex
              );
              setAllGoals(updatedGoals);
              await AsyncStorage.setItem(
                "userGoals",
                JSON.stringify(updatedGoals)
              );
            } catch (e) {
              console.error("Failed to delete goal.", e);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
      <GradientBackground>
        <AddGoalModal
          modalVisible={addGoalModalVisible}
          setModalVisible={setAddGoalModalVisible}
          onGoalAdded={loadData}
        />
        <EnduranceProgressModal
          modalVisible={enduranceProgressModalVisible}
          setModalVisible={setEnduranceProgressModalVisible}
          goal={selectedGoal}
          onSave={handleSaveProgress}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* header */}
          <View style={styles.headerRow}>
            <Header />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Home
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.colors.secondaryText }]}
              >
                Your headquarters for your health
              </Text>
            </View>
          </View>

          {/* streak card */}
          <View
            style={[
              { backgroundColor: theme.colors.card },
              styles.iconContainer,
            ]}
          >
            <View style={styles.streakGoalContainer}>
              <View style={styles.fireIconWrapper}>
                <AntDesign
                  name="fire"
                  size={150}
                  color={theme.colors.primary}
                />
                <Text style={styles.streakNumber}>{streak}</Text>
              </View>
              <View style={styles.textColumn}>
                <Text style={styles.streakText}>
                  You are on a {streak}-day streak.
                </Text>
              </View>
            </View>
          </View>

          <EnduranceCard
            goal={enduranceGoal}
            onPress={handleEnduranceCardPress}
          />
          <PersonalBestsCard personalBests={personalBests} />

          {/* separator */}
          <View style={styles.separatorContainer}>
            <View
              style={[
                styles.separatorLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
            <Text style={[styles.separatorText, { color: theme.colors.text }]}>
              Goals
            </Text>
            <View
              style={[
                styles.separatorLine,
                { backgroundColor: theme.colors.border },
              ]}
            />
          </View>

          {/* goals display */}
          <View style={styles.goalsListContainer}>
            {allGoals.map((goal, index) => (
              <GoalCard
                key={index}
                goal={goal}
                onLongPress={() => handleDeleteGoal(index)}
              />
            ))}
          </View>

          {/* add goal button */}
          <TouchableOpacity
            style={styles.addGoalButton}
            onPress={() => setAddGoalModalVisible(true)}
          >
            <Text style={styles.addGoalButtonText}>Add Goal</Text>
          </TouchableOpacity>
        </ScrollView>
      </GradientBackground>
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
    paddingTop: 20,
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
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "center",
    marginTop: 30,
    height: 185,
    width: "90%",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  streakGoalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fireIconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textColumn: {
    marginLeft: 20,
    flexShrink: 1,
  },
  streakNumber: {
    position: "absolute",
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    transform: [{ translateY: 12 }],
  },
  streakText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  goalsListContainer: {
    width: "90%",
  },
  addGoalButton: {
    backgroundColor: "#52d874",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  addGoalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
