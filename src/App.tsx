import Navbar from "./components/Navbar";
import "./App.css";
import { useBooks } from "./hooks/useBooks";
import BookForm from "./components/AddBookForm/BookForm";

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
        {/* Book list */}
        <div className="grid grid-cols-3 gap-3 p-4">
          {books.map((book, index) => (
            <div key={index} className="border border-gray-300 p-2">
              <h3 className="font-semibold">Tytuł: {book.title}</h3>
              <p className="text-gray-600">Autor: {book.author}</p>
              <p className="my-2">
                Status:{" "}
                <span
                  onClick={() => handleStatusChange(index)}
                  className={`cursor-pointer rounded-2xl px-2 py-1 font-bold text-white ${book.read === "Przeczytana" ? "bg-green-500" : book.read === "W trakcie" ? "bg-yellow-500" : "bg-red-500"}`}
                >
                  {book.read}
                </span>
              </p>
              <p className="text-gray-600">
                Liczba stron: {book.readPages} / {book.overallPages}
              </p>
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="mx-auto mt-2 aspect-[2/3] max-w-[150px] object-cover object-center"
              />

              {/* Rating */}
              <div className="my-2 flex">
                {[...Array(10)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 cursor-pointer fill-current ${
                      i < book.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                    onClick={() => handleRatingChange(index, i + 1)}
                  >
                    <path d="M12 .587l3.668 7.431 8.232 1.194-5.95 5.787 1.404 8.193L12 18.896l-7.354 3.866 1.404-8.193-5.95-5.787 8.232-1.194z" />
                  </svg>
                ))}
              </div>

              <button
                className="mx-auto mt-2 w-full cursor-pointer rounded-2xl bg-red-500 p-1 px-2 text-white"
                onClick={() => handleBookDelete(index)}
              >
                Usuń książkę
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
