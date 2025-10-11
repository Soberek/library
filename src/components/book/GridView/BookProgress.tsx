import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Rating,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { Book } from '../../../types/Book';

interface BookProgressProps {
  book: Book;
  isHovered: boolean;
  onRatingChange: (bookId: string, newRating: number) => void;
}

const ProgressSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

const ProgressBadge = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  backgroundColor: alpha('#eef2ff', 1),
  padding: '4px 12px',
  borderRadius: 8,
}));

const RatingBadge = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  backgroundColor: alpha('#fef3c7', 1),
  padding: '4px 12px',
  borderRadius: 8,
}));

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'isHovered',
})<{ isHovered?: boolean }>(({ isHovered }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha('#e0e7ff', 1),
  position: 'relative',
  
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
    boxShadow: isHovered ? `0 0 12px ${alpha('#6366f1', 0.6)}` : 'none',
    transition: 'all 0.5s ease',
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: 'var(--progress-position, 0%)',
    transform: 'translate(-50%, -50%)',
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    border: `3px solid #6366f1`,
    borderRadius: '50%',
    boxShadow: `0 2px 8px ${alpha('#6366f1', 0.4)}`,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
  },
}));

const StyledRating = styled(Rating)(() => ({
  '& .MuiRating-iconFilled': {
    color: '#f59e0b',
  },
  '& .MuiRating-iconHover': {
    color: '#d97706',
    transform: 'scale(1.2)',
  },
  '& .MuiRating-icon': {
    transition: 'transform 0.2s ease',
  },
}));

export default function BookProgress({ book, isHovered, onRatingChange }: BookProgressProps) {
  const progress = Math.min(((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100, 100);

  return (
    <>
      {/* Progress Section */}
      <ProgressSection>
        <SectionHeader>
          <SectionTitle>Progress</SectionTitle>
          <ProgressBadge>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {book.readPages}
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '0.7rem', 
                color: 'text.secondary',
                fontWeight: 600,
              }}
            >
              /
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              {book.overallPages}
            </Typography>
          </ProgressBadge>
        </SectionHeader>
        
        <StyledLinearProgress
          variant="determinate"
          value={progress}
          isHovered={isHovered}
          sx={{
            '--progress-position': `${progress}%`,
          }}
        />
        
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'text.secondary',
            mt: 0.5,
          }}
        >
          {Math.round(progress)}% completed
        </Typography>
      </ProgressSection>

      {/* Rating Section */}
      <ProgressSection sx={{ mb: 4 }}>
        <SectionHeader>
          <SectionTitle>Rating</SectionTitle>
          <RatingBadge>
            <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 900,
                color: '#d97706',
              }}
            >
              {book.rating}/10
            </Typography>
          </RatingBadge>
        </SectionHeader>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          <StyledRating
            name={`rating-${book.id}`}
            value={book.rating / 2}
            max={5}
            precision={0.5}
            onChange={(_, newValue) => {
              if (newValue !== null) {
                onRatingChange(book.id, newValue * 2);
              }
            }}
            icon={<StarIcon sx={{ fontSize: 24 }} />}
            emptyIcon={<StarBorderIcon sx={{ fontSize: 24, color: alpha('#cbd5e1', 1) }} />}
          />
        </Box>
      </ProgressSection>
    </>
  );
}
