import React from 'react';
import { Star } from 'lucide-react';
import type { Book } from '../../../types/Book';
import { Progress } from '../../ui/progress';
import { Rating } from '../../ui/rating';

interface BookProgressProps {
  book: Book;
  isHovered?: boolean;
  onRatingChange: (bookId: string, newRating: number) => void;
}

export const BookProgress: React.FC<BookProgressProps> = ({
  book,
  onRatingChange,
}) => {
  const progress = Math.min(((book.readPages ?? 0) / (book.overallPages || 1)) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Progress Section */}
      <div>
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">Postęp</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-bold">
            {book.readPages} / {book.overallPages} ({Math.round(progress)}%)
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Rating Section */}
      <div>
        <div className="flex justify-between items-center mb-1.5 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400">Ocena</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {book.rating}/10
          </span>
        </div>
        <div className="flex justify-center">
          <Rating
            value={book.rating / 2}
            onChange={(_, val) => {
              if (val !== null) {
                onRatingChange(book.id, val * 2);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookProgress;
