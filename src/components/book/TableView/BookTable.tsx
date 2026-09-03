import React, { useState, memo } from "react";
import { ArrowUp, ArrowDown, Heart, Edit3, Trash2, BookOpen, Check, Layers, User } from "lucide-react";
import type { Book, BookStatus } from "../../../types/Book";
import { useFilterStore } from "../../../stores";
import { formatBookCount, formatGenre } from "../../../utils/textHelpers";
import StatusMenuButton from "../StatusMenuButton";
import { Modal } from "../../ui/modal";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Rating } from "../../ui/rating";
import { cn } from "../../../lib/utils";

interface BookTableProps {
  books: Book[];
  handleStatusChange: (bookId: string, newStatus: BookStatus) => void;
  handleRatingChange: (bookId: string, newRating: number) => void;
  handleToggleFavorite: (bookId: string, currentFavorite: boolean) => void;
  handleEdit: (bookId: string) => void;
  handleDelete: (bookId: string) => void;
  handlePagesChange?: (bookId: string, newReadPages: number, overallPages?: number) => void;
}

type SortField = NonNullable<
  ReturnType<typeof useFilterStore.getState>["filters"]["sortBy"]
>;

export const BookTable: React.FC<BookTableProps> = memo(({
  books,
  handleStatusChange,
  handleRatingChange,
  handleToggleFavorite,
  handleEdit,
  handleDelete,
  handlePagesChange,
}) => {
  const sortBy = useFilterStore((state) => state.filters.sortBy);
  const sortOrder = useFilterStore((state) => state.filters.sortOrder);
  const showOnlyFavorites = useFilterStore((state) => state.filters.showOnlyFavorites);
  const setFilter = useFilterStore((state) => state.setFilter);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    if (sortBy === field) {
      setFilter("sortOrder", newOrder);
    } else {
      setFilter("sortBy", field);
      setFilter("sortOrder", "asc");
    }
  };

  const deleteBook = books.find((b) => b.id === deleteId);

  const SortableHeader = ({
    field,
    label,
    className,
  }: {
    field: SortField;
    label: string;
    className?: string;
  }) => {
    const active = sortBy === field;

    return (
      <th
        scope="col"
        onClick={() => handleSort(field)}
        className={cn(
          "px-4 py-3.5 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100/80 transition-colors select-none",
          active && "text-indigo-600 font-black",
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          {active && (
            sortOrder === "asc" ? (
              <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
            )
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-sm">
      {/* Table header count bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>{formatBookCount(books.length)} w widoku tabeli</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm text-left">
          <thead className="bg-slate-50/90 border-b border-slate-200">
            <tr>
              <SortableHeader field="title" label="Książka" />
              <SortableHeader field="author" label="Autor" className="w-48" />
              <SortableHeader field="status" label="Status" className="w-36" />
              <SortableHeader field="rating" label="Ocena" className="w-36" />
              <SortableHeader field="pages" label="Postęp czytania" className="w-52" />
              <th scope="col" className="px-4 py-3.5 text-right text-xs font-extrabold uppercase tracking-wider text-slate-500 w-28">
                Akcje
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                  {showOnlyFavorites ? "Brak ulubionych książek" : "Brak książek w bibliotece"}
                </td>
              </tr>
            ) : (
              books.map((book) => {
                const isFavorite = Boolean(book.isFavorite);
                const overall = Math.max(book.overallPages || 1, 1);
                const read = Math.min(Math.max(book.readPages || 0, 0), overall);
                const progress = Math.min((read / overall) * 100, 100);

                return (
                  <tr
                    key={book.id}
                    className={cn(
                      "transition-colors hover:bg-slate-50/80 group",
                      isFavorite && "bg-amber-50/20"
                    )}
                  >
                    {/* Title + Cover + Genre */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              onClick={() => handleEdit(book.id)}
                              className="font-bold text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors truncate max-w-xs block font-display"
                            >
                              {book.title}
                            </span>
                            {isFavorite && (
                              <span className="text-amber-500 shrink-0 text-xs font-bold" title="Ulubiona">
                                ★
                              </span>
                            )}
                          </div>
                          {book.genre && (
                            <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/50 mt-1">
                              {formatGenre(book.genre)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3.5 text-slate-600 font-medium truncate max-w-[170px]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{book.author}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusMenuButton
                        status={book.read}
                        onSelect={(next) => handleStatusChange(book.id, next)}
                        variant="pill"
                      />
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Rating
                          value={book.rating / 2}
                          size="sm"
                          onChange={(_, val) => {
                            if (val !== null) handleRatingChange(book.id, val * 2);
                          }}
                        />
                        <span className="text-xs font-black text-slate-700">
                          {book.rating > 0 ? book.rating.toFixed(1) : "—"}
                        </span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3.5">
                      <div className="min-w-[140px]">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>{read}/{overall}</span>
                          </span>
                          <span className="text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress value={progress} />

                        {handlePagesChange && book.read !== "Przeczytana" && (
                          <div className="flex items-center justify-end gap-1 mt-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={() =>
                                handlePagesChange(
                                  book.id,
                                  Math.min(overall, read + 10),
                                  overall
                                )
                              }
                              className="h-6 px-1.5 text-[10px] font-bold"
                            >
                              +10
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="xs"
                              onClick={() =>
                                handlePagesChange(
                                  book.id,
                                  Math.min(overall, read + 50),
                                  overall
                                )
                              }
                              className="h-6 px-1.5 text-[10px] font-bold"
                            >
                              +50
                            </Button>
                            <Button
                              type="button"
                              variant="success"
                              size="xs"
                              onClick={() =>
                                handlePagesChange(book.id, overall, overall)
                              }
                              className="h-6 px-1.5 text-[10px] font-bold"
                              title="Oznacz jako przeczytana"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleToggleFavorite(book.id, isFavorite)}
                          aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                          title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                          className={cn(
                            isFavorite
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", isFavorite && "fill-amber-500 text-amber-500")} />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(book.id)}
                          aria-label="Edytuj"
                          title="Edytuj"
                          className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteId(book.id)}
                          aria-label="Usuń"
                          title="Usuń"
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Potwierdź usunięcie"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Czy na pewno chcesz usunąć
            {deleteBook ? ` „${deleteBook.title}”?` : " tę książkę?"} Tej operacji nie można cofnąć.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) handleDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Usuń
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

BookTable.displayName = "BookTable";

export default BookTable;
