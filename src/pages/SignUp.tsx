import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../providers/UserContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useUser();
  const navigate = useNavigate();

  if (authContext.user?.uid) {
    return <Navigate to="/" />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (userCredential.user) {
        navigate("/sign-in");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? `Wystąpił błąd: ${error.message}`
          : "Wystąpił nieznany błąd",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight={700}
          color="primary"
          gutterBottom
        >
          Zarejestruj się
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form
          onSubmit={handleSignUp}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
          <TextField
            type="password"
            label="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              py: 1.5,
              borderRadius: 2,
            }}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Rejestruję..." : "Zarejestruj"}
          </Button>
        </form>
        <Typography
          align="center"
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            letterSpacing: 0.2,
          }}
        >
          Masz już konto?{" "}
          <Link
            to="/sign-in"
            replace
            style={{
              color: "#7b1fa2",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            Zaloguj się
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;
