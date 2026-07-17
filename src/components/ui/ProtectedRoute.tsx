import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <LoadingSpinner message="Ładowanie biblioteki..." size={36} />
      </Box>
    );
  }

  return auth.user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
