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
    minHeight: { md: 56 },
    py: 1,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-1px)',
      '& .brand-icon': {
        transform: 'rotate(6deg)',
      },
    },
  },
  iconWrapper: {
    p: 1,
    borderRadius: 2,
    background: 'rgba(255, 255, 255, 0.18)',
    border: '1px solid rgba(255, 255, 255, 0.28)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  brandText: {
    color: '#f8fafc',
    letterSpacing: '-0.5px',
    fontWeight: 800,
    fontSize: '1.35rem',
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
              <MenuBookIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h6"
              component="span"
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
