import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BookLotteryFilters } from '../../types/LotteryBook';
import {
  BOOK_EDITION_OPTIONS,
  BOOK_LOTTERY_LANGUAGES,
  BOOK_LOTTERY_SUBJECTS,
  BOOK_PAGES_OPTIONS,
  BOOK_POPULARITY_OPTIONS,
  BOOK_RATING_COUNT_OPTIONS,
} from '../../services/openLibraryService';
import { Slider } from '../ui/slider';
import { Select } from '../ui/select';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1899 }, (_, i) => CURRENT_YEAR - i);

interface BookFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BookLotteryFilters;
  onChange: (patch: Partial<BookLotteryFilters>) => void;
  onReset: () => void;
  poolSize: number | null;
  poolLoading: boolean;
  disabled?: boolean;
}

export const BookFilterDrawer: React.FC<BookFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  poolSize,
  poolLoading,
  disabled = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet / Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col z-10"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            {/* Drag Handle (Mobile) */}
            <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                    Filtry katalogu
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Precyzyjnie dostosuj parametry losowania
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={onReset}
                  leftIcon={<RotateCcw className="w-3 h-3" />}
                  className="text-xs font-semibold text-slate-500 hover:text-emerald-700"
                  title="Przywróć domyślne filtry"
                >
                  <span className="hidden xs:inline">Domyślne</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  rounded="full"
                  onClick={onClose}
                  aria-label="Zamknij"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1">
              {/* Gatunek & Język */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="book-field">
                  <span className="book-field-label text-xs font-bold text-slate-700">
                    Gatunek literacki
                  </span>
                  <Select
                    value={filters.subject}
                    disabled={disabled}
                    onChange={(e) => onChange({ subject: String(e.target.value) })}
                  >
                    {BOOK_LOTTERY_SUBJECTS.map((s) => (
                      <option key={s.value || 'all'} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </label>

                <label className="book-field">
                  <span className="book-field-label text-xs font-bold text-slate-700">
                    Język wydania
                  </span>
                  <Select
                    value={filters.language}
                    disabled={disabled}
                    onChange={(e) => onChange({ language: String(e.target.value) })}
                  >
                    {BOOK_LOTTERY_LANGUAGES.map((lang) => (
                      <option key={lang.code || 'any'} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>

              {/* Minimalna ocena */}
              <div className="book-field p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-700">Minimalna ocena</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                    {filters.minRating <= 0 ? 'dowolna' : `${filters.minRating.toFixed(1)}+ ⭐`}
                  </span>
                </div>
                <Slider
                  value={filters.minRating}
                  min={0}
                  max={5}
                  step={0.5}
                  disabled={disabled}
                  onChange={(val) =>
                    onChange({
                      minRating: Array.isArray(val) ? val[0] : val,
                    })
                  }
                />
              </div>

              {/* Popularność */}
              <div className="book-field">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Popularność w Open Library
                </span>
                <div className="grid grid-cols-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  {BOOK_POPULARITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => onChange({ minPopularity: opt.value })}
                      className={`py-2 text-xs font-bold transition-colors cursor-pointer text-center border-r border-slate-200 last:border-r-0 ${
                        filters.minPopularity === opt.value
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tylko z okładką */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                <div>
                  <div className="text-xs font-bold text-slate-800">Tylko z okładką</div>
                  <div className="text-[11px] text-slate-500">
                    Odrzuca pozycje bez grafiki w Open Library
                  </div>
                </div>
                <Switch
                  checked={filters.requireCover}
                  disabled={disabled}
                  onChange={(checked) => onChange({ requireCover: checked })}
                />
              </div>

              {/* Zaawansowane sekcje */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Dodatkowe kryteria
                </div>

                {/* Lata pierwszego wydania */}
                <div className="book-field">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Lata pierwszego wydania
                  </span>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Select
                      value={filters.yearFrom ?? ''}
                      disabled={disabled}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange({ yearFrom: val === '' ? null : Number(val) });
                      }}
                    >
                      <option value="">Od zawsze</option>
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                    <Select
                      value={filters.yearTo ?? ''}
                      disabled={disabled}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange({ yearTo: val === '' ? null : Number(val) });
                      }}
                    >
                      <option value="">Do dziś</option>
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Minimalna liczba stron */}
                <div className="book-field">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Minimalna liczba stron
                  </span>
                  <div className="grid grid-cols-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    {BOOK_PAGES_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange({ minPages: opt.value })}
                        className={`py-2 text-xs font-bold transition-colors cursor-pointer text-center border-r border-slate-200 last:border-r-0 ${
                          filters.minPages === opt.value
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min. wydań */}
                <div className="book-field">
                  <span className="text-xs font-bold text-slate-700 block mb-1">
                    Liczba wydań (znane tytuły)
                  </span>
                  <div className="grid grid-cols-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    {BOOK_EDITION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange({ minEditions: opt.value })}
                        className={`py-2 text-xs font-bold transition-colors cursor-pointer text-center border-r border-slate-200 last:border-r-0 ${
                          filters.minEditions === opt.value
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Apply Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/90 flex items-center gap-3">
              <Button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  {poolLoading ? 'Liczenie puli…' : `Zastosuj (~${(poolSize ?? 0).toLocaleString('pl-PL')} w puli)`}
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookFilterDrawer;
