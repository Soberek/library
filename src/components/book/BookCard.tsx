import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookActions } from './';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';

interface BookCardProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
}

const statusGradients: Record<BookStatus, string> = {
  'Chcę przeczytać': 'from-blue-400 to-indigo-500',
  'W trakcie': 'from-yellow-400 to-orange-500',
  'Przeczytana': 'from-green-400 to-emerald-500',
  'Porzucona': 'from-red-400 to-rose-500',
};

const BookCard: React.FC<BookCardProps> = ({ 
  book, onEdit, onDelete, onStatusChange, onShare, onToggleFavorite, 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFavorite = book.isFavorite;

  return (
    <div
      className={`h-full flex flex-col rounded-2xl transition-all duration-400 overflow-hidden relative 
        ${isFavorite 
          ? `bg-gradient-to-br from-amber-50 to-white border-2 ${isHovered ? 'border-amber-300 shadow-[0_20px_40px_rgba(251,191,36,0.3)] -translate-y-2 scale-[1.02]' : 'border-amber-200 shadow-lg shadow-amber-100/50'}` 
          : `bg-gradient-to-br from-white to-slate-50 border ${isHovered ? 'shadow-[0_20px_40px_rgba(99,102,241,0.15)] border-indigo-200 -translate-y-2 scale-[1.02]' : 'shadow-lg border-slate-200'}`
        } 
        ${isFavorite ? 'animate-golden-pulse' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // onClick={() => console.log('BookCard clicked')}
    >
      {/* Status Top Border */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
          ${isFavorite
            ? 'from-amber-400 to-yellow-600'
            : statusGradients[book.read]}
          transition-opacity duration-300 
          ${isHovered || isFavorite ? 'opacity-100' : 'opacity-0'}
          ${isFavorite ? 'animate-shimmer' : ''}`}
      />

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="absolute top-6 right-6 flex flex-col gap-2 transition-all duration-300 z-50"
        style={{ zIndex: 999, pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        <button
          onClick={() => {
            onToggleFavorite(book.id);
          }}
          className="w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-12 z-50"
          title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          style={{ zIndex: 999 }}
        >
          <Star
            className={`w-5 h-5 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-600'}`}
          />
        </button>
        {onShare && (
          <button
            onClick={() => onShare(book)}
            className="w-9 h-9 rounded-lg bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-12"
            title="Udostępnij książkę"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-share-2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
          </button>
        )}
      </motion.div>

      {/* Favorite Badge */}
      {isFavorite && (
        <div className="absolute bottom-4 left-6 bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold shadow-lg shadow-amber-500/40">
          <Star className="w-4 h-4 fill-yellow-100" />
          <span className="font-extrabold text-white">Ulubione</span>
        </div>
      )}

      {/* Book Cover */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={book.cover || 'https://via.placeholder.com/150'}
          alt={book.title}
          className="w-full h-full object-cover rounded-t-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-3 left-3 text-white text-sm font-semibold pr-2 py-1 rounded-md">
          {book.readPages} / {book.overallPages} stron
        </span>
      </div>

      {/* Book Details */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
          <Link to={`/books/${book.id}`} className="hover:text-indigo-600 transition-colors duration-200">
            {book.title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 mb-3">{book.author}</p>

        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(book.rating / 2) ? 'fill-amber-500' : ''}`}
              />
            ))}
            {book.rating ? book.rating.toFixed(1) : 'N/A'}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{book.genre}</span>
          <span className="text-gray-400">•</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold 
              ${book.read === 'Chcę przeczytać' ? 'bg-blue-100 text-blue-800'
              : book.read === 'W trakcie' ? 'bg-yellow-100 text-yellow-800'
              : book.read === 'Przeczytana' ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'}`}
          >
            {book.read}
          </span>
        </div>

        <div className="mt-auto">
          <BookActions
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onShare={onShare}
            onMenuToggle={() => {}} // Dummy function
            onToggleFavorite={onToggleFavorite} // Pass the prop here
          />
        </div>
      </div>
    </div>
  );
};

export default BookCard;
