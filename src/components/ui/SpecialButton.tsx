// Full component implementation
import React from 'react';
import { styled } from '@mui/material/styles';
import Button, { type ButtonProps } from '@mui/material/Button';

interface SpecialButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  specialVariant?: 'spinning' | 'gradient'; // spinning = conic gradient border, gradient = gradient text/bg
}

const StyledSpecialButton = styled(Button)<SpecialButtonProps>(({ theme, specialVariant = 'gradient' }) => {
  // Common styles
  const commonStyles = {
    appearance: 'none' as const,
    border: 'none',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 200ms ease-out',
    '&&': {
      minWidth: 'auto',
    },
  };

  // Gradient variant (new design)
  if (specialVariant === 'gradient') {
    return {
      ...commonStyles,
      color: '#000',
      fontSize: '0.85rem',
      lineHeight: 1.5,
      fontWeight: 800,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      borderRadius: '9999rem',
      background: 'white',
      boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.1)',
      isolation: 'isolate' as const,
      
      '&::before': {
        content: '""',
        borderRadius: 'inherit',
        background: 'linear-gradient(90deg, hsl(320, 93%, 63%), hsl(358, 88%, 61%), hsl(46, 92%, 55%))',
        zIndex: -1,
        position: 'absolute',
        inset: 0,
        transform: 'translateX(-100%)',
        transition: 'transform 200ms ease-out',
      },
      
      '& > span': {
        color: 'transparent',
        background: 'linear-gradient(90deg, hsl(320, 93%, 63%), hsl(358, 88%, 61%), hsl(46, 92%, 55%))',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        transition: 'color 200ms ease-out',
      },
      
      '&:hover, &:focus': {
        boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.1)',
        transform: 'scale(1.05)',
        
        '&::before': {
          transform: 'translateX(0)',
        },
        
        '& > span': {
          color: 'white',
          WebkitTextFillColor: 'white',
        },
      },
    };
  }

  // Spinning variant (original conic gradient design)
  return {
    ...commonStyles,
    width: '100%',
    padding: '0.75rem 1rem',
    background: theme.palette.common.black,
    color: theme.palette.common.white,
    fontFamily: 'monospace',
    borderRadius: '10px',
    fontSize: '0.85rem',
    animation: 'glow 2s linear infinite',

    // ::before - spinning conic gradient
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      aspectRatio: '1 / 1',
      width: '150%',
      height: 'auto',
      borderRadius: '50%',
      background: 'conic-gradient(#fff 0%, #000 3%, #409 60%, #fff 100%)',
      animation: 'spin 2s linear infinite',
      transform: 'translate(-50%, -50%)',
    },

    // ::after - inner overlay with blur
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 'calc(100% - 4px)',
      height: 'calc(100% - 4px)',
      background: 'rgba(0, 0, 0, 0.875)',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px',
      backdropFilter: 'blur(5px)',
    },

    // Span for centered text
    '& span': {
      display: 'block',
      width: '100%',
      position: 'absolute',
      zIndex: 1,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: '"Geo", monospace',
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      fontWeight: 700,
    },

    // Animations
    '@keyframes spin': {
      '0%': {
        transform: 'translate(-50%, -50%) rotate(0deg)',
      },
      '100%': {
        transform: 'translate(-50%, -50%) rotate(360deg)',
      },
    },

    '@keyframes glow': {
      '0%': {
        border: '0 transparent solid',
      },
      '25%': {
        border: '3px #4094 solid',
      },
      '50%': {
        border: '6px transparent solid',
      },
      '100%': {
        border: '0 transparent solid',
      },
    },
  };
});

const SpecialButton: React.FC<SpecialButtonProps> = ({ children, ...props }) => {
  return (
    <StyledSpecialButton {...props}>
      <span>{children}</span>
    </StyledSpecialButton>
  );
};

export default SpecialButton;
