import { useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  ButtonBase,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useNavigate } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";

const MobileNavbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);
  const handleBrandClick = useCallback(() => navigate("/"), [navigate]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          display: { md: "none" },
          bgcolor: "rgba(255, 255, 255, 0.95)",
          borderBottom: "1px solid",
          borderColor: "grey.200",
          boxShadow: "0 1px 2px rgba(26, 32, 44, 0.04)",
        }}
      >
        <Toolbar
          sx={{ justifyContent: "space-between", minHeight: 56, py: 0.5 }}
        >
          <ButtonBase
            onClick={handleBrandClick}
            aria-label="MyLibrary — strona główna"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderRadius: 1.5,
              py: 0.5,
              px: 0.5,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(102, 126, 234, 0.1)",
                color: "primary.main",
              }}
            >
              <MenuBookOutlinedIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography
              fontWeight={800}
              fontSize="1rem"
              letterSpacing="-0.02em"
            >
              MyLibrary
            </Typography>
          </ButtonBase>

          <IconButton
            edge="end"
            aria-label="Otwórz menu"
            onClick={handleDrawerOpen}
            sx={{ color: "text.secondary" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <Box sx={{ px: 2, pb: 1.5 }}>
          <SearchBar variant="mobile" />
        </Box>
      </AppBar>

      <MobileDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default MobileNavbar;
