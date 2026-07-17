import React from 'react';
import { Box } from '@mui/material';

interface MagdaIconProps {
  size?: number;
  className?: string;
  alt?: string;
}

const MagdaIcon: React.FC<MagdaIconProps> = ({
  size = 28,
  className,
  alt = 'MAGDA LOSUJE',
}) => (
  <Box
    component="img"
    src="/magda-losuje-icon.png"
    alt={alt}
    className={className}
    sx={{
      width: size,
      height: size,
      borderRadius: size > 40 ? '18%' : '22%',
      objectFit: 'cover',
      display: 'block',
      flexShrink: 0,
      boxShadow:
        size >= 48
          ? '0 8px 28px rgba(240, 180, 41, 0.28)'
          : '0 1px 3px rgba(0, 0, 0, 0.18)',
    }}
  />
);

export default MagdaIcon;
