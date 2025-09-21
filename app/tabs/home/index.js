import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddGoalModal from "../../../components/dashboardComponents/addGoalModal";
import EnduranceCard from "../../../components/dashboardComponents/enduranceCard";
import GoalCard from "../../../components/dashboardComponents/goalCard";
import PersonalBestsCard from "../../../components/dashboardComponents/personalBestsCard";
import Header from "../../../components/headerComponent";
import { useTheme } from "../../../context/ThemeContext";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    try {
      const goalsJson = await AsyncStorage.getItem("userGoals");
      if (goalsJson !== null) {
        setGoals(JSON.parse(goalsJson));
      } else {
        setGoals([]);
      }
    } catch (e) {
      console.error("Failed to load goals.", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const handleDeleteGoal = (goalIndex) => {
    const goalToDelete = goals[goalIndex];
    const goalType =
      goalToDelete.category.charAt(0).toUpperCase() +
      goalToDelete.category.slice(1);

    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete your ${goalType} goal?`, //change this if you want
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
              const updatedGoals = goals.filter(
                (_, index) => index !== goalIndex
              );
              setGoals(updatedGoals);
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
    >
      <AddGoalModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onGoalAdded={loadGoals}
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
        <View style={styles.iconContainer}>
          <View style={styles.streakGoalContainer}>
            <View style={styles.fireIconWrapper}>
              <AntDesign name="fire" size={120} color="orange" />
              <Text style={styles.streakNumber}>3</Text>
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.streakText}>
                Streak goal
                <Text style={styles.streakTextBold}> 43% </Text>
                complete. Complete 4 more days to meet your goal!
              </Text>
            </View>
          </View>
        </View>

        {/* endurance and PB components */}
        <EnduranceCard />
        <PersonalBestsCard />

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
          {goals.map((goal, index) => (
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
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addGoalButtonText}>Add Goal</Text>
        </TouchableOpacity>
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
    paddingTop: 19.5, //if you make it 20 it moves a tiny bit
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
    backgroundColor: "#143048ff",
    height: 225,
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
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -25 }],
  },
  streakText: {
    fontSize: 20,
    color: "white",
  },
  streakTextBold: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addGoalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});