import React from 'react';
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // setError,
    clearErrors,
  } = useForm<FormData>();
  const [error, setLocalError] = React.useState<string | null>(null);
  const authContext = useUser();
  const navigate = useNavigate();

  if (authContext.user?.uid) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: FormData) => {
    clearErrors();
    setLocalError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      if (userCredential.user) {
        navigate('/sign-in');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLocalError(`Wystąpił błąd: ${error.message}`);
      } else {
        setLocalError('Wystąpił nieznany błąd');
      }
    }
  };

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
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            required
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
            variant="outlined"
            fullWidth
            required
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
            disabled={isSubmitting}
            fullWidth
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              py: 1.5,
              borderRadius: 2,
            }}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Rejestruję...' : 'Zarejestruj'}
          </Button>
        </form>
        <Typography
          align="center"
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: 0.2,
          }}
        >
          Masz już konto?{' '}
          <Link
            to="/sign-in"
            replace
            style={{
              color: '#7b1fa2',
              textDecoration: 'underline',
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
