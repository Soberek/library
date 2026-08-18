import React, { useState, useCallback } from "react";
import { Menu, BookOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";

export const MobileNavbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearch = location.pathname !== "/";

  const handleDrawerOpen = useCallback(() => setDrawerOpen(true), []);
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);
  const handleBrandClick = useCallback(() => navigate("/"), [navigate]);

  return (
    <>
      <header className="sticky top-0 z-40 block md:hidden w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={handleBrandClick}
            aria-label="MyLibrary — strona główna"
            className="flex items-center gap-2 rounded-xl py-1 px-1 transition-opacity hover:opacity-80 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 font-display">
              MyLibrary
            </span>
          </button>

          <button
            aria-label="Otwórz menu"
            onClick={handleDrawerOpen}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {!hideSearch && (
          <div className="px-4 pb-3">
            <SearchBar variant="mobile" />
          </div>
        )}
      </header>

      <MobileDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
};

export default MobileNavbar;
