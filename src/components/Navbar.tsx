import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useSearch } from "../hooks/useSearch";

const Navbar: React.FC = () => {
  const authContext = useUser();
  const searchContext = useSearch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899)",
        display: { xs: "none", md: "block" },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ bgcolor: "white", mr: 1 }}
          >
            <MenuBookIcon sx={{ color: "#8b5cf6" }} />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
          >
            Library App
          </Typography>
        </Box>
        <Box sx={{ mx: 4, width: 300 }}>
          <TextField
            value={searchContext?.searchTerm}
            onChange={(e) => searchContext?.setSearchTerm(e.target.value)}
            placeholder="Szukaj książek..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              sx: { bgcolor: "white", borderRadius: 1 },
            }}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {authContext.user ? (
            <>
              <Avatar sx={{ bgcolor: "#8b5cf6" }}>
                {authContext.user.email?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ maxWidth: 200, color: "white" }}
                  noWrap
                >
                  {authContext.user.email}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "white", opacity: 0.7 }}
                >
                  Witaj!
                </Typography>
              </Box>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                sx={{
                  ml: 2,
                  bgcolor: "#8b5cf6",
                  color: "white",
                  "&:hover": { bgcolor: "#7c3aed" },
                }}
              >
                Wyloguj
              </Button>
            </>
          ) : (
            <Button
              href="/login"
              variant="contained"
              sx={{
                bgcolor: "#4f46e5",
                color: "white",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Zaloguj
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
