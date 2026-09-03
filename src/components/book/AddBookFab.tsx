import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui";

interface AddBookFabProps {
  onClick: () => void;
}

export const AddBookFab: React.FC<AddBookFabProps> = ({ onClick }) => {
  return (
    <Button
      type="button"
      variant="primary"
      size="icon-lg"
      rounded="lg"
      onClick={onClick}
      aria-label="Dodaj książkę"
      title="Dodaj książkę"
      className="md:hidden fixed bottom-20 right-4 z-40 h-14 w-14 shadow-lg shadow-indigo-950/20 border border-indigo-500/30"
    >
      <Plus className="h-6 w-6 stroke-[2.5]" />
    </Button>
  );
};

export default AddBookFab;
