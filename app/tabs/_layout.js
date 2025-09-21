import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0e2335ff",
            borderTopWidth: 0.2,
            borderTopColor: theme.colors.border,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="exercises"
          options={{
            title: "Exercises",
            tabBarIcon: ({ color }) => (
              <Ionicons name="barbell" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="results"
          options={{
            title: "Results",
            tabBarIcon: ({ color }) => (
              <Ionicons name="trophy" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
