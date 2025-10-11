import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';
import { BOOK_STATUSES } from '../../constants/bookStatus';
import BookCard from './BookCard';

interface BookListProps {
  loading: boolean;
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleBookUpdate: (bookId: string, updatedBook: Partial<Book>) => void;
  handleBookDelete: (bookId: string) => void;
  handleBookModalOpen: (params: { mode: 'add' | 'edit'; bookId: string | null }) => void;
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
      navigator.share({
        title: book.title,
        text: `Sprawdź tę książkę: ${book.title} by ${book.author}`,
      }).catch(() => {});
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
    handleBookModalOpen({ mode: 'edit', bookId });
    setOpenMenu(null);
  };

  const handleMenuToggle = (bookId: string) => {
    setOpenMenu(bookId || null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-16">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <div className="relative">
            <div className="w-18 h-18 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 opacity-60" />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Ładowanie książek...
          </h3>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center py-16">
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-700">
          <div className="relative w-36 h-36 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-12 flex items-center justify-center animate-float">
            <div className="absolute inset-[-8px] rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50 blur-xl -z-10" />
            <BookOpen className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Brak książek w bibliotece
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-md leading-relaxed">
            Dodaj swoją pierwszą książkę, aby rozpocząć śledzenie swoich lektur i budować cyfrową bibliotekę
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 p-4 mb-16">
      {books.map((book, index) => {
        const isHovered = hoveredCard === book.id;
        const isFavorite = book.isFavorite ?? false;

        return (
          <BookCard
            key={book.id}
            book={book}
            index={index}
            mounted={mounted}
            isHovered={isHovered}
            isFavorite={isFavorite}
            openMenu={openMenu}
            onMouseEnter={() => setHoveredCard(book.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onToggleFavorite={() => handleToggleFavorite(book.id, isFavorite)}
            onShare={handleShare}
            onStatusChange={handleStatusChange}
            onRatingChange={handleRatingChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onMenuToggle={handleMenuToggle}
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
