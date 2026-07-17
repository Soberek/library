import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Fade,
  Divider,
  ButtonBase,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Badge from "@mui/material/Badge";
import { useAuth } from "../../hooks/useAuth";
import { useBooksQuery } from "../../hooks/useBooksQuery";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

const STAT_ITEM_SX = {
  display: "flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.25,
  py: 0.5,
  borderRadius: 2,
  bgcolor: "grey.50",
  border: "1px solid",
  borderColor: "grey.200",
  transition: "background-color 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    bgcolor: "grey.100",
    borderColor: "grey.300",
  },
} as const;

const UserMenu: React.FC = () => {
  const authContext = useAuth();
  const { booksStats } = useBooksQuery(false);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!authContext.user) {
    return (
      <Fade in timeout={1200}>
        <Box
          component="a"
          href="/sign-in"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 2.5,
            py: 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 2.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            textDecoration: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.25)",
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 14px rgba(102, 126, 234, 0.35)",
            },
          }}
        >
          Zaloguj się
        </Box>
      </Fade>
    );
  }

  const email = authContext.user.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "U";
  const displayName = email.split("@")[0] || email;

  return (
    <Fade in timeout={1200}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Wszystkie książki">
            <Box sx={STAT_ITEM_SX}>
              <MenuBookOutlinedIcon
                sx={{ fontSize: 16, color: "primary.main" }}
              />
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  color: "text.primary",
                  lineHeight: 1,
                }}
              >
                {booksStats.total}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  lineHeight: 1,
                }}
              >
                książek
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Przeczytane książki">
            <Box
              sx={{
                ...STAT_ITEM_SX,
                bgcolor: "rgba(34, 197, 94, 0.06)",
                borderColor: "rgba(34, 197, 94, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(34, 197, 94, 0.1)",
                  borderColor: "rgba(34, 197, 94, 0.35)",
                },
              }}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: 16, color: "success.dark" }}
              />
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  color: "success.dark",
                  lineHeight: 1,
                }}
              >
                {booksStats.read}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  color: "success.dark",
                  opacity: 0.8,
                  lineHeight: 1,
                }}
              >
                przeczytanych
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Tooltip title="Powiadomienia">
          <IconButton
            size="small"
            aria-label="Powiadomienia"
            sx={{
              color: "text.secondary",
              bgcolor: "transparent",
              border: "1px solid",
              borderColor: "grey.200",
              width: 36,
              height: 36,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                color: "primary.main",
                bgcolor: "rgba(102, 126, 234, 0.06)",
                borderColor: "primary.light",
              },
            }}
          >
            <Badge
              badgeContent={0}
              color="error"
              invisible
              sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem" } }}
            >
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Menu użytkownika">
          <ButtonBase
            onClick={handleMenuClick}
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              pl: 0.5,
              pr: { xs: 0.5, sm: 1.25 },
              py: 0.5,
              borderRadius: 999,
              border: "1px solid",
              borderColor: open ? "primary.light" : "grey.200",
              bgcolor: open ? "rgba(102, 126, 234, 0.06)" : "grey.50",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "rgba(102, 126, 234, 0.06)",
                borderColor: "primary.light",
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 34,
                height: 34,
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "primary.contrastText",
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
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  lineHeight: 1.2,
                  maxWidth: 140,
                }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
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
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.25,
              minWidth: 220,
              borderRadius: 2.5,
              boxShadow:
                "0 12px 40px rgba(26, 32, 44, 0.12), 0 0 0 1px rgba(26, 32, 44, 0.04)",
              border: "1px solid",
              borderColor: "grey.100",
              overflow: "hidden",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {email}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Czytelnik
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              py: 1.25,
              px: 2,
              mx: 0.75,
              mt: 0.75,
              borderRadius: 2,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "rgba(102, 126, 234, 0.08)" },
            }}
          >
            <AccountCircleIcon
              sx={{ mr: 1.5, fontSize: 20, color: "text.secondary" }}
            />
            Profil
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              py: 1.25,
              px: 2,
              mx: 0.75,
              borderRadius: 2,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "rgba(102, 126, 234, 0.08)" },
            }}
          >
            <SettingsIcon
              sx={{ mr: 1.5, fontSize: 20, color: "text.secondary" }}
            />
            Ustawienia
          </MenuItem>
          <Divider sx={{ my: 0.75 }} />
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogout();
            }}
            sx={{
              color: "error.main",
              py: 1.25,
              px: 2,
              mx: 0.75,
              mb: 0.75,
              borderRadius: 2,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
            }}
          >
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Wyloguj
          </MenuItem>
        </Menu>
      </Box>
    </Fade>
  );
};

export default UserMenu;
