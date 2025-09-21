import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTheme } from "../context/ThemeContext";

const GradientBackground = ({ children }) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.secondary]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
