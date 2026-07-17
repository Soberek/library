import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  accent?: string;
  hint?: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  accent = "#667eea",
  hint,
  progress,
}) => {
  return (
    <Box
      sx={{
        height: "100%",
        p: 1.25,
        borderRadius: 1.5,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "grey.200",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2.5,
          bgcolor: accent,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 0.5,
          mb: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 650,
            fontSize: "0.65rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "text.secondary",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {icon && (
          <Box
            sx={{
              color: accent,
              display: "flex",
              opacity: 0.85,
              "& .MuiSvgIcon-root": { fontSize: 14 },
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1.25rem",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: "text.primary",
          mb: hint || typeof progress === "number" ? 0.35 : 0,
        }}
      >
        {value}
      </Typography>

      {hint && (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.7rem",
            lineHeight: 1.2,
          }}
        >
          {hint}
        </Typography>
      )}

      {typeof progress === "number" && (
        <LinearProgress
          variant="determinate"
          value={Math.min(Math.max(progress, 0), 100)}
          sx={{
            mt: 0.5,
            height: 3,
            borderRadius: 2,
            bgcolor: "grey.100",
            "& .MuiLinearProgress-bar": {
              bgcolor: accent,
              borderRadius: 2,
            },
          }}
        />
      )}
    </Box>
  );
};

export default StatCard;
