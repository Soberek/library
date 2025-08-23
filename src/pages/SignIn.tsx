import React from "react";
import { useNavigate, Link as RouterLink, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useUser } from "../providers/UserContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";

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
      const message = "Wystąpił błąd podczas logowania.";
      setErrorMessage(message);
      if (process.env.NODE_ENV === "development") {
        console.error("Error signing in:", error?.message);
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
        component="form"
        onSubmit={handleSignIn}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          textAlign="center"
          gutterBottom
        >
          Zaloguj się
        </Typography>
        <TextField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          autoComplete="email"
        />
        <TextField
          type="password"
          label="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ py: 1.5, fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={26} color="info" /> : "Zaloguj"}
        </Button>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: -2 }}>
            {errorMessage}
          </Alert>
        )}
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Nie masz konta?{" "}
          <Link
            component={RouterLink}
            to="/sign-up"
            underline="none"
            color="primary"
            fontWeight={500}
          >
            Zarejestruj się
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn;
