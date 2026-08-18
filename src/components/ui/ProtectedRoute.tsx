import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

export const ProtectedRoute = () => {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Ładowanie biblioteki..." size={36} />
      </div>
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
