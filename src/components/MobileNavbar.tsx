const MobileNavbar = () => {
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-white/10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl md:hidden">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <span className="text-4xl font-bold text-white">📚</span>
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-sm sm:text-xl">
              Library App for Magdzialena
            </h1>
          </div>

          {/* Burger menu button */}
          {/* <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-8 w-8 flex-col items-center justify-center space-y-1 md:hidden"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            ></span>
          </button> */}
        </div>

        {/* Mobile menu */}
        {/* <div
          className={`mt-4 transition-all duration-300 md:hidden ${isMenuOpen ? "max-h-48 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
        >
          <div className="absolute flex flex-col space-y-2 pt-2">
            {["Home", "Books", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/20 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div> */}
      </div>
    </nav>
  );
};

export default MobileNavbar;
