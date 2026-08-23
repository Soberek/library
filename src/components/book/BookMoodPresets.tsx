import React from 'react';
import { Sparkles, X } from 'lucide-react';
import type { BookMoodPreset } from '../../types/LotteryBook';
import { BOOK_MOOD_PRESETS } from '../../services/openLibraryService';
import { cn } from '../../lib/utils';

interface BookMoodPresetsProps {
  activeMoodId: string | null;
  onSelectMood: (preset: BookMoodPreset) => void;
  onClearMood?: () => void;
  disabled?: boolean;
}

export const BookMoodPresets: React.FC<BookMoodPresetsProps> = ({
  activeMoodId,
  onSelectMood,
  onClearMood,
  disabled = false,
}) => {
  const activePreset = BOOK_MOOD_PRESETS.find((p) => p.id === activeMoodId);

  return (
    <div className="book-mood-section">
      <div className="book-mood-header flex items-center justify-between mb-2">
        <span className="book-mood-kicker flex items-center gap-1.5 text-xs font-bold text-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Szybki klimat czytelniczy</span>
        </span>
        {activeMoodId && onClearMood && (
          <button
            type="button"
            onClick={onClearMood}
            disabled={disabled}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Wyczyść klimat</span>
          </button>
        )}
      </div>

      <div className="book-mood-carousel" role="group" aria-label="Wybierz nastrój">
        {BOOK_MOOD_PRESETS.map((preset) => {
          const isSelected = activeMoodId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMood(preset)}
              className={cn(
                'book-mood-chip group select-none cursor-pointer',
                isSelected && 'is-selected',
              )}
            >
              <span className="book-mood-icon text-lg shrink-0 transition-transform group-hover:scale-110">
                {preset.icon}
              </span>
              <div className="book-mood-text text-left min-w-0">
                <div className="book-mood-label font-bold text-xs leading-tight line-clamp-1">
                  {preset.label}
                </div>
                <div className="book-mood-tagline text-[10px] text-slate-500 line-clamp-1">
                  {preset.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {activePreset && (
        <div className="book-mood-active-banner mt-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2 text-left">
          <span className="text-base shrink-0">{activePreset.icon}</span>
          <p className="text-xs text-amber-900 leading-snug font-medium">
            <strong className="font-bold text-amber-950 font-serif mr-1">
              {activePreset.label}:
            </strong>
            {activePreset.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookMoodPresets;
