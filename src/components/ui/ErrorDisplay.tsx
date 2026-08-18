import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import type { ErrorType } from '../../types/Error';
import { ERROR_MESSAGES } from '../../constants/validation';
import { Button } from './button';

export interface ErrorDisplayProps {
  error: ErrorType | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  if (!error) return null;

  const getErrorMessage = (err: ErrorType): string => {
    switch (err.code) {
      case 'VALIDATION_ERROR':
        return err.message;
      case 'FIREBASE_ERROR':
        return err.message || ERROR_MESSAGES.FIREBASE_ERROR;
      case 'NETWORK_ERROR':
        return err.message || ERROR_MESSAGES.NETWORK_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  };

  return (
    <div className="mb-4 flex items-start justify-between gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-900">
            {error.code === 'VALIDATION_ERROR' ? 'Błąd walidacji' : 'Wystąpił błąd'}
          </h4>
          <p className="text-xs text-red-700 mt-0.5">
            {getErrorMessage(error)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-7 text-xs border-red-300 hover:bg-red-100"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Ponów
          </Button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-red-200/50 transition-colors cursor-pointer"
            aria-label="Zamknij"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
