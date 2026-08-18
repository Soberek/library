import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  message?: string;
  size?: number | string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Ładowanie...',
  size = 32,
  fullScreen = false,
  className,
}) => {
  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3 p-4", className)}>
      <Loader2
        style={{ width: size, height: size }}
        className="animate-spin text-indigo-600"
      />
      {message && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
