import Navbar from "./components/Navbar";
import "./App.css";
import { useEffect, useState } from "react";

interface Book {
  title: string;
  author: string;
  read: string;
  overallPages: number;
  readPages?: number;
  cover: string;
  genre: string;
  rating: number;
}
function getBooksFromLocalStorage() {
  const savedBooks = localStorage.getItem("books");
  return savedBooks ? JSON.parse(savedBooks) : [];
}

function App() {
  const [books, setBooks] = useState<Book[]>(() => getBooksFromLocalStorage());
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    // Save books to localStorage whenever they change
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const handleBookSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const newBook: Book = {
      title: form.get("title") as string,
      author: form.get("author") as string,
      read: form.get("read") as string,
      overallPages: Number(form.get("pages")),
      readPages: Number(form.get("readPages")),
      cover: form.get("cover") as string,
      genre: form.get("genre") as string,
      rating: stars,
    };
    if (
      newBook.title &&
      newBook.author &&
      newBook.read &&
      newBook.overallPages &&
      newBook.cover
    ) {
      setBooks([...books, newBook]);
    }
    // e.target.reset();
  };

  const handleBookDelete = (index: number) => {
    setBooks(books.filter((_, i) => i !== index));
  };

  const handleStarClick = (index: number) => {
    setStars(index + 1);
  };

  const handleRatingChange = (id: number, rating: number) => {
    setBooks(
      books.map((book, index) => (index === id ? { ...book, rating } : book)),
    );
  };

  const handleStatusChange = (id: number) => {
    const statuses = ["W trakcie", "Przeczytana", "Porzucona"];

    setBooks(
      books.map((book, index) =>
        index === id
          ? {
              ...book,
              read: statuses[
                (statuses.indexOf(book.read) + 1) % statuses.length
              ],
            }
          : book,
      ),
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-white">
        {/* Add a book form */}
        <form
          className="mx-auto flex w-1/2 flex-col p-4"
          onSubmit={handleBookSubmit}
        >
          <h2 className="mb-2 text-lg font-semibold">Dodaj nową książkę</h2>
          <input
            type="text"
            name="title"
            placeholder="Tytuł"
            className="mb-2 border border-gray-300 p-2"
          />
          <input
            type="text"
            name="author"
            placeholder="Autor"
            className="mb-2 border border-gray-300 p-2"
          />
          {/* How to style select?? */}

          <select
            name="read"
            className="mb-2 block w-full appearance-none rounded-md border border-gray-300 bg-white px-2 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          >
            <option value="" disabled hidden>
              Wybierz status
            </option>
            <option value="W trakcie">W trakcie</option>
            <option value="Przeczytana">Przeczytana</option>
            <option value="Porzucona">Porzucona</option>
          </select>

          {/* genre */}

          <select
            name="genre"
            className="mb-2 block w-full appearance-none rounded-md border border-gray-300 bg-white px-2 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
            aria-placeholder="Wybierz gatunek"
          >
            <option value="" disabled hidden>
              Wybierz gatunek
            </option>
            <option value="Fiction">Fikcja</option>
            <option value="Non-Fiction">Non-Fikcja</option>
            <option value="Fantasy">Fantastyka</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Mystery">Tajemnica</option>
          </select>

          <div className="flex w-full">
            <input
              type="number"
              name="readPages"
              placeholder="Przeczytane strony"
              max={5000}
              min={0}
              className="mb-2 w-1/2 border border-gray-300 p-2"
            />
            <div className="mx-2 my-2 h-full w-px bg-black" />
            <input
              type="number"
              name="pages"
              placeholder="Liczba stron"
              max={5000}
              min={1}
              className="mb-2 w-1/2 border border-gray-300 p-2"
            />
            {/* Divider */}
          </div>

          {/* Star SVG*/}
          <div className="my-3 flex w-full justify-between">
            {[...Array(10)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 cursor-pointer fill-current ${
                  i < stars ? "text-yellow-500" : "text-gray-300"
                }`}
                viewBox="0 0 24 24"
                onClick={() => handleStarClick(i)}
              >
                <path d="M12 .587l3.668 7.431 8.232 1.194-5.95 5.787 1.404 8.193L12 18.896l-7.354 3.866 1.404-8.193-5.95-5.787 8.232-1.194z" />
              </svg>
            ))}
          </div>

          <input
            type="text"
            name="cover"
            placeholder="Okładka (URL)"
            className="mb-2 border border-gray-300 p-2"
          />
          <button className="bg-blue-500 p-2 text-white">Dodaj książkę</button>
        </form>

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
