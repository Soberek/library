import Navbar from "./components/Navbar";
import "./App.css";
import { useBooks } from "./hooks/useBooks";
import BookForm from "./components/AddBookForm/BookForm";
import BookList from "./components/BookList";

function App() {
  const {
    books,
    stars,
    handleBookDelete,
    handleRatingChange,
    handleStatusChange,
    handleStarClick,
    handleBookSubmit,
  } = useBooks();

  return (
    <>
      <Navbar />
      <div className="flex flex-col rounded-lg bg-white">
        {/* Add a book form */}
        <BookForm
          handleBookSubmit={handleBookSubmit}
          handleStarClick={handleStarClick}
          stars={stars}
        />

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
