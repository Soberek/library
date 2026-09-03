import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface BookRatingInputProps {
  value: number; // 0 to 10
  onChange: (val: number) => void;
  id?: string;
  className?: string;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Nieporozumienie',
  2: 'Bardzo zła',
  3: 'Słaba',
  4: 'Ujdzie',
  5: 'Średnia',
  6: 'Niezła',
  7: 'Dobra',
  8: 'Bardzo dobra',
  9: 'Rewelacyjna',
  10: 'Arcydzieło! 🏆',
};

export const BookRatingInput: React.FC<BookRatingInputProps> = ({
  value = 0,
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const activeValue = hoverValue !== null ? hoverValue : value;

  const handleSelect = (score: number) => {
    // Clicking the already selected rating resets it to 0
    if (value === score) {
      onChange(0);
    } else {
      onChange(score);
    }
  };

  return (
    <div
      className={cn(
        "p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-amber-100/20 border border-amber-200/80 shadow-2xs space-y-2.5 select-none",
        className
      )}
    >
      {/* Header with Title and Dynamic Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800">Twoja ocena</span>
          <span className="text-[11px] text-slate-400 font-medium hidden xs:inline">(skala 1–10)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {activeValue > 0 ? (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-500 text-white shadow-2xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-white text-white" />
                {activeValue} / 10
              </span>
              <span className="text-xs font-bold text-amber-800 hidden sm:inline">
                {RATING_DESCRIPTIONS[activeValue]}
              </span>
              <button
                type="button"
                onClick={() => onChange(0)}
                title="Usuń ocenę"
                aria-label="Usuń ocenę"
                className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 text-slate-400 border border-slate-200/80 shadow-2xs">
              Brak oceny
            </span>
          )}
        </div>
      </div>

      {/* 10 Glowing Stars */}
      <div
        className="flex items-center justify-between pt-1"
        onMouseLeave={() => setHoverValue(null)}
      >
        {Array.from({ length: 10 }, (_, index) => {
          const starIndex = index + 1;
          const isFilled = activeValue >= starIndex;

          return (
            <button
              key={starIndex}
              type="button"
              onClick={() => handleSelect(starIndex)}
              onMouseEnter={() => setHoverValue(starIndex)}
              aria-label={`${starIndex} gwiazdek`}
              title={`${starIndex}/10: ${RATING_DESCRIPTIONS[starIndex]}`}
              className="p-1 transition-transform cursor-pointer hover:scale-125 active:scale-95 focus:outline-none"
            >
              <Star
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-150",
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_3px_rgba(251,191,36,0.6)]"
                    : "fill-white/80 text-slate-300 hover:text-amber-300"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Numbered Pill Quick Selector (1 - 10) */}
      <div
        className="grid grid-cols-10 gap-1 pt-1"
        onMouseLeave={() => setHoverValue(null)}
      >
        {Array.from({ length: 10 }, (_, index) => {
          const score = index + 1;
          const isSelected = value === score;
          const isHovered = hoverValue === score;
          const isBelow = activeValue >= score;

          return (
            <button
              key={score}
              type="button"
              onClick={() => handleSelect(score)}
              onMouseEnter={() => setHoverValue(score)}
              title={`${score}/10: ${RATING_DESCRIPTIONS[score]}`}
              className={cn(
                "py-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center border",
                isSelected
                  ? "bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/40"
                  : isHovered
                  ? "bg-amber-400 text-white border-amber-400 shadow-2xs"
                  : isBelow
                  ? "bg-amber-100/80 text-amber-900 border-amber-200"
                  : "bg-white/80 text-slate-500 border-slate-200/80 hover:bg-amber-50 hover:text-amber-800"
              )}
            >
              {score}
            </button>
          );
        })}
      </div>

      {/* Descriptive text row for mobile or preview */}
      {activeValue > 0 && (
        <div className="text-center sm:hidden pt-0.5">
          <span className="text-xs font-bold text-amber-800 animate-in fade-in duration-150">
            {activeValue}/10 · {RATING_DESCRIPTIONS[activeValue]}
          </span>
        </div>
      )}
    </div>
  );
};

export default BookRatingInput;
