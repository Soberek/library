import { Star, Bookmark, Share2, BookOpen } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';
import BookProgress from './BookProgress';
import BookActions from './BookActions';

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

interface BookCardProps {
  book: Book;
  index: number;
  mounted: boolean;
  isHovered: boolean;
  isFavorite: boolean;
  openMenu: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleFavorite: (bookId: string) => void;
  onShare: (book: Book) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onRatingChange: (bookId: string, newRating: number) => void;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onMenuToggle: (bookId: string) => void;
}

export default function BookCard({
  book,
  index,
  mounted,
  isHovered,
  isFavorite,
  openMenu,
  onMouseEnter,
  onMouseLeave,
  onToggleFavorite,
  onShare,
  onStatusChange,
  onRatingChange,
  onEdit,
  onDelete,
  onMenuToggle,
}: BookCardProps) {
  return (
    <div
      className={`transition-all duration-500 ${mounted ? 'animate-in zoom-in' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
                className={`w-full h-56 object-contain bg-white transition-transform duration-400 ${
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
              onClick={() => onToggleFavorite(book.id)}
              className="w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-12"
              title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
            >
              <Bookmark
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
              />
            </button>
            <button
              onClick={() => onShare(book)}
              className="w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
              title="Udostępnij"
            >
              <Share2 className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Status Badge */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Status chip clicked:', book.id, 'Current status:', book.read);
              onStatusChange(book.id, book.read);
            }}
            onMouseEnter={() => console.log('Status chip hovered:', book.id)}
            onMouseLeave={() => console.log('Status chip mouse left:', book.id)}
            className={`absolute top-6 left-6 ${statusColors[book.read]} px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-200 cursor-pointer z-50`}
            style={{ zIndex: 999 }}
            title="Kliknij, aby zmienić status"
          >
            {BOOK_STATUS_LABELS[book.read]}
          </button>

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
          <BookProgress
            book={book}
            isHovered={isHovered}
            onRatingChange={onRatingChange}
          />

          {/* Action Buttons */}
          <BookActions
            book={book}
            openMenu={openMenu}
            onEdit={onEdit}
            onDelete={onDelete}
            onMenuToggle={onMenuToggle}
            onStatusChange={onStatusChange}
            onShare={onShare}
          />
        </div>
      </div>
    </div>
  );
}
