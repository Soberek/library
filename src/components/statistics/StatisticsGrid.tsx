import React from "react";
import { Grid } from "@mui/material";
import StatCard from "./StatCard";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

interface BooksStats {
  total: number;
  read: number;
  inProgress: number;
  dropped: number;
  wantToRead: number;
}

interface AdditionalStats {
  completionRate: number;
}

interface StatisticsGridProps {
  booksStats: BooksStats;
  additionalStats: AdditionalStats;
}

const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  booksStats,
  additionalStats,
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={2.4}>
        <StatCard
          title="Wszystkich"
          value={booksStats.total}
          icon={<BookIcon sx={{ fontSize: 24, opacity: 0.9 }} />}
          color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          chipLabel="Biblioteka"
          delay={0}
        />
      </Grid>
      <Grid item xs={6} sm={2.4}>
        <StatCard
          title="Chcę przeczytać"
          value={booksStats.wantToRead}
          icon={<BookmarkAddIcon sx={{ fontSize: 24, opacity: 0.9 }} />}
          color="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
          chipLabel="Na liście"
          delay={50}
        />
      </Grid>
      <Grid item xs={6} sm={2.4}>
        <StatCard
          title="W trakcie"
          value={booksStats.inProgress}
          icon={<PauseCircleIcon sx={{ fontSize: 24, opacity: 0.9 }} />}
          color="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          chipLabel="Aktywne"
          delay={100}
        />
      </Grid>
      <Grid item xs={6} sm={2.4}>
        <StatCard
          title="Przeczytane"
          value={booksStats.read}
          icon={<CheckCircleIcon sx={{ fontSize: 24, opacity: 0.9 }} />}
          color="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
          chipLabel={`${additionalStats.completionRate}%`}
          delay={150}
        />
      </Grid>
      <Grid item xs={6} sm={2.4}>
        <StatCard
          title="Porzucone"
          value={booksStats.dropped}
          icon={<CancelIcon sx={{ fontSize: 24, opacity: 0.9 }} />}
          color="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          chipLabel="Do powrotu"
          delay={200}
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsGrid;
