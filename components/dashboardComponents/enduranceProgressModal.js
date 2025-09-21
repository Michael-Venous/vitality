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

export default function AddProgressModal({
  modalVisible,
  setModalVisible,
  goal,
  onSave,
}) {
  const theme = useTheme();
  const [progress, setProgress] = useState("");

  const handleSave = () => {
    onSave(parseFloat(progress) || 0);
    setProgress("");
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
            Add Progress
          </Text>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            How many miles did you complete?
          </Text>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            onChangeText={setProgress}
            value={progress}
            placeholder={`Current: ${goal?.progress || 0} / ${goal?.value} Miles`}
            placeholderTextColor={theme.colors.secondaryText}
            keyboardType="numeric"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Progress</Text>
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
    shadowOffset: { width: 0, height: 2 },
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