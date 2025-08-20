type Props = {
  handleBookSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
  handleStarClick: (index: number) => void;
  stars: number;
};

const bookGenres: { [key: string]: string } = {
  powiesc_historyczna: "powieść historyczna",
  powiesc_przygodowa: "powieść przygodowa",
  powiesc_kryminalna: "powieść kryminalna",
  powiesc_fantastyczno_naukowa: "powieść fantastyczno-naukowa",
  powiesc_fantasy: "powieść fantasy",
  romans: "romans",
  science_fiction: "science fiction",
  horror: "horror",
  kryminal: "kryminał",
  thriller: "thriller",
  hymn: "hymn",
  oda: "oda",
  piesn: "pieśń",
  psalm: "psalm",
  elegia: "elegia",
  tren: "tren",
  fraszka: "fraszka",
  sonet: "sonet",
  komedia: "komedia",
  tragedia: "tragedia",
  tragedikomedia: "tragedikomedia",
  opera: "opera",
  esej: "esej",
  satyra: "satyra",
  listy: "listy",
  dzienniki: "dzienniki",
};

const BookForm: React.FC<Props> = ({
  handleBookSubmit,
  handleStarClick,
  stars,
}) => {
  return (
    <form
      className="mx-6 mt-4 flex flex-col rounded-lg p-4 shadow-lg"
      onSubmit={handleBookSubmit}
    >
      <h2 className="mb-2 text-3xl font-semibold">Dodaj nową książkę</h2>
      <input
        type="text"
        name="title"
        placeholder="Tytuł"
        className="mb-2 rounded-lg border border-gray-300 p-2"
      />
      <input
        type="text"
        name="author"
        placeholder="Autor"
        className="mb-2 rounded-lg border border-gray-300 p-2"
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
        <option value="" disabled>
          Wybierz gatunek
        </option>
        {Object.entries(bookGenres).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div className="flex w-full">
        <input
          type="number"
          name="readPages"
          placeholder="Przeczytane strony"
          max={5000}
          min={0}
          className="mb-2 w-1/2 rounded-lg border border-gray-300 p-2"
        />
        <div className="mx-2 my-2 h-full w-px bg-black" />
        <input
          type="number"
          name="pages"
          placeholder="Liczba stron"
          max={5000}
          min={1}
          className="mb-2 w-1/2 rounded-lg border border-gray-300 p-2"
        />
        {/* Divider */}
      </div>

      {/* Star SVG*/}
      <div className="my-3 flex w-full justify-between">
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

      <input
        type="text"
        name="cover"
        placeholder="Okładka (URL)"
        className="mb-2 rounded-lg border border-gray-300 p-2"
      />
      <button
        type="submit"
        className="mt-4 cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-lg font-semibold text-white shadow-md transition-transform duration-150 hover:scale-105 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        Dodaj książkę
      </button>
    </form>
  );
};

export default BookForm;
