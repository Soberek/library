import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const ProtectedRoute = () => {
  const auth = useUser();

  if (auth.loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #d400a6ff 0%, #da0000ff 100%)",
        }}
      >
        <div
          style={{
            padding: "2rem 3rem",
            borderRadius: "1rem",
            background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#2d3748",
          }}
        >
          Ładuje się stronka, poczekaj...
        </div>
      </div>
    );
  }

  return auth.user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
