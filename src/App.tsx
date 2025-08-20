import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { useBooks } from "./hooks/useBooks";
import BookForm from "./components/AddBookForm/BookForm";
import BookList from "./components/BookList";

function App() {
  // Form should be visible when User clicks button
  const [isFormVisible, setIsFormVisible] = useState(false);
  const {
    books,
    stars,
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

    // Cleanup, jeśli komponent zniknie z DOM, przywraca scroll
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFormVisible]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col rounded-lg bg-white">
        {/* Add a button to toggle the form visibility */}
        <button
          className="m-4 cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
          />
        )}

        <BookList
          books={books}
          handleStatusChange={handleStatusChange}
          handleRatingChange={handleRatingChange}
          handleBookDelete={handleBookDelete}
        />
      </div>
    </>
  );
}

export default App;
