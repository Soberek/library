import type { Book } from "../types/Book";

type Props = {
  books: Book[];
  handleStatusChange: (index: number) => void;
  handleRatingChange: (index: number, newRating: number) => void;
  handleBookDelete: (index: number) => void;
};

const BookList: React.FC<Props> = ({
  books,
  handleStatusChange,
  handleRatingChange,
  handleBookDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 pb-8 md:grid-cols-2 lg:grid-cols-5">
      {books.map((book, index) => (
        <div
          key={index}
          className="group relative transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative p-2">
            {/* Header */}
            <div className="mb-2">
              <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800">
                {book.title}
              </h3>
              <p className="font-medium text-gray-600">
                <span className="text-sm text-gray-500">Autor:</span>{" "}
                {book.author}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <div
                onClick={() => handleStatusChange(index)}
                className={`ml-2 inline-block cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-md ${
                  book.read === "Przeczytana"
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    : book.read === "W trakcie"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                }`}
              >
                {book.read}
              </div>
            </div>

            {/* Book Cover */}
            <div className="mb-2 flex justify-center">
              <div className="relative overflow-hidden rounded-lg shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                <img
                  src={book.cover}
                  alt={`${book.title} cover`}
                  className="mx-auto aspect-[2/3] h-[225px] w-[150px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>

            {/* Pages Progress */}
            <div className="mb-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Postęp
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {book.readPages} / {book.overallPages}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="mt-1 block text-xs text-gray-500">
                {Math.round(
                  ((book.readPages ?? 0) / (book.overallPages ?? 1)) * 100,
                )}
                % ukończone
              </span>
            </div>

            {/* Rating */}
            <div className="mb-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Ocena</span>
                <span className="text-sm font-bold text-gray-800">
                  {book.rating}/10
                </span>
              </div>
              <div className="flex justify-center space-x-1">
                {[...Array(10)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
                      i < book.rating
                        ? "text-yellow-400 drop-shadow-sm"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    onClick={() => handleRatingChange(index, i + 1)}
                  >
                    <path d="M12 .587l3.668 7.431 8.232 1.194-5.95 5.787 1.404 8.193L12 18.896l-7.354 3.866 1.404-8.193-5.95-5.787 8.232-1.194z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Delete Button */}
            <button
              className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 py-1 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:ring-4 focus:ring-red-200 focus:outline-none active:scale-95"
              onClick={() => handleBookDelete(index)}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Usuń książkę</span>
              </div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
