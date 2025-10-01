import { Trash2, Edit, MoreVertical, Bookmark, Share2 } from 'lucide-react';
import type { Book, BookStatus } from '../../types/Book';

interface BookActionsProps {
  book: Book;
  openMenu: string | null;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onMenuToggle: (bookId: string) => void;
  onStatusChange: (bookId: string, currentStatus: BookStatus) => void;
  onShare: (book: Book) => void;
}

export default function BookActions({
  book,
  openMenu,
  onEdit,
  onDelete,
  onMenuToggle,
  onStatusChange,
  onShare,
}: BookActionsProps) {
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
      <div className="relative">
        <button
          onClick={() => onMenuToggle(openMenu === book.id ? '' : book.id)}
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
                onStatusChange(book.id, book.read);
                onMenuToggle('');
              }}
              className="w-full px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors"
            >
              <Bookmark className="w-4 h-4 text-indigo-600" />
              Zmień status
            </button>
            <button
              onClick={() => {
                onShare(book);
                onMenuToggle('');
              }}
              className="w-full px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 text-sm font-semibold text-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              Udostępnij
            </button>
            <div className="h-px bg-slate-200 my-1" />
            <button
              onClick={() => onDelete(book.id)}
              className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm font-semibold text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Usuń książkę
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
