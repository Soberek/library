import React from "react";
import { Plus } from "lucide-react";

interface AddBookFabProps {
  onClick: () => void;
}

export const AddBookFab: React.FC<AddBookFabProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Dodaj książkę"
      title="Dodaj książkę"
      className="md:hidden fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/35 transition-all hover:scale-105 active:scale-95 cursor-pointer"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
};

export default AddBookFab;
