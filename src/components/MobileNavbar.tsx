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
                  <SearchIcon sx={{ 
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: 18
                  }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "rgba(255, 255, 255, 0.4)",
                borderRadius: 2,
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                transition: "all 0.2s ease",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                },
                "&.Mui-focused": {
                  bgcolor: "rgba(255, 255, 255, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.7)",
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.3)",
                },
                "& input": {
                  color: "white",
                  fontSize: "0.9rem",
                  "&::placeholder": {
                    color: "rgba(255, 255, 255, 0.8)",
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
            width: 340,
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            borderLeft: "none",
            backdropFilter: "blur(20px)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)",
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
                  background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2.5} mb={2.5} position="relative" zIndex={1}>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    border: "3px solid rgba(255, 255, 255, 0.3)",
                    width: 65,
                    height: 65,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)",
                      borderRadius: "50%",
                      zIndex: -1,
                    },
                  }}
                >
                  {user.user?.email?.charAt(0).toUpperCase() ?? "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
                    {user.user?.email}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
                    Czytelnik
                  </Typography>
                </Box>
              </Box>

              {/* Enhanced Stats */}
              <Box display="flex" gap={1.5} flexWrap="wrap" position="relative" zIndex={1}>
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
                  sx={{
                    bgcolor: "rgba(34, 197, 94, 0.3)",
                    color: "white",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
                    "& .MuiChip-label": { fontWeight: 600, fontSize: "0.85rem" },
                    "& .MuiChip-icon": { color: "white" },
                    "&:hover": {
                      bgcolor: "rgba(34, 197, 94, 0.4)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                />
              </Box>
            </Box>
          </Fade>

          {/* Navigation Menu */}
          <Box sx={{ 
            flex: 1, 
            py: 2,
            background: "linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)",
            backdropFilter: "blur(10px)",
          }}>
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

            <Divider sx={{ 
              mx: 2, 
              my: 2, 
              opacity: 0.2,
              "&::before, &::after": {
                borderColor: "rgba(102, 126, 234, 0.1)",
              },
            }} />

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
