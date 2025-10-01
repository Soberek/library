import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Divider,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUser } from "../hooks/useUser";
import { useBooks } from "../hooks/useBooks";
import { useSearch } from "../hooks/useSearch";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Link, useNavigate } from "react-router-dom";


const MobileNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useUser();
  const { booksStats } = useBooks();
  const searchContext = useSearch();
  const navigate = useNavigate();

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          display: { md: "none" },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo and Brand */}
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                p: 0.8,
                borderRadius: 2,
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <MenuBookIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight="700"
              sx={{
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              MyLibrary
            </Typography>
          </Box>

          {/* Menu Button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {/* Mobile Search Bar */}
        <Box sx={{ px: 2, pb: 1 }}>
          <TextField
            value={searchContext?.searchTerm || ""}
            onChange={(e) => searchContext?.setSearchTerm(e.target.value)}
            placeholder="Szukaj książek..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                },
                "&.Mui-focused": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
                "& input": {
                  color: "white",
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.7)",
                    opacity: 1,
                  },
                },
              },
            }}
          />
        </Box>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ display: { md: "none" } }}
        PaperProps={{
          sx: {
            width: 280,
            background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          },
        }}
      >
        <Box
          role="presentation"
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* User Profile Section */}
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  width: 50,
                  height: 50,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {user.user?.email?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {user.user?.email}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Czytelnik
                </Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={`${booksStats.total} książek`}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  "& .MuiChip-label": { fontWeight: 600, fontSize: "0.75rem" },
                }}
              />
              <Chip
                label={`${booksStats.read} przeczytanych`}
                size="small"
                sx={{
                  bgcolor: "rgba(34, 197, 94, 0.2)",
                  color: "white",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  "& .MuiChip-label": { fontWeight: 600, fontSize: "0.75rem" },
                }}
              />
            </Box>
          </Box>

          {/* Navigation Menu */}
          <Box sx={{ flex: 1, py: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/"
                  onClick={handleDrawerClose}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                  }}
                >
                  <HomeIcon sx={{ mr: 2, color: "primary.main" }} />
                  <ListItemText
                    primary="Lista książek"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>

            <Divider sx={{ mx: 2, my: 1 }} />

            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleDrawerClose}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                  }}
                >
                  <PersonIcon sx={{ mr: 2, color: "text.secondary" }} />
                  <ListItemText
                    primary="Profil"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleDrawerClose}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                  }}
                >
                  <SettingsIcon sx={{ mr: 2, color: "text.secondary" }} />
                  <ListItemText
                    primary="Ustawienia"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Logout Button */}
          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
              }}
            >
              Wyloguj się
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
