import React from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

/**
 * Props for ThemeProvider component
 */
interface ThemeProviderProps {
  /** Child components to be wrapped with theme */
  children: React.ReactNode;
}

/**
 * Application theme provider component
 *
 * Wraps the application with Material-UI theme and CSS baseline.
 * Provides consistent styling across all components.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
