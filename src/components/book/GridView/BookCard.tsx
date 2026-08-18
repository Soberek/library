import React, { useState } from "react";
import { Heart, Edit3, Trash2, Check, Layers, User, CheckCircle2 } from "lucide-react";
import type { Book, BookStatus } from "../../../types/Book";
import StatusMenuButton from "../StatusMenuButton";
import { Modal } from "../../ui/modal";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Rating } from "../../ui/rating";
import { formatGenre } from "../../../utils/textHelpers";
import { cn } from "../../../lib/utils";

interface BookCardProps {
  book: Book;
  onEdit: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onStatusChange: (bookId: string, newStatus: BookStatus) => void;
  onToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  onRatingChange?: (bookId: string, newRating: number) => void;
  onPagesChange?: (bookId: string, newReadPages: number, overallPages?: number) => void;
}

const GENRE_GRADIENTS: Record<string, string> = {
  fantasy: "from-purple-600 via-indigo-600 to-blue-700",
  "science-fiction": "from-cyan-600 via-blue-600 to-indigo-800",
  kryminał: "from-slate-700 via-slate-800 to-zinc-900",
  thriller: "from-rose-700 via-red-800 to-slate-900",
  romans: "from-pink-500 via-rose-500 to-red-600",
  historia: "from-amber-700 via-amber-800 to-stone-900",
  biografia: "from-emerald-700 via-teal-800 to-slate-800",
  horror: "from-red-900 via-stone-900 to-black",
  psychologia: "from-teal-600 via-emerald-600 to-cyan-700",
};

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleFavorite,
  onRatingChange,
  onPagesChange,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imgError, setImgError] = useState(false);

  const overall = Math.max(book.overallPages || 1, 1);
  const read = Math.min(Math.max(book.readPages || 0, 0), overall);
  const progress = Math.min((read / overall) * 100, 100);
  const isFavorite = Boolean(book.isFavorite);
  const isCompleted = book.read === "Przeczytana" || progress >= 100;
  const formattedGenre = formatGenre(book.genre);

  const genreLower = (book.genre || "").toLowerCase();
  const fallbackGradient =
    GENRE_GRADIENTS[genreLower] || "from-indigo-600 via-violet-600 to-purple-800";

  const handleFinishBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPagesChange) {
      onPagesChange(book.id, overall, overall);
    }
    onStatusChange(book.id, "Przeczytana");
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full rounded-3xl border bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        isFavorite
          ? "border-amber-300 ring-2 ring-amber-200/50 shadow-[0_4px_20px_rgba(245,158,11,0.08)]"
          : "border-slate-200 shadow-2xs hover:border-indigo-200 hover:shadow-md"
      )}
    >
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <StatusMenuButton
          status={book.read}
          onSelect={(next) => onStatusChange(book.id, next)}
          variant="solid"
          size="sm"
        />

        <button
          type="button"
          onClick={() => onToggleFavorite(book.id, isFavorite)}
          aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border shadow-2xs",
            isFavorite
              ? "bg-amber-500 text-white border-amber-400 hover:bg-amber-600"
              : "bg-slate-50 text-slate-400 border-slate-200 hover:text-rose-500 hover:border-rose-200 hover:bg-white"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-white text-white")} />
        </button>
      </div>

      {/* Book Cover Container */}
      <div
        onClick={() => onEdit(book.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit(book.id);
          }
        }}
        aria-label={`Edytuj książkę ${book.title}`}
        className="relative h-56 w-full cursor-pointer flex items-center justify-center px-4 py-2 select-none"
      >
        {book.cover && !imgError ? (
          <div className="relative max-h-52 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            {/* Realistic Book Jacket Container */}
            <div className="relative rounded-lg overflow-hidden shadow-[0_8px_18px_rgba(0,0,0,0.14)] max-h-50 border border-black/5">
              {/* Left spine shadow */}
              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />
              <img
                src={book.cover}
                alt={book.title}
                onError={() => setImgError(true)}
                className="max-h-50 max-w-[155px] object-cover rounded-md"
              />
            </div>
          </div>
        ) : (
          /* Editorial Fallback Cover */
          <div
            className={cn(
              "w-32 h-48 rounded-lg p-3.5 flex flex-col justify-between text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)] relative overflow-hidden transition-transform duration-300 group-hover:scale-105 bg-gradient-to-br",
              fallbackGradient
            )}
          >
            {/* Left spine shadow */}
            <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              {formattedGenre && (
                <span className="inline-block text-[10px] font-bold text-white/85 border-b border-white/30 pb-0.5 mb-1.5 truncate max-w-full">
                  {formattedGenre}
                </span>
              )}
              <h3 className="text-xs font-bold line-clamp-3 leading-snug text-white drop-shadow-xs">
                {book.title}
              </h3>
            </div>

            <div className="relative z-10 pt-1.5 border-t border-white/20">
              <p className="text-[10px] font-semibold text-white/90 truncate">
                {book.author}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Book details body */}
      <div className="flex flex-col flex-1 p-4 pt-2 gap-3 text-left">
        {/* Title, Author & Genre Header */}
        <div>
          {formattedGenre && (
            <div className="mb-1.5">
              <span className="inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50/90 px-2.5 py-0.5 rounded-full border border-indigo-100/80 truncate max-w-full">
                {formattedGenre}
              </span>
            </div>
          )}

          <h2
            onClick={() => onEdit(book.id)}
            className="font-bold text-base text-slate-900 line-clamp-2 cursor-pointer hover:text-indigo-600 transition-colors leading-snug"
          >
            {book.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium truncate mt-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{book.author}</span>
          </p>
        </div>

        {/* Progress box */}
        <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-100">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>{read} / {overall} str.</span>
            </span>
            <span className="font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs text-[11px]">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />

          {/* Quick stepper buttons or Completed state */}
          {isCompleted ? (
            <div className="flex items-center justify-center gap-1.5 mt-2.5 pt-2 border-t border-slate-200/60 text-xs font-bold text-emerald-700 bg-emerald-50/80 rounded-xl py-1 px-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Książka przeczytana</span>
            </div>
          ) : onPagesChange ? (
            <div
              className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-slate-200/60"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() =>
                  onPagesChange(
                    book.id,
                    Math.min(overall, read + 10),
                    overall
                  )
                }
                title="Dodaj 10 stron do przeczytanych"
                className="flex-1 py-1 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs text-center"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() =>
                  onPagesChange(
                    book.id,
                    Math.min(overall, read + 50),
                    overall
                  )
                }
                title="Dodaj 50 stron do przeczytanych"
                className="flex-1 py-1 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-2xs text-center"
              >
                +50
              </button>
              <button
                type="button"
                onClick={handleFinishBook}
                title="Oznacz całą książkę jako przeczytaną (100%)"
                className="flex-[1.2] py-1 px-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1 active:scale-95"
              >
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Przeczytana</span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Footer with Rating & Action buttons */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Rating
              value={book.rating / 2}
              size="sm"
              onChange={(_, val) => {
                if (val !== null && onRatingChange) {
                  onRatingChange(book.id, val * 2);
                }
              }}
            />
            <span className="text-xs font-black text-slate-700 ml-0.5">
              {book.rating > 0 ? book.rating.toFixed(1) : "—"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(book.id)}
              aria-label="Edytuj książkę"
              title="Edytuj książkę"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpenDeleteDialog(true)}
              aria-label="Usuń książkę"
              title="Usuń książkę"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Potwierdź usunięcie"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Czy na pewno chcesz usunąć „<strong className="text-slate-900">{book.title}</strong>”? Tej operacji nie można cofnąć.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(book.id);
                setOpenDeleteDialog(false);
              }}
            >
              Usuń
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookCard;
