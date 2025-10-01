import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloseIcon from "@mui/icons-material/Close";
import { useUser } from "../../hooks/useUser";
import { useBooks } from "../../hooks/useBooks";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const user = useUser();
  const { booksStats } = useBooks();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { text: "Biblioteka", icon: <HomeIcon />, action: () => navigate("/") },
    {
      text: "Statystyki",
      icon: <AnalyticsIcon />,
      action: () => navigate("/"),
    },
    { text: "Profil", icon: <PersonIcon />, action: () => {} },
    { text: "Ustawienia", icon: <SettingsIcon />, action: () => {} },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ display: { md: "none" }, zIndex: 1300 }}
      PaperProps={{
        sx: {
          width: "100vw",
          maxWidth: "100vw",
          height: "100vh",
          maxHeight: "100vh",
          borderRadius: 0,
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "none",
          borderLeft: "none",
          backdropFilter: "blur(20px)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)",
            pointerEvents: "none",
            zIndex: 0,
          },
        },
      }}
    >
      <Box
        role="presentation"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Profile Section */}
        <Fade in timeout={600}>
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={2.5}
              mb={2.5}
              position="relative"
              zIndex={1}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.25)",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  width: 65,
                  height: 65,
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                    borderRadius: "50%",
                    zIndex: -1,
                  },
                }}
              >
                {user.user?.email?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{ mb: 0.5, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                >
                  {user.user?.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 500,
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  Czytelnik
                </Typography>
              </Box>
            </Box>

            {/* Enhanced Stats */}
            <Box
              display="flex"
              gap={1.5}
              flexWrap="wrap"
              position="relative"
              zIndex={1}
            >
              <Chip
                icon={<BookmarkIcon sx={{ fontSize: 18 }} />}
                label={`${booksStats.total} książek`}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "& .MuiChip-label": { fontWeight: 600, fontSize: "0.85rem" },
                  "& .MuiChip-icon": { color: "white" },
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              />
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
                label={`${booksStats.read} przeczytanych`}
                size="small"
              />
            </Box>
          </Box>
        </Fade>

        {/* Navigation Menu */}
        <Fade in timeout={800}>
          <List sx={{ flex: 1, px: 2, py: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.08)",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 16px rgba(102, 126, 234, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "text.secondary",
                      minWidth: 40,
                      transition: "color 0.2s ease",
                      "&:hover": { color: "primary.main" },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Fade>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Logout Button */}
        <Fade in timeout={1000}>
          <Box sx={{ p: 2 }}>
            <ListItemButton
              onClick={() => {
                handleLogout();
                onClose();
              }}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 2,
                color: "error.main",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "rgba(244, 67, 54, 0.08)",
                  transform: "translateX(8px)",
                  boxShadow: "0 4px 16px rgba(244, 67, 54, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Wyloguj"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              />
            </ListItemButton>
          </Box>
        </Fade>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
