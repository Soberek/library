import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit, Bookmark, Share2, MoreVertical, BookOpen } from 'lucide-react';
import type { Book, BookStatus } from '../types/Book';

const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  Przeczytana: 'Przeczytana',
  'W trakcie': 'W trakcie',
  Porzucona: 'Porzucona',
};

const statusColors: Record<BookStatus, string> = {
  Przeczytana: 'bg-green-500 text-white',
  'W trakcie': 'bg-amber-500 text-white',
  Porzucona: 'bg-red-500 text-white',
};

const statusGradients: Record<BookStatus, string> = {
  Przeczytana: 'from-green-500 to-emerald-600',
  'W trakcie': 'from-amber-500 to-orange-600',
  Porzucona: 'from-red-500 to-rose-600',
};

interface BookListProps {
  loading: boolean;
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleBookUpdate: (bookId: string, updatedBook: Partial<Book>) => void;
  handleBookDelete: (bookId: string) => void;
  handleBookModalOpen: (params: { mode: 'add' | 'edit'; bookId: string | null }) => void;
  handleBookModalClose: () => void;
}

export default function BookList({
  loading,
  books,
  handleStatusChange,
  handleBookUpdate,
  handleBookDelete,
  handleBookModalOpen,
  handleBookModalClose,
}: BookListProps) {
  const [favoriteBooks, setFavoriteBooks] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFavorite = (bookId: string) => {
    setFavoriteBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  };

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

  const sortedBooks = [...books].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 p-4 mb-16">
      {sortedBooks.map((book, index) => {
        const progress = Math.min(((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100, 100);
        const isHovered = hoveredCard === book.id;
        const isFavorite = favoriteBooks.has(book.id);

        return (
          <div
            key={book.id}
            className={`transition-all duration-500 ${mounted ? 'animate-in zoom-in' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 80}ms` }}
            onMouseEnter={() => setHoveredCard(book.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`h-full flex flex-col rounded-2xl bg-gradient-to-br from-white to-slate-50 border transition-all duration-400 overflow-hidden relative ${
                isHovered
                  ? 'shadow-[0_20px_40px_rgba(99,102,241,0.15)] border-indigo-200 -translate-y-2 scale-[1.02]'
                  : 'shadow-lg border-slate-200'
              }`}
            >
              {/* Status Top Border */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusGradients[book.read]} transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Book Cover Section */}
              <div className="relative p-4">
                {book.cover ? (
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 transition-opacity duration-300 ${
                        isHovered ? 'opacity-60' : 'opacity-0'
                      }`}
                    />
                    <img
                      src={book.cover}
                      alt={`${book.title} cover`}
                      className={`w-full h-56 object-cover transition-transform duration-400 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                  </div>
                ) : (
                  <div className="relative h-56 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transition-transform duration-600 ${
                        isHovered ? 'translate-x-full' : '-translate-x-full'
                      }`}
                    />
                    <div className="flex flex-col items-center z-10">
                      <BookOpen className="w-12 h-12 text-white opacity-90 mb-2" />
                      <span className="text-white font-bold text-sm tracking-wide">Brak okładki</span>
                    </div>
                  </div>
                )}

                {/* Floating Action Buttons */}
                <div
                  className={`absolute top-6 right-6 flex flex-col gap-2 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`}
                >
                  <button
                    onClick={() => toggleFavorite(book.id)}
                    className="w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-12"
                    title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
                    />
                  </button>
                  <button
                    onClick={() => handleShare(book)}
                    className="w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    title="Udostępnij"
                  >
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Status Badge */}
                <div
                  className={`absolute top-6 left-6 ${statusColors[book.read]} px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-white/20 backdrop-blur-sm`}
                >
                  {BOOK_STATUS_LABELS[book.read]}
                </div>

                {/* Favorite Badge */}
                {isFavorite && (
                  <div className="absolute bottom-4 left-6 bg-red-500/95 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-lg shadow-red-500/40">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    Ulubione
                  </div>
                )}
              </div>

              {/* Book Content */}
              <div className="flex-1 p-5 pt-3 flex flex-col">
                {/* Title and Author */}
                <div className="mb-4">
                  <h3
                    className="text-base font-bold text-slate-900 leading-snug mb-1 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
                    title={book.title}
              >
                {book.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">{book.author}</p>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Postęp</span>
                    <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg">
                      <span className="text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {book.readPages}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">/</span>
                      <span className="text-xs font-bold text-slate-600">{book.overallPages}</span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ${
                        isHovered ? 'shadow-[0_0_12px_rgba(99,102,241,0.6)]' : ''
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-3 border-indigo-600 rounded-full shadow-md shadow-indigo-400 transition-all duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 font-semibold mt-1 block">
                    {Math.round(progress)}% ukończone
                  </span>
                </div>

                {/* Rating Section */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Ocena</span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-extrabold text-amber-600">{book.rating}/10</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const filled = i < Math.floor(book.rating);
                      const half = i === Math.floor(book.rating) && book.rating % 1 >= 0.5;
                      return (
                        <button
                          key={i}
                          onClick={() => handleRatingChange(book.id, i + 1)}
                          className="hover:scale-125 transition-transform duration-200"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              filled || half ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="flex-1 px-3 py-2 border-2 border-red-500 text-red-600 rounded-xl text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-200 transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Usuń
                  </button>
                  <button
                    onClick={() => handleEdit(book.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edytuj
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === book.id ? null : book.id)}
                      className={`w-10 h-10 border-2 border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 flex items-center justify-center transition-all duration-200 ${
                        openMenu === book.id ? 'rotate-90 bg-indigo-50 border-indigo-500' : ''
                      }`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {/* Context Menu */}
                    {openMenu === book.id && (
                      <div className="absolute right-0 top-12 w-44 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => {
                            const statuses: BookStatus[] = ['W trakcie', 'Przeczytana', 'Porzucona'];
                            const currentIndex = statuses.indexOf(book.read);
                            const nextIndex = (currentIndex + 1) % statuses.length;
                            handleStatusChange(book.id, statuses[nextIndex]);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-indigo-600" />
                          Zmień status
                        </button>
                        <button
                          onClick={() => {
                            handleShare(book);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-indigo-600" />
                          Udostępnij
                        </button>
                        <div className="h-px bg-slate-200 my-1" />
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm font-semibold text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Usuń książkę
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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