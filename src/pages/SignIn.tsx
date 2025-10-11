import React from 'react';
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';

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

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/', { replace: true });
    } catch (error) {
      const message = 'Wystąpił błąd podczas logowania.';
      setErrorMessage(message);
      if (error instanceof Error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error:', error);
        }
        setErrorMessage(error.message); // Zeigt detaillierteren Fehler in der Entwicklung an
      }
    } finally {
      setLoading(false);
    }
  };

  const userContext = useAuth();

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
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
          variant="outlined"
          required
          fullWidth
          autoComplete="email"
          {...register('email', {
            required: 'Email jest wymagany',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Nieprawidłowy format email',
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
          {...register('password', {
            required: 'Hasło jest wymagane',
            minLength: {
              value: 6,
              message: 'Hasło musi mieć co najmniej 6 znaków',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ py: 1.5, fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={26} color="info" /> : 'Zaloguj'}
        </Button>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: -2 }}>
            {errorMessage}
          </Alert>
        )}
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Nie masz konta?{' '}
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
