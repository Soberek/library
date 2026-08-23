import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home } from "lucide-react";
import { buttonVariants } from "../components/ui/button";
import { cn } from "../lib/utils";

export const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
    <div className="text-center max-w-sm">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-indigo-500/10 text-indigo-600">
        <BookOpen className="w-7 h-7" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1 font-display">
        MyLibrary
      </h1>
      <div className="text-6xl font-black text-indigo-600 tracking-tight leading-none mb-3">
        404
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Nie znaleziono tej strony. Wróć do swojej biblioteki.
      </p>

      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "default" }),
          "gap-2 inline-flex items-center justify-center whitespace-nowrap"
        )}
      >
        <Home className="w-4 h-4" />
        <span>Wróć do biblioteki</span>
      </Link>

      <p className="text-xs text-slate-400 mt-6">
        <Link to="/sign-in" className="hover:underline">
          Zaloguj się
        </Link>
      </p>
    </div>
  </div>
);

export default NotFound;
