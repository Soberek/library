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
  Fade,
  Slide,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CloseIcon from "@mui/icons-material/Close";
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
            width: 320,
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 0 40px rgba(0,0,0,0.15)",
            borderLeft: "1px solid rgba(0,0,0,0.05)",
          },
        }}
      >
        <Box
          role="presentation"
          sx={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* Header with Close Button */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ opacity: 0.9 }}>
              Menu
            </Typography>
            <Tooltip title="Zamknij">
              <IconButton
                onClick={handleDrawerClose}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
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
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2} position="relative" zIndex={1}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    width: 60,
                    height: 60,
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  {user.user?.email?.charAt(0).toUpperCase() ?? "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>
                    {user.user?.email}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                    Czytelnik
                  </Typography>
                </Box>
              </Box>

              {/* Enhanced Stats */}
              <Box display="flex" gap={1} flexWrap="wrap" position="relative" zIndex={1}>
                <Chip
                  icon={<BookmarkIcon sx={{ fontSize: 16 }} />}
                  label={`${booksStats.total} książek`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    "& .MuiChip-label": { fontWeight: 600, fontSize: "0.8rem" },
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
                <Chip
                  icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                  label={`${booksStats.read} przeczytanych`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(34, 197, 94, 0.3)",
                    color: "white",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    "& .MuiChip-label": { fontWeight: 600, fontSize: "0.8rem" },
                    "& .MuiChip-icon": { color: "white" },
                  }}
                />
              </Box>
            </Box>
          </Fade>

          {/* Navigation Menu */}
          <Box sx={{ flex: 1, py: 2 }}>
            <Slide direction="left" in timeout={800}>
              <List sx={{ px: 1 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/"
                    onClick={handleDrawerClose}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      py: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": { 
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <HomeIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    </Box>
                    <ListItemText
                      primary="Lista książek"
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "text.primary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleDrawerClose}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      py: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": { 
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AnalyticsIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    </Box>
                    <ListItemText
                      primary="Statystyki"
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "text.primary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Slide>

            <Divider sx={{ mx: 2, my: 2, opacity: 0.3 }} />

            <Slide direction="left" in timeout={1000}>
              <List sx={{ px: 1 }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleDrawerClose}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      py: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": { 
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(0, 0, 0, 0.05)",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </Box>
                    <ListItemText
                      primary="Profil"
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "text.primary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleDrawerClose}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      py: 1.5,
                      transition: "all 0.2s ease",
                      "&:hover": { 
                        bgcolor: "rgba(102, 126, 234, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: "rgba(0, 0, 0, 0.05)",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SettingsIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    </Box>
                    <ListItemText
                      primary="Ustawienia"
                      primaryTypographyProps={{ 
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "text.primary",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Slide>
          </Box>

          {/* Logout Button */}
          <Fade in timeout={1200}>
            <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", opacity: 0.7 }}>
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
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "white",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Wyloguj się
              </Button>
            </Box>
          </Fade>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
