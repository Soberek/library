import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import DesktopNavbar from './DesktopNavbar';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

// Styles constants for better maintainability
const NAVBAR_STYLES = {
  secondaryBar: {
    display: { xs: 'none', md: 'block' },
    background: '#fff', // pure white for max contrast
    borderBottom: '1px solid #667eea',
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
    backdropFilter: 'none',
  },
  toolbar: {
    justifyContent: 'space-between',
    py: 1.5,
  },
  spacer: {
    flex: 1,
  },
  userMenuContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
} as const;

/**
 * Main Navbar component for desktop view
 * Combines the brand navbar with search and user menu bar
 */
const Navbar: React.FC = () => {
  return (
    <>
      {/* Top brand bar */}
      <DesktopNavbar />

      {/* Secondary bar with search and user menu */}
      <AppBar position="sticky" elevation={0} sx={NAVBAR_STYLES.secondaryBar}>
        <Toolbar sx={NAVBAR_STYLES.toolbar}>
          <Box sx={NAVBAR_STYLES.spacer} />
          <SearchBar variant="desktop" />
          <Box sx={NAVBAR_STYLES.userMenuContainer}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
