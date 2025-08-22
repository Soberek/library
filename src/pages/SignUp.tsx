import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Navigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (userCredential.user) {
        console.log("User created:", userCredential.user);
        return <Navigate to="/" />;
      }
    } catch (error) {
      console.error(
        "Error signing up:",
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
        onSubmit={handleSignUp}
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
          Zarejestruj się
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
          Zarejestruj
        </button>
      </form>
    </div>
  );
};

export default SignUp;
