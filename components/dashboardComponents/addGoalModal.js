import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

const goalCategories = [
  { key: "streak", label: "Streak Goal", unit: "Days" },
  { key: "endurance", label: "Endurance Goal", unit: "Miles" },
  { key: "pb", label: "Personal Bests Goal", unit: "Pounds" },
  { key: "calories", label: "Calories Burned Goal", unit: "kcal" },
];

export default function AddGoalModal({ modalVisible, setModalVisible, onGoalAdded }) {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [goalValue, setGoalValue] = useState("");

  const handleSaveGoal = async () => {
    if (!selectedCategory || !goalValue) {
      alert("Please select a category and enter a value.");
      return;
    }

    const newGoal = {
      category: selectedCategory.key,
      value: goalValue,
      unit: selectedCategory.unit,
    };

    try {
      const existingGoals = await AsyncStorage.getItem("userGoals");
      const goals = existingGoals ? JSON.parse(existingGoals) : [];
      goals.push(newGoal);
      await AsyncStorage.setItem("userGoals", JSON.stringify(goals));
      console.log("Goal saved:", newGoal);
      onGoalAdded();
    } catch (e) {
      console.error("Failed to save goal.", e);
    }

    setSelectedCategory(null);
    setGoalValue("");
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Add a New Goal
          </Text>

          {/* category select */}
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Choose a Category:
          </Text>
          <View style={styles.categoryContainer}>
            {goalCategories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryButton,
                  selectedCategory?.key === cat.key && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.categoryButtonText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* num input */}
          {selectedCategory && (
            <>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Enter your goal ({selectedCategory.unit}):
              </Text>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                onChangeText={setGoalValue}
                value={goalValue}
                placeholder="e.g., 7, 10, 225"
                placeholderTextColor={theme.colors.secondaryText}
                keyboardType="numeric"
              />
            </>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveGoal}
            >
              <Text style={styles.buttonText}>Save Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(28, 28, 30, 0.95)",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#3a3a3a",
    borderRadius: 10,
    padding: 10,
    width: "48%",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#3a3a3a",
    borderWidth: 1,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#52d874",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e10c0cff",
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});