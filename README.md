# 📚 Library App - Aplikacja do zarządzania kolekcją książek

**Projekt zaliczeniowy** | Autor: Krzysztof Palpuchowski | II rok - AJP

---

## 📖 Opis projektu

**Library App** to nowoczesna, w pełni funkcjonalna aplikacja webowa do zarządzania osobistą kolekcją książek. Pozwala użytkownikom na dodawanie, edytowanie i usuwanie książek, śledzenie postępu czytania, filtrowanie i wyszukiwanie pozycji w bibliotece.

Aplikacja wdrażana jest na platformie **Firebase** i dostępna jest pod adresem: [https://membib.netlify.app/](https://membib.netlify.app/)

---

## ✨ Funkcjonalności

### Funkcje podstawowe
- 📝 Dodawanie książek (tytuł, autor, gatunek, status czytania, ocena)
- 🔍 Wyszukiwanie i filtrowanie książek po tytule
- 📊 Śledzenie statusu czytania (W trakcie, Przeczytana, Porzucona)
- 📈 Wyświetlanie statystyk i postępu czytania
- ✏️ Edycja i usuwanie książek
- 📱 Responsywny design (desktop, tablet, mobile)

### Cechy techniczne
- **Bezpieczeństwo typów**: TypeScript ze ścisłą walidacją typów
- **Walidacja danych**: Zod - schematy walidacji dla formularzy
- **Obsługa błędów**: Error boundaries i przyjazne komunikaty dla użytkownika
- **Optymalizacja**: Memoizacja komponentów, zoptymalizowane re-rendy
- **Testy jednostkowe**: Pokrycie testami hooks'ów, serwisów i funkcji
- **Dostępność**: Etykiety ARIA i nawigacja klawiaturą
- **Autentykacja**: Firebase Authentication (email/hasło)
- **Baza danych**: Firestore - izolacja danych dla każdego użytkownika

---

## 🛠️ Technologie

### Frontend
| Technologia | Wersja | Zastosowanie |
|-------------|--------|-------------|
| **React** | 19 | Framework do budowania UI |
| **TypeScript** | Latest | Statyczna typizacja i bezpieczeństwo |
| **Material-UI (MUI)** | 5.15 | Biblioteka komponentów UI |
| **Tailwind CSS** | 4.1 | Utility-first styling |
| **React Hook Form** | 7.62 | Zarządzanie formularzami |
| **Zod** | 4.1 | Walidacja schematów |
| **Lucide React** | 0.544 | Biblioteka ikon |

### Backend & Baza danych
| Technologia | Wersja | Zastosowanie |
|-------------|--------|-------------|
| **Firebase Auth** | 12.1 | Autentykacja użytkowników |
| **Firestore** | 12.1 | Baza danych NoSQL |
| **Vite** | Latest | Build tool i dev server |

### Narzędzia deweloperskie
| Narzędzie | Wersja | Zastosowanie |
|-----------|--------|-------------|
| **Jest** | Latest | Testing framework |
| **React Testing Library** | 16.3 | Testy komponentów |
| **ESLint** | 9.33 | Linting kodu |
| **Prettier** | Latest | Formatowanie kodu |
| **React Query** | 5.90 | Zarządzanie stanem asynchronicznym |

---

## 📁 Struktura projektu

```
library/
├── public/                     # Pliki statyczne
│   └── _redirects             # Konfiguracja routingu Netlify
│
├── src/
│   ├── components/            # Komponenty UI
│   │   ├── book/              # Komponenty do wyświetlania książek
│   │   │   ├── BookCard.tsx   # Karta książki w widoku siatki
│   │   │   ├── BookList.tsx   # Lista książek
│   │   │   └── BooksHeader.tsx
│   │   ├── forms/             # Formularze
│   │   │   └── AddBookForm/   # Formularz dodawania książki
│   │   ├── navigation/        # Komponenty nawigacji
│   │   │   ├── Navbar.tsx     # Navbar desktopowy
│   │   │   └── MobileNavbar.tsx # Navbar mobilny
│   │   ├── statistics/        # Widgety statystyk
│   │   ├── ui/                # Komponenty podstawowe
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── index.ts           # Barrel exports
│   │
│   ├── constants/             # Stałe aplikacji
│   │   ├── bookStatus.ts      # Statusy książek
│   │   ├── genres.ts          # Dostępne gatunki
│   │   └── validation.ts      # Reguły walidacji
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useBooks.tsx       # Zarządzanie danymi książek
│   │   ├── useAuth.ts         # Autentykacja
│   │   ├── useSearch.tsx      # Wyszukiwanie
│   │   ├── useDebounce.ts     # Debouncing
│   │   └── __tests__/         # Testy hooks'ów
│   │
│   ├── pages/                 # Strony aplikacji
│   │   ├── Books.tsx          # Główna strona z książkami
│   │   ├── SignIn.tsx         # Logowanie
│   │   └── SignUp.tsx         # Rejestracja
│   │
│   ├── providers/             # Context providers
│   │   ├── RouterProvider.tsx # Konfiguracja routingu
│   │   └── SearchProvider.tsx # Kontekst wyszukiwania
│   │
│   ├── schemas/               # Zod schematy walidacji
│   │   └── bookSchema.ts      # Walidacja danych książki
│   │
│   ├── services/              # Serwisy komunikacji z API
│   │   ├── booksService.ts    # Operacje Firestore
│   │   └── __tests__/
│   │
│   ├── stores/                # Zustand stores (state management)
│   │   ├── filterStore.ts     # Stan filtrów
│   │   └── uiStore.ts         # Stan UI
│   │
│   ├── types/                 # Typy TypeScript
│   │   ├── Book.ts            # Typy książki
│   │   ├── User.ts            # Typy użytkownika
│   │   └── Error.ts           # Typy błędów
│   │
│   ├── utils/                 # Funkcje pomocnicze
│   │   ├── validation.ts      # Funkcje walidacji
│   │   └── textHelpers.ts
│   │
│   ├── App.tsx                # Główny komponent
│   ├── main.tsx               # Punkt wejścia
│   └── index.css              # Style globalne
│
├── index.html                 # HTML template
├── package.json               # Dependencje projektu
├── tsconfig.json              # Konfiguracja TypeScript
├── vite.config.ts             # Konfiguracja Vite
├── tailwind.config.js         # Konfiguracja Tailwind
├── jest.config.cjs            # Konfiguracja Jest
└── eslint.config.js           # Konfiguracja ESLint
```

---

## 🚀 Instalacja i uruchomienie

### Wymagania
- **Node.js** w wersji 16+ lub **pnpm** 8+
- Konto Firebase (do konfiguracji bazy danych)
- Klient Git

### Krok 1: Klonowanie repozytorium

```bash
git clone https://github.com/Soberek/library.git
cd library
```

### Krok 2: Instalacja zależności

Użyj **pnpm** (zalecane):
```bash
pnpm install
```

Lub **npm**:
```bash
npm install
```

### Krok 3: Konfiguracja Firebase

1. Stwórz projekt w [Firebase Console](https://console.firebase.google.com/)
2. Utwórz plik `src/config/firebaseConfig.ts` z konfiguracją:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Krok 4: Uruchomienie serwera deweloperskiego

```bash
pnpm dev
```

Aplikacja będzie dostępna pod adresem: **http://localhost:5173**

---

## 📦 Dostępne komendy

```bash
# Uruchomienie serwera deweloperskiego
pnpm dev

# Build produkcyjny
pnpm build

# Preview build produkcyjnego
pnpm preview

# Uruchomienie testów jednostkowych
pnpm test

# Lint kodu (ESLint)
pnpm lint

# Formatowanie kodu (Prettier)
pnpm format
```

---

## 🧪 Testowanie

Projekt zawiera testy jednostkowe napisane przy użyciu **Jest** i **React Testing Library**.

Testy znajdują się w katalogach `__tests__/` obok implementacji:

```bash
# Uruchomienie wszystkich testów
pnpm test

# Uruchomienie testów z obserwacją zmian
pnpm test --watch

# Pokrycie testami
pnpm test --coverage
```

Przykład test hook'u (`src/hooks/__tests__/useBooks.test.tsx`):
```typescript
describe('useBooks', () => {
  it('should fetch books for user', async () => {
    // Test implementation
  });
});
```

---

## 📝 Model danych

### Struktura książki w Firestore

```typescript
interface Book {
  id: string;                    // ID dokumentu Firestore
  userId: string;                // ID właściciela (izolacja danych)
  title: string;                 // Tytuł książki
  author: string;                // Autor
  genre: string;                 // Gatunek (sci-fi, fantazja, itp.)
  status: 'W trakcie' | 'Przeczytana' | 'Porzucona'; // Status czytania
  rating: number;                // Ocena (1-5)
  progress?: number;             // Procent przeczytania (0-100)
  createdAt: Date;               // Data utworzenia
  updatedAt: Date;               // Data ostatniej aktualizacji
}
```

---

## 🔐 Bezpieczeństwo

- ✅ Autentykacja Firebase - każdy użytkownik loguje się osobnym kontem
- ✅ Firestore Security Rules - dane izolowane na podstawie `userId`
- ✅ Walidacja po stronie klienta - Zod schematy
- ✅ Obsługa błędów - error boundaries i graceful degradation
- ✅ Type-safe - TypeScript eliminuje błędy typowania

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 📊 Architektura aplikacji

### Przepływ danych

```
User Input
    ↓
React Component
    ↓
React Hook Form + Zod (Walidacja)
    ↓
Custom Hook (useBooks, etc.)
    ↓
Service Layer (booksService)
    ↓
Firebase Firestore
    ↓
Zustand Store (stan globalny)
    ↓
Komponenty (re-render)
```

### Wzorce stosowane

- **Custom Hooks** - logika biznesowa oddzielona od UI
- **Context API** - globalne stany (User, Search)
- **Error Boundary** - obsługa błędów komponentów
- **Protected Routes** - strony dostępne tylko zalogowanym użytkownikom
- **Barrel Exports** - czysty import komponentów

---

## 🎨 Styling

Projekt łączy dwa podejścia do stylowania:

1. **Material-UI (MUI)** - komponenty systemowe, przyciski, karty
2. **Tailwind CSS** - utility classes dla responsywności i spacingu

Przykład:
```typescript
<Card className="p-4 rounded-lg shadow-md">
  <CardContent>
    {/* Tailwind classes + MUI components */}
  </CardContent>
</Card>
```

---

## 🐛 Znane ograniczenia i TODO

- [ ] Autentykacja społeczna (Google, Facebook)
- [ ] Wgrywanie okładek książek
- [ ] Śledzenie postępu czytania z datami
- [ ] Rekomendacje książek
- [ ] Export/import biblioteki (CSV, JSON)
- [ ] Tryb ciemny / jasny

---

## 📚 Referencje i zasoby

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Material-UI Docs](https://mui.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Zod Validation](https://zod.dev)

---

## 📄 Licencja

Projekt jest publiczny. Możliwe do użytku w celach edukacyjnych i prywatnych.

---

## 👨‍💻 Autor

**Krzysztof Palpuchowski**  
Student II roku - kierunek AJP  
Projekt zaliczeniowy - 2025/2026

---

## 📮 Kontakt

W przypadku pytań dotyczących projektu, proszę otworzyć issue na GitHub lub kontaktować się bezpośrednio z autorem.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/soberek/library.git
cd library
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
   - Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication
   - Copy your Firebase config to `src/config/firebaseConfig.ts`

4. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier

## Usage

### Adding Books
1. Click the "Dodaj książkę" (Add Book) button
2. Fill in the book details:
   - Title (required)
   - Author (required)
   - Reading status (required)
   - Genre (required)
   - Number of pages (required)
   - Pages read (optional)
   - Rating (0-10)
   - Cover image URL (optional)
3. Click "Dodaj książkę" to save

### Managing Books
- **Search**: Use the search bar to filter books by title
- **Status Change**: Click on the status chip to cycle through reading states
- **Edit**: Click the "Edytuj" (Edit) button to modify book details
- **Delete**: Click the "Usuń" (Delete) button to remove a book
- **Rating**: Click on stars to rate a book

### Reading Statistics
The app displays reading statistics including:
- Total books
- Books read
- Books in progress
- Books dropped

## Code Quality

This project follows modern React and TypeScript best practices:

### Type Safety
- Strict TypeScript configuration
- Union types for book statuses
- Comprehensive error type definitions
- Zod schema validation

### Performance
- React.memo for component optimization
- useCallback and useMemo for expensive operations
- Debounced search functionality
- Efficient state management

### Error Handling
- Error boundaries for component-level error catching
- Comprehensive error types and messages
- User-friendly error displays
- Graceful degradation

### Testing
- Unit tests for custom hooks
- Service layer testing
- Utility function testing
- Component testing with React Testing Library

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Semantic HTML structure
- Color contrast compliance

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Run linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow the existing component structure
- Add JSDoc comments for public APIs
- Write tests for new functionality
- Use meaningful variable and function names

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Material-UI](https://mui.com/)
- Database and authentication by [Firebase](https://firebase.google.com/)
- Icons by [Material Design Icons](https://materialdesignicons.com/)
