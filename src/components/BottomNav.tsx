import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
// import HomeIcon from "@mui/icons-material/Home";
// import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

type Props = {
  handleBookAddModal: () => void;
};
const BottomNav: React.FC<Props> = ({ handleBookAddModal }) => {
  const [value, setValue] = React.useState(0);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        display: { xs: "block", md: "none" },
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
      >
        {/* <BottomNavigationAction label="Home" icon={<HomeIcon />} /> */}
        {/* <BottomNavigationAction
          label="Biblioteka"
          icon={<LibraryBooksIcon />}
        /> */}
        <BottomNavigationAction
          label="Dodaj książkę"
          icon={<AddBoxIcon />}
          onClick={handleBookAddModal}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
