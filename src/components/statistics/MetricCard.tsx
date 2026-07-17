import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
  showProgress?: boolean;
  progressValue?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  accent = "#667eea",
  showProgress = false,
  progressValue = 0,
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        bgcolor: "grey.50",
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "grey.200",
            color: accent,
            "& .MuiSvgIcon-root": { fontSize: 15 },
          }}
        >
          {icon}
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: "text.primary",
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            fontSize: "0.7rem",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {showProgress && (
          <LinearProgress
            variant="determinate"
            value={Math.min(Math.max(progressValue, 0), 100)}
            sx={{
              mt: 0.5,
              height: 2.5,
              borderRadius: 2,
              bgcolor: "grey.200",
              "& .MuiLinearProgress-bar": {
                bgcolor: accent,
                borderRadius: 2,
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default MetricCard;
