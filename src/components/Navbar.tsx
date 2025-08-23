import { useUser } from "../providers/UserContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { TextField } from "@mui/material";
import { useSearch } from "../providers/SearchProvider";
type Props = {};

const Navbar: React.FC<Props> = () => {
  const authContext = useUser();
  const searchContext = useSearch();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in", { replace: true }); // Przekierowanie po wylogowaniu
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  return (
    <nav className="hidden w-full border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-4 shadow-xl md:flex">
      <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
          <span className="text-lg font-bold text-white">📚</span>
        </div>
        <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-sm">
          Library App
        </h1>
      </div>
      <div className="mx-8 w-72">
        <TextField
          value={searchContext?.searchTerm}
          onChange={(e) => searchContext?.setSearchTerm(e.target.value)}
          placeholder="Szukaj książek..."
          variant="outlined"
          size="small"
          fullWidth
        />
      </div>
      <div className="flex items-center space-x-3 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
        {authContext.user ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white shadow-sm">
                <span className="font-semibold">
                  {authContext.user.email?.charAt(0).toUpperCase() ?? "U"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="max-w-[200px] truncate text-sm font-medium text-white">
                  {authContext.user.email}
                </span>
                <span className="hidden text-xs text-white/70 sm:block">
                  Witaj!
                </span>
              </div>
            </div>

            <button
              onClick={() => handleLogout()}
              className="ml-3 rounded-md bg-white/20 px-3 py-1 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/30 active:scale-95"
              aria-label="Wyloguj"
            >
              Wyloguj
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="rounded-md bg-indigo-500/60 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-105 hover:bg-indigo-500/80 active:scale-95"
          >
            Zaloguj
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
