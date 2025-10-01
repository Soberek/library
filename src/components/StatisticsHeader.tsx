import React from "react";
import { Box, Typography } from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

const StatisticsHeader: React.FC = () => {
  // Add safety check for SSR
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mb: 4 }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AutoGraphIcon sx={{ color: "white", fontSize: 28 }} />
      </Box>
      <Box>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Statystyki czytania
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Twoje osiągnięcia i postępy
        </Typography>
      </Box>
    </Box>
  );
};

export default StatisticsHeader;
