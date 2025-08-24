import { useEffect, useMemo, useState } from "react";
import BookForm from "../components/AddBookForm/BookForm";
import BookList from "../components/BookList";
import { useBooks } from "../hooks/useBooks";
import { useSearch } from "../hooks/useSearch";
import BottomNav from "../components/BottomNav";

const Books = () => {
  const {
    books,
    loading,
    handleBookDelete,
    handleBookUpdate,
    handleStatusChange,
    handleBookSubmit,
  } = useBooks();

  const [isEditing, setIsEditing] = useState<{
    status: boolean;
    mode: "add" | "edit";
    bookId: string | null;
  }>({
    status: false,
    mode: "add",
    bookId: null,
  });

  const searchContext = useSearch();

  useEffect(() => {
    if (isEditing.status) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup: restores scroll when the component is removed from the DOM
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditing.status]);

  // Filter books based on searchTerm
  const filteredBooks = useMemo(() => {
    if (searchContext?.searchTerm) {
      return books.filter((book) =>
        book.title
          .toLowerCase()
          .includes(searchContext.searchTerm.toLowerCase()),
      );
    }
    return books;
  }, [books, searchContext?.searchTerm]);

  const handleBookModalOpen = ({
    bookId,
    mode,
  }: {
    bookId: string | null;
    mode: "add" | "edit";
  }) => {
    if (mode === "edit") {
      console.log("Opening edit modal for book:", bookId);

      setIsEditing({
        mode: mode,
        status: true,
        bookId: bookId,
      });
    } else {
      console.log("Opening add modal");
      setIsEditing({
        mode: mode,
        status: true,
        bookId: null,
      });
    }
  };

  const handleBookModalClose = () => {
    console.log("Closing modal for book:");
    setIsEditing((prev) => ({ ...prev, status: false }));
  };

  console.log("Current editing state:", isEditing);

  return (
    <div className="flex flex-col rounded-lg bg-white">
      {/* Add a button to toggle the form visibility */}
      <button
        className="m-4 hidden cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none md:flex"
        onClick={() => handleBookModalOpen({ mode: "add", bookId: null })}
      >
        {!isEditing.status && isEditing.mode === "add"
          ? "Ukryj formularz"
          : "Dodaj książkę"}
      </button>

      {/* Add a book form */}
      {isEditing.status && isEditing.mode === "add" && (
        <BookForm
          mode="add"
          handleBookSubmit={handleBookSubmit}
          handleBookModalOpen={handleBookModalOpen}
          handleBookModalClose={handleBookModalClose}
          isFormVisible={isEditing.status}
        />
      )}

      {/* Edit Book Form */}
      {isEditing.status && isEditing.bookId && isEditing.mode === "edit" && (
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

      <BookList
        loading={loading}
        books={filteredBooks}
        handleStatusChange={handleStatusChange}
        handleBookUpdate={handleBookUpdate}
        handleBookDelete={handleBookDelete}
        handleBookModalOpen={handleBookModalOpen}
        handleBookModalClose={handleBookModalClose}
      />

      {/* Fixed add book button */}
      <BottomNav handleBookModalOpen={handleBookModalOpen} />
    </div>
  );
};

export default Books;
