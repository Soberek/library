import React from "react";
import { Paper, Box, Typography, LinearProgress, Zoom } from "@mui/material";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  showProgress?: boolean;
  progressValue?: number;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  showProgress = false,
  progressValue = 0,
  delay = 0,
}) => {
  // Add safety check for SSR
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Zoom in={mounted} timeout={1300 + delay}>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          minHeight: 100,
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 40,
              height: 40,
            }}
          >
            {icon}
          </Box>
          <Box flex={1}>
            <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="500" sx={{ fontSize: "0.85rem" }}>
              {title}
            </Typography>
            {showProgress && (
              <LinearProgress
                variant="determinate"
                value={Math.min(progressValue, 100)}
                sx={{
                  mt: 0.5,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    background: color,
                    borderRadius: 2,
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default MetricCard;
