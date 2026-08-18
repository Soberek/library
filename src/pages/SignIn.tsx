import React, { useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import AuthLayout from "../components/ui/AuthLayout";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

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

export const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useAuth();
  const redirectTo = resolveRedirectTarget(
    (location.state as { from?: unknown } | null)?.from,
  );

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      let message = "Wystąpił błąd podczas logowania.";
      if (error instanceof Error) {
        const errStr = error.message.toLowerCase();
        if (errStr.includes("user-not-found") || errStr.includes("wrong-password") || errStr.includes("invalid-credential")) {
          message = "Nieprawidłowy adres email lub hasło.";
        } else if (errStr.includes("too-many-requests")) {
          message = "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.";
        } else {
          message = error.message;
        }
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  if (userContext.user) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthLayout
      title="Witaj ponownie!"
      subtitle="Zaloguj się na swoje konto, aby uzyskać dostęp do swoich książek i filmów."
      footer={
        <p className="text-xs text-slate-500">
          Nie posiadasz jeszcze konta?{" "}
          <Link
            to="/sign-up"
            state={{ from: redirectTo === "/" ? undefined : redirectTo }}
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Zarejestruj się za darmo
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="signin-email" className="block text-xs font-bold text-slate-700 mb-1.5">
            Adres email *
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              placeholder="twoj@email.com"
              className={cn(
                "flex h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15"
              )}
              {...register("email", {
                required: "Email jest wymagany",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Nieprawidłowy format adresu email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="signin-password" className="block text-xs font-bold text-slate-700">
              Hasło *
            </label>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={cn(
                "flex h-11 w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-3",
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
                  : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15"
              )}
              {...register("password", {
                required: "Hasło jest wymagane",
                minLength: {
                  value: 6,
                  message: "Hasło musi mieć co najmniej 6 znaków",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-sm font-bold shadow-md hover:shadow-lg gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>{loading ? "Logowanie…" : "Zaloguj się"}</span>
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
