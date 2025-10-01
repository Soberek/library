import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Chip,
  InputAdornment,
  Badge,
  Tooltip,
  Fade,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useSearch } from "../hooks/useSearch";
import { useState } from "react";
import { useBooks } from "../hooks/useBooks";

const Navbar: React.FC = () => {
  const authContext = useUser();
  const searchContext = useSearch();
  const { booksStats } = useBooks();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: { xs: "none", md: "block" },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        {/* Logo and Brand */}
        <Box display="flex" alignItems="center" gap={2}>
          <Fade in timeout={800}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <MenuBookIcon sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  letterSpacing: "-0.5px",
                }}
              >
                MyLibrary
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Search Bar */}
        <Fade in timeout={1000}>
          <Box sx={{ mx: 4, width: { md: 400, lg: 500 } }}>
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
                      fontSize: 20
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
        </Fade>

        {/* User Section */}
        <Fade in timeout={1200}>
          <Box display="flex" alignItems="center" gap={2}>
            {authContext.user ? (
              <>
                {/* Stats Chips */}
                <Box display="flex" gap={1} sx={{ display: { xs: "none", lg: "flex" } }}>
                  <Chip
                    label={`${booksStats.total} książek`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      "& .MuiChip-label": { fontWeight: 600 },
                    }}
                  />
                  <Chip
                    label={`${booksStats.read} przeczytanych`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(34, 197, 94, 0.2)",
                      color: "white",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      "& .MuiChip-label": { fontWeight: 600 },
                    }}
                  />
                </Box>

                {/* Notifications */}
                <Tooltip title="Powiadomienia">
                  <IconButton
                    sx={{
                      color: "white",
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                    }}
                  >
                    <Badge badgeContent={0} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Menu */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Box textAlign="right" sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        maxWidth: 200,
                      }}
                      noWrap
                    >
                      {authContext.user.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "0.75rem",
                      }}
                    >
                      Czytelnik
                    </Typography>
                  </Box>
                  <Tooltip title="Menu użytkownika">
                    <IconButton
                      onClick={handleMenuClick}
                      sx={{
                        p: 0.5,
                        "&:hover": { transform: "scale(1.1)" },
                        transition: "transform 0.2s ease",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.2)",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          width: 40,
                          height: 40,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                        }}
                      >
                        {authContext.user.email?.charAt(0).toUpperCase() ?? "U"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* User Menu Dropdown */}
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(0,0,0,0.05)",
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <AccountCircleIcon sx={{ mr: 2, color: "text.secondary" }} />
                    Profil
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <SettingsIcon sx={{ mr: 2, color: "text.secondary" }} />
                    Ustawienia
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      handleLogout();
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <LogoutIcon sx={{ mr: 2 }} />
                    Wyloguj
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                href="/sign-in"
                variant="contained"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Zaloguj się
              </Button>
            )}
          </Box>
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
