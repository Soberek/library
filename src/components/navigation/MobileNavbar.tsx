import React, { useState, useCallback } from "react";
import { BookOpen, Sparkles, Heart, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import MagdaIcon from "../ui/MagdaIcon";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export const MobileNavbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  const isBooksActive = location.pathname === "/";
  const isMagdaActive = location.pathname === "/magda-losuje";
  const isBookLosujeActive = location.pathname === "/losuj-ksiazke";
  const isPozycjeActive = location.pathname === "/pozycje-seksualne";

  return (
    <>
      <nav
        aria-label="Nawigacja dolna"
        className="fixed bottom-0 inset-x-0 z-40 block md:hidden bg-[#f3f4fa]/98 backdrop-blur-md border-t border-[#e2e4ef] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 px-1"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {/* Tab 1: Biblioteka */}
          <Link
            to="/"
            className="flex flex-col items-center justify-center py-0.5 px-0.5 select-none active:opacity-75 transition-opacity group"
          >
            <div
              className={cn(
                "w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                isBooksActive
                  ? "bg-[#dbe1ff] text-[#00174c]"
                  : "text-[#44474e] group-hover:bg-[#e6e8f2]"
              )}
            >
              <BookOpen
                className={cn(
                  "w-5 h-5 transition-transform",
                  isBooksActive ? "stroke-[2.5]" : "stroke-[1.8]"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[11px] tracking-tight mt-1 truncate max-w-full font-sans",
                isBooksActive ? "font-bold text-[#1a1b24]" : "font-medium text-[#44474e]"
              )}
            >
              Biblioteka
            </span>
          </Link>

          {/* Tab 2: Magda Losuje */}
          <Link
            to="/magda-losuje"
            className="flex flex-col items-center justify-center py-0.5 px-0.5 select-none active:opacity-75 transition-opacity group"
          >
            <div
              className={cn(
                "w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                isMagdaActive
                  ? "bg-[#ffe088] text-[#3b2800] ring-1 ring-amber-400/50 shadow-xs scale-105"
                  : "text-[#44474e] group-hover:bg-[#e6e8f2]"
              )}
            >
              <MagdaIcon size={20} alt="" />
            </div>
            <span
              className={cn(
                "text-[11px] tracking-tight mt-1 truncate max-w-full font-sans",
                isMagdaActive ? "font-bold text-[#3b2800]" : "font-medium text-[#44474e]"
              )}
            >
              Magda
            </span>
          </Link>

          {/* Tab 3: Losuj Książkę */}
          <Link
            to="/losuj-ksiazke"
            className="flex flex-col items-center justify-center py-0.5 px-0.5 select-none active:opacity-75 transition-opacity group"
          >
            <div
              className={cn(
                "w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                isBookLosujeActive
                  ? "bg-[#a6f4c5] text-[#00381e]"
                  : "text-[#44474e] group-hover:bg-[#e6e8f2]"
              )}
            >
              <Sparkles
                className={cn(
                  "w-5 h-5 transition-transform",
                  isBookLosujeActive ? "stroke-[2.5]" : "stroke-[1.8]"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[11px] tracking-tight mt-1 truncate max-w-full font-sans",
                isBookLosujeActive ? "font-bold text-[#00381e]" : "font-medium text-[#44474e]"
              )}
            >
              Książka
            </span>
          </Link>

          {/* Tab 4: Pozycje */}
          <Link
            to="/pozycje-seksualne"
            className="flex flex-col items-center justify-center py-0.5 px-0.5 select-none active:opacity-75 transition-opacity group"
          >
            <div
              className={cn(
                "w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                isPozycjeActive
                  ? "bg-[#ffd9e2] text-[#3e001d]"
                  : "text-[#44474e] group-hover:bg-[#e6e8f2]"
              )}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-transform",
                  isPozycjeActive ? "stroke-[2.5] fill-current" : "stroke-[1.8]"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[11px] tracking-tight mt-1 truncate max-w-full font-sans",
                isPozycjeActive ? "font-bold text-[#3e001d]" : "font-medium text-[#44474e]"
              )}
            >
              Pozycje
            </span>
          </Link>

          {/* Tab 5: Menu / Więcej */}
          <button
            type="button"
            onClick={handleDrawerOpen}
            aria-label="Otwórz menu"
            className="flex flex-col items-center justify-center py-0.5 px-0.5 select-none active:opacity-75 transition-opacity cursor-pointer group"
          >
            <div className="w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-[#44474e] group-hover:bg-[#e6e8f2]">
              {user?.email ? (
                <div className="w-6 h-6 rounded-full bg-[#303036] text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Menu className="w-5 h-5 stroke-[1.8]" />
              )}
            </div>
            <span className="text-[11px] font-medium text-[#44474e] tracking-tight mt-1 truncate max-w-full font-sans">
              Menu
            </span>
          </button>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default MobileNavbar;
