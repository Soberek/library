import React from "react";
import { Award, BookOpen, Heart, BarChart } from "lucide-react";
import type { Book } from "../../types/Book";

interface ReadingHighlightsProps {
  books: Book[];
}

export const ReadingHighlights: React.FC<ReadingHighlightsProps> = ({ books }) => {
  if (!books || books.length === 0) return null;

  // Find top rated book
  const ratedBooks = books.filter((b) => Number(b.rating) > 0);
  const topRatedBook = ratedBooks.length > 0
    ? [...ratedBooks].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))[0]
    : null;

  // Find thickest book
  const booksWithPages = books.filter((b) => Number(b.overallPages) > 0);
  const thickestBook = booksWithPages.length > 0
    ? [...booksWithPages].sort((a, b) => (Number(b.overallPages) || 0) - (Number(a.overallPages) || 0))[0]
    : null;

  // Favorite books
  const favoriteBooksCount = books.filter((b) => b.isFavorite).length;

  // Average pages
  const totalPages = books.reduce((sum, b) => sum + (Number(b.overallPages) || 0), 0);
  const avgPages = books.length > 0 ? Math.round(totalPages / books.length) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Top Rated Highlight */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-amber-700 mb-2">
          <Award className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Najwyżej oceniona
          </span>
        </div>
        {topRatedBook ? (
          <div>
            <p className="text-sm font-black text-slate-900 truncate" title={topRatedBook.title}>
              {topRatedBook.title}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
              {topRatedBook.author} · <span className="font-extrabold text-amber-600">★ {topRatedBook.rating}/10</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Brak ocenionych pozycji</p>
        )}
      </div>

      {/* Thickest Book Highlight */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-700 mb-2">
          <BookOpen className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Najobszerniejsza
          </span>
        </div>
        {thickestBook ? (
          <div>
            <p className="text-sm font-black text-slate-900 truncate" title={thickestBook.title}>
              {thickestBook.title}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
              {thickestBook.author} · <span className="font-extrabold text-indigo-600">{thickestBook.overallPages} stron</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Brak danych o stronach</p>
        )}
      </div>

      {/* Favorites Count */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-rose-700 mb-2">
          <Heart className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Ulubione książki
          </span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {favoriteBooksCount}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {favoriteBooksCount === 1 ? "pozycja oznaczona serduszkiem" : "pozycji oznaczonych serduszkiem"}
          </p>
        </div>
      </div>

      {/* Average Book Length */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/80 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-700 mb-2">
          <BarChart className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Średnia objętość
          </span>
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {avgPages} <span className="text-xs font-semibold text-slate-500">str.</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Średnia liczba stron na książkę
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadingHighlights;
