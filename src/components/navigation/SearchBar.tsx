import React, { useRef, useEffect } from "react";
import { useFilterStore } from "../../stores";
import { SearchInput } from "../ui";
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
      <SearchInput
        ref={inputRef}
        id="global-search-input"
        value={searchTerm}
        onChange={(e) => setFilter("searchTerm", e.target.value)}
        onClear={clearSearch}
        placeholder={placeholder}
        aria-label="Szukaj książek"
        shortcutBadge={!isMobile && !searchTerm ? "⌘K" : undefined}
        inputSize="default"
        inputVariant="filled"
        className="rounded-2xl"
      />
    </div>
  );
};

export default SearchBar;
