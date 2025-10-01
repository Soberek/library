import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  Zoom,
  Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";

type Props = {
  handleBookModalOpen: (params: {
    mode: "add" | "edit";
    bookId: string | null;
  }) => void;
};

const BottomNav: React.FC<Props> = ({ handleBookModalOpen }) => {
  const [value, setValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <Zoom in={mounted} timeout={600}>
        <Fab
          color="primary"
          aria-label="Dodaj książkę"
          onClick={() => handleBookModalOpen({ mode: "add", bookId: null })}
          sx={{
            position: "fixed",
            bottom: 88,
            right: 20,
            zIndex: 1300,
            display: { xs: "flex", md: "none" },
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow:
              "0 8px 32px rgba(102, 126, 234, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)",
            width: 64,
            height: 64,
            borderRadius: 4,
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "scale(1.1) rotate(5deg)",
              boxShadow:
                "0 12px 40px rgba(102, 126, 234, 0.5), 0 6px 20px rgba(0, 0, 0, 0.15)",
            },
            "&:active": {
              transform: "scale(1.05) rotate(2deg)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <AddIcon sx={{ fontSize: 28, color: "white" }} />
        </Fab>
      </Zoom>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          display: { xs: "block", md: "none" },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
          borderRadius: "20px 20px 0 0",
          overflow: "hidden",
        }}
        elevation={0}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
            // Navigate based on selection
            if (newValue === 0) navigate("/");
            // Add other navigation logic here
          }}
          sx={{
            height: 80,
            background: "transparent",
            "& .MuiBottomNavigationAction-root": {
              color: "text.secondary",
              minWidth: "auto",
              maxWidth: "none",
              flex: 1,
              py: 1,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "0 0 4px 4px",
                transition: "width 0.3s ease",
              },
              "&.Mui-selected": {
                color: "primary.main",
                "&::before": {
                  width: "60%",
                },
                "& .MuiBottomNavigationAction-label": {
                  fontWeight: 700,
                  fontSize: "0.75rem",
                },
              },
              "&:hover": {
                color: "primary.main",
                transform: "translateY(-2px)",
                "& .nav-icon": {
                  transform: "scale(1.1)",
                },
              },
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.7rem",
              fontWeight: 600,
              mt: 0.5,
              transition: "all 0.2s ease",
            },
          }}
        >
          <BottomNavigationAction
            label="Biblioteka"
            icon={
              <Badge
                badgeContent={0}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.6rem",
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <LibraryBooksIcon
                  className="nav-icon"
                  sx={{ fontSize: 24, transition: "transform 0.2s ease" }}
                />
              </Badge>
            }
            sx={{
              "&.Mui-selected .nav-icon": {
                color: "primary.main",
              },
            }}
          />
          <BottomNavigationAction
            label="Statystyki"
            icon={
              <TrendingUpIcon
                className="nav-icon"
                sx={{ fontSize: 24, transition: "transform 0.2s ease" }}
              />
            }
            sx={{
              "&.Mui-selected .nav-icon": {
                color: "primary.main",
              },
            }}
          />
          <BottomNavigationAction
            label="Profil"
            icon={
              <HomeIcon
                className="nav-icon"
                sx={{ fontSize: 24, transition: "transform 0.2s ease" }}
              />
            }
            sx={{
              "&.Mui-selected .nav-icon": {
                color: "primary.main",
              },
            }}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default BottomNav;
