import React from "react";
import { Loader2 } from "lucide-react";

interface BookListLoadingProps {
  message?: string;
}

export const BookListLoading: React.FC<BookListLoadingProps> = ({
  message = "Wczytywanie Twojej biblioteki...",
}) => {
  return (
    <div className="py-20 px-4 text-center rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      <p className="text-sm font-semibold text-slate-500 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default BookListLoading;
