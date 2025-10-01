import { createTheme } from "@mui/material";

/**
 * Theme Constants
 * Centralized color and style values used throughout the application
 */
export const THEME_CONSTANTS = {
  // Brand Colors
  gradient: {
    primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    primaryHover: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
  },
  // Transitions
  transitions: {
    default: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  // Border Radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
  },
  // Shadows
  shadows: {
    light: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    medium:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    large:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xlarge: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  // Glassmorphism
  glass: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
} as const;

/**
 * Main application theme
 * Defines colors, typography, spacing, and component overrides
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#667eea",
      light: "#8fa4f3",
      dark: "#4c63d2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#9c7bb8",
      dark: "#5a3a7a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
    grey: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      letterSpacing: "-0.025em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.025em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONSTANTS.borderRadius.medium,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
          boxShadow: THEME_CONSTANTS.shadows.medium,
          transition: THEME_CONSTANTS.transitions.default,
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: THEME_CONSTANTS.shadows.large,
          },
        },
        contained: {
          background: THEME_CONSTANTS.gradient.primary,
          "&:hover": {
            background: THEME_CONSTANTS.gradient.primaryHover,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: THEME_CONSTANTS.borderRadius.medium,
            transition: THEME_CONSTANTS.transitions.default,
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#667eea",
                borderWidth: 2,
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#667eea",
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONSTANTS.borderRadius.large,
          boxShadow: THEME_CONSTANTS.shadows.medium,
          transition: THEME_CONSTANTS.transitions.smooth,
          "&:hover": {
            boxShadow: THEME_CONSTANTS.shadows.large,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONSTANTS.borderRadius.small,
          fontWeight: 600,
          textTransform: "none",
          boxShadow: THEME_CONSTANTS.shadows.light,
          transition: THEME_CONSTANTS.transitions.default,
          "&:hover": {
            boxShadow: THEME_CONSTANTS.shadows.medium,
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: THEME_CONSTANTS.borderRadius.large,
          boxShadow: THEME_CONSTANTS.shadows.xlarge,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: THEME_CONSTANTS.shadows.light,
        },
        elevation2: {
          boxShadow: THEME_CONSTANTS.shadows.medium,
        },
        elevation3: {
          boxShadow: THEME_CONSTANTS.shadows.large,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: THEME_CONSTANTS.borderRadius.small,
          height: 8,
        },
        bar: {
          borderRadius: THEME_CONSTANTS.borderRadius.small,
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          "& .MuiRating-icon": {
            color: "#fbbf24",
          },
          "& .MuiRating-iconFilled": {
            color: "#f59e0b",
          },
        },
      },
    },
  },
});

export default theme;
