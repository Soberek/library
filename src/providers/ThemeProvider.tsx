import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #1976d2 0%, #dc004e 100%)",
          color: "#fff",
          border: 0,
          boxShadow: "none",
          "&:hover": {
            background: "linear-gradient(90deg, #1565c0 0%, #c51162 100%)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 1)",
          borderRadius: 8,
          "& .MuiInputBase-input": {
            color: "black",
            background: "rgba(255, 255, 255, 1)",
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
