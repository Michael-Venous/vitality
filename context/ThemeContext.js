import { createContext, useContext } from "react";
import { darkTheme } from "../constants/theme"; // Import your dark theme

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={darkTheme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
