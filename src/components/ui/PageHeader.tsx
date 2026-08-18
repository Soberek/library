import React from "react";
import { Plus, ArrowUpDown, LayoutGrid, List, BookOpen, CheckCircle2 } from "lucide-react";
import { formatBookCount } from "../../utils/textHelpers";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface PageHeaderProps {
  title?: string;
  bookCount: number;
  totalCount?: number;
  readCount?: number;
  onAddBook: () => void;
  onExportImport?: () => void;
  viewMode: "cards" | "table";
  onViewModeChange: (newMode: "cards" | "table") => void;
  hideViewToggle?: boolean;
  hideAddButton?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = "Moje Książki",
  bookCount,
  totalCount,
  readCount,
  onAddBook,
  onExportImport,
  viewMode,
  onViewModeChange,
  hideViewToggle = false,
  hideAddButton = false,
}) => {
  const isFiltered = typeof totalCount === "number" && totalCount !== bookCount;
  const countLabel = isFiltered
    ? `${bookCount} z ${totalCount} pozycji`
    : formatBookCount(bookCount);

  const total = typeof totalCount === "number" && totalCount > 0 ? totalCount : bookCount;
  const readPct = total > 0 && typeof readCount === "number" ? Math.round((readCount / total) * 100) : 0;

  return (
    <header className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 pb-4 mb-2 border-b border-slate-200/90">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">
            Kolekcja
          </span>
          {isFiltered && (
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Filtrowanie aktywne
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>{countLabel}</span>
          </span>

          {typeof readCount === "number" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{readCount} przeczytanych</span>
              <span className="text-emerald-600 font-extrabold ml-0.5">({readPct}%)</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {onExportImport && (
          <Button
            variant="outline"
            size="default"
            onClick={onExportImport}
            title="Kopia zapasowa / Import / Eksport"
            aria-label="Kopia zapasowa, import lub eksport biblioteki"
            className="border-slate-200 bg-white hover:bg-slate-50 shadow-2xs font-semibold gap-1.5 h-10 px-3"
          >
            <ArrowUpDown className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline text-xs">Kopia & Import</span>
          </Button>
        )}

        {!hideViewToggle && (
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange("cards")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "cards"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
              aria-label="Widok siatki"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Siatka</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                viewMode === "table"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
              aria-label="Widok tabeli"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabela</span>
            </button>
          </div>
        )}

        {!hideAddButton && (
          <Button onClick={onAddBook} className="gap-1.5 shadow-md hover:shadow-lg font-bold h-10 px-4">
            <Plus className="w-4 h-4" />
            <span>Dodaj książkę</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
