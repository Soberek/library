import { Star } from 'lucide-react';
import type { Book } from '../../types/Book';

interface BookProgressProps {
  book: Book;
  isHovered: boolean;
  onRatingChange: (bookId: string, newRating: number) => void;
}

export default function BookProgress({ book, isHovered, onRatingChange }: BookProgressProps) {
  const progress = Math.min(((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100, 100);

  return (
    <>
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
                onClick={() => onRatingChange(book.id, i + 1)}
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
    </>
  );
}
