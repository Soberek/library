import React from "react";
import { Star, Award } from "lucide-react";
import type { Book } from "../../types/Book";

interface RatingDistributionProps {
  books: Book[];
}

const RATING_TIERS = [
  { range: "9–10 ★", label: "Arcydzieła", min: 9, max: 10, color: "#10b981" },
  { range: "7–8.5 ★", label: "Bardzo dobre", min: 7, max: 8.9, color: "#6366f1" },
  { range: "5–6.5 ★", label: "Średnie", min: 5, max: 6.9, color: "#f59e0b" },
  { range: "1–4.5 ★", label: "Poniżej oczekiwań", min: 0.1, max: 4.9, color: "#ef4444" },
];

export const RatingDistribution: React.FC<RatingDistributionProps> = ({ books }) => {
  if (!books || books.length === 0) return null;

  const ratedBooks = books.filter((b) => Number(b.rating) > 0);
  const totalRated = ratedBooks.length;

  const tierCounts = RATING_TIERS.map((tier) => {
    const count = ratedBooks.filter(
      (b) => Number(b.rating) >= tier.min && Number(b.rating) <= tier.max
    ).length;
    const percentage = totalRated > 0 ? Math.round((count / totalRated) * 100) : 0;
    return {
      ...tier,
      count,
      percentage,
    };
  });

  const avgRating =
    totalRated > 0
      ? (
          ratedBooks.reduce((sum, b) => sum + (Number(b.rating) || 0), 0) /
          totalRated
        ).toFixed(1)
      : "0.0";

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Rozkład wystawionych ocen
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Jak oceniasz przeczytane pozycje
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{avgRating} / 10</span>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        {tierCounts.map((tier) => (
          <div key={tier.range} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="font-bold text-slate-800">{tier.range}</span>
                <span className="text-slate-400 font-medium">({tier.label})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">{tier.count} poz.</span>
                <span className="font-extrabold text-slate-900">{tier.percentage}%</span>
              </div>
            </div>

            {/* Bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${tier.percentage}%`,
                  backgroundColor: tier.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Oceniono: <strong>{totalRated}</strong> z {books.length} książek</span>
        <span>Bez oceny: <strong>{books.length - totalRated}</strong></span>
      </div>
    </div>
  );
};

export default RatingDistribution;
