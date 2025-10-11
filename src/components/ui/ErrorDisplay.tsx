import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import type { ErrorType } from '../../types/Error';
import { ERROR_MESSAGES } from '../../constants/validation';

/**
 * Props for the ErrorDisplay component
 */
interface ErrorDisplayProps {
  /** The error to display, or null to hide the component */
  error: ErrorType | null;
  /** Optional callback function to retry the failed operation */
  onRetry?: () => void;
  /** Optional callback function to dismiss the error */
  onDismiss?: () => void;
  /** The severity level of the error display */
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Displays error messages with optional retry functionality
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  severity = 'error',
}) => {
  if (!error) return null;

  const getErrorMessage = (error: ErrorType): string => {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return error.message;
      case 'FIREBASE_ERROR':
        return error.message || ERROR_MESSAGES.FIREBASE_ERROR;
      case 'NETWORK_ERROR':
        return error.message || ERROR_MESSAGES.NETWORK_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity={severity}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRetry && (
              <Button
                color="inherit"
                size="small"
                onClick={onRetry}
                aria-label="Spróbuj ponownie"
              >
                Spróbuj ponownie
              </Button>
            )}
            {onDismiss && (
              <Button
                color="inherit"
                size="small"
                onClick={onDismiss}
                aria-label="Zamknij"
              >
                Zamknij
              </Button>
            )}
          </Box>
        }
      >
        <AlertTitle>
          {error.code === 'VALIDATION_ERROR' ? 'Błąd walidacji' : 'Wystąpił błąd'}
        </AlertTitle>
        {getErrorMessage(error)}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;
