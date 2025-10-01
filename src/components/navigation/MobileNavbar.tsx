import { useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Fade,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";

// Styles constants for better maintainability
const MOBILE_NAVBAR_STYLES = {
  appBar: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    display: { md: "none" },
  },
  toolbar: {
    justifyContent: "space-between",
    py: 1.5,
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    cursor: "pointer",
  },
  iconWrapper: {
    p: 1,
    borderRadius: 3,
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "scale(1.05)",
      background: "rgba(255, 255, 255, 0.2)",
    },
  },
  brandText: {
    color: "white",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    letterSpacing: "-1px",
    fontSize: "1.25rem",
  },
  menuButton: {
    bgcolor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.2)",
      transform: "scale(1.1)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    },
  },
  searchContainer: {
    px: 2,
    pb: 2,
  },
} as const;

const MobileNavbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleBrandClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={MOBILE_NAVBAR_STYLES.appBar}>
        <Toolbar sx={MOBILE_NAVBAR_STYLES.toolbar}>
          {/* Logo and Brand */}
          <Box
            sx={MOBILE_NAVBAR_STYLES.brandContainer}
            onClick={handleBrandClick}
          >
            <Fade in timeout={600}>
              <Box sx={MOBILE_NAVBAR_STYLES.iconWrapper}>
                <MenuBookIcon sx={{ color: "white", fontSize: 26 }} />
              </Box>
            </Fade>
            <Fade in timeout={800}>
              <Typography
                variant="h6"
                fontWeight="800"
                sx={MOBILE_NAVBAR_STYLES.brandText}
              >
                MyLibrary
              </Typography>
            </Fade>
          </Box>

          {/* Menu Button */}
          <Fade in timeout={1000}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              sx={MOBILE_NAVBAR_STYLES.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </Fade>
        </Toolbar>

        {/* Mobile Search Bar */}
        <Box sx={MOBILE_NAVBAR_STYLES.searchContainer}>
          <SearchBar variant="mobile" />
        </Box>
      </AppBar>

      <MobileDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default MobileNavbar;
