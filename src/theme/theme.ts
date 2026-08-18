/**
 * Theme Constants
 * Centralized color and style values used throughout the application
 */
export const THEME_CONSTANTS = {
  // Brand Colors
  gradient: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primaryHover: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    dark: 'linear-gradient(135deg, #4c63d2 0%, #5a3a7a 100%)',
  },
  // Transitions
  transitions: {
    default: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  // Border Radius
  borderRadius: {
    small: '0.5rem',
    medium: '0.75rem',
    large: '1rem',
    xlarge: '1.25rem',
  },
  // Shadows
  shadows: {
    light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xlarge: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  // Glassmorphism
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    dark: {
      background: 'rgba(15, 23, 42, 0.88)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
  },
} as const;

export default THEME_CONSTANTS;
