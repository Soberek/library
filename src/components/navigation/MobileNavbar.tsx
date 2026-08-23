import React, { useState, useCallback } from "react";
import { BookOpen, Sparkles, Heart, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MobileDrawer from "./MobileDrawer";
import MagdaIcon from "../ui/MagdaIcon";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

interface TabConfig {
  path: string;
  label: string;
  pillColor: string;
  activeTextColor: string;
  icon: (active: boolean) => React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    path: "/",
    label: "Biblioteka",
    pillColor: "bg-[#dbe1ff]",
    activeTextColor: "text-[#00174c] font-bold",
    icon: (active) => (
      <BookOpen
        className={cn(
          "w-5 h-5 transition-transform",
          active ? "stroke-[2.5] text-[#00174c]" : "stroke-[1.8] text-[#44474e]"
        )}
      />
    ),
  },
  {
    path: "/magda-losuje",
    label: "Magda",
    pillColor: "bg-[#ffe088] ring-1 ring-amber-400/50 shadow-xs",
    activeTextColor: "text-[#3b2800] font-bold",
    icon: (active) => (
      <div className={cn("transition-transform", active && "scale-105")}>
        <MagdaIcon size={20} alt="" />
      </div>
    ),
  },
  {
    path: "/losuj-ksiazke",
    label: "Książka",
    pillColor: "bg-[#a6f4c5]",
    activeTextColor: "text-[#00381e] font-bold",
    icon: (active) => (
      <Sparkles
        className={cn(
          "w-5 h-5 transition-transform",
          active ? "stroke-[2.5] text-[#00381e]" : "stroke-[1.8] text-[#44474e]"
        )}
      />
    ),
  },
  {
    path: "/pozycje-seksualne",
    label: "Pozycje",
    pillColor: "bg-[#ffd9e2]",
    activeTextColor: "text-[#3e001d] font-bold",
    icon: (active) => (
      <Heart
        className={cn(
          "w-5 h-5 transition-transform",
          active ? "stroke-[2.5] fill-current text-[#3e001d]" : "stroke-[1.8] text-[#44474e]"
        )}
      />
    ),
  },
];

export const MobileNavbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <nav
        aria-label="Nawigacja dolna"
        className="fixed bottom-0 inset-x-0 z-40 block md:hidden bg-[#f3f4fa]/98 backdrop-blur-md border-t border-[#e2e4ef] shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 px-1"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto">
          {TABS.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center justify-center py-0.5 px-0.5 select-none active:opacity-75 transition-opacity group relative"
              >
                <div className="relative w-14 h-8 flex items-center justify-center">
                  {isActive && (
                    <motion.div
                      layoutId="m3-active-pill"
                      className={cn("absolute inset-0 rounded-full", tab.pillColor)}
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <div className="relative z-10">{tab.icon(isActive)}</div>
                </div>
                <span
                  className={cn(
                    "text-[11px] tracking-tight mt-1 truncate max-w-full font-sans transition-colors",
                    isActive ? tab.activeTextColor : "font-medium text-[#44474e]"
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

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
