import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Shuffle,
  Heart,
  Search,
  Sparkles,
  LayoutGrid,
  Loader2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  pickRandomPosition,
  SEXUAL_POSITIONS,
  shufflePositions,
  type SexualPosition,
  type PositionDifficulty,
} from '../constants/sexualPositions';
import PozycjeDrawAnimation from '../components/pozycje/PozycjeDrawAnimation';
import { Modal, Button } from '../components/ui';
import { toast } from '../stores';
import { cn } from '../lib/utils';
import './PozycjeSeksualne.css';

const RECENT_LIMIT = 8;

const DIFFICULTY_LABEL: Record<SexualPosition['difficulty'], string> = {
  łatwa: 'Łatwa',
  średnia: 'Średnia',
  zaawansowana: 'Zaawansowana',
};

const FAVORITES_STORAGE_KEY = 'pozycje_favorites';

export const PozycjeSeksualne: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'draw' | 'catalog'>('draw');
  const [result, setResult] = useState<SexualPosition | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [reel, setReel] = useState<SexualPosition[]>([]);
  const [spinWinner, setSpinWinner] = useState<SexualPosition | null>(null);

  // Catalog state
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | PositionDifficulty | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedPosition, setSelectedPosition] = useState<SexualPosition | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Pozycje dla par · MyLibrary';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
        if (isFav) {
          toast.info("Usunięto pozycję z ulubionych.");
        } else {
          toast.success("Dodano pozycję do ulubionych!");
        }
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  }, []);

  const handleDraw = useCallback(() => {
    setDrawing(true);
    setResult(null);
    setReel([]);
    setSpinWinner(null);

    const exclude = new Set(recentIds);
    const picked = pickRandomPosition(exclude);
    const pool = shufflePositions(picked.id).slice(0, 12);
    const reelPool = pool.length > 0 ? pool : SEXUAL_POSITIONS.filter((p) => p.id !== picked.id);

    setReel(reelPool.length > 0 ? reelPool : [picked]);
    setSpinWinner(picked);
    setRecentIds((prev) => [picked.id, ...prev.filter((id) => id !== picked.id)].slice(0, RECENT_LIMIT));
  }, [recentIds]);

  const handleSpinComplete = useCallback(() => {
    if (!spinWinner) return;
    setResult(spinWinner);
    setDrawing(false);
    setSpinWinner(null);
    setReel([]);
  }, [spinWinner]);

  const filteredPositions = useMemo(() => {
    return SEXUAL_POSITIONS.filter((position) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (difficultyFilter === 'favorites') {
        return favorites.includes(position.id);
      }
      if (difficultyFilter !== 'all') {
        return position.difficulty === difficultyFilter;
      }
      return true;
    });
  }, [searchQuery, difficultyFilter, favorites]);

  return (
    <main className="pozycje-page">
      <div className="pozycje-glow pozycje-glow--left" aria-hidden />
      <div className="pozycje-glow pozycje-glow--right" aria-hidden />

      <div className="pozycje-inner" style={{ maxWidth: activeTab === 'catalog' ? 1100 : 720 }}>
        <motion.header
          className="pozycje-hero"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="pozycje-kicker">tylko dla Was</p>
          <h1 className="pozycje-brand">
            <span className="pozycje-brand-line pozycje-brand-line--name">POZYCJE</span>
            <span className="pozycje-brand-line pozycje-brand-line--verb">LOSUJĄ</span>
          </h1>
          <p className="pozycje-tagline">Jedno kliknięcie — jedna pozycja. Resztę zostawcie sobie.</p>

          <div className="flex justify-center mt-4">
            <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={cn(
                  "flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                  activeTab === 'draw'
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Losowanie</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={cn(
                  "flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                  activeTab === 'catalog'
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Katalog ({SEXUAL_POSITIONS.length})</span>
              </button>
            </div>
          </div>
        </motion.header>

        {activeTab === 'draw' ? (
          <>
            <motion.section
              className="pozycje-controls"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                className="pozycje-draw-btn w-full h-12 text-sm font-bold gap-2"
                disabled={drawing}
                onClick={handleDraw}
              >
                {drawing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shuffle className="w-5 h-5" />
                )}
                <span>{drawing ? 'Losuję…' : result ? 'Losuj ponownie' : 'Losuj pozycję'}</span>
              </Button>
            </motion.section>

            <div className="pozycje-result-slot">
              <AnimatePresence mode="wait">
                {!result && !drawing && (
                  <motion.div
                    key="empty"
                    className="pozycje-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Heart className="w-10 h-10 text-rose-300 mb-2" />
                    <p className="pozycje-empty-text text-sm text-center">
                      Tu pojawi się wylosowana pozycja.
                    </p>
                  </motion.div>
                )}

                {drawing && spinWinner && (
                  <PozycjeDrawAnimation
                    key={`spin-${spinWinner.id}`}
                    reel={reel}
                    winner={spinWinner}
                    onComplete={handleSpinComplete}
                  />
                )}

                {result && !drawing && (
                  <motion.article
                    key={result.id}
                    className="pozycje-card"
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="pozycje-card-kicker">Wylosowano</p>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(result.id)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Heart className={cn("w-5 h-5", favorites.includes(result.id) && "fill-rose-500 text-rose-500")} />
                      </button>
                    </div>

                    <h2 className="pozycje-card-title">
                      {result.name}
                    </h2>
                    <div className="pozycje-card-diagram">
                      <img
                        className="pozycje-card-image"
                        src={result.image}
                        alt={`Ilustracja: ${result.name}`}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="flex justify-center my-3">
                      <span
                        className={`pozycje-chip pozycje-chip--${result.difficulty === 'łatwa' ? 'easy' : result.difficulty === 'średnia' ? 'mid' : 'hard'}`}
                      >
                        {DIFFICULTY_LABEL[result.difficulty]}
                      </span>
                    </div>
                    <p className="pozycje-card-desc">{result.description}</p>
                  </motion.article>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="mt-2 space-y-4">
            {/* Catalog controls */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="relative w-full md:w-80">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Szukaj pozycji..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setDifficultyFilter('all')}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                    difficultyFilter === 'all'
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Wszystkie ({SEXUAL_POSITIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter('łatwa')}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                    difficultyFilter === 'łatwa'
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Łatwa
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter('średnia')}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                    difficultyFilter === 'średnia'
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Średnia
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter('zaawansowana')}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                    difficultyFilter === 'zaawansowana'
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  Zaawansowana
                </button>
                <button
                  type="button"
                  onClick={() => setDifficultyFilter('favorites')}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                    difficultyFilter === 'favorites'
                      ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Heart className={cn("w-3 h-3", difficultyFilter === 'favorites' ? "fill-white text-white" : "fill-rose-500 text-rose-500")} />
                  <span>Polubione ({favorites.length})</span>
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredPositions.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
                <Heart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">Brak pozycji spełniających wybrane kryteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPositions.map((pos) => {
                  const isFav = favorites.includes(pos.id);
                  return (
                    <div
                      key={pos.id}
                      onClick={() => setSelectedPosition(pos)}
                      className={cn(
                        "cursor-pointer p-3.5 rounded-2xl bg-white border transition-all flex flex-col hover:-translate-y-1 hover:shadow-lg shadow-xs",
                        isFav
                          ? "border-rose-300 ring-2 ring-rose-200/50"
                          : "border-slate-200 hover:border-rose-200"
                      )}
                    >
                      <div className="relative mb-2.5">
                        <img
                          src={pos.image}
                          alt={pos.name}
                          loading="lazy"
                          className="w-full h-44 object-contain rounded-xl bg-slate-50 border border-slate-100 p-2"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pos.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-200 shadow-sm transition-colors cursor-pointer"
                        >
                          <Heart className={cn("w-4 h-4", isFav && "fill-rose-500 text-rose-500")} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {pos.name}
                        </h3>
                        <span
                          className={`pozycje-chip pozycje-chip--${pos.difficulty === 'łatwa' ? 'easy' : pos.difficulty === 'średnia' ? 'mid' : 'hard'}`}
                          style={{ height: 20, fontSize: '0.65rem' }}
                        >
                          {DIFFICULTY_LABEL[pos.difficulty]}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-auto">
                        {pos.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Position Preview Modal */}
      <Modal
        isOpen={Boolean(selectedPosition)}
        onClose={() => setSelectedPosition(null)}
        title={selectedPosition?.name || ''}
        maxWidth="md"
      >
        {selectedPosition && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <span
                className={`pozycje-chip pozycje-chip--${selectedPosition.difficulty === 'łatwa' ? 'easy' : selectedPosition.difficulty === 'średnia' ? 'mid' : 'hard'}`}
              >
                {DIFFICULTY_LABEL[selectedPosition.difficulty]}
              </span>
            </div>

            <img
              src={selectedPosition.image}
              alt={selectedPosition.name}
              className="max-h-64 mx-auto rounded-xl bg-slate-50 border border-slate-100 p-3 shadow-xs object-contain"
            />

            <p className="text-sm text-slate-700 leading-relaxed">
              {selectedPosition.description}
            </p>

            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => toggleFavorite(selectedPosition.id)}
              >
                <Heart className={cn("w-4 h-4", favorites.includes(selectedPosition.id) && "fill-rose-500 text-rose-500")} />
                <span>
                  {favorites.includes(selectedPosition.id) ? 'Usuń z polubionych' : 'Dodaj do polubionych'}
                </span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default PozycjeSeksualne;
