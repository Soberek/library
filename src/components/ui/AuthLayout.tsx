import React from "react";
import { BookOpen, Sparkles, CheckCircle2, Heart, Film } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  const location = useLocation();
  const isSignIn = location.pathname === "/sign-in";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-50">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Left Side: Brand Story & Highlights (Hidden on small screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white relative overflow-hidden">
          {/* Subtle background circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

          {/* Top Logo & Title */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white text-indigo-700 shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                MyLibrary
              </span>
            </Link>

            <h2 className="text-xl font-bold font-display leading-snug mb-2 text-white">
              Twoja osobista przestrzeń czytelnicza
            </h2>
            <p className="text-xs text-indigo-100/85 leading-relaxed">
              Zarządzaj swoją domową biblioteką, śledź postępy, losuj kolejne lektury i ciesz się pięknym interfejsem.
            </p>
          </div>

          {/* Feature highlights list */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Automatyczne uzupełnianie</h4>
                <p className="text-[11px] text-indigo-100/75">Wyszukuj książki w Open Library i pobieraj okładki jednym kliknięciem.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Maszyna losująca książki</h4>
                <p className="text-[11px] text-indigo-100/75">Nie wiesz co czytać? Wylosuj idealną pozycję z animowanym bębnem.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Film className="w-4 h-4 text-pink-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Magda Losuje & Watchlista</h4>
                <p className="text-[11px] text-indigo-100/75">Losowarka filmów z bazy TMDB z zaawansowanymi filtrami gatunków i platform VOD.</p>
              </div>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 pt-4 border-t border-indigo-500/40 flex items-center gap-2 text-[11px] text-indigo-200/80">
            <Heart className="w-3.5 h-3.5 text-pink-300 shrink-0" />
            <span>Stworzone z pasją do książek i filmów</span>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          {/* Top Switcher (Logowanie / Rejestracja) */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl mb-6 shadow-2xs">
            <Link
              to="/sign-in"
              className={cn(
                "flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all",
                isSignIn
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Logowanie
            </Link>
            <Link
              to="/sign-up"
              className={cn(
                "flex-1 text-center py-2 rounded-xl text-xs font-bold transition-all",
                !isSignIn
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Rejestracja
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Children */}
          <div>{children}</div>

          {/* Footer */}
          {footer && <div className="mt-6 text-center text-xs text-slate-500">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
