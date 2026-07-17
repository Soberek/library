import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  ButtonBase,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const UserMenu: React.FC = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in", { replace: true });
    } catch (_error) {
      // Ignore sign-out errors
    }
  };

  if (!authContext.user) {
    return (
      <ButtonBase
        component={RouterLink}
        to="/sign-in"
        sx={{
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontWeight: 600,
          fontSize: "0.8125rem",
          fontFamily: "var(--font-sans)",
          boxShadow: "0 2px 8px rgba(102, 126, 234, 0.28)",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        Zaloguj się
      </ButtonBase>
    );
  }

  const email = authContext.user.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "U";
  const displayName = email.split("@")[0] || email;

  return (
    <>
      <Tooltip title={open ? "" : email} arrow>
        <ButtonBase
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          aria-label="Menu użytkownika"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            pl: 0.5,
            pr: 1,
            py: 0.5,
            maxWidth: 200,
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: open ? "rgba(102, 126, 234, 0.35)" : "grey.200",
            bgcolor: open ? "rgba(102, 126, 234, 0.06)" : "#fff",
            boxShadow: open
              ? "0 0 0 3px rgba(102, 126, 234, 0.1)"
              : "0 1px 2px rgba(26, 32, 44, 0.04)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
            "&:hover": {
              borderColor: "rgba(102, 126, 234, 0.4)",
              bgcolor: "rgba(102, 126, 234, 0.04)",
              boxShadow: "0 2px 8px rgba(26, 32, 44, 0.06)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: "0.875rem",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "#fff",
              background: "linear-gradient(145deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
            }}
          >
            {initial}
          </Avatar>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 0,
              flex: 1,
              textAlign: "left",
            }}
          >
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: "0.8125rem",
                lineHeight: 1.25,
                letterSpacing: "-0.015em",
                color: "text.primary",
                maxWidth: 110,
              }}
            >
              {displayName}
            </Typography>
            <Typography
              component="span"
              sx={{
                mt: 0.15,
                px: 0.75,
                py: 0.1,
                borderRadius: 999,
                fontSize: "0.625rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "primary.dark",
                bgcolor: "rgba(102, 126, 234, 0.1)",
                lineHeight: 1.5,
              }}
            >
              Czytelnik
            </Typography>
          </Box>

          <KeyboardArrowDownIcon
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: 18,
              color: "text.secondary",
              flexShrink: 0,
              transition: "transform 0.2s ease",
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        </ButtonBase>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.25,
            minWidth: 260,
            overflow: "visible",
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "grey.200",
            boxShadow: "0 16px 48px rgba(26, 32, 44, 0.12)",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 22,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              borderLeft: "1px solid",
              borderTop: "1px solid",
              borderColor: "grey.200",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.75,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              background: "linear-gradient(145deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {initial}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "-0.015em",
              }}
            >
              {displayName}
            </Typography>
            <Typography
              noWrap
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", maxWidth: 180 }}
            >
              {email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "grey.100" }} />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleLogout();
          }}
          sx={{
            mx: 1,
            my: 1,
            py: 1.15,
            borderRadius: 1.5,
            color: "error.main",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Wyloguj się"
            primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
