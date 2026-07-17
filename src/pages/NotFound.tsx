import React from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { Box, Button, Typography, Link } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const NotFound: React.FC = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2,
      bgcolor: "grey.50",
    }}
  >
    <Box sx={{ textAlign: "center", maxWidth: 400 }}>
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2,
          mx: "auto",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(102, 126, 234, 0.1)",
          color: "primary.main",
        }}
      >
        <MenuBookOutlinedIcon sx={{ fontSize: 28 }} />
      </Box>

      <Typography
        variant="h4"
        sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 1 }}
      >
        MyLibrary
      </Typography>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "3rem", sm: "4rem" },
          color: "primary.main",
          lineHeight: 1,
          mb: 1,
        }}
      >
        404
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Nie znaleziono tej strony. Wróć do swojej biblioteki.
      </Typography>

      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        startIcon={<HomeOutlinedIcon />}
        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
      >
        Wróć do biblioteki
      </Button>

      <Typography variant="body2" sx={{ mt: 3 }}>
        <Link component={RouterLink} to="/sign-in" underline="hover">
          Zaloguj się
        </Link>
      </Typography>
    </Box>
  </Box>
);

export default NotFound;
