import React from "react";
import { AppBar, Toolbar, Box, Typography, ButtonBase } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        display: { xs: "none", md: "block" },
        bgcolor: "rgba(255, 255, 255, 0.92)",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        boxShadow: "0 1px 2px rgba(26, 32, 44, 0.04)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          gap: 2,
          minHeight: 60,
          px: { md: 3, lg: 4 },
          py: 0.75,
        }}
      >
        <ButtonBase
          onClick={() => navigate("/")}
          aria-label="MyLibrary — strona główna"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
            minWidth: 140,
            borderRadius: 1.5,
            py: 0.5,
            px: 0.5,
            justifyContent: "flex-start",
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(102, 126, 234, 0.1)",
              color: "primary.main",
            }}
          >
            <MenuBookOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            component="span"
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.125rem',
              letterSpacing: '-0.02em',
              color: 'text.primary',
            }}
          >
            MyLibrary
          </Typography>
        </ButtonBase>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            maxWidth: 520,
            mx: "auto",
          }}
        >
          <SearchBar variant="desktop" />
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
