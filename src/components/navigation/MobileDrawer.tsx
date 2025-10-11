import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  // const { logout } = useAuth(); // This line was removed as per the edit hint
  const location = useLocation();

  // const handleLogout = async () => { // This function was removed as per the edit hint
  //   try {
  //     await logout();
  //     onClose(); // Close drawer after logout
  //   } catch (_error) {
  //     // Fehler beim Abmelden ignorieren oder protokollieren
  //   }
  // };

  const menuItems = [
    { text: 'Strona główna', icon: <HomeIcon />, path: '/' },
    { text: 'Moje książki', icon: <BookIcon />, path: '/books' },
    { text: 'Statystyki', icon: <BarChartIcon />, path: '/statistics' },
    { text: 'O aplikacji', icon: <InfoIcon />, path: '/about' },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose} PaperProps={{ sx: { width: 280 } }}>
      <Box
        sx={{
          height: 120, // Erhöhte Höhe für bessere Optik
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          pb: 2, // Abstand unten
          pt: 4, // Abstand oben
        }}
      >
        <Typography variant="h5" component="div" fontWeight={700}>
          Book<Box component="span" fontWeight={300}>Wise</Box>
        </Typography>
        {user && (
          <Typography variant="body2" mt={1}>
            Witaj, {user.email}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path} 
              onClick={onClose}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ fontWeight: location.pathname === item.path ? 'bold' : 'normal' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            to="/settings" 
            onClick={onClose}
            selected={location.pathname === '/settings'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === '/settings' ? 'primary.main' : 'text.secondary' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Ustawienia" />
          </ListItemButton>
        </ListItem>
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => {}}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Wyloguj się" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default MobileDrawer;
