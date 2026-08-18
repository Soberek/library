import React, { useEffect, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { MovieFilters, MovieGenre, TmdbEntityRef, WatchProvider } from '../../types/Movie';
import {
  MOVIE_SORT_OPTIONS,
  ORIGIN_COUNTRIES,
  ORIGINAL_LANGUAGES,
  RUNTIME_PRESETS,
  WATCH_REGIONS,
} from '../../constants/movieFilters';
import {
  fetchWatchProviders,
  searchCompanies,
  searchPeople,
} from '../../services/tmdbService';
import { useDebounce } from '../../hooks/useDebounce';
import { Slider } from '../ui/slider';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

interface MagdaAdvancedFiltersProps {
  filters: MovieFilters;
  genres: MovieGenre[];
  disabled?: boolean;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<MovieFilters>) => void;
  activeCount: number;
}

export const MagdaAdvancedFilters: React.FC<MagdaAdvancedFiltersProps> = ({
  filters,
  genres,
  disabled = false,
  open,
  onToggle,
  onChange,
  activeCount,
}) => {
  const [castQuery, setCastQuery] = useState(filters.castName ?? '');
  const [crewQuery, setCrewQuery] = useState(filters.crewName ?? '');
  const [companyQuery, setCompanyQuery] = useState(filters.companyName ?? '');
  const [castOptions, setCastOptions] = useState<TmdbEntityRef[]>([]);
  const [crewOptions, setCrewOptions] = useState<TmdbEntityRef[]>([]);
  const [companyOptions, setCompanyOptions] = useState<TmdbEntityRef[]>([]);
  const [providers, setProviders] = useState<WatchProvider[]>([]);

  const debouncedCast = useDebounce(castQuery, 350);
  const debouncedCrew = useDebounce(crewQuery, 350);
  const debouncedCompany = useDebounce(companyQuery, 350);

  useEffect(() => {
    if (!open || disabled) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchWatchProviders(filters.watchRegion);
        if (!cancelled) setProviders(list);
      } catch {
        if (!cancelled) setProviders([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, disabled, filters.watchRegion]);

  useEffect(() => {
    if (!open || disabled || debouncedCast.trim().length < 2) {
      setCastOptions([]);
      return;
    }
    let cancelled = false;
    searchPeople(debouncedCast)
      .then((res) => {
        if (!cancelled) setCastOptions(res);
      })
      .catch(() => {
        if (!cancelled) setCastOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedCast, open, disabled]);

  useEffect(() => {
    if (!open || disabled || debouncedCrew.trim().length < 2) {
      setCrewOptions([]);
      return;
    }
    let cancelled = false;
    searchPeople(debouncedCrew)
      .then((res) => {
        if (!cancelled) setCrewOptions(res);
      })
      .catch(() => {
        if (!cancelled) setCrewOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedCrew, open, disabled]);

  useEffect(() => {
    if (!open || disabled || debouncedCompany.trim().length < 2) {
      setCompanyOptions([]);
      return;
    }
    let cancelled = false;
    searchCompanies(debouncedCompany)
      .then((res) => {
        if (!cancelled) setCompanyOptions(res);
      })
      .catch(() => {
        if (!cancelled) setCompanyOptions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedCompany, open, disabled]);

  const runtimePresetIndex = RUNTIME_PRESETS.findIndex(
    (p) => p.min === filters.runtimeMin && p.max === filters.runtimeMax,
  );

  return (
    <div className="w-full">
      <button
        type="button"
        className={cn(
          "flex items-center justify-between w-full p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
          open
            ? "border-amber-300 bg-amber-50 text-amber-900"
            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
        )}
        onClick={onToggle}
        disabled={disabled}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <span>Zaawansowane filtry filmów</span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200 text-slate-500",
            open && "rotate-180 text-amber-700"
          )}
        />
      </button>

      {open && (
        <div className="mt-3 p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-4 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {/* Sort */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sortowanie</label>
              <Select
                value={filters.sortBy}
                disabled={disabled}
                onChange={(e) =>
                  onChange({ sortBy: e.target.value as MovieFilters['sortBy'] })
                }
              >
                {MOVIE_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Max rating */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Maks. ocena</span>
                <span className="text-amber-700 font-bold">
                  {filters.maxRating === null ? 'brak limitu' : filters.maxRating.toFixed(1)}
                </span>
              </div>
              <Slider
                value={filters.maxRating ?? 10}
                min={1}
                max={10}
                step={0.5}
                disabled={disabled}
                onChange={(val) => {
                  const next = Array.isArray(val) ? val[0] : val;
                  onChange({ maxRating: next >= 10 ? null : next });
                }}
              />
            </div>

            {/* Original Language */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Język oryginału</label>
              <Select
                value={filters.originalLanguage ?? ''}
                disabled={disabled}
                onChange={(e) =>
                  onChange({
                    originalLanguage: e.target.value === '' ? null : String(e.target.value),
                  })
                }
              >
                <option value="">Dowolny</option>
                {ORIGINAL_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Origin Country */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kraj produkcji</label>
              <Select
                value={filters.originCountry ?? ''}
                disabled={disabled}
                onChange={(e) =>
                  onChange({
                    originCountry: e.target.value === '' ? null : String(e.target.value),
                  })
                }
              >
                <option value="">Dowolny</option>
                {ORIGIN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Exclude Genre */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Wyklucz gatunek</label>
              <Select
                value={filters.excludeGenreId ?? ''}
                disabled={disabled}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    excludeGenreId: val === '' ? null : Number(val),
                  });
                }}
              >
                <option value="">Bez wykluczeń</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Watch region */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Region streamingu</label>
              <Select
                value={filters.watchRegion}
                disabled={disabled}
                onChange={(e) =>
                  onChange({
                    watchRegion: String(e.target.value),
                    watchProviderId: null,
                  })
                }
              >
                {WATCH_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* VOD Provider */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Platforma VOD</label>
              <Select
                value={filters.watchProviderId ?? ''}
                disabled={disabled}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    watchProviderId: val === '' ? null : Number(val),
                  });
                }}
              >
                <option value="">Dowolna</option>
                {providers.map((p) => (
                  <option key={p.provider_id} value={p.provider_id}>
                    {p.provider_name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Cast actor */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Aktor / aktorka</label>
              <div className="relative">
                <Input
                  placeholder="Wpisz nazwisko aktora (min. 2 znaki)..."
                  value={castQuery}
                  disabled={disabled}
                  onChange={(e) => {
                    setCastQuery(e.target.value);
                    if (!e.target.value) {
                      onChange({ castId: null, castName: null });
                    }
                  }}
                />
                {castOptions.length > 0 && (
                  <div className="absolute z-20 top-full mt-1 w-full max-h-36 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    {castOptions.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          onChange({ castId: person.id, castName: person.name });
                          setCastQuery(person.name);
                          setCastOptions([]);
                        }}
                        className="w-full text-left p-2 rounded-lg text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors"
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Runtime Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Czas trwania
            </label>
            <div className="flex flex-wrap gap-1.5">
              {RUNTIME_PRESETS.map((preset, index) => (
                <button
                  key={preset.label}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onChange({ runtimeMin: preset.min, runtimeMax: preset.max })
                  }
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer",
                    runtimePresetIndex === index
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset advanced button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={disabled || activeCount === 0}
              onClick={() => {
                onChange({
                  maxRating: null,
                  runtimeMin: null,
                  runtimeMax: null,
                  originalLanguage: null,
                  originCountry: null,
                  excludeGenreId: null,
                  sortBy: 'popularity.desc',
                  castId: null,
                  castName: null,
                  crewId: null,
                  crewName: null,
                  companyId: null,
                  companyName: null,
                  watchProviderId: null,
                  certification: null,
                });
                setCastQuery('');
                setCrewQuery('');
                setCompanyQuery('');
              }}
              className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors disabled:opacity-40 cursor-pointer"
            >
              Wyczyść zaawansowane filtry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagdaAdvancedFilters;
