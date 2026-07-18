import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const auth = useAuth();
  const location = useLocation();

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

  if (auth.user) {
    return <Outlet />;
  }

  return (
    <Navigate
      to="/sign-in"
      replace
      state={{ from: `${location.pathname}${location.search}${location.hash}` }}
    />
  );
};

export default ProtectedRoute;
