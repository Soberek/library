import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import type { Book } from '../../../types/Book';
import { Button } from '../../ui/button';

interface BookActionsProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
}

export const BookActions: React.FC<BookActionsProps> = ({
  book,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(book.id)}
        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4 mr-1.5" />
        Usuń
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => onEdit(book.id)}
        className="flex-1"
      >
        <Edit3 className="w-4 h-4 mr-1.5" />
        Edytuj
      </Button>
    </div>
  );
};

export default BookActions;
