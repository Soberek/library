import React from 'react';
import { AppBar, Toolbar, Typography, Box, Fade } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';

// Styles constants for better maintainability
const NAVBAR_STYLES = {
  appBar: {
    display: { xs: 'none', md: 'block' },
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderBottom: '1px solid #764ba2',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
    // Remove excessive blur and transparency for clarity
    backdropFilter: 'none',
  },
  toolbar: {
    justifyContent: 'center',
    py: 2,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.04)',
      '& .brand-icon': {
        transform: 'rotate(8deg) scale(1.12)',
      },
    },
  },
  iconWrapper: {
    p: 1.5,
    borderRadius: 3,
    background: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid #667eea',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
  },
  brandText: {
    color: '#f8fafc',
    textShadow: '0 2px 8px rgba(102,126,234,0.25)',
    letterSpacing: '-1px',
    fontWeight: 800,
    // Remove background gradient for better contrast
  },
} as const;

const DesktopNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleBrandClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={NAVBAR_STYLES.appBar}>
      <Toolbar sx={NAVBAR_STYLES.toolbar}>
        <Fade in timeout={800}>
          <Box sx={NAVBAR_STYLES.brandContainer} onClick={handleBrandClick}>
            <Box className="brand-icon" sx={NAVBAR_STYLES.iconWrapper}>
              <MenuBookIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={NAVBAR_STYLES.brandText}
            >
              MyLibrary
            </Typography>
          </Box>
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default DesktopNavbar;
