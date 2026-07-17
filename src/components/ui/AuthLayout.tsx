import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2,
      py: 4,
      bgcolor: "grey.50",
    }}
  >
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(102, 126, 234, 0.1)",
            color: "primary.main",
            mb: 1.5,
          }}
        >
          <MenuBookOutlinedIcon sx={{ fontSize: 26 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            mb: 0.5,
          }}
        >
          MyLibrary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Twoja osobista biblioteka książek
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          boxShadow: "0 8px 32px rgba(26, 32, 44, 0.06)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: subtitle ? 0.5 : 2.5, textAlign: "center" }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2.5, textAlign: "center" }}
          >
            {subtitle}
          </Typography>
        )}
        {children}
      </Paper>

      {footer && (
        <Box sx={{ mt: 2.5, textAlign: "center" }}>{footer}</Box>
      )}
    </Box>
  </Box>
);

export default AuthLayout;
