import React from "react";
import { useNavigate, Link as RouterLink, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/ui/AuthLayout";

type FormData = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const userContext = useAuth();

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/", { replace: true });
    } catch (error) {
      const message = "Wystąpił błąd podczas logowania.";
      setErrorMessage(message);
      if (error instanceof Error) {
        if (import.meta.env.DEV) {
          console.error("Login error:", error);
        }
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (userContext.user) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Zaloguj się"
      footer={
        <Typography variant="body2" color="text.secondary">
          Nie masz konta?{" "}
          <Link
            component={RouterLink}
            to="/sign-up"
            underline="hover"
            color="primary"
            fontWeight={600}
          >
            Zarejestruj się
          </Link>
        </Typography>
      }
    >
      <Stack
        component="form"
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          required
          fullWidth
          autoComplete="email"
          {...register("email", {
            required: "Email jest wymagany",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Nieprawidłowy format email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          type="password"
          label="Hasło"
          required
          variant="outlined"
          fullWidth
          autoComplete="current-password"
          {...register("password", {
            required: "Hasło jest wymagane",
            minLength: {
              value: 6,
              message: "Hasło musi mieć co najmniej 6 znaków",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ py: 1.25, fontWeight: 600, textTransform: "none", borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Zaloguj"}
        </Button>
      </Stack>
    </AuthLayout>
  );
};

export default SignIn;
