import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const SignIn: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User signed in:", userCredential.user);
      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Error signing in:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

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
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(90deg, #5f2c82 0%, #49a09d 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(44, 62, 80, 0.08)",
            transition: "background 0.2s",
          }}
        >
          Zaloguj
        </button>

        {/* If no account */}
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            textAlign: "center",
            color: "#666",
          }}
        >
          Nie masz konta?{" "}
          <a
            href="/sign-up"
            style={{
              color: "#5f2c82",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Zarejestruj się
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
