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
      // Focus search on '/' when not in input/textarea
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
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
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/90 pl-10 pr-10 text-sm text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-indigo-500/15"
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
            <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded">
              /
            </kbd>
          </div>
        )
      )}
    </div>
  );
};

export default SearchBar;
