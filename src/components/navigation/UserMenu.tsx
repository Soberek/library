import React, { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, User, ShieldCheck } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { toast } from "../../stores";
import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../ui";

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
      toast.info("Wylogowano z konta.");
      navigate("/sign-in", { replace: true });
    } catch {
      toast.error("Błąd podczas wylogowywania.");
    }
  };

  if (!authContext.user) {
    return (
      <RouterLink
        to="/sign-in"
        className={cn(buttonVariants({ variant: "primary", size: "sm" }), "rounded-xl shadow-sm")}
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
          "inline-flex items-center gap-2 rounded-2xl border p-1 pr-3 transition-all cursor-pointer select-none",
          isOpen
            ? "border-indigo-400 bg-indigo-50/80 ring-3 ring-indigo-500/15 shadow-xs"
            : "border-slate-200/80 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-xs font-display">
          {initial}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
            Czytelnik
          </span>
        </div>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-indigo-600"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95">
          {/* User info banner */}
          <div className="flex items-center gap-3 p-2.5 border-b border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-xs font-display">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate font-display">
                {displayName}
              </p>
              <p className="text-xs text-slate-500 truncate font-medium">
                {email}
              </p>
            </div>
          </div>

          <div className="py-1.5 space-y-1">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Konto aktywne (Chmura)</span>
            </div>

            {/* Logout */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4 shrink-0 text-rose-600" />}
              className="justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              Wyloguj się
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
