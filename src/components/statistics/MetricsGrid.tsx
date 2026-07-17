import React from "react";
import { Box } from "@mui/material";
import MetricCard from "./MetricCard";
import StarIcon from "@mui/icons-material/Star";
import PagesIcon from "@mui/icons-material/Pages";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface AdditionalStats {
  averageRating: number;
  totalPages: number;
  readPages: number;
  progressRate: number;
}

interface MetricsGridProps {
  additionalStats: AdditionalStats;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ additionalStats }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 1,
      }}
    >
      <MetricCard
        title="Średnia ocena"
        value={
          additionalStats.averageRating > 0
            ? additionalStats.averageRating.toFixed(1)
            : "0.0"
        }
        icon={<StarIcon />}
        accent="#f59e0b"
      />
      <MetricCard
        title="Wszystkich stron"
        value={additionalStats.totalPages.toLocaleString()}
        icon={<PagesIcon />}
        accent="#7c3aed"
      />
      <MetricCard
        title="Przeczytanych stron"
        value={additionalStats.readPages.toLocaleString()}
        icon={<MenuBookOutlinedIcon />}
        accent="#059669"
      />
      <MetricCard
        title="Postęp ogólny"
        value={`${additionalStats.progressRate}%`}
        icon={<TrendingUpIcon />}
        accent="#0891b2"
        showProgress
        progressValue={additionalStats.progressRate}
      />
    </Box>
  );
};

export default MetricsGrid;
