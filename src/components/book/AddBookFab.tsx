import React from "react";
import { Fab, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddBookFabProps {
  onClick: () => void;
}

const AddBookFab: React.FC<AddBookFabProps> = ({ onClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile) return null;

  return (
    <Tooltip title="Dodaj książkę" placement="left">
      <Fab
        color="primary"
        aria-label="Dodaj książkę"
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 20,
          zIndex: theme.zIndex.speedDial,
          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.35)",
        }}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default AddBookFab;
