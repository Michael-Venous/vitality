import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GradientBackground from "../../../components/GradientBackground";
import { useTheme } from "../../../context/ThemeContext";

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <GradientBackground>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Profile
          </Text>
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150" }} // Placeholder image
            style={styles.profileImage}
          />
          <Text style={[styles.profileName, { color: theme.colors.text }]}>
            John Doe
          </Text>
          <Text
            style={[styles.profileEmail, { color: theme.colors.secondaryText }]}
          >
            john.doe@example.com
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="person-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
              Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={theme.colors.text}
            />
            <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
              Help
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.colors.primary}
            />
            <Text
              style={[styles.menuItemText, { color: theme.colors.primary }]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 16,
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 18,
  },
});
