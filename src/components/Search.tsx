import Input from "./Input";

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const Search: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mr-6 ml-auto flex h-full">
      {/* Search input */}
      <Input
        type="text"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Szukaj książek..."
      />
    </div>
  );
};

export default Search;
