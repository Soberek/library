import React from 'react';
import { BookForm } from '.';
import type { Book, BookFormData } from '../../types/Book';

interface BookFormsProps {
  isEditing: {
    status: boolean;
    mode: 'add' | 'edit';
    bookId: string | null;
  };
  books: Book[];
  handleBookSubmit: (book: BookFormData) => void;
  handleBookUpdate: (bookId: string, updatedData: Partial<Book>) => void;
  handleBookModalOpen: (params: { mode: 'add' | 'edit'; bookId: string | null }) => void;
  handleBookModalClose: () => void;
}

const BookForms: React.FC<BookFormsProps> = ({
  isEditing,
  books,
  handleBookSubmit,
  handleBookUpdate,
  handleBookModalOpen,
  handleBookModalClose,
}) => {
  return (
    <>
      {/* Add Book Form */}
      {isEditing.status && isEditing.mode === 'add' && (
        <BookForm
          mode="add"
          handleBookSubmit={handleBookSubmit}
          handleBookModalOpen={handleBookModalOpen}
          handleBookModalClose={handleBookModalClose}
          isFormVisible={isEditing.status}
        />
      )}

      {/* Edit Book Form */}
      {isEditing.status && isEditing.bookId && isEditing.mode === 'edit' && (
        <BookForm
          mode="edit"
          bookToEdit={
            books.find((book) => book.id === isEditing.bookId) || null
          }
          handleBookSubmit={handleBookSubmit}
          handleBookUpdate={handleBookUpdate}
          handleBookModalOpen={handleBookModalOpen}
          handleBookModalClose={handleBookModalClose}
          isFormVisible={isEditing.status}
        />
      )}
    </>
  );
};

export default BookForms;
