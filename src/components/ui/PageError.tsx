import React from "react";
import { Alert, AlertTitle, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface PageErrorProps {
  message: string;
  title?: string;
}

const PageError: React.FC<PageErrorProps> = ({
  message,
  title = "Nie udało się załadować danych",
}) => (
  <Box sx={{ py: 4 }}>
    <Alert
      severity="error"
      icon={<ErrorOutlineIcon />}
      sx={{
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "error.light",
        bgcolor: "rgba(239, 68, 68, 0.04)",
      }}
    >
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      {message}
    </Alert>
  </Box>
);

export default PageError;
