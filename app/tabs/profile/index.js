import { Ionicons } from "@expo/vector-icons";
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
import GradientBackground from "../../../components/GradientBackground";
import Header from "../../../components/headerComponent";
import { useTheme } from "../../../context/ThemeContext";

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={["top", "left", "right"]}
    >
      <GradientBackground>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <Header />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Profile
              </Text>
              <Text
                style={[styles.subtitle, { color: theme.colors.secondaryText }]}
              >
                Manage your account and settings
              </Text>
            </View>
          </View>

          <View style={styles.profileContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150" }}
              style={styles.profileImage}
            />
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              John Doe
            </Text>
            <Text
              style={[
                styles.profileEmail,
                { color: theme.colors.secondaryText },
              ]}
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
    paddingTop: 20, // FIX: Was 52, now matches other screens
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
  profileContainer: {
    width: "90%",
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
    width: "90%",
    marginTop: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3A506B",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 18,
  },
});
