import React, { useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Heart,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useUIStore, useFilterStore, toast } from '../../stores';
import MagdaIcon from '../ui/MagdaIcon';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: React.ReactNode;
  collapsed: boolean;
  accentColor?: 'indigo' | 'amber' | 'emerald' | 'pink';
}

const ACCENT_STYLES = {
  indigo: {
    active: 'bg-indigo-50 text-indigo-900 border-indigo-200/80 shadow-xs font-bold',
    inactive: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
    iconActive: 'text-indigo-600',
    iconInactive: 'text-slate-400 group-hover:text-slate-600',
  },
  amber: {
    active: 'bg-amber-50 text-amber-950 border-amber-200/80 shadow-xs font-bold',
    inactive: 'text-slate-600 hover:bg-amber-50/50 hover:text-amber-900',
    iconActive: 'text-amber-600',
    iconInactive: 'text-slate-400 group-hover:text-amber-600',
  },
  emerald: {
    active: 'bg-emerald-50 text-emerald-950 border-emerald-200/80 shadow-xs font-bold',
    inactive: 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-900',
    iconActive: 'text-emerald-600',
    iconInactive: 'text-slate-400 group-hover:text-emerald-600',
  },
  pink: {
    active: 'bg-pink-50 text-pink-950 border-pink-200/80 shadow-xs font-bold',
    inactive: 'text-slate-600 hover:bg-pink-50/50 hover:text-pink-900',
    iconActive: 'text-pink-600',
    iconInactive: 'text-slate-400 group-hover:text-pink-600',
  },
};

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  badge,
  collapsed,
  accentColor = 'indigo',
}) => {
  const styles = ACCENT_STYLES[accentColor];

  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all select-none border border-transparent',
          isActive ? styles.active : styles.inactive,
          collapsed && 'justify-center px-0 py-2.5',
        )
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={cn(
              'shrink-0 transition-transform duration-200 group-hover:scale-110',
              isActive ? styles.iconActive : styles.iconInactive,
            )}
          >
            {icon}
          </div>

          {!collapsed && (
            <div className="flex flex-1 items-center justify-between min-w-0">
              <span className="truncate">{label}</span>
              {badge && <div className="ml-2 shrink-0">{badge}</div>}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const searchTerm = useFilterStore((state) => state.filters.searchTerm);
  const setFilter = useFilterStore((state) => state.setFilter);

  // Global Keyboard Shortcuts (Cmd/Ctrl + B to toggle sidebar, Cmd/Ctrl + K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      toast.info('Wylogowano pomyślnie.');
      navigate('/sign-in', { replace: true });
    } catch {
      toast.error('Wystąpił błąd podczas wylogowywania.');
    }
  }, [navigate]);

  const email = user?.email || '';
  const initial = email.charAt(0).toUpperCase() || 'U';
  const displayName = email.split('@')[0] || email;

  return (
    <aside
      aria-label="Panel boczny aplikacji"
      className={cn(
        'hidden md:flex flex-col sticky top-0 h-screen border-r border-slate-200/80 bg-white/95 backdrop-blur-xl z-40 transition-all duration-300 ease-in-out shrink-0 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)] relative',
        collapsed ? 'w-20 min-w-[5rem]' : 'w-64 min-w-[16rem]',
      )}
    >
      {/* Floating Edge Toggle Button on sidebar boundary */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? 'Rozwiń pasek boczny (⌘B)' : 'Zwiń pasek boczny (⌘B)'}
        title={collapsed ? 'Rozwiń pasek boczny (⌘B)' : 'Zwiń pasek boczny (⌘B)'}
        className="absolute -right-3.5 top-5 z-50 flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all cursor-pointer hover:scale-110 active:scale-95"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
        )}
      </button>

      {/* Top Brand Header & Toggle Button */}
      <div className="flex h-16 items-center justify-between px-3.5 border-b border-slate-100">
        {collapsed ? (
          <div className="w-full flex flex-col items-center justify-center gap-1">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Rozwiń pasek boczny (⌘B)"
              title="Rozwiń pasek boczny (⌘B)"
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform cursor-pointer"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 rounded-2xl transition-all cursor-pointer group text-left min-w-0"
              title="MyLibrary"
            >
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-900 font-display leading-none">
                    MyLibrary
                  </span>
                  <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-extrabold text-indigo-700 border border-indigo-200/50">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Biblioteka
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Zwiń pasek boczny (⌘B)"
              title="Zwiń pasek boczny (⌘B)"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Quick Search Shortcut Bar (when expanded) */}
      {!collapsed && location.pathname === '/' && (
        <div className="px-3 pt-3 pb-1">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              id="sidebar-quick-search"
              value={searchTerm}
              onChange={(e) => setFilter('searchTerm', e.target.value)}
              placeholder="Szukaj w bibliotece..."
              className="w-full h-9 pl-9 pr-8 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all font-medium"
            />
            <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white rounded border border-slate-200 pointer-events-none shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
        {/* Section 1: Biblioteka */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Książki
            </p>
          )}

          <NavItem
            to="/"
            icon={<Layers className="w-4 h-4" />}
            label="Moja biblioteka"
            collapsed={collapsed}
            accentColor="indigo"
          />

          <NavItem
            to="/losuj-ksiazke"
            icon={<Sparkles className="w-4 h-4 text-emerald-600" />}
            label="Losuj książkę"
            badge={
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                AI
              </span>
            }
            collapsed={collapsed}
            accentColor="emerald"
          />
        </div>

        {/* Section 2: Rozrywka & Magda */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Rozrywka
            </p>
          )}

          <NavItem
            to="/magda-losuje"
            icon={<MagdaIcon size={18} alt="" />}
            label="MAGDA LOSUJE"
            badge={
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                Filmy
              </span>
            }
            collapsed={collapsed}
            accentColor="amber"
          />

          <NavItem
            to="/pozycje-seksualne"
            icon={<Heart className="w-4 h-4 text-pink-600" />}
            label="Pozycje dla par"
            collapsed={collapsed}
            accentColor="pink"
          />
        </div>

        {/* Mini Motivation / Pro Tip Box (Expanded Only) */}
        {!collapsed && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Nawyk czytania</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Codzienne czytanie nawet 15 minut pomaga zredukować stres o 68%!
            </p>
          </div>
        )}
      </div>

      {/* Footer / User Profile & Toggle */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Rozwiń pasek boczny (⌘B)"
              title="Rozwiń pasek boczny (⌘B)"
              className="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title={`Wyloguj (${email})`}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0 font-display">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate font-display">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Wyloguj się"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-medium">
              <span>Skróty: ⌘B / ⌘K</span>
              <span>v2.0</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
