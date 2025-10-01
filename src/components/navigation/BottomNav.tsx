import React from "react";
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper, 
  Fab,
  Zoom,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

type Props = {
  handleBookModalOpen: (params: {
    mode: "add" | "edit";
    bookId: string | null;
  }) => void;
};
const BottomNav: React.FC<Props> = ({ handleBookModalOpen }) => {
  const [value, setValue] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <Zoom in={mounted} timeout={600}>
        <Fab
          color="primary"
          aria-label="Dodaj książkę"
          onClick={() => handleBookModalOpen({ mode: "add", bookId: null })}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            zIndex: 1300,
            display: { xs: "flex", md: "none" },
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          display: { xs: "block", md: "none" },
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        elevation={0}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          sx={{
            "& .MuiBottomNavigationAction-root": {
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <BottomNavigationAction 
            label="Biblioteka" 
            icon={<LibraryBooksIcon />} 
          />
          <BottomNavigationAction 
            label="Statystyki" 
            icon={<TrendingUpIcon />} 
          />
          <BottomNavigationAction 
            label="Profil" 
            icon={<HomeIcon />} 
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default BottomNav;
