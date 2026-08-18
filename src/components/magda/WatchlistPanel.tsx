import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Film, Loader2 } from 'lucide-react';
import type { WatchlistMovie } from '../../types/WatchlistMovie';
import { posterUrl, releaseYear } from '../../services/tmdbService';
import { cn } from '../../lib/utils';

type WatchlistFilter = 'all' | 'todo' | 'watched';

interface WatchlistPanelProps {
  items: WatchlistMovie[];
  loading: boolean;
  onToggleWatched: (entryId: string, watched: boolean) => Promise<void>;
  onRemove: (entryId: string) => Promise<void>;
  busy?: boolean;
}

export const WatchlistPanel: React.FC<WatchlistPanelProps> = ({
  items,
  loading,
  onToggleWatched,
  onRemove,
  busy = false,
}) => {
  const [filter, setFilter] = useState<WatchlistFilter>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    if (filter === 'todo') return !item.watched;
    if (filter === 'watched') return item.watched;
    return true;
  });

  const todoCount = items.filter((i) => !i.watched).length;
  const watchedCount = items.filter((i) => i.watched).length;

  const handleToggle = async (item: WatchlistMovie) => {
    setPendingId(item.id);
    try {
      await onToggleWatched(item.id, !item.watched);
    } finally {
      setPendingId(null);
    }
  };

  const handleRemove = async (item: WatchlistMovie) => {
    setPendingId(item.id);
    try {
      await onRemove(item.id);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Watchlista filmowa
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {todoCount} do obejrzenia · {watchedCount} obejrzane
          </p>
        </div>

        {/* Tab pill filter */}
        <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer",
              filter === 'all'
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Wszystkie ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('todo')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer",
              filter === 'todo'
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Do obejrzenia ({todoCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('watched')}
            className={cn(
              "px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer",
              filter === 'watched'
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Obejrzane ({watchedCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
          <Film className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-500">
            {items.length === 0
              ? 'Dodaj wylosowany film do watchlisty.'
              : 'Brak filmów w tej zakładce.'}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const poster = posterUrl(item.posterPath, 'w342');
            const isBusy = busy || pendingId === item.id;

            return (
              <li
                key={item.id}
                className={cn(
                  "flex gap-3 p-3 rounded-xl border transition-all bg-white",
                  item.watched
                    ? "border-emerald-200/80 bg-emerald-50/20"
                    : "border-slate-200 hover:border-amber-300 shadow-xs"
                )}
              >
                <div className="relative w-16 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {poster ? (
                    <img src={poster} alt="" loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Film className="w-6 h-6" />
                    </div>
                  )}
                  {item.watched && (
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] font-bold text-center py-0.5">
                      Obejrzane
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 truncate" title={item.title}>
                      {item.title}
                    </h3>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {releaseYear(item.releaseDate)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        ★ {item.voteAverage.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleToggle(item)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer",
                        item.watched
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                      )}
                    >
                      {item.watched ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Circle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{item.watched ? 'Cofnij' : 'Obejrzane'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleRemove(item)}
                      aria-label={`Usuń ${item.title}`}
                      title="Usuń z listy"
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      {pendingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default WatchlistPanel;
