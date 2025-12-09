import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import type { Book, BookStatus } from "../../types/Book";
import { BOOK_STATUSES } from "../../constants/bookStatus";
import BookCard from "./GridView/BookCard";

interface BookListProps {
  loading: boolean;
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleBookUpdate: (bookId: string, updatedBook: Partial<Book>) => void;
  handleBookDelete: (bookId: string) => void;
  handleBookModalOpen: (params: {
    mode: "add" | "edit";
    bookId: string | null;
  }) => void;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
}

export default function BookList({
  loading,
  books,
  handleStatusChange,
  handleBookUpdate,
  handleBookDelete,
  handleBookModalOpen,
  handleToggleFavorite,
}: BookListProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = (book: Book) => {
    if (navigator.share) {
      navigator
        .share({
          title: book.title,
          text: `Sprawdź tę książkę: ${book.title} by ${book.author}`,
        })
        .catch(() => {});
    }
  };

  const handleDelete = (bookId: string) => {
    handleBookDelete(bookId);
    setOpenMenu(null);
  };

  const handleRatingChange = (bookId: string, newRating: number) => {
    handleBookUpdate(bookId, { rating: newRating });
  };

  const handleEdit = (bookId: string) => {
    handleBookModalOpen({ mode: "edit", bookId });
    setOpenMenu(null);
  };

  const handleMenuToggle = (bookId: string) => {
    setOpenMenu(bookId || null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-16">
        <div className="animate-in fade-in flex flex-col items-center gap-6 duration-700">
          <div className="relative">
            <div className="h-18 w-18 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <BookOpen className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-indigo-600 opacity-60" />
          </div>
          <h3 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
            Ładowanie książek...
          </h3>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-16">
        <div className="animate-in fade-in flex flex-col items-center gap-6 duration-700">
          <div className="animate-float relative flex h-36 w-36 items-center justify-center rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-12">
            <div className="absolute inset-[-8px] -z-10 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 blur-xl" />
            <BookOpen className="h-16 w-16 text-white" />
          </div>
          <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-center text-4xl font-bold text-transparent">
            Brak książek w bibliotece
          </h2>
          <p className="max-w-md text-center text-lg leading-relaxed text-slate-600">
            Dodaj swoją pierwszą książkę, aby rozpocząć śledzenie swoich lektur
            i budować cyfrową bibliotekę
          </p>
        </div>
      </div>
    );
  }

  const sortedBooks = [...books].sort((a, b) => {
    // Primary: status priority based on BOOK_STATUSES ordering
    const aStatus = BOOK_STATUSES.indexOf(a.read as BookStatus);
    const bStatus = BOOK_STATUSES.indexOf(b.read as BookStatus);
    if (aStatus !== bStatus) return aStatus - bStatus;

    // Secondary: newest first
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="mb-16 grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {sortedBooks.map((book) => {

        const isFavorite = book.isFavorite ?? false;

        return (
          <BookCard
            key={book.id}
            book={book}
            onToggleFavorite={() => handleToggleFavorite(book.id, isFavorite)}
            onShare={handleShare}
            onStatusChange={handleStatusChange}
            onRatingChange={handleRatingChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      })}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
