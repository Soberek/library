import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      navigate("/sign-in", { replace: true });
    } catch (_error) {
      // Ignore sign-out errors
    }
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 280 } }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 3,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
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
          <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">
            MyLibrary
          </Typography>
        </Box>
        {user?.email && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        )}
      </Box>

      <List sx={{ py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            onClick={onClose}
            selected={location.pathname === "/"}
            sx={{
              mx: 1,
              borderRadius: 1.5,
              "&.Mui-selected": {
                bgcolor: "rgba(102, 126, 234, 0.1)",
                color: "primary.main",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 36,
                color:
                  location.pathname === "/" ? "primary.main" : "text.secondary",
              }}
            >
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Moja biblioteka"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      {user && (
        <>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  mx: 1,
                  borderRadius: 1.5,
                  color: "error.main",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: "error.main" }}>
                  <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Wyloguj się"
                  primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  );
};

export default MobileDrawer;
