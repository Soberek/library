import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import DesktopNavbar from './DesktopNavbar';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const NAVBAR_STYLES = {
  secondaryBar: {
    display: { xs: 'none', md: 'block' },
    background: 'rgba(255, 255, 255, 0.92)',
    borderBottom: '1px solid',
    borderColor: 'grey.200',
    boxShadow: '0 1px 0 rgba(102, 126, 234, 0.06), 0 4px 16px rgba(26, 32, 44, 0.04)',
    backdropFilter: 'blur(12px)',
  },
  toolbar: {
    justifyContent: 'space-between',
    gap: 2,
    minHeight: { md: 64 },
    px: { md: 3, lg: 4 },
    py: 1,
  },
  searchContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    maxWidth: 560,
    mx: 'auto',
  },
  userMenuContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
    minWidth: { md: 200, lg: 280 },
  },
} as const;

/**
 * Main Navbar component for desktop view
 * Combines the brand navbar with search and user menu bar
 */
const Navbar: React.FC = () => {
  return (
    <>
      <DesktopNavbar />

      <AppBar position="sticky" elevation={0} color="transparent" sx={NAVBAR_STYLES.secondaryBar}>
        <Toolbar sx={NAVBAR_STYLES.toolbar} disableGutters>
          <Box sx={{ minWidth: { md: 200, lg: 280 }, flexShrink: 0 }} />
          <Box sx={NAVBAR_STYLES.searchContainer}>
            <SearchBar variant="desktop" />
          </Box>
          <Box sx={NAVBAR_STYLES.userMenuContainer}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
