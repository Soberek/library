import type { ComponentType } from "react";
import { BookmarkPlus, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import type { BookStatus } from "../types/Book";
import { BOOK_STATUS_LABELS } from "./bookStatus";

export const GOLD = {
  soft: "#fef9c3",
  mid: "#facc15",
  rich: "#eab308",
  deep: "#a16207",
  glow: "rgba(234, 179, 8, 0.35)",
} as const;

export const STATUS_ACCENT: Record<BookStatus, string> = {
  "Chcę przeczytać": "#2563eb",
  "W trakcie": "#d97706",
  Przeczytana: "#16a34a",
  Porzucona: "#dc2626",
};

export const STATUS_STYLE: Record<
  BookStatus,
  { bg: string; color: string; border?: string; Icon: ComponentType<{ className?: string; size?: number }>; short: string }
> = {
  "Chcę przeczytać": {
    bg: "#2563eb",
    color: "#fff",
    border: "#1d4ed8",
    Icon: BookmarkPlus,
    short: "Do przeczytania",
  },
  "W trakcie": {
    bg: "#d97706",
    color: "#fff",
    border: "#b45309",
    Icon: BookOpen,
    short: "W trakcie",
  },
  Przeczytana: {
    bg: "#16a34a",
    color: "#fff",
    border: "#15803d",
    Icon: CheckCircle2,
    short: "Przeczytana",
  },
  Porzucona: {
    bg: "#dc2626",
    color: "#fff",
    border: "#b91c1c",
    Icon: XCircle,
    short: "Porzucona",
  },
};

export const STATUS_PILL: Record<BookStatus, { bg: string; color: string; border: string }> = {
  "Chcę przeczytać": {
    bg: "#eff6ff",
    color: "#1d4ed8",
    border: "#bfdbfe",
  },
  "W trakcie": {
    bg: "#fffbeb",
    color: "#b45309",
    border: "#fde68a",
  },
  Przeczytana: {
    bg: "#f0fdf4",
    color: "#15803d",
    border: "#bbf7d0",
  },
  Porzucona: {
    bg: "#fef2f2",
    color: "#b91c1c",
    border: "#fecaca",
  },
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
