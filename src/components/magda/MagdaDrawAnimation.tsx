import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import LocalMoviesOutlinedIcon from '@mui/icons-material/LocalMoviesOutlined';
import type { Movie } from '../../types/Movie';
import { posterUrl } from '../../services/tmdbService';

const FRAME_W = 156;
const FRAME_GAP = 16;
const FRAME_STRIDE = FRAME_W + FRAME_GAP;
const PREVIEW_COUNT = 5;
/** Całość spina ≈ 2 s */
const SLIDE_MS = 140;
const HOLD_MS = 200;

const PHRASES = [
  'Taśma leci…',
  'Magda kręci bębnem…',
  'Jeszcze chwila…',
  'Stop!',
];

interface MagdaDrawAnimationProps {
  reelMovies: Movie[];
  winner: Movie;
  onComplete: () => void;
}

function buildStrip(pool: Movie[], winner: Movie): Movie[] {
  const others = pool.filter((m) => m.id !== winner.id && m.poster_path);
  const picks: Movie[] = [];

  for (const movie of others) {
    if (picks.length >= PREVIEW_COUNT) break;
    picks.push(movie);
  }

  let i = 0;
  while (picks.length < Math.min(PREVIEW_COUNT, Math.max(others.length, 1)) && others.length > 0) {
    picks.push(others[i % others.length]);
    i += 1;
    if (i > PREVIEW_COUNT * 2) break;
  }

  if (picks.length === 0) {
    picks.push(winner);
  }

  return [...picks, winner];
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function delay(ms: number, signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(() => resolve(), ms);
    const poll = window.setInterval(() => {
      if (signal.cancelled) {
        window.clearTimeout(id);
        window.clearInterval(poll);
        resolve();
      }
    }, 40);

    window.setTimeout(() => window.clearInterval(poll), ms + 50);
  });
}

function animateTranslateX(
  el: HTMLElement,
  from: number,
  to: number,
  durationMs: number,
  signal: { cancelled: boolean },
): Promise<void> {
  return new Promise((resolve) => {
    if (durationMs <= 0 || from === to) {
      el.style.transform = `translate3d(${to}px, 0, 0)`;
      resolve();
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      if (signal.cancelled) {
        resolve();
        return;
      }
      const t = Math.min(1, (now - start) / durationMs);
      const x = from + (to - from) * easeInOutCubic(t);
      el.style.transform = `translate3d(${x}px, 0, 0)`;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    raf = requestAnimationFrame(tick);
    // store raf on element for cleanup via signal — cancelled stops next frame
    void raf;
  });
}

const MagdaDrawAnimation: React.FC<MagdaDrawAnimationProps> = ({
  reelMovies,
  winner,
  onComplete,
}) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [landed, setLanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const strip = useMemo(() => buildStrip(reelMovies, winner), [reelMovies, winner]);
  const winnerIndex = strip.length - 1;

  useEffect(() => {
    const stage = stageRef.current;
    const stripEl = stripRef.current;
    if (!stage || !stripEl) return;

    const signal = { cancelled: false };
    const centerOffset = Math.max(0, (stage.clientWidth - FRAME_W) / 2);

    const xForIndex = (index: number) => -(index * FRAME_STRIDE) + centerOffset;

    stripEl.style.transform = `translate3d(${xForIndex(0)}px, 0, 0)`;
    setActiveIndex(0);

    (async () => {
      let currentX = xForIndex(0);

      for (let i = 1; i <= winnerIndex; i++) {
        if (signal.cancelled) return;

        // Chwila na obejrzenie bieżącego plakatu
        await delay(HOLD_MS, signal);
        if (signal.cancelled) return;

        const nextX = xForIndex(i);
        await animateTranslateX(stripEl, currentX, nextX, SLIDE_MS, signal);
        if (signal.cancelled) return;

        currentX = nextX;
        setActiveIndex(i);
      }

      // Domknięcie na zwycięzcy
      await delay(HOLD_MS, signal);
      if (signal.cancelled || completedRef.current) return;

      completedRef.current = true;
      setLanded(true);
      window.setTimeout(() => onCompleteRef.current(), 280);
    })();

    return () => {
      signal.cancelled = true;
    };
  }, [winnerIndex, strip.length]);

  useEffect(() => {
    if (landed) {
      setPhraseIndex(PHRASES.length - 1);
      return;
    }
    const id = window.setInterval(() => {
      setPhraseIndex((prev) => Math.min(prev + 1, PHRASES.length - 2));
    }, 600);
    return () => window.clearInterval(id);
  }, [landed]);

  return (
    <div className="magda-drawing" role="status" aria-live="polite">
      <div className="magda-slot-machine" ref={stageRef}>
        <div className="magda-slot-topbar">
          <span>MAGDA</span>
          <span className="magda-slot-lights" aria-hidden>
            {Array.from({ length: 7 }).map((_, i) => (
              <i key={i} className={landed ? 'is-win' : undefined} />
            ))}
          </span>
          <span>LOSUJE</span>
        </div>

        <div className={`magda-slot-viewport${landed ? ' is-landed' : ''}`}>
          <div className="magda-slot-vignette" />
          <div className="magda-slot-pointer magda-slot-pointer--left" />
          <div className="magda-slot-pointer magda-slot-pointer--right" />

          <div className="magda-film-track">
            <div className="magda-film-edge magda-film-edge--top" aria-hidden>
              {Array.from({ length: 48 }).map((_, i) => (
                <span key={`t-${i}`} />
              ))}
            </div>

            <div className="magda-film-strip" ref={stripRef}>
              {strip.map((movie, index) => {
                const src = posterUrl(movie.poster_path, 'w342');
                const isWinnerFrame = landed && index === winnerIndex;
                const isActive = index === activeIndex;
                return (
                  <div
                    key={`${movie.id}-${index}`}
                    className={`magda-film-frame${isWinnerFrame ? ' is-winner' : ''}${isActive ? ' is-active' : ''}`}
                    style={{ width: FRAME_W }}
                  >
                    <div className="magda-film-frame-inner">
                      {src ? (
                        <img src={src} alt="" draggable={false} />
                      ) : (
                        <div className="magda-film-frame-fallback">
                          <LocalMoviesOutlinedIcon />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="magda-film-edge magda-film-edge--bottom" aria-hidden>
              {Array.from({ length: 48 }).map((_, i) => (
                <span key={`b-${i}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="magda-slot-lever" aria-hidden>
          <div className={`magda-slot-lever-arm${landed ? '' : ' is-pulling'}`} />
          <div className="magda-slot-lever-knob" />
        </div>
      </div>

      <div className="magda-drawing-copy">
        <Typography className="magda-drawing-text" key={phraseIndex}>
          {PHRASES[phraseIndex]}
        </Typography>
      </div>
    </div>
  );
};

export default MagdaDrawAnimation;
