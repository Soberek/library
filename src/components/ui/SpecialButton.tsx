import React from 'react';
import { cn } from '../../lib/utils';

export interface SpecialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  specialVariant?: 'spinning' | 'gradient';
}

export const SpecialButton: React.FC<SpecialButtonProps> = ({
  children,
  className,
  specialVariant = 'gradient',
  ...props
}) => {
  if (specialVariant === 'gradient') {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-extrabold text-white overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-mono uppercase font-bold text-white bg-slate-950 border border-slate-700 shadow-md hover:shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default SpecialButton;
