import { Trash2, Edit, Star } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';

interface BookActionsProps {
  book: Book;
  openMenu: string | null;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onMenuToggle: (bookId: string) => void;
  onStatusChange: (bookId: string, currentStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite?: (bookId: string) => void;
}

export default function BookActions({
  book,
  onEdit,
  onDelete,
  onToggleFavorite
}: BookActionsProps) {
  const isFavorite = book.isFavorite ?? false;

  return (
    <div className="flex gap-2 mt-auto">
      <button
        onClick={() => onDelete(book.id)}
        className="flex-1 px-3 py-2 border-2 border-red-500 text-red-600 rounded-xl text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-200 transition-all duration-200 flex items-center justify-center gap-1"
      >
        <Trash2 className="w-4 h-4" />
        Usuń
      </button>
      <button
        onClick={() => onEdit(book.id)}
        className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300 transition-all duration-200 flex items-center justify-center gap-1"
      >
        <Edit className="w-4 h-4" />
        Edytuj
      </button>


    </div>
  );
}
