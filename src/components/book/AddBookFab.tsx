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
      className="md:hidden fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-950/20 active:scale-95 transition-all cursor-pointer border border-indigo-500/30"
    >
      <Plus className="h-6 w-6 stroke-[2.5]" />
    </button>
  );
};

export default AddBookFab;
