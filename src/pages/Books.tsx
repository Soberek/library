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

  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleFormVisibility = (visible: boolean) => {
    setIsFormVisible(visible);
  };

  useEffect(() => {
    if (isFormVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup: restores scroll when the component is removed from the DOM
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFormVisible]);

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

  const handleBookUpdateModal = (bookId: string) => {
    setIsFormVisible(true);
    setIsEditing({ mode: "edit", status: true, bookId });
  };

  const handleBookAddModal = () => {
    setIsFormVisible(true);
    setIsEditing({ mode: "add", status: true, bookId: null });
  };

  return (
    <div className="flex flex-col rounded-lg bg-white">
      {/* Add a button to toggle the form visibility */}
      <button
        className="m-4 hidden cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none md:flex"
        onClick={handleBookAddModal}
      >
        {isFormVisible && !isEditing.status && isEditing.mode === "add"
          ? "Ukryj formularz"
          : "Dodaj książkę"}
      </button>

      {/* Add a book form */}
      {isFormVisible && isEditing.status && isEditing.mode === "add" && (
        <BookForm
          mode="add"
          handleFormVisibility={handleFormVisibility}
          handleBookSubmit={handleBookSubmit}
          handleBookAddModal={handleBookAddModal}
          isFormVisible={isFormVisible}
        />
      )}

      {/* Edit Book Form */}
      {isFormVisible &&
        isEditing.status &&
        isEditing.bookId &&
        isEditing.mode === "edit" && (
          <BookForm
            mode="edit"
            bookToEdit={
              books.find((book) => book.id === isEditing.bookId) || null
            }
            handleFormVisibility={handleFormVisibility}
            handleBookSubmit={handleBookSubmit}
            handleBookUpdate={handleBookUpdate}
            isFormVisible={isFormVisible}
          />
        )}

      <BookList
        loading={loading}
        books={filteredBooks}
        handleStatusChange={handleStatusChange}
        handleBookUpdate={handleBookUpdate}
        handleBookDelete={handleBookDelete}
        handleBookUpdateModal={handleBookUpdateModal}
      />

      {/* Fixed add book button */}
      <BottomNav handleBookAddModal={handleBookAddModal} />
    </div>
  );
};

export default Books;
