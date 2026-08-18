import React from 'react';
import { cn } from '../../lib/utils';

interface MagdaIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

export const MagdaIcon: React.FC<MagdaIconProps> = ({
  size = 28,
  className,
  alt = 'MAGDA LOSUJE',
}) => (
  <img
    src="/magda-losuje-icon.png"
    alt={alt}
    style={{ width: size, height: size }}
    className={cn(
      "rounded-lg object-cover block shrink-0 shadow-sm transition-transform hover:scale-105",
      className
    )}
  />
);

export default MagdaIcon;
