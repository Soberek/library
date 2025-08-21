import Search from "./Search";
type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const Navbar: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <nav className="hidden border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl md:flex">
      <div className="container mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <span className="text-lg font-bold text-white">📚</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-sm">
            Library App dla Madzi
          </h1>
        </div>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex items-center justify-center space-x-1">
          {["Home", "Books", "About"].map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-lg px-4 py-2 font-medium text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white hover:shadow-lg active:scale-95"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
