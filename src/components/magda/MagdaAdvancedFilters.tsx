import React, { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Chip,
  Collapse,
  FormControl,
  MenuItem,
  Select,
  Slider,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { MovieFilters, MovieGenre, TmdbEntityRef, WatchProvider } from '../../types/Movie';
import {
  CERTIFICATIONS,
  MOVIE_SORT_OPTIONS,
  ORIGIN_COUNTRIES,
  ORIGINAL_LANGUAGES,
  RUNTIME_PRESETS,
  WATCH_REGIONS,
} from '../../constants/movieFilters';
import {
  fetchWatchProviders,
  providerLogoUrl,
  searchCompanies,
  searchPeople,
} from '../../services/tmdbService';
import { useDebounce } from '../../hooks/useDebounce';

interface MagdaAdvancedFiltersProps {
  filters: MovieFilters;
  genres: MovieGenre[];
  disabled?: boolean;
  open: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<MovieFilters>) => void;
  activeCount: number;
}

const MagdaAdvancedFilters: React.FC<MagdaAdvancedFiltersProps> = ({
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
  const [loadingCast, setLoadingCast] = useState(false);
  const [loadingCrew, setLoadingCrew] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(false);

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
    setLoadingCast(true);
    searchPeople(debouncedCast)
      .then((res) => {
        if (!cancelled) setCastOptions(res);
      })
      .catch(() => {
        if (!cancelled) setCastOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCast(false);
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
    setLoadingCrew(true);
    searchPeople(debouncedCrew)
      .then((res) => {
        if (!cancelled) setCrewOptions(res);
      })
      .catch(() => {
        if (!cancelled) setCrewOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCrew(false);
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
    setLoadingCompany(true);
    searchCompanies(debouncedCompany)
      .then((res) => {
        if (!cancelled) setCompanyOptions(res);
      })
      .catch(() => {
        if (!cancelled) setCompanyOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingCompany(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedCompany, open, disabled]);

  const selectedCast = useMemo(
    () =>
      filters.castId
        ? { id: filters.castId, name: filters.castName ?? `#${filters.castId}` }
        : null,
    [filters.castId, filters.castName],
  );

  const selectedCrew = useMemo(
    () =>
      filters.crewId
        ? { id: filters.crewId, name: filters.crewName ?? `#${filters.crewId}` }
        : null,
    [filters.crewId, filters.crewName],
  );

  const selectedCompany = useMemo(
    () =>
      filters.companyId
        ? { id: filters.companyId, name: filters.companyName ?? `#${filters.companyId}` }
        : null,
    [filters.companyId, filters.companyName],
  );

  const runtimePresetIndex = RUNTIME_PRESETS.findIndex(
    (p) => p.min === filters.runtimeMin && p.max === filters.runtimeMax,
  );

  return (
    <div className="magda-advanced">
      <button
        type="button"
        className={`magda-advanced-toggle${open ? ' is-open' : ''}`}
        onClick={onToggle}
        disabled={disabled}
      >
        <span className="magda-advanced-toggle-label">
          Zaawansowane filtry
          {activeCount > 0 && (
            <Chip size="small" label={activeCount} className="magda-advanced-count" />
          )}
        </span>
        <ExpandMoreIcon className="magda-advanced-chevron" fontSize="small" />
      </button>

      <Collapse in={open} timeout={280} unmountOnExit>
        <div className="magda-advanced-body">
          <div className="magda-advanced-grid">
            <div className="magda-field">
              <span className="magda-field-label">Sortowanie</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  value={filters.sortBy}
                  onChange={(e) =>
                    onChange({ sortBy: e.target.value as MovieFilters['sortBy'] })
                  }
                >
                  {MOVIE_SORT_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="magda-field">
              <div className="magda-field-label-row">
                <span className="magda-field-label">Max ocena</span>
                <span className="magda-rating-pill magda-rating-pill--ghost">
                  {filters.maxRating === null ? 'brak' : `${filters.maxRating.toFixed(1)}`}
                </span>
              </div>
              <Slider
                value={filters.maxRating ?? 10}
                min={1}
                max={10}
                step={0.5}
                disabled={disabled}
                onChange={(_, value) => {
                  const next = Array.isArray(value) ? value[0] : value;
                  onChange({ maxRating: next >= 10 ? null : next });
                }}
                className="magda-rating-slider"
              />
              <button
                type="button"
                className="magda-clear-link"
                disabled={disabled || filters.maxRating === null}
                onClick={() => onChange({ maxRating: null })}
              >
                Wyczyść max ocenę
              </button>
            </div>

            <div className="magda-field magda-field--span2">
              <span className="magda-field-label">Czas trwania</span>
              <div className="magda-seg magda-seg--wrap" role="group" aria-label="Czas trwania">
                {RUNTIME_PRESETS.map((preset, index) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`magda-seg-btn${runtimePresetIndex === index ? ' is-active' : ''}`}
                    disabled={disabled}
                    onClick={() =>
                      onChange({ runtimeMin: preset.min, runtimeMax: preset.max })
                    }
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="magda-field">
              <span className="magda-field-label">Język oryginału</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  displayEmpty
                  value={filters.originalLanguage ?? ''}
                  onChange={(e) =>
                    onChange({
                      originalLanguage: e.target.value === '' ? null : String(e.target.value),
                    })
                  }
                >
                  <MenuItem value="">Dowolny</MenuItem>
                  {ORIGINAL_LANGUAGES.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <label className="magda-field">
              <span className="magda-field-label">Kraj produkcji</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  displayEmpty
                  value={filters.originCountry ?? ''}
                  onChange={(e) =>
                    onChange({
                      originCountry: e.target.value === '' ? null : String(e.target.value),
                    })
                  }
                >
                  <MenuItem value="">Dowolny</MenuItem>
                  {ORIGIN_COUNTRIES.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <label className="magda-field">
              <span className="magda-field-label">Wyklucz gatunek</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  displayEmpty
                  value={filters.excludeGenreId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange({
                      excludeGenreId: value === '' ? null : Number(value),
                    });
                  }}
                >
                  <MenuItem value="">Bez wykluczeń</MenuItem>
                  {genres.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <label className="magda-field">
              <span className="magda-field-label">Certyfikat (US)</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  displayEmpty
                  value={filters.certification ?? ''}
                  onChange={(e) =>
                    onChange({
                      certification: e.target.value === '' ? null : String(e.target.value),
                      certificationCountry: 'US',
                    })
                  }
                >
                  <MenuItem value="">Dowolny</MenuItem>
                  {CERTIFICATIONS.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <div className="magda-field magda-field--span2">
              <span className="magda-field-label">Aktor / aktorka</span>
              <Autocomplete
                size="small"
                disabled={disabled}
                options={castOptions}
                loading={loadingCast}
                value={selectedCast}
                inputValue={castQuery}
                onInputChange={(_, value) => setCastQuery(value)}
                onChange={(_, value) => {
                  onChange({
                    castId: value?.id ?? null,
                    castName: value?.name ?? null,
                  });
                  setCastQuery(value?.name ?? '');
                }}
                getOptionLabel={(opt) => opt.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Szukaj osoby (min. 2 znaki)"
                    className="magda-autocomplete-field"
                  />
                )}
              />
            </div>

            <div className="magda-field magda-field--span2">
              <span className="magda-field-label">Reżyser / ekipa</span>
              <Autocomplete
                size="small"
                disabled={disabled}
                options={crewOptions}
                loading={loadingCrew}
                value={selectedCrew}
                inputValue={crewQuery}
                onInputChange={(_, value) => setCrewQuery(value)}
                onChange={(_, value) => {
                  onChange({
                    crewId: value?.id ?? null,
                    crewName: value?.name ?? null,
                  });
                  setCrewQuery(value?.name ?? '');
                }}
                getOptionLabel={(opt) => opt.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Szukaj osoby (min. 2 znaki)"
                    className="magda-autocomplete-field"
                  />
                )}
              />
            </div>

            <div className="magda-field magda-field--span2">
              <span className="magda-field-label">Studio / wytwórnia</span>
              <Autocomplete
                size="small"
                disabled={disabled}
                options={companyOptions}
                loading={loadingCompany}
                value={selectedCompany}
                inputValue={companyQuery}
                onInputChange={(_, value) => setCompanyQuery(value)}
                onChange={(_, value) => {
                  onChange({
                    companyId: value?.id ?? null,
                    companyName: value?.name ?? null,
                  });
                  setCompanyQuery(value?.name ?? '');
                }}
                getOptionLabel={(opt) => opt.name}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="np. A24, Disney, Netflix…"
                    className="magda-autocomplete-field"
                  />
                )}
              />
            </div>

            <label className="magda-field">
              <span className="magda-field-label">Region streamingu</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  value={filters.watchRegion}
                  onChange={(e) =>
                    onChange({
                      watchRegion: String(e.target.value),
                      watchProviderId: null,
                    })
                  }
                >
                  {WATCH_REGIONS.map((r) => (
                    <MenuItem key={r.code} value={r.code}>
                      {r.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>

            <label className="magda-field">
              <span className="magda-field-label">Platforma VOD</span>
              <FormControl fullWidth size="small" disabled={disabled}>
                <Select
                  displayEmpty
                  value={filters.watchProviderId != null ? String(filters.watchProviderId) : ''}
                  onChange={(e) => {
                    const value = String(e.target.value);
                    onChange({
                      watchProviderId: value === '' ? null : Number(value),
                    });
                  }}
                  renderValue={(selected) => {
                    const value = String(selected ?? '');
                    if (!value) return 'Dowolna';
                    const provider = providers.find((p) => p.provider_id === Number(value));
                    return provider?.provider_name ?? 'Wybrana platforma';
                  }}
                >
                  <MenuItem value="">Dowolna</MenuItem>
                  {providers.map((p) => (
                    <MenuItem key={p.provider_id} value={String(p.provider_id)}>
                      <span className="magda-provider-option">
                        {providerLogoUrl(p.logo_path) && (
                          <img src={providerLogoUrl(p.logo_path)!} alt="" />
                        )}
                        {p.provider_name}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </label>
          </div>

          <button
            type="button"
            className="magda-clear-advanced"
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
          >
            Wyczyść zaawansowane
          </button>
        </div>
      </Collapse>
    </div>
  );
};

export default MagdaAdvancedFilters;
