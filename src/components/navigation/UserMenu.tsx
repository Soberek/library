import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Fade,
  Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useBooksQuery } from '../../hooks/useBooksQuery';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

const UserMenu: React.FC = () => {
  const authContext = useAuth();
  const { booksStats } = useBooksQuery();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/sign-in', { replace: true });
    } catch (_error) {
      // Fehler beim Abmelden ignorieren oder protokollieren
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!authContext.user) {
    return (
      <Fade in timeout={1200}>
        <Box
          component="a"
          href="/sign-in"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 3,
            py: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.25)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          Zaloguj się
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={1200}>
      <Box display="flex" alignItems="center" gap={2}>
        {/* Stats Chips */}
        <Box
          display="flex"
          gap={1.5}
          sx={{ display: { xs: 'none', lg: 'flex' } }}
        >
          <Chip
            label={`${booksStats.total} książek`}
            size="small"
            sx={{
              bgcolor: '#e2e8f0',
              color: '#222',
              border: '1px solid #cbd5e0',
              fontWeight: 600,
              fontSize: '0.8rem',
              boxShadow: '0 2px 8px #cbd5e0',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#cbd5e0',
                transform: 'translateY(-1px)',
              },
            }}
          />
          <Chip
            label={`${booksStats.read} przeczytanych`}
            size="small"
            sx={{
              bgcolor: '#bbf7d0',
              color: '#166534',
              border: '1px solid #22c55e',
              fontWeight: 600,
              fontSize: '0.8rem',
              boxShadow: '0 2px 8px #bbf7d0',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#4ade80',
                transform: 'translateY(-1px)',
              },
            }}
          />
        </Box>

        {/* Notifications */}
        <Tooltip title="Powiadomienia">
          <IconButton
            sx={{
              color: '#667eea',
              bgcolor: '#e2e8f0',
              border: '1px solid #cbd5e0',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: '#cbd5e0',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 16px #cbd5e0',
              },
            }}
          >
            <Badge badgeContent={0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="body2"
              sx={{
                color: '#222',
                fontWeight: 600,
                maxWidth: 200,
                textShadow: 'none',
              }}
              noWrap
            >
              {authContext.user.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#667eea',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Czytelnik
            </Typography>
          </Box>
          <Tooltip title="Menu użytkownika">
            <IconButton
              onClick={handleMenuClick}
              sx={{
                p: 0.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  '& .user-avatar': {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  },
                },
              }}
            >
              <Avatar
                className="user-avatar"
                sx={{
                  bgcolor: '#e2e8f0',
                  border: '2px solid #667eea',
                  width: 44,
                  height: 44,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 16px #cbd5e0',
                  color: '#667eea',
                }}
              >
                {authContext.user.email?.charAt(0).toUpperCase() ?? 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 3,
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mx: 1,
              mt: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <AccountCircleIcon sx={{ mr: 2, color: 'text.secondary' }} />
            Profil
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mx: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <SettingsIcon sx={{ mr: 2, color: 'text.secondary' }} />
            Ustawienia
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleMenuClose();
              handleLogout();
            }}
            sx={{
              color: 'error.main',
              py: 1.5,
              px: 2,
              borderRadius: 2,
              mx: 1,
              mb: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(244, 67, 54, 0.08)',
                transform: 'translateX(4px)',
              },
            }}
          >
            <LogoutIcon sx={{ mr: 2 }} />
            Wyloguj
          </MenuItem>
        </Menu>
      </Box>
    </Fade>
  );
};

export default UserMenu;
