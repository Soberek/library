import type { ElementType } from "react";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import type { BookStatus } from "../types/Book";
import { BOOK_STATUS_LABELS } from "./bookStatus";

export const GOLD = {
  soft: "#f8f1df",
  mid: "#e8c872",
  rich: "#c9a227",
  deep: "#8a6a12",
  glow: "rgba(201, 162, 39, 0.35)",
} as const;

export const STATUS_ACCENT: Record<BookStatus, string> = {
  "Chcę przeczytać": "#3b82f6",
  "W trakcie": "#f59e0b",
  Przeczytana: "#22c55e",
  Porzucona: "#ef4444",
};

export const STATUS_STYLE: Record<
  BookStatus,
  { bg: string; color: string; Icon: ElementType; short: string }
> = {
  "Chcę przeczytać": {
    bg: "#3b82f6",
    color: "#fff",
    Icon: BookmarkAddOutlinedIcon,
    short: "Do przeczytania",
  },
  "W trakcie": {
    bg: "#f59e0b",
    color: "#fff",
    Icon: AutoStoriesOutlinedIcon,
    short: "W trakcie",
  },
  Przeczytana: {
    bg: "#22c55e",
    color: "#fff",
    Icon: CheckCircleOutlineIcon,
    short: "Przeczytana",
  },
  Porzucona: {
    bg: "#ef4444",
    color: "#fff",
    Icon: HighlightOffOutlinedIcon,
    short: "Porzucona",
  },
};

export const STATUS_PILL: Record<BookStatus, { bg: string; color: string }> =
  {
    "Chcę przeczytać": { bg: "rgba(59, 130, 246, 0.12)", color: "#1d4ed8" },
    "W trakcie": { bg: "rgba(245, 158, 11, 0.14)", color: "#b45309" },
    Przeczytana: { bg: "rgba(34, 197, 94, 0.12)", color: "#15803d" },
    Porzucona: { bg: "rgba(239, 68, 68, 0.12)", color: "#b91c1c" },
  };

export const getNextStatus = (current: BookStatus): BookStatus => {
  switch (current) {
    case "Przeczytana":
    case "Porzucona":
      return "Chcę przeczytać";
    case "W trakcie":
      return "Przeczytana";
    case "Chcę przeczytać":
      return "W trakcie";
    default:
      return "Chcę przeczytać";
  }
};

export const getNextStatusLabel = (current: BookStatus): string =>
  BOOK_STATUS_LABELS[getNextStatus(current)];
