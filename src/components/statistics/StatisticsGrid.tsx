import React from "react";
import StatCard from "./StatCard";
import { CheckCircle2, BookOpen, BookmarkPlus, XCircle } from "lucide-react";
import { useFilterStore } from "../../stores";

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
  { key: "read", label: "Przeczytane", statusVal: "Przeczytana", color: "#059669", bg: "bg-emerald-50" },
  { key: "inProgress", label: "W trakcie", statusVal: "W trakcie", color: "#d97706", bg: "bg-amber-50" },
  { key: "wantToRead", label: "Chcę przeczytać", statusVal: "Chcę przeczytać", color: "#2563eb", bg: "bg-blue-50" },
  { key: "dropped", label: "Porzucone", statusVal: "Porzucona", color: "#e11d48", bg: "bg-rose-50" },
] as const;

export const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  booksStats,
  additionalStats,
}) => {
  const setFilter = useFilterStore((state) => state.setFilter);
  const toggleTab = useFilterStore((state) => state.toggleTab);

  const total = Math.max(booksStats.total, 1);
  const segments = STATUS_SEGMENTS.map((segment) => ({
    ...segment,
    value: booksStats[segment.key],
    pct: (booksStats[segment.key] / total) * 100,
  }));

  const handleStatusFilter = (statusValue: string) => {
    setFilter("status", statusValue);
    toggleTab("filters");
  };

  return (
    <div className="space-y-3.5">
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-slate-50 shadow-2xs">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
              {booksStats.total}
            </span>
            <span className="text-xs text-slate-600 font-bold">
              {booksStats.total === 1 ? "pozycja w kolekcji" : "pozycji w kolekcji"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-extrabold">{additionalStats.completionRate}% ukończonych</span>
          </div>
        </div>

        {/* Multi-segment Progress bar */}
        <div className="flex h-3 rounded-full overflow-hidden bg-slate-200/80 mb-3.5 shadow-inner p-0.5">
          {booksStats.total === 0 ? (
            <div className="w-full bg-slate-200 rounded-full" />
          ) : (
            segments.map(
              (segment) =>
                segment.value > 0 && (
                  <div
                    key={segment.key}
                    title={`${segment.label}: ${segment.value} (${Math.round(segment.pct)}%)`}
                    style={{
                      width: `${segment.pct}%`,
                      backgroundColor: segment.color,
                      minWidth: segment.value > 0 ? 8 : 0,
                    }}
                    className="h-full rounded-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                  />
                )
            )
          )}
        </div>

        {/* Status Legend Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {segments.map((segment) => (
            <div
              key={segment.key}
              onClick={() => handleStatusFilter(segment.statusVal)}
              className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer group"
              title={`Filtruj po: ${segment.label}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: segment.color }}
              />
              <div className="min-w-0 flex-1 flex justify-between items-baseline gap-1">
                <span className="text-[11px] font-semibold text-slate-600 group-hover:text-indigo-600 truncate transition-colors">
                  {segment.label}
                </span>
                <span className="text-xs font-black text-slate-900">
                  {segment.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Przeczytane"
          value={booksStats.read}
          percentage={(booksStats.read / total) * 100}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent="#059669"
          progress={additionalStats.completionRate}
          onClick={() => handleStatusFilter("Przeczytana")}
          hint="Kliknij, aby przefiltrować"
        />
        <StatCard
          title="W trakcie"
          value={booksStats.inProgress}
          percentage={(booksStats.inProgress / total) * 100}
          icon={<BookOpen className="w-4 h-4" />}
          accent="#d97706"
          onClick={() => handleStatusFilter("W trakcie")}
          hint="Kliknij, aby przefiltrować"
        />
        <StatCard
          title="Chcę przeczytać"
          value={booksStats.wantToRead}
          percentage={(booksStats.wantToRead / total) * 100}
          icon={<BookmarkPlus className="w-4 h-4" />}
          accent="#2563eb"
          onClick={() => handleStatusFilter("Chcę przeczytać")}
          hint="Kliknij, aby przefiltrować"
        />
        <StatCard
          title="Porzucone"
          value={booksStats.dropped}
          percentage={(booksStats.dropped / total) * 100}
          icon={<XCircle className="w-4 h-4" />}
          accent="#e11d48"
          onClick={() => handleStatusFilter("Porzucona")}
          hint="Kliknij, aby przefiltrować"
        />
      </div>
    </div>
  );
};

export default StatisticsGrid;
