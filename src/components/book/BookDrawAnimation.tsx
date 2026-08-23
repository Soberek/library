import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import type { LotteryBook } from '../../types/LotteryBook';

const FRAME_W = 140;
const FRAME_GAP = 14;
const FRAME_STRIDE = FRAME_W + FRAME_GAP;
const PREVIEW_COUNT = 5;
const SLIDE_MS = 140;
const HOLD_MS = 200;

const PHRASES = [
  'Otwieram katalog…',
  'Kartkuję tomy biblioteki…',
  'Wybieram dzieło losu…',
  '✦ Oto Twoja księga! ✦',
];

interface BookDrawAnimationProps {
  reelBooks: LotteryBook[];
  winner: LotteryBook;
  onComplete: () => void;
}

function buildStrip(pool: LotteryBook[], winner: LotteryBook): LotteryBook[] {
  const others = pool.filter((b) => b.id !== winner.id);
  const picks: LotteryBook[] = [];

  if (others.length > 0) {
    let i = 0;
    while (picks.length < PREVIEW_COUNT) {
      picks.push(others[i % others.length]);
      i += 1;
    }
  } else {
    // If only winner is in pool (e.g. wishlist with 1 item or 1 search result)
    for (let i = 0; i < PREVIEW_COUNT; i++) {
      picks.push(winner);
    }
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

    const tick = (now: number) => {
      if (signal.cancelled) {
        resolve();
        return;
      }
      const t = Math.min(1, (now - start) / durationMs);
      const x = from + (to - from) * easeInOutCubic(t);
      el.style.transform = `translate3d(${x}px, 0, 0)`;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(tick);
  });
}

export const BookDrawAnimation: React.FC<BookDrawAnimationProps> = ({
  reelBooks,
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

  const strip = useMemo(() => buildStrip(reelBooks, winner), [reelBooks, winner]);
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
        await delay(HOLD_MS, signal);
        if (signal.cancelled) return;

        const nextX = xForIndex(i);
        await animateTranslateX(stripEl, currentX, nextX, SLIDE_MS, signal);
        if (signal.cancelled) return;

        currentX = nextX;
        setActiveIndex(i);
      }

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
    <div className="book-draw-container" role="status" aria-live="polite">
      <div className="book-draw-card" ref={stageRef}>
        {/* Top Ornamental Bar */}
        <div className="book-draw-topbar">
          <span className="book-draw-topbar-tag">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>EX LIBRIS</span>
          </span>
          <div className="book-draw-lights" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className={landed ? 'is-win' : undefined} />
            ))}
          </div>
          <span className="book-draw-topbar-tag">
            <span>VOL. MMXXVI</span>
          </span>
        </div>

        {/* Viewport Strip */}
        <div className={`book-draw-viewport${landed ? ' is-landed' : ''}`}>
          <div className="book-draw-vignette" />
          <div className="book-draw-pointer book-draw-pointer--left" />
          <div className="book-draw-pointer book-draw-pointer--right" />

          <div className="book-draw-reel-track">
            <div className="book-draw-ornament-edge" aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={`t-${i}`}>✦</span>
              ))}
            </div>

            <div className="book-draw-strip" ref={stripRef}>
              {strip.map((book, index) => {
                const isWinner = landed && index === winnerIndex;
                const isActive = index === activeIndex;
                return (
                  <div
                    key={`${book.id}-${index}`}
                    className={`book-draw-frame${isWinner ? ' is-winner' : ''}${isActive ? ' is-active' : ''}`}
                    style={{ width: FRAME_W }}
                  >
                    <div className="book-draw-frame-inner">
                      {book.cover ? (
                        <img src={book.cover} alt="" draggable={false} />
                      ) : (
                        <div className="book-draw-frame-fallback">
                          <BookOpen className="w-7 h-7 text-emerald-700 mb-1" />
                          <span className="line-clamp-2 text-[11px] font-bold leading-tight">{book.title}</span>
                          {book.author && <span className="text-[9px] text-emerald-900 line-clamp-1 italic">{book.author}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="book-draw-ornament-edge" aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={`b-${i}`}>✦</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="book-draw-status-phrase font-serif" key={phraseIndex}>
        {PHRASES[phraseIndex]}
      </p>
    </div>
  );
};

export default BookDrawAnimation;
