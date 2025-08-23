import React from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useUser } from "../providers/UserContext";

const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/", { replace: true });
    } catch (error: any) {
      const message = error?.message || "Wystąpił błąd podczas logowania.";
      setErrorMessage(message);
      if (process.env.NODE_ENV === "development") {
        console.error("Error signing in:", message);
      }
    } finally {
      setLoading(false);
    }
  };

  const userContext = useUser();

  if (userContext.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      }}
    >
      <form
        onSubmit={handleSignIn}
        style={{
          background: "#fff",
          padding: "2rem 2.5rem",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(44, 62, 80, 0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          minWidth: "320px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#5f2c82",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          Zaloguj się
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: loading
              ? "linear-gradient(90deg, #bdbdbd 0%, #e0e0e0 100%)"
              : "linear-gradient(90deg, #5f2c82 0%, #49a09d 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(44, 62, 80, 0.08)",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Logowanie..." : "Zaloguj"}
        </button>
        {errorMessage && (
          <div
            style={{
              color: "#d32f2f",
              background: "#fdecea",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginTop: "-1rem",
              fontSize: "0.95rem",
              textAlign: "center",
              border: "1px solid #f8bbbc",
            }}
          >
            {errorMessage}
          </div>
        )}
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            textAlign: "center",
            color: "#666",
          }}
        >
          Nie masz konta?{" "}
          <Link
            to="/sign-up"
            style={{
              color: "#5f2c82",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Zarejestruj się
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
