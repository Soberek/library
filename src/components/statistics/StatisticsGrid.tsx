import React from "react";
import { Box, Typography } from "@mui/material";
import StatCard from "./StatCard";
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

const STATUS_SEGMENTS = [
  { key: "wantToRead", label: "Chcę przeczytać", color: "#3b82f6" },
  { key: "inProgress", label: "W trakcie", color: "#f59e0b" },
  { key: "read", label: "Przeczytane", color: "#22c55e" },
  { key: "dropped", label: "Porzucone", color: "#ef4444" },
] as const;

const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  booksStats,
  additionalStats,
}) => {
  const total = Math.max(booksStats.total, 1);
  const segments = STATUS_SEGMENTS.map((segment) => ({
    ...segment,
    value: booksStats[segment.key],
    pct: (booksStats[segment.key] / total) * 100,
  }));

  return (
    <Box>
      <Box
        sx={{
          mb: 1.25,
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.200",
          bgcolor: "grey.50",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.5rem",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "text.primary",
              }}
            >
              {booksStats.total}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                fontSize: "0.8rem",
              }}
            >
              {booksStats.total === 1 ? "książka" : "książek"} ·{" "}
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "success.dark" }}
              >
                {additionalStats.completionRate}%
              </Box>{" "}
              ukończenia
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            height: 6,
            borderRadius: 999,
            overflow: "hidden",
            bgcolor: "grey.200",
            mb: 0.75,
          }}
        >
          {booksStats.total === 0 ? (
            <Box sx={{ width: "100%", bgcolor: "grey.200" }} />
          ) : (
            segments.map(
              (segment) =>
                segment.value > 0 && (
                  <Box
                    key={segment.key}
                    title={`${segment.label}: ${segment.value}`}
                    sx={{
                      width: `${segment.pct}%`,
                      bgcolor: segment.color,
                      minWidth: segment.value > 0 ? 3 : 0,
                    }}
                  />
                ),
            )
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {segments.map((segment) => (
            <Box
              key={segment.key}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: segment.color,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  lineHeight: 1.2,
                }}
              >
                {segment.label}{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  {segment.value}
                </Box>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            sm: "repeat(4, 1fr)",
          },
          gap: 1,
        }}
      >
        <StatCard
          title="Chcę przeczytać"
          value={booksStats.wantToRead}
          icon={<BookmarkAddIcon />}
          accent="#3b82f6"
        />
        <StatCard
          title="W trakcie"
          value={booksStats.inProgress}
          icon={<PauseCircleIcon />}
          accent="#f59e0b"
        />
        <StatCard
          title="Przeczytane"
          value={booksStats.read}
          icon={<CheckCircleIcon />}
          accent="#22c55e"
          progress={additionalStats.completionRate}
        />
        <StatCard
          title="Porzucone"
          value={booksStats.dropped}
          icon={<CancelIcon />}
          accent="#ef4444"
        />
      </Box>
    </Box>
  );
};

export default StatisticsGrid;
