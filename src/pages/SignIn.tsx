import React, { useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import {
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { AuthLayout, Button, ResetPasswordModal } from "../components/ui";
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
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useAuth();
  const currentEmail = watch("email") || "";

  const redirectTo = resolveRedirectTarget(
    (location.state as { from?: unknown } | null)?.from,
  );

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email.trim(), data.password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      let message = "Wystąpił błąd podczas logowania.";
      if (error instanceof Error) {
        const errStr = error.message.toLowerCase();
        if (
          errStr.includes("user-not-found") ||
          errStr.includes("wrong-password") ||
          errStr.includes("invalid-credential")
        ) {
          message = "Nieprawidłowy adres email lub hasło.";
        } else if (errStr.includes("too-many-requests")) {
          message = "Zbyt wiele nieudanych prób. Odczekaj chwilę przed kolejną próbą.";
        } else if (errStr.includes("invalid-email")) {
          message = "Niepoprawny format adresu email.";
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
    <>
      <AuthLayout
        title="Witaj ponownie!"
        subtitle="Zaloguj się, aby zarządzać swoją biblioteką i odkrywać nowe pozycje."
        footer={
          <p className="text-xs text-slate-500">
            Nie posiadasz jeszcze konta?{" "}
            <Link
              to="/sign-up"
              state={{ from: redirectTo === "/" ? undefined : redirectTo }}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1 group"
            >
              <span>Zarejestruj się za darmo</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="signin-email"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Adres email <span className="text-rose-500">*</span>
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
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                    : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/15"
                )}
                {...register("email", {
                  required: "Adres email jest wymagany",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Wprowadź poprawny adres email",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="signin-password"
                className="block text-xs font-bold text-slate-700"
              >
                Hasło <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer focus:outline-none"
              >
                Zapomniałeś hasła?
              </button>
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
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
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
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 animate-in fade-in-0 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
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
              <span>{loading ? "Logowanie do konta…" : "Zaloguj się"}</span>
            </Button>
          </div>
        </form>
      </AuthLayout>

      {/* Password Reset Modal */}
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        defaultEmail={currentEmail}
      />
    </>
  );
};

export default SignIn;
