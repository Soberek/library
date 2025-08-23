import Input from "../Input";
import { GENRES } from "../../constants/genres";
type Props = {
  handleBookSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  handleStarClick: (index: number) => void;
  stars: number;
  handleFormVisibility: () => void;
  isFormVisible: boolean;
};

const BookForm: React.FC<Props> = ({
  handleBookSubmit,
  handleStarClick,
  stars,
  handleFormVisibility,
  isFormVisible,
}) => {
  return (
    <>
      {/* full screen gray background */}
      <div
        className="fixed inset-0 z-10 bg-gray-300 opacity-40"
        onClick={handleFormVisibility}
      />

      <form
        className={`fixed top-1/2 left-1/2 z-20 flex w-full max-w-[550px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg bg-white px-4 py-4 shadow-lg ${isFormVisible ? "fade-in" : "fade-out"}`}
        onSubmit={handleBookSubmit}
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Dodaj nową książkę
          </h1>
          <button
            type="button"
            className="cursor-pointer rounded-full px-4 py-2 text-3xl font-semibold text-black shadow transition-colors duration-150 hover:bg-red-600 hover:text-white focus:ring-2 focus:ring-red-400 focus:outline-none"
            onClick={handleFormVisibility}
            aria-label="Zamknij formularz"
          >
            &#10005;
          </button>
        </div>
        <Input type="text" name="title" placeholder="Tytuł" />
        <Input type="text" name="author" placeholder="Autor" />
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
          <option value="" disabled>
            Wybierz gatunek
          </option>
          {Object.entries(GENRES)
            .sort()
            .map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
        </select>

        <div className="flex w-full items-center justify-between">
          <Input
            type="number"
            name="readPages"
            placeholder="Przeczytane strony"
            max={5000}
            min={0}
          />
          <div className="mx-2 my-2 h-full w-px bg-black" />
          <Input
            type="number"
            name="pages"
            placeholder="Liczba stron"
            max={5000}
            min={1}
          />
          {/* Divider */}
        </div>

        {/* Star SVG*/}
        <div
          data-testid="star-rating"
          className="my-3 flex w-full justify-between"
        >
          {[...Array(10)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 cursor-pointer fill-current ${
                i < stars ? "text-yellow-500" : "text-gray-300"
              }`}
              viewBox="0 0 24 24"
              onClick={() => handleStarClick(i)}
            >
              <path d="M12 .587l3.668 7.431 8.232 1.194-5.95 5.787 1.404 8.193L12 18.896l-7.354 3.866 1.404-8.193-5.95-5.787 8.232-1.194z" />
            </svg>
          ))}
        </div>

        <Input
          type="text"
          name="cover"
          placeholder="Okładka (URL)"
          dataTestId="cover-input"
        />
        <button
          type="submit"
          name="submit"
          className="mt-2 cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-lg font-semibold text-white shadow-md transition-transform duration-150 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          Dodaj książkę
        </button>
      </form>
    </>
  );
};

export default BookForm;
