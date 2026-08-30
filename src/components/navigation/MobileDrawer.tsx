import React, { useEffect } from "react";
import { Home, Sparkles, Heart, LogOut, X, BookOpen } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { toast } from "../../stores";
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
      toast.info("Wylogowano pomyślnie.");
      onClose();
      navigate("/sign-in", { replace: true });
    } catch {
      toast.error("Błąd podczas wylogowywania.");
    }
  };

  if (!open) return null;

  const email = user?.email || "";
  const initial = email.charAt(0).toUpperCase() || "U";
  const displayName = email.split("@")[0] || email;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Material 3 Bottom Sheet */}
      <div className="relative z-50 w-full max-w-lg bg-[#f3f4fa] rounded-t-[32px] border-t border-[#e2e4ef] shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-250 pb-[max(env(safe-area-inset-bottom),1rem)]">
        {/* M3 Drag handle */}
        <div className="w-10 h-1.5 bg-[#74777f]/40 rounded-full mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#e2e4ef] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 text-sm font-bold font-display">
              {user ? initial : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 font-display">
                {user ? displayName : "MyLibrary"}
              </h2>
              {user?.email ? (
                <p className="text-xs font-medium text-slate-500 truncate max-w-[200px]">
                  {user.email}
                </p>
              ) : (
                <p className="text-xs text-slate-400">Niezalogowany</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij menu"
            className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="overflow-y-auto p-4 space-y-2.5">
          <Link
            to="/"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all bg-white border border-[#e2e4ef] shadow-2xs",
              location.pathname === "/"
                ? "bg-[#dbe1ff] text-[#00174c] border-indigo-300 font-bold"
                : "text-slate-800 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <span>Moja biblioteka</span>
            </div>
          </Link>

          <Link
            to="/magda-losuje"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all bg-white border border-[#e2e4ef] shadow-2xs",
              location.pathname === "/magda-losuje"
                ? "bg-[#ffe088] text-[#3b2800] border-amber-400 font-bold"
                : "text-slate-800 hover:bg-amber-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <MagdaIcon size={18} alt="" />
              </div>
              <span>MAGDA LOSUJE (Filmy)</span>
            </div>
          </Link>

          <Link
            to="/losuj-ksiazke"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all bg-white border border-[#e2e4ef] shadow-2xs",
              location.pathname === "/losuj-ksiazke"
                ? "bg-[#a6f4c5] text-[#00381e] border-emerald-300 font-bold"
                : "text-slate-800 hover:bg-emerald-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Losuj książkę (AI)</span>
            </div>
          </Link>

          <Link
            to="/pozycje-seksualne"
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all bg-white border border-[#e2e4ef] shadow-2xs",
              location.pathname === "/pozycje-seksualne"
                ? "bg-[#ffd9e2] text-[#3e001d] border-pink-300 font-bold"
                : "text-slate-800 hover:bg-pink-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span>Pozycje dla par</span>
            </div>
          </Link>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#e2e4ef]">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Wyloguj się z konta</span>
            </button>
          ) : (
            <Link
              to="/sign-in"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
            >
              <span>Zaloguj się</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
