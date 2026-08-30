import React from "react";
import {
  BookOpen,
  Heart,
  Sparkles,
  PanelLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import MagdaIcon from "../ui/MagdaIcon";
import { useUIStore } from "../../stores";
import { cn } from "../../lib/utils";

const ROUTE_TITLES: Record<string, { title: string; category: string }> = {
  "/": { title: "Moja biblioteka", category: "Książki" },
  "/magda-losuje": { title: "MAGDA LOSUJE", category: "Rozrywka" },
  "/losuj-ksiazke": { title: "Losuj książkę", category: "Książki" },
  "/pozycje-seksualne": { title: "Pozycje dla par", category: "Rozrywka" },
};

export const Navbar: React.FC = () => {
  const location = useLocation();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  const isMainPage = location.pathname === "/";
  const hideSearch = !isMainPage;
  const currentRoute = ROUTE_TITLES[location.pathname] || {
    title: "MyLibrary",
    category: "Aplikacja",
  };

  return (
    <header className="sticky top-0 z-30 hidden md:block w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Breadcrumbs + Expand button only when sidebar is collapsed */}
        <div className="flex items-center gap-3 shrink-0">
          {sidebarCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Rozwiń pasek boczny (⌘B)"
              title="Rozwiń pasek boczny (⌘B)"
              className="p-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span className="text-slate-500 font-medium">{currentRoute.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-bold">{currentRoute.title}</span>
          </div>
        </div>

        {/* Center: Search Bar or Route Pills */}
        <div className="flex-1 max-w-lg mx-auto">
          {!hideSearch ? (
            <SearchBar variant="desktop" />
          ) : (
            <nav className="flex items-center justify-center gap-2" aria-label="Szybka nawigacja">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all select-none border",
                    isActive
                      ? "bg-indigo-50 text-indigo-900 border-indigo-200 shadow-2xs ring-2 ring-indigo-500/10"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  )
                }
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Biblioteka</span>
              </NavLink>

              <NavLink
                to="/magda-losuje"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all select-none border",
                    isActive
                      ? "bg-amber-100 text-amber-950 border-amber-300 shadow-2xs ring-2 ring-amber-400/20"
                      : "bg-amber-50/70 text-amber-900 border-amber-200/70 hover:bg-amber-100"
                  )
                }
              >
                <MagdaIcon size={16} alt="" />
                <span>MAGDA LOSUJE</span>
              </NavLink>

              <NavLink
                to="/losuj-ksiazke"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all select-none border",
                    isActive
                      ? "bg-emerald-100 text-emerald-950 border-emerald-300 shadow-2xs ring-2 ring-emerald-400/20"
                      : "bg-emerald-50/70 text-emerald-900 border-emerald-200/70 hover:bg-emerald-100"
                  )
                }
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Losuj książkę</span>
              </NavLink>

              <NavLink
                to="/pozycje-seksualne"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all select-none border",
                    isActive
                      ? "bg-pink-100 text-pink-950 border-pink-300 shadow-2xs ring-2 ring-pink-400/20"
                      : "bg-pink-50/70 text-pink-900 border-pink-200/70 hover:bg-pink-100"
                  )
                }
              >
                <Heart className="w-3.5 h-3.5 text-pink-600" />
                <span>Pozycje</span>
              </NavLink>
            </nav>
          )}
        </div>

        {/* Right: Quick Actions + User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
