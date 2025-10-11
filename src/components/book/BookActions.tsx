import { Trash2, Edit, Star } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';

interface BookActionsProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onMenuToggle: (bookId: string) => void;
  onStatusChange: (bookId: string, currentStatus: BookStatus) => void;
  onShare?: (book: Book) => void;
  onToggleFavorite?: (bookId: string, currentFavorite: boolean) => void;
}

export default function BookActions({
  book,
  onEdit,
  onDelete,
  onToggleFavorite,
}: BookActionsProps) {
  const isFavorite = book.isFavorite;

  return (
    <div className="flex gap-2 mt-auto">
      {onToggleFavorite && (
        <button
          onClick={() => {
            onToggleFavorite(book.id, book.isFavorite!);
          }}
          className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1 ${ 
            isFavorite
              ? 'bg-gradient-to-r from-amber-400 to-yellow-600 text-white hover:shadow-amber-200'
              : 'border-2 border-amber-400 text-amber-500 hover:shadow-amber-100'
          }`}
          title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-100' : ''}`}/>
          {isFavorite ? 'Ulubione' : 'Ulubione'}
        </button>
      )}
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
