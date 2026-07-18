import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { AnimatePresence, motion } from 'framer-motion';
import {
  pickRandomPosition,
  SEXUAL_POSITIONS,
  shufflePositions,
  type SexualPosition,
} from '../constants/sexualPositions';
import PozycjeDrawAnimation from '../components/pozycje/PozycjeDrawAnimation';
import './PozycjeSeksualne.css';

const RECENT_LIMIT = 8;

const DIFFICULTY_LABEL: Record<SexualPosition['difficulty'], string> = {
  łatwa: 'Łatwa',
  średnia: 'Średnia',
  zaawansowana: 'Zaawansowana',
};

const PozycjeSeksualne: React.FC = () => {
  const [result, setResult] = useState<SexualPosition | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [reel, setReel] = useState<SexualPosition[]>([]);
  const [spinWinner, setSpinWinner] = useState<SexualPosition | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Pozycje';
    return () => {
      document.title = previousTitle;
    };
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

  return (
    <Box className="pozycje-page" component="main">
      <div className="pozycje-grain" aria-hidden />
      <div className="pozycje-glow pozycje-glow--left" aria-hidden />
      <div className="pozycje-glow pozycje-glow--right" aria-hidden />

      <Box className="pozycje-inner">
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
        </motion.header>

        <motion.section
          className="pozycje-controls"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            className="pozycje-draw-btn"
            variant="contained"
            size="large"
            disabled={drawing}
            onClick={handleDraw}
            startIcon={<ShuffleIcon />}
          >
            {drawing ? 'Losuję…' : result ? 'Losuj ponownie' : 'Losuj pozycję'}
          </Button>
        </motion.section>

        <Box className="pozycje-result-slot">
          <AnimatePresence mode="wait">
            {!result && !drawing && (
              <motion.div
                key="empty"
                className="pozycje-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FavoriteBorderIcon sx={{ fontSize: 48, opacity: 0.45 }} />
                <Typography variant="body1" textAlign="center" className="pozycje-empty-text">
                  Tu pojawi się wylosowana pozycja.
                </Typography>
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
                initial={{ opacity: 0, scale: 0.88, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="pozycje-card-kicker">Wylosowano</p>
                <Typography className="pozycje-card-title" component="h2">
                  {result.name}
                </Typography>
                <div className="pozycje-card-diagram">
                  <img
                    className="pozycje-card-image"
                    src={result.image}
                    alt={`Ilustracja: ${result.name}`}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ my: 1.5 }} justifyContent="center">
                  <Chip
                    size="small"
                    label={DIFFICULTY_LABEL[result.difficulty]}
                    className={`pozycje-chip pozycje-chip--${result.difficulty === 'łatwa' ? 'easy' : result.difficulty === 'średnia' ? 'mid' : 'hard'}`}
                  />
                </Stack>
                <Typography className="pozycje-card-desc">{result.description}</Typography>
              </motion.article>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default PozycjeSeksualne;
