import React, { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { cn } from "../../lib/utils";

export const UserMenu: React.FC = () => {
  const authContext = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate("/sign-in", { replace: true });
    } catch (_error) {
      // Ignore sign-out errors
    }
  };

  if (!authContext.user) {
    return (
      <RouterLink
        to="/sign-in"
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700"
      >
        Zaloguj się
      </RouterLink>
    );
  }

  const email = authContext.user.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "U";
  const displayName = email.split("@")[0] || email;

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu użytkownika"
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl border p-1 pr-2.5 transition-all cursor-pointer select-none",
          isOpen
            ? "border-indigo-400/50 bg-indigo-50/70 ring-2 ring-indigo-500/15"
            : "border-slate-200 bg-white hover:bg-slate-50 shadow-xs"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-xs font-display">
          {initial}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
            {displayName}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
            Czytelnik
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all animate-in fade-in-0 zoom-in-95">
          {/* User info banner */}
          <div className="flex items-center gap-3 p-2.5 border-b border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-xs">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {email}
              </p>
            </div>
          </div>

          <div className="py-1 space-y-0.5">
            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Wyloguj się</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
