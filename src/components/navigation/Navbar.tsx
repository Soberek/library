import React from "react";
import { BookOpen, Heart, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import MagdaIcon from "../ui/MagdaIcon";
import { cn } from "../../lib/utils";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainPage = location.pathname === "/";
  const isMagdaPage = location.pathname === "/magda-losuje";
  const isBookLosujePage = location.pathname === "/losuj-ksiazke";
  const isPozycjePage = location.pathname === "/pozycje-seksualne";
  const hideSearch = !isMainPage;

  return (
    <header className="sticky top-0 z-40 hidden md:block w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <button
          onClick={() => navigate("/")}
          aria-label="MyLibrary — strona główna"
          className="flex items-center gap-2.5 rounded-2xl py-1 px-1.5 transition-all hover:opacity-90 cursor-pointer text-left shrink-0 group"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 font-display leading-none">
              MyLibrary
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
              Biblioteka
            </span>
          </div>
        </button>

        {/* Quick navigation links */}
        <nav className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate("/magda-losuje")}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer select-none border",
              isMagdaPage
                ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs ring-2 ring-amber-400/20"
                : "bg-amber-50 text-amber-800 border-amber-200/70 hover:bg-amber-100 hover:border-amber-300"
            )}
          >
            <MagdaIcon size={18} alt="" />
            <span>MAGDA LOSUJE</span>
          </button>

          <button
            onClick={() => navigate("/losuj-ksiazke")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer select-none border",
              isBookLosujePage
                ? "bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs ring-2 ring-emerald-400/20"
                : "bg-emerald-50 text-emerald-800 border-emerald-200/70 hover:bg-emerald-100 hover:border-emerald-300"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Losuj książkę</span>
          </button>

          <button
            onClick={() => navigate("/pozycje-seksualne")}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer select-none border",
              isPozycjePage
                ? "bg-pink-100 text-pink-900 border-pink-300 shadow-xs ring-2 ring-pink-400/20"
                : "bg-pink-50 text-pink-800 border-pink-200/70 hover:bg-pink-100 hover:border-pink-300"
            )}
          >
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span>Pozycje</span>
          </button>
        </nav>

        {/* Center Search Bar */}
        <div className="flex-1 max-w-md mx-auto">
          {!hideSearch && <SearchBar variant="desktop" />}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 shrink-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
