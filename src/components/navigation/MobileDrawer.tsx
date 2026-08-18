import React, { useEffect } from "react";
import { Home, Sparkles, Heart, LogOut, X, BookOpen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import MagdaIcon from "../ui/MagdaIcon";
import { cn } from "../../lib/utils";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      navigate("/sign-in", { replace: true });
    } catch (_error) {
      // Ignore sign-out errors
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Drawer surface */}
      <div className="relative z-50 w-72 max-w-[80vw] h-full bg-white border-r border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-left duration-250">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                MyLibrary
              </h2>
              {user?.email && (
                <p className="text-xs text-slate-500 truncate max-w-[150px]">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij menu"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              location.pathname === "/"
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            <Home className="w-4 h-4 shrink-0 text-indigo-600" />
            <span>Moja biblioteka</span>
          </Link>

          <Link
            to="/magda-losuje"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              location.pathname === "/magda-losuje"
                ? "bg-amber-100 text-amber-900 font-bold"
                : "text-slate-700 hover:bg-amber-50 hover:text-amber-800"
            )}
          >
            <MagdaIcon size={20} alt="" />
            <span>MAGDA LOSUJE</span>
          </Link>

          <Link
            to="/losuj-ksiazke"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              location.pathname === "/losuj-ksiazke"
                ? "bg-emerald-100 text-emerald-900 font-bold"
                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
            )}
          >
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Losuj książkę</span>
          </Link>

          <Link
            to="/pozycje-seksualne"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              location.pathname === "/pozycje-seksualne"
                ? "bg-pink-100 text-pink-900 font-bold"
                : "text-slate-700 hover:bg-pink-50 hover:text-pink-800"
            )}
          >
            <Heart className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Pozycje</span>
          </Link>
        </div>

        {/* Footer actions */}
        {user && (
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Wyloguj się</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDrawer;
