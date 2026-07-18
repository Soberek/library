import React from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/ui/AuthLayout";

type FormData = {
  email: string;
  password: string;
};

function resolveRedirectTarget(from: unknown): string {
  if (typeof from !== "string" || !from.startsWith("/") || from.startsWith("//")) {
    return "/";
  }
  if (from === "/sign-in" || from === "/sign-up") {
    return "/";
  }
  return from;
}

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<FormData>();
  const [error, setLocalError] = React.useState<string | null>(null);
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = resolveRedirectTarget(
    (location.state as { from?: unknown } | null)?.from,
  );

  if (authContext.user?.uid) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (data: FormData) => {
    clearErrors();
    setLocalError(null);
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate(redirectTo, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLocalError(`Wystąpił błąd: ${error.message}`);
      } else {
        setLocalError("Wystąpił nieznany błąd");
      }
    }
  };

  return (
    <AuthLayout
      title="Zarejestruj się"
      footer={
        <Typography variant="body2" color="text.secondary">
          Masz już konto?{" "}
          <Link
            component={RouterLink}
            to="/sign-in"
            state={{ from: redirectTo === "/" ? undefined : redirectTo }}
            underline="hover"
            color="primary"
            fontWeight={600}
          >
            Zaloguj się
          </Link>
        </Typography>
      }
    >
      <Stack
        component="form"
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          fullWidth
          required
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
          variant="outlined"
          fullWidth
          required
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          fullWidth
          sx={{
            fontWeight: 600,
            py: 1.25,
            borderRadius: 2,
            textTransform: "none",
          }}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? "Rejestruję..." : "Zarejestruj"}
        </Button>
      </Stack>
    </AuthLayout>
  );
};

export default SignUp;
