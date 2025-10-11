import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Optional message to display below the spinner */
  message?: string;
  /** Size of the spinner in pixels */
  size?: number;
  /** Whether to display as a full-screen overlay */
  fullScreen?: boolean;
}

/**
 * Reusable loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Ładowanie...',
  size = 40,
  fullScreen = false,
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 2,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;
