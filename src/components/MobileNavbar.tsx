import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { useUser } from "../hooks/useUser";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Link } from "react-router-dom";

const menuItems = [{ name: "Lista książek", path: "/books" }];

const MobileNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useUser();

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleLogout = () => {
    // Add logout logic here
    signOut(auth);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(90deg, #4f46e5 0%, #8b5cf6 50%, #ec4899 100%)",
          boxShadow: 3,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: { md: "none" },
        }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                backdropFilter: "blur(4px)",
              }}
            >
              <span style={{ fontSize: "2rem" }}>📚</span>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Library App for Magdzialena
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                mr: 1,
                fontWeight: 500,
                fontSize: "1rem",
              }}
            >
              Zalogowano jako: {user.user?.email}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ display: { md: "none" } }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.user?.email}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="medium"
              onClick={handleLogout}
              sx={{ mt: 1, textTransform: "none" }}
              fullWidth
            >
              Wyloguj się
            </Button>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton component={Link} to={item.path} replace>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
