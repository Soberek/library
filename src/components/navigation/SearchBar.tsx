import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useFilterStore } from "../../stores";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  variant = "desktop",
  placeholder = "Szukaj książek (tytuł, autor)...",
  className,
}) => {
  const searchTerm = useFilterStore((state) => state.filters.searchTerm);
  const setFilter = useFilterStore((state) => state.setFilter);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = variant === "mobile";

  const clearSearch = () => {
    setFilter("searchTerm", "");
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' or 'Cmd/Ctrl + K' when not in another input
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (
        (e.key === "/" && !isInput) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className={cn("relative w-full", !isMobile && "max-w-md", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        ref={inputRef}
        id="global-search-input"
        type="text"
        value={searchTerm}
        onChange={(e) => setFilter("searchTerm", e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && searchTerm) {
            e.preventDefault();
            clearSearch();
          }
        }}
        placeholder={placeholder}
        aria-label="Szukaj książek"
        className="h-10 sm:h-11 w-full rounded-2xl border border-slate-200/80 bg-slate-50/90 pl-10 pr-12 text-xs sm:text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 hover:bg-white hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/15"
      />
      {searchTerm ? (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Wyczyść wyszukiwanie"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        !isMobile && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
              ⌘K
            </kbd>
          </div>
        )
      )}
    </div>
  );
};

export default SearchBar;
