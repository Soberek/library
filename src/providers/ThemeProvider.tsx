import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafbfc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
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
      main: "#0ea5e9",
      light: "#38bdf8",
      dark: "#0284c7",
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
      fontSize: "3rem",
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.875rem",
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
      color: "#334155",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      color: "#475569",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
  },
  shape: {
    borderRadius: 14,
  },
  shadows: [
    "none",
    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    "0 0 0 1px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "0 0 60px -15px rgba(99, 102, 241, 0.5)",
    "0 0 60px -15px rgba(139, 92, 246, 0.5)",
    "0 0 60px -15px rgba(16, 185, 129, 0.5)",
    "0 0 60px -15px rgba(239, 68, 68, 0.5)",
    "0 0 60px -15px rgba(245, 158, 11, 0.5)",
    "0 0 60px -15px rgba(14, 165, 233, 0.5)",
    "0 0 60px -15px rgba(0, 0, 0, 0.1)",
    "0 0 80px -15px rgba(0, 0, 0, 0.15)",
    "0 0 100px -15px rgba(0, 0, 0, 0.2)",
    "0 0 120px -15px rgba(0, 0, 0, 0.25)",
    "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
    "0 40px 70px -15px rgba(0, 0, 0, 0.35)",
    "0 45px 80px -15px rgba(0, 0, 0, 0.4)",
    "0 50px 100px -20px rgba(0, 0, 0, 0.5)",
    "0 55px 125px -25px rgba(0, 0, 0, 0.6)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 28px",
          fontSize: "0.938rem",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: "translateX(-100%)",
            transition: "transform 0.3s ease",
          },
          "&:hover::before": {
            transform: "translateX(0)",
          },
        },
        contained: {
          boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            boxShadow: "0 6px 20px 0 rgba(99, 102, 241, 0.5)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: "#6366f1",
          color: "#6366f1",
          "&:hover": {
            borderWidth: 2,
            borderColor: "#4f46e5",
          },
        },
        text: {
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.08)",
          },
        },
        sizeLarge: {
          padding: "16px 36px",
          fontSize: "1rem",
        },
        sizeSmall: {
          padding: "8px 20px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transform: "translateY(-4px)",
            borderColor: "rgba(99, 102, 241, 0.2)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          fontSize: "0.813rem",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
        filled: {
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          color: "#4f46e5",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.2)",
          },
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          borderRight: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
        elevation2: {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 10,
          backgroundColor: "rgba(99, 102, 241, 0.1)",
        },
        bar: {
          borderRadius: 10,
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#6366f1",
        },
        circle: {
          strokeLinecap: "round",
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: "#f59e0b",
          "& .MuiRating-iconEmpty": {
            color: "#e2e8f0",
          },
        },
        iconFilled: {
          color: "#f59e0b",
        },
        iconHover: {
          color: "#fbbf24",
          transform: "scale(1.1)",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 4,
            transitionDuration: "300ms",
            "&.Mui-checked": {
              transform: "translateX(20px)",
              color: "#fff",
              "& + .MuiSwitch-track": {
                backgroundColor: "#6366f1",
                opacity: 1,
                border: 0,
              },
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 24,
            height: 24,
            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)",
          },
          "& .MuiSwitch-track": {
            borderRadius: 16,
            backgroundColor: "#e2e8f0",
            opacity: 1,
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#6366f1",
          height: 6,
        },
        thumb: {
          height: 20,
          width: 20,
          backgroundColor: "#fff",
          border: "3px solid currentColor",
          boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(99, 102, 241, 0.4)",
          },
          "&.Mui-active": {
            boxShadow: "0 5px 10px rgba(99, 102, 241, 0.5)",
          },
        },
        track: {
          height: 6,
          borderRadius: 3,
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
        },
        rail: {
          height: 6,
          borderRadius: 3,
          backgroundColor: "#e2e8f0",
          opacity: 1,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "16px 0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: "0.938rem",
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          color: "#059669",
        },
        standardError: {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#dc2626",
        },
        standardWarning: {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: "#d97706",
        },
        standardInfo: {
          backgroundColor: "rgba(14, 165, 233, 0.1)",
          color: "#0284c7",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1e293b",
          fontSize: "0.813rem",
          fontWeight: 500,
          borderRadius: 8,
          padding: "8px 12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
        },
        arrow: {
          color: "#1e293b",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e2e8f0",
        },
        head: {
          fontWeight: 700,
          color: "#0f172a",
          backgroundColor: "#f8fafc",
          borderBottom: "2px solid #cbd5e0",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.938rem",
          minHeight: 48,
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.04)",
          },
          "&.Mui-selected": {
            color: "#6366f1",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
        },
      },
    },
  },
});

export default theme;