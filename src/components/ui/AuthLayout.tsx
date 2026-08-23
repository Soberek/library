import React from "react";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Star,
  Film,
  Compass,
  BookmarkCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-50/80 overflow-hidden">
      {/* Background Dot Matrix Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Gradient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glass/Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-indigo-950/5 overflow-hidden"
      >
        {/* Left Side: Brand Story & Live Feature Previews (Visible on Large Screens) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-10 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white relative overflow-hidden">
          {/* Subtle glowing overlays */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

          {/* Top: Brand Identity */}
          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-3 mb-6 group focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-display block leading-none">
                  MyLibrary
                </span>
                <span className="text-[10px] font-bold text-indigo-300/80 tracking-widest uppercase">
                  Domowe Centrum Kultury
                </span>
              </div>
            </Link>

            <h2 className="text-2xl font-bold font-display leading-tight text-white mb-2.5">
              Twoja prywatna przestrzeń czytelnicza & filmowa
            </h2>
            <p className="text-xs text-indigo-100/80 leading-relaxed">
              Zarządzaj książkami, śledź postępy czytania, losuj kolejne pozycje
              oraz odkrywaj hity filmowe z Magdą.
            </p>
          </div>

          {/* Middle: Interactive-Looking Feature Cards */}
          <div className="relative z-10 space-y-3 my-6">
            {/* Mini Book Card Preview */}
            <div className="p-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-sm hover:bg-white/[0.09] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <BookmarkCheck className="w-3 h-3" /> W trakcie czytania
                </span>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-11 rounded-lg bg-indigo-600/40 border border-white/20 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs">
                  📖
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    Wiedźmin: Ostatnie życzenie
                  </h4>
                  <p className="text-[11px] text-indigo-200/70 truncate">
                    Andrzej Sapkowski • 230/340 stron
                  </p>
                  <div className="w-full bg-white/15 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Draw & Features */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Losowarka</span>
                </div>
                <p className="text-[10px] text-indigo-100/70 leading-tight">
                  Animowany bęben losujący nowe lektury.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-300">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">Magda Losuje</span>
                </div>
                <p className="text-[10px] text-indigo-100/70 leading-tight">
                  Katalog filmów TMDB i filtry VOD.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: Trust & Security Pill */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bezpieczna autoryzacja Firebase</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] bg-white/10 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-indigo-300" />
              <span>Chmura 24/7</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Container */}
        <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          {/* Top Navigation Tabs (Pill Switcher) */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200/80 rounded-2xl mb-7 max-w-xs mx-auto lg:mx-0 shadow-2xs">
            <Link
              to="/sign-in"
              className={cn(
                "flex-1 text-center py-2 px-4 rounded-xl text-xs font-bold transition-all select-none cursor-pointer",
                isSignIn
                  ? "bg-white text-indigo-700 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Logowanie
            </Link>
            <Link
              to="/sign-up"
              className={cn(
                "flex-1 text-center py-2 px-4 rounded-xl text-xs font-bold transition-all select-none cursor-pointer",
                !isSignIn
                  ? "bg-white text-indigo-700 shadow-2xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Rejestracja
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-6 text-center lg:text-left">
            <div className="lg:hidden inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 mb-3 mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Body */}
          <div>{children}</div>

          {/* Footer Area */}
          {footer && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
