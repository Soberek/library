import { useEffect, useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import "./App.css";
import { useBooks } from "./hooks/useBooks";
import BookForm from "./components/AddBookForm/BookForm";
import BookList from "./components/BookList";
import type { Book } from "./types/Book";

function App() {
  // Form should be visible when User clicks button
  const [isFormVisible, setIsFormVisible] = useState(false);
  const {
    books,
    stars,
    loading,
    handleBookDelete,
    handleRatingChange,
    handleStatusChange,
    handleStarClick,
    handleBookSubmit,
  } = useBooks();

  const handleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
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

  const [searchTerm, setSearchTerm] = useState("");

  let filteredBooks: Book[];

  // Filter books based on searchTerm
  filteredBooks = useMemo(() => {
    if (searchTerm) {
      return books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return books;
  }, [books, searchTerm]);

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <MobileNavbar />
      <div className="flex flex-col rounded-lg bg-white">
        {/* Add a button to toggle the form visibility */}
        <button
          className="m-4 hidden cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none md:flex"
          onClick={handleFormVisibility}
        >
          {isFormVisible ? "Ukryj formularz" : "Dodaj książkę"}
        </button>

        {/* Add a book form */}
        {isFormVisible && (
          <BookForm
            handleFormVisibility={handleFormVisibility}
            handleBookSubmit={handleBookSubmit}
            handleStarClick={handleStarClick}
            stars={stars}
            isFormVisible={isFormVisible}
          />
        )}

        <BookList
          loading={loading}
          books={filteredBooks}
          handleStatusChange={handleStatusChange}
          handleRatingChange={handleRatingChange}
          handleBookDelete={handleBookDelete}
        />

        {/* Fixed add book button */}
        {!isFormVisible && (
          <button
            className="fixed right-6 bottom-4 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-400 focus:outline-none active:scale-95"
            onClick={handleFormVisibility}
          >
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}

export default App;
