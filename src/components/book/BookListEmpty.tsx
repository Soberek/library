import React from "react";
import { BookOpen, Plus, FilterX } from "lucide-react";
import { Button } from "../ui/button";

interface BookListEmptyProps {
  hasFilters: boolean;
  onAddBook: () => void;
  onClearFilters: () => void;
}

export const BookListEmpty: React.FC<BookListEmptyProps> = ({
  hasFilters,
  onAddBook,
  onClearFilters,
}) => {
  return (
    <div className="py-16 sm:py-20 px-4 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/70 backdrop-blur-xs">
      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs">
        <BookOpen className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-1 font-display">
        {hasFilters ? "Brak wyników wyszukiwania" : "Twoja biblioteka jest pusta"}
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
        {hasFilters
          ? "Żadna książka nie pasuje do wybranych filtrów. Spróbuj zresetować filtry lub zmień kryteria."
          : "Nie dodałeś jeszcze żadnych książek. Zacznij budować swoją kolekcję już teraz!"}
      </p>

      {hasFilters ? (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="gap-2 shadow-xs"
        >
          <FilterX className="w-4 h-4" />
          <span>Wyczyść filtry</span>
        </Button>
      ) : (
        <Button onClick={onAddBook} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Dodaj pierwszą książkę</span>
        </Button>
      )}
    </div>
  );
};

export default BookListEmpty;
