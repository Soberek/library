import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import type { LotteryBook } from '../../types/LotteryBook';

const PREVIEW_COUNT = 5;
const SLIDE_MS = 150;
const HOLD_MS = 210;

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

  for (const book of others) {
    if (picks.length >= PREVIEW_COUNT) break;
    picks.push(book);
  }

  let i = 0;
  while (
    picks.length < Math.min(PREVIEW_COUNT, Math.max(others.length, 1)) &&
    others.length > 0
  ) {
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
    const frameWidth = Math.min(140, Math.max(105, Math.floor(stage.clientWidth * 0.38)));
    const frameGap = 12;
    const stride = frameWidth + frameGap;
    const centerOffset = Math.max(0, (stage.clientWidth - frameWidth) / 2);
    const xForIndex = (index: number) => -(index * stride) + centerOffset;

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
      window.setTimeout(() => onCompleteRef.current(), 380);
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
                  >
                    <div className="book-draw-frame-inner">
                      {book.cover ? (
                        <img src={book.cover} alt="" draggable={false} />
                      ) : (
                        <div className="book-draw-frame-fallback">
                          <BookOpen className="w-7 h-7 text-emerald-700 mb-1" />
                          <span className="line-clamp-2">{book.title}</span>
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
