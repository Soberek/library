import React from "react";
import { Bookmark, Sparkles } from "lucide-react";
import { GENRES } from "../../constants/genres";
import type { Book } from "../../types/Book";
import { useFilterStore } from "../../stores";

interface GenreBreakdownProps {
  books: Book[];
}

const GENRE_COLORS = [
  "#4f46e5", // Indigo
  "#059669", // Emerald
  "#d97706", // Amber
  "#e11d48", // Rose
  "#0284c7", // Sky
  "#7c3aed", // Violet
  "#db2777", // Pink
  "#ca8a04", // Yellow
];

export const GenreBreakdown: React.FC<GenreBreakdownProps> = ({ books }) => {
  const setFilter = useFilterStore((state) => state.setFilter);
  const toggleTab = useFilterStore((state) => state.toggleTab);

  if (!books || books.length === 0) return null;

  // Group books by genre
  const genreCounts: Record<string, { total: number; read: number }> = {};

  books.forEach((book) => {
    const genre = book.genre || "Inne";
    if (!genreCounts[genre]) {
      genreCounts[genre] = { total: 0, read: 0 };
    }
    genreCounts[genre].total += 1;
    if (book.read === "Przeczytana") {
      genreCounts[genre].read += 1;
    }
  });

  const sortedGenres = Object.entries(genreCounts)
    .map(([genreKey, stats]) => {
      const label = GENRES[genreKey] || genreKey;
      const percentage = Math.round((stats.total / books.length) * 100);
      return {
        key: genreKey,
        label,
        ...stats,
        percentage,
      };
    })
    .sort((a, b) => b.total - a.total);

  const topGenres = sortedGenres.slice(0, 6);

  const handleGenreClick = (genreKey: string) => {
    setFilter("genre", genreKey);
    toggleTab("filters");
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Podział według gatunków
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Popularność kategorii w Twojej bibliotece
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {sortedGenres.length} {sortedGenres.length === 1 ? "gatunek" : "gatunków"}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {topGenres.map((item, index) => {
          const color = GENRE_COLORS[index % GENRE_COLORS.length];
          return (
            <div
              key={item.key}
              onClick={() => handleGenreClick(item.key)}
              className="group p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer"
              title={`Kliknij, aby przefiltrować po gatunku: ${item.label}`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-bold text-slate-800 group-hover:text-indigo-600 truncate transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400 font-medium">
                    {item.read}/{item.total} przeczytanych
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenreBreakdown;
