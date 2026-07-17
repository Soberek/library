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
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
      <Box
        component="a"
        href="/sign-in"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          px: 2,
          py: 0.75,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 2,
          fontWeight: 600,
          fontSize: "0.8125rem",
          textDecoration: "none",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        Zaloguj się
      </Box>
    );
  }

  const email = authContext.user.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "U";
  const displayName = email.split("@")[0] || email;

  return (
    <>
      <Tooltip title="Menu użytkownika">
        <ButtonBase
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-controls={open ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 0.5,
            pr: { xs: 0.5, sm: 1.25 },
            py: 0.5,
            borderRadius: 999,
            border: "1px solid",
            borderColor: open ? "primary.light" : "grey.200",
            bgcolor: open ? "rgba(102, 126, 234, 0.06)" : "grey.50",
            "&:hover": {
              bgcolor: "rgba(102, 126, 234, 0.06)",
              borderColor: "primary.light",
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 32,
              height: 32,
              fontSize: "0.8125rem",
              fontWeight: 700,
            }}
          >
            {initial}
          </Avatar>
          <Box
            textAlign="left"
            sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}
          >
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontWeight: 600,
                fontSize: "0.8125rem",
                lineHeight: 1.2,
                maxWidth: 130,
              }}
            >
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontSize: "0.6875rem" }}
            >
              Czytelnik
            </Typography>
          </Box>
        </ButtonBase>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 2.5,
            border: "1px solid",
            borderColor: "grey.100",
            boxShadow: "0 12px 40px rgba(26, 32, 44, 0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Czytelnik
          </Typography>
        </Box>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleLogout();
          }}
          sx={{
            color: "error.main",
            py: 1.25,
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Wyloguj" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
