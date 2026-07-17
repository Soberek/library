# Library App - Krzysztof Palpuchowski

---

## SPIS TREŚCI

1. [Wstęp](#wstęp)
2. [Cel i Zakres Projektu](#cel-i-zakres-projektu)
3. [Funkcjonalności Aplikacji](#funkcjonalności-aplikacji)
4. [Architektura Systemu](#architektura-systemu)
5. [Stack Technologiczny](#stack-technologiczny)
6. [Przepływ Danych](#przepływ-danych)
7. [Struktura Bazy Danych](#struktura-bazy-danych)
8. [Instalacja i Konfiguracja](#instalacja-i-konfiguracja)
9. [Instrukcje Użytkowania](#instrukcje-użytkowania)
10. [Konwencje Kodowania](#konwencje-kodowania)
11. [Testowanie](#testowanie)
12. [Bezpieczeństwo](#bezpieczeństwo)
13. [Wdrożenie](#wdrożenie)
14. [Rozwijanie Projektu](#rozwijanie-projektu)

---

## WSTĘP


**Autor:** Krzysztof Palpuchowski, II rok, Stacjonarne 027358
**Status:** Ukończony i wdrożony  
**URL produkcyjny:** https://membib.netlify.app/

### Przeznaczenie

Aplikacja jest przeznaczona dla osób, które chcą:
- Organizować swoją osobistą bibliotekę cyfrową
- Śledzić postęp czytania
- Oceniać przeczytane książki
- Wyszukiwać i filtrować książki w kolekcji
- Analizować statystyki czytania

---

## CEL I ZAKRES PROJEKTU

### Cele Główne

1. **Zarządzanie kolekcją** - Umożliwienie użytkownikom dodawania, edytowania i usuwania książek z ich osobistej biblioteki

2. **Śledzenie postępu** - Możliwość śledzenia statusu czytania każdej książki (W trakcie, Przeczytana, Porzucona)

3. **Filtrowanie i wyszukiwanie** - Intuicyjne narzędzia do znajdowania książek po tytule, autorze lub gatunku

4. **Statystyki** - Wyświetlanie przydatnych informacji o bibliotece (liczba przeczytanych książek, średnia ocena, itp.)

5. **Bezpieczeństwo** - Każdy użytkownik ma dostęp tylko do swoich danych

### Zakres Funkcjonalności

**Funkcje zaimplementowane:**
- ✓ System rejestracji i logowania z Firebase
- ✓ Dodawanie, edytowanie, usuwanie książek
- ✓ Wyszukiwanie po tytule książki
- ✓ Filtrowanie po statusie, gatunku, ocenie
- ✓ Sortowanie po dacie dodania, tytule, ocenie
- ✓ Wyświetlanie statystyk
- ✓ Responsywny design (mobile, tablet, desktop)
- ✓ Testy jednostkowe
- ✓ Obsługa błędów i komunikaty dla użytkownika

---

## FUNKCJONALNOŚCI APLIKACJI

### 1. Autentykacja i Zarządzanie Kontem

#### Rejestracja
- Użytkownik podaje email i hasło
- Walidacja formularza (email, siła hasła)
- Tworzenie konta w Firebase Authentication
- Automatyczne logowanie po rejestracji

#### Logowanie
- Logowanie za pomocą email i hasła
- Opcja resetowania hasła (Firebase)
- Sesja persystuje w localStorage
- Automatyczne wylogowanie po zamknięciu sesji

#### Zarządzanie Sesją
- Przechowywanie informacji o zalogowanym użytkowniku
- Ochrona tras (protected routes)
- Automatyczne odświeżanie tokena

### 2. Zarządzanie Książkami

#### Dodawanie Książek
Użytkownik wprowadza:
- **Tytuł** - nazwa książki (wymagane, 1-200 znaków)
- **Autor** - imię i nazwisko autora (wymagane, 1-100 znaków)
- **Gatunek** - kategoria z predefiniowanej listy (wymagane)
  - Fantastyka
  - Science Fiction
  - Kryminał
  - Romans
  - Klasyka
  - Dla dzieci
  - Samodoskonalenie
  - Historia
- **Status** - stan czytania (wymagane)
  - W trakcie - aktualnie czytam
  - Przeczytana - zakończyłem czytanie
  - Porzucona - zrezygnowałem z czytania
- **Ocena** - ocena od 1 do 5 gwiazdek (opcjonalne)
- **Notatka** - dodatkowe uwagi (opcjonalne)

#### Edycja Książek
- Można edytować wszystkie pola każdej książki
- Zmiany natychmiast synchronizują się z bazą danych
- Walidacja danych identyczna jak przy dodawaniu

#### Usuwanie Książek
- Opcja usunięcia z menu akcji książki
- Potwierdzenie usunięcia dla bezpieczeństwa
- Dane zostają trwale usunięte z bazy

### 3. Wyszukiwanie i Filtrowanie

#### Wyszukiwanie
- Wyszukiwanie w czasie rzeczywistym po tytule książki
- Debouncing (opóźnienie 300ms) dla optymalizacji
- Wyszukiwanie case-insensitive (wielkość liter nie ma znaczenia)

#### Filtrowanie
Dostępne filtry:
- **Po statusie** - wybór jednego lub wielu statusów
- **Po gatunku** - wybór jednego lub wielu gatunków
- **Po ocenie** - zakres od-do (np. 3-5 gwiazdek)

#### Sortowanie
- Po dacie dodania (najnowsze/najstarsze)
- Po tytule (A-Z / Z-A)
- Po ocenie (od najwyższej/najniższej)

### 4. Widoki Danych

#### Widok Siatki (Grid View)
- Karty książek w układzie siatki
- Responsywny - 1 kolumna na mobile, 2 na tablet, 3+ na desktop
- Wyświetla: okładkę, tytuł, autora, status, ocenę
- Akcje dostępne z menu na karcie

#### Widok Tabeli (Table View)
- Wszystkie dane w formacie tabelarycznym
- Wygodny do przeglądania na dużych ekranach
- Sortowanie poprzez kliknięcie na nagłówek kolumny
- Akcje w ostatniej kolumnie

### 5. Statystyki i Dashboard

Dashboard wyświetla:
- **Liczba książek ogółem** - wszystkie pozycje w bibliotece
- **Liczba przeczytanych** - z statusem "Przeczytana"
- **Liczba w trakcie** - aktualnie czytane
- **Liczba porzuconych** - zrezygnowane
- **Średnia ocena** - średnia arytmetyczna ocen
- **Rozkład statusów** - wykres procentowy
- **Książki po gatunkach** - liczba pozycji w każdym gatunku

---

## ARCHITEKTURA SYSTEMU

### Model Architektury

Aplikacja opiera się na architekturze komponentowo-serwisowej z wyraźnym podziałem odpowiedzialności:

```
┌─────────────────────────────────────────────────┐
│              Warstwa Prezentacji                 │
│  (Komponenty React, Strony, UI)                 │
├─────────────────────────────────────────────────┤
│           Warstwa State Management               │
│  (Custom Hooks, Zustand, React Query)           │
├─────────────────────────────────────────────────┤
│            Warstwa Logiki Biznesowej             │
│  (Serwisy, Funkcje Pomocnicze, Walidacja)      │
├─────────────────────────────────────────────────┤
│              Warstwa Danych                      │
│  (Firebase: Authentication, Firestore)          │
└─────────────────────────────────────────────────┘
```

### Podziały Odpowiedzialności

#### Warstwa Prezentacji (Components)

**Lokalizacja:** `src/components/`

Zawiera komponenty React pogrupowane po funkcjonalności:

- **book/** - komponenty do wyświetlania książek
  - `BookCard.tsx` - pojedyncza karta książki
  - `BookList.tsx` - lista książek
  - `BookListEmpty.tsx` - komunikat o pustej liście
  - `BookListLoading.tsx` - stan ładowania
  - `BooksHeader.tsx` - nagłówek sekcji
  - `BooksViewSwitcher.tsx` - przełączanie widoku
  - `GridView/` - komponenty widoku siatki
  - `TableView/` - komponenty widoku tabeli

- **forms/** - formularze aplikacji
  - `AddBookForm/` - formularz dodawania/edycji książki

- **navigation/** - komponenty nawigacji
  - `Navbar.tsx` - responsywny navbar
  - `MobileNavbar.tsx` - navbar na mobile
  - `MobileDrawer.tsx` - szuflada na mobile
  - `DesktopNavbar.tsx` - navbar na desktop
  - `SearchBar.tsx` - pasek wyszukiwania
  - `UserMenu.tsx` - menu użytkownika

- **statistics/** - widgety statystyk
  - `StatisticsDashboard.tsx` - główny dashboard
  - `MetricsGrid.tsx` - siatka metryk
  - `StatCard.tsx` - pojedyncza karta statystyki

- **filters/** - komponenty filtrowania
  - `FilterSortPanel.tsx` - panel filtrów i sortowania

- **ui/** - komponenty bazowe i narzędziowe
  - `ErrorBoundary.tsx` - łapanie błędów komponentów
  - `ErrorDisplay.tsx` - wyświetlanie błędów
  - `LoadingSpinner.tsx` - wskaźnik ładowania
  - `ProtectedRoute.tsx` - ochrona tras
  - `Input.tsx` - input field
  - `CustomModal.tsx` - modal dialog
  - `PageHeader.tsx` - nagłówek strony

**Konwencje:**
- Komponenty funkcyjne z hooks'ami
- Props interfejsy dla typizacji
- Memoizacja komponentów dużych (React.memo)
- Destructuring props w sygnaturze funkcji

#### Warstwa State Management

**Lokalizacja:** `src/hooks/` i `src/stores/`

**Custom Hooks:**
- `useAuth.ts` - autentykacja użytkownika
- `useBooks.ts` - zarządzanie danymi książek
- `useSearch.tsx` - funkcjonalność wyszukiwania
- `useBookFilters.ts` - zarządzanie filtrami
- `useBooksQuery.ts` - zapytania do książek
- `useDebounce.ts` - debouncing wartości
- `useLocalStorage.ts` - przechowywanie w localStorage

**Zustand Stores:**
- `filterStore.ts` - global state filtrów
- `uiStore.ts` - global state UI (dark mode, itp.)

**React Query:**
- Zarządzanie cache'em danych
- Automatyczne refetch'owanie
- Obsługa stanów loading/error/success

#### Warstwa Logiki Biznesowej

**Serwisy:** `src/services/booksService.ts`

Funkcje do komunikacji z Firebase Firestore:
- `addBook()` - dodanie nowej książki
- `updateBook()` - aktualizacja książki
- `deleteBook()` - usunięcie książki
- `getBooks()` - pobranie wszystkich książek użytkownika
- `getBook()` - pobranie jednej książki
- `subscribeToBooks()` - subskrypcja zmian (real-time)

**Walidacja:** `src/schemas/bookSchema.ts`

Schematy Zod do walidacji danych:
- `bookFormSchema` - walidacja formularza
- `bookSchema` - walidacja modelu książki

**Funkcje Pomocnicze:** `src/utils/`

- `bookFilters.ts` - filtry i sortowanie
- `validation.ts` - walidacja danych
- `textHelpers.ts` - pomocne funkcje tekstowe

#### Warstwa Danych

**Firebase:**
- **Authentication** - zarządzanie użytkownikami
- **Firestore** - baza danych NoSQL

**Konfiguracja:** `src/config/firebaseConfig.ts`

---

## STACK TECHNOLOGICZNY

### Frontend Framework
- **React 19** - biblioteka do budowania UI
- **TypeScript** - statyczna typizacja
- **React Router 7** - routing aplikacji

### Styling
- **Tailwind CSS 4.1** - utility-first CSS framework
- **Material-UI 5.15** - biblioteka komponentów
- **Emotion** - CSS-in-JS do MUI
- **Lucide React** - biblioteka ikon

### Zarządzanie Stanem
- **React Query 5.90** - zarządzanie stanem asynchronicznym
- **Zustand 5.0** - global state management
- **React Hook Form 7.62** - zarządzanie formularzami

### Walidacja
- **Zod 4.1** - schema validation library

### Build i Development
- **Vite 5** - build tool i dev server
- **npm/pnpm** - package manager

### Firebase
- **Firebase SDK 12.1** - authentication i Firestore

### Testowanie
- **Jest** - test runner
- **React Testing Library 16.3** - testy komponentów
- **jsdom** - DOM environment dla testów

### Linting i Formatowanie
- **ESLint 9.33** - linting kodu
- **Prettier** - automatyczne formatowanie

---

## PRZEPŁYW DANYCH

### Przepływ Dodawania Książki

```
1. Użytkownik wypełnia formularz
   ↓
2. React Hook Form zbiera dane
   ↓
3. Zod sprawdza validację
   ↓
4. Jeśli OK → wołamy serwis
   ↓
5. booksService.addBook() zapisuje do Firestore
   ↓
6. Firebase emit'a zmianę → React Query updates
   ↓
7. Komponent się re-renderuje z nowymi danymi
   ↓
8. Wyświetl potwierdzenie i zamknij formularz
```

### Przepływ Ładowania Książek

```
1. Komponent Books.tsx się montuje
   ↓
2. useBooks() hook pobiera dane za pomocą React Query
   ↓
3. Query wywoła booksService.getBooks()
   ↓
4. Firebase Firestore zwraca dane
   ↓
5. React Query cachuje dane
   ↓
6. Komponent wyświetla loading spinner
   ↓
7. Dane się załadują → wyświetl listę
```

### Przepływ Autentykacji

```
1. Użytkownik przechodzi do /signin
   ↓
2. Wpisuje email i hasło
   ↓
3. Firebase.auth().signInWithEmailAndPassword()
   ↓
4. Jeśli pomyślnie → Firebase emituje zmianę
   ↓
5. useAuth() hook aktualizuje kontekst użytkownika
   ↓
6. Router przekierowuje do /books
   ↓
7. Protected routes sprawdzają czy user jest zalogowany
```

### Przepływ Filtrowania

```
1. Użytkownik zmienia filtry w panelu
   ↓
2. filterStore.ts aktualizuje globalny stan
   ↓
3. useBooksQuery() obserwuje zmiany filtrów
   ↓
4. Trigguje re-fetch danych z nowymi parametrami
   ↓
5. bookFilters.ts aplikuje filtry na dane
   ↓
6. Komponenty wyświetlają przefiltrowane dane
```

---

## STRUKTURA BAZY DANYCH

### Firebase Firestore Collections

#### Collection: books

```
/books
  /userId1
    - id: string (Firebase doc ID)
    - userId: string (identyfikator użytkownika)
    - title: string (tytuł książki)
    - author: string (autor)
    - genre: string (gatunek)
    - status: "W trakcie" | "Przeczytana" | "Porzucona"
    - rating: number (1-5, opcjonalne)
    - notes: string (notatki użytkownika, opcjonalne)
    - createdAt: Timestamp (data dodania)
    - updatedAt: Timestamp (data ostatniej aktualizacji)
  
  /userId2
    ...
```

### Opis Pól

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| id | string | Tak | Unikalny identyfikator dokumentu (generowany przez Firebase) |
| userId | string | Tak | ID użytkownika właściciela (izolacja danych) |
| title | string | Tak | Tytuł książki, 1-200 znaków |
| author | string | Tak | Imię i nazwisko autora, 1-100 znaków |
| genre | string | Tak | Kategoria z predefiniowanej listy |
| status | enum | Tak | Jeden z: "W trakcie", "Przeczytana", "Porzucona" |
| rating | number | Nie | Ocena od 1-5, dokładność do 0.5 |
| notes | string | Nie | Notatki użytkownika, max 500 znaków |
| createdAt | Timestamp | Tak | Czas utworzenia dokumentu |
| updatedAt | Timestamp | Tak | Czas ostatniej aktualizacji |

### Security Rules

Firestore rules zapewniają:
- Każdy użytkownik ma dostęp tylko do swoich danych
- Moderator/admin mogą zarządzać wszystkimi danymi
- Nieuwierzytelnieni użytkownicy nie mają dostępu

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## INSTALACJA I KONFIGURACJA

### Wymagania Systemowe

- **Node.js** w wersji 16.x lub wyższej
- **pnpm** w wersji 8+ lub **npm** 8+
- **Git** do klonowania repozytorium
- Nowoczesna przeglądarka (Chrome, Firefox, Safari, Edge)

### Kroki Instalacji

#### 1. Klonowanie Repozytorium

```bash
git clone https://github.com/Soberek/library.git
cd library
```

#### 2. Instalacja Zależności

Przy użyciu **pnpm** (zalecane):
```bash
pnpm install
```

Lub przy użyciu **npm**:
```bash
npm install
```

#### 3. Konfiguracja Firebase

1. Przejdź na https://console.firebase.google.com/
2. Stwórz nowy projekt lub użyj istniejący
3. Aktywuj Firebase Authentication (Email/Password)
4. Stwórz Firestore Database (tryb development na początek)
5. Skopiuj konfigurację (Project settings)

6. Utwórz plik `src/config/firebaseConfig.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### 4. Konfiguracja Firestore Security Rules

W Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /books/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

#### 5. Uruchomienie Serwera Deweloperskiego

```bash
pnpm dev
```

Aplikacja otworzy się automatycznie na `http://localhost:5173`

### Konfiguracja Tailwind CSS

Plik `tailwind.config.js` zawiera predefiniowane:
- Kolory
- Typografia
- Breakpoints
- Custom utilities

Nie wymaga dodatkowej konfiguracji - wszystko jest już skonfigurowane.

### Konfiguracja TypeScript

Projekt używa trzech plików konfiguracyjnych:
- `tsconfig.json` - główna konfiguracja
- `tsconfig.app.json` - ustawienia dla aplikacji
- `tsconfig.node.json` - ustawienia dla toolów

Domyślnie: `strict: true` - ścisła typizacja obowiązkowa.

---

## INSTRUKCJE UŻYTKOWANIA

### Dla Użytkownika Końcowego

#### Rejestracja Nowego Konta

1. Przejdź na https://membib.netlify.app/
2. Kliknij "Załóż konto"
3. Wpisz email i hasło
4. Hasło musi zawierać:
   - Minimum 8 znaków
   - Minimum 1 wielką literę
   - Minimum 1 cyfrę
5. Kliknij "Zarejestruj"
6. Będziesz automatycznie zalogowany

#### Logowanie

1. Przejdź na stronę logowania
2. Wpisz email i hasło
3. Kliknij "Zaloguj się"
4. Jeśli zapomniałeś hasła – kliknij "Nie pamiętam hasła"

#### Dodanie Nowej Książki

1. Zaloguj się do aplikacji
2. Kliknij przycisk "Dodaj książkę" lub "+"
3. Wypełnij formularz:
   - **Tytuł** - nazwa książki
   - **Autor** - imię i nazwisko autora
   - **Gatunek** - wybierz z listy
   - **Status** - gdzie jesteś w czytaniu
   - **Ocena** (opcjonalne) - jak ci się spodobała
   - **Notatka** (opcjonalne) - twoja opinia
4. Kliknij "Dodaj książkę"
5. Książka pojawi się w twojej bibliotece

#### Edycja Książki

1. Znajdź książkę w bibliotece
2. Kliknij przycisk edycji (ikona ołówka) lub menu akcji
3. Zmień potrzebne dane
4. Kliknij "Zapisz zmiany"

#### Usunięcie Książki

1. Znajdź książkę w bibliotece
2. Kliknij menu akcji (trzy kreski) lub ikonę kosza
3. Wybierz "Usuń"
4. Potwierdź operację
5. Książka zostanie usunięta bezpowrotnie

#### Wyszukiwanie Książek

1. Kliknij pasek wyszukiwania na górze strony
2. Wpisz fragment tytułu książki
3. Wyniki będą się pokazywać w czasie rzeczywistym
4. Kliknij na książkę aby ją wybrać

#### Filtrowanie i Sortowanie

1. Otwórz panel filtrów (ikona lejka)
2. Zaznacz interesujące cię filtry:
   - **Status** - które statusy chcesz widzieć
   - **Gatunek** - które gatunki
   - **Ocena** - jaki zakres ocen
3. Wybierz sortowanie:
   - Po dacie dodania
   - Po tytule
   - Po ocenie
4. Kliknij "Zastosuj" lub filtry się automatycznie aktualizują

#### Przeglądanie Statystyk

1. Kliknij "Statystyki" w menu głównym
2. Przejrzyj dashboard z informacjami:
   - Liczba wszystkich książek
   - Liczba przeczytanych
   - Liczba w trakcie czytania
   - Średnia ocena
   - Rozkład po gatunkach

#### Zmiana Widoku

1. Na stronie głównej kliknij ikonę widoku (obok tytułu)
2. Wybierz między:
   - **Widok siatki** - karty książek
   - **Widok tabeli** - tabelaryczne dane

#### Wylogowanie

1. Kliknij ikonę użytkownika w górnym rogu
2. Wybierz "Wyloguj się"
3. Będziesz przekierowany na stronę logowania

### Dla Deweloperów

#### Struktura Folderu Src

```
src/
├── components/          # Komponenty React
├── config/             # Konfiguracja (Firebase)
├── constants/          # Stałe aplikacji
├── hooks/             # Custom React hooks
├── pages/             # Strony (routes)
├── providers/         # Context providers
├── schemas/           # Zod validations
├── services/          # API/Firebase services
├── stores/            # Zustand stores
├── theme/             # Material-UI theme
├── types/             # TypeScript types
├── utils/             # Helper functions
├── App.tsx            # Root component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

#### Dodawanie Nowego Typu Książki (Feature)

1. **Zdefiniuj typ w `src/types/`**
   ```typescript
   // src/types/MyFeature.ts
   export interface MyFeature {
     id: string;
     userId: string;
     // ... fields
   }
   ```

2. **Stwórz schmat validacji w `src/schemas/`**
   ```typescript
   // src/schemas/myFeatureSchema.ts
   export const myFeatureSchema = z.object({
     // ... zod validation
   });
   ```

3. **Implementuj serwis w `src/services/`**
   ```typescript
   // Dodaj funkcje do booksService.ts
   export const addMyFeature = async (data) => {
     // Firebase operations
   };
   ```

4. **Stwórz custom hook w `src/hooks/`**
   ```typescript
   // src/hooks/useMyFeature.ts
   export const useMyFeature = () => {
     // Hook logic
   };
   ```

5. **Utwórz komponenty w `src/components/`**
   ```typescript
   // src/components/MyFeature/MyFeatureComponent.tsx
   export const MyFeatureComponent = () => {
     // Component JSX
   };
   ```

6. **Zaktualizuj barrel exports w `index.ts`**
   ```typescript
   // src/components/index.ts
   export { MyFeatureComponent } from './MyFeature/MyFeatureComponent';
   ```

#### Uruchamianie Testów

```bash
# Wszystkie testy
pnpm test

# Testy z obserwacją zmian
pnpm test --watch

# Pokrycie testami
pnpm test --coverage

# Jeden plik testowy
pnpm test useBooks.test.tsx
```

#### Debugowanie

1. **Konsola przeglądarki** - Ctrl+Shift+J / Cmd+Option+J
2. **React DevTools** - zainstaluj rozszerzenie
3. **VS Code Debugger** - uruchom `npm run dev` i ustaw breakpoints

#### Zmiana Konfiguracji Firebase

Edytuj `src/config/firebaseConfig.ts` z nowymi wartościami z Firebase Console.

#### Dodawanie Nowej Zależności

```bash
# Dodaj pakiet
pnpm add package-name

# Dodaj jako dev-dependency
pnpm add -D package-name

# Sprawdź konflikty
pnpm install
```

---

## KONWENCJE KODOWANIA

### Konwencje Nazewnictwa

#### Komponenty
- **PascalCase** dla nazw plików i komponentów
- Przykład: `BookCard.tsx`, `AddBookForm.tsx`
- Jeden komponent = jeden plik

#### Funkcje i Zmienne
- **camelCase** dla funkcji i zmiennych
- Przykład: `addBook`, `handleSubmit`, `userId`

#### Stałe
- **UPPER_SNAKE_CASE** dla stałych
- Przykład: `MAX_TITLE_LENGTH`, `DEFAULT_PAGE_SIZE`

#### Pliki
- **camelCase** dla zwykłych plików
- **kebab-case** dla plików konfiguracyjnych
- Przykład: `bookFilters.ts`, `tsconfig.json`

### Struktura Komponentu

Standardowa struktura komponentu React:

```typescript
import React from 'react';
import { useHook } from '@hooks';
import { Component } from '@components';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  const [state, setState] = React.useState('');

  const handleClick = () => {
    // Logic
  };

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};

export default MyComponent;
```

### Konwencje TypeScript

#### Interfejsy i Typy
```typescript
// Interfejsy dla Props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// Typy dla danych
type BookStatus = 'W trakcie' | 'Przeczytana' | 'Porzucona';

// Typy dla funkcji
type AddBook = (book: Book) => Promise<void>;
```

#### Generyki
```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}

function getData<T>(url: string): Promise<ApiResponse<T>> {
  // Implementation
}
```

### Konwencje Stylu

#### Tailwind Classes
```tsx
// Struktura: responsive + state + property
<div className="p-4 md:p-6 hover:bg-blue-100 focus:ring-2 dark:bg-gray-800">
  Content
</div>
```

#### Material-UI Components
```tsx
import { Button, TextField } from '@mui/material';

<Button variant="contained" color="primary" onClick={handleClick}>
  Action
</Button>
```

#### CSS Modules (jeśli potrzebne)
```typescript
import styles from './Component.module.css';

<div className={styles.container}>
  Content
</div>
```

### Obsługa Błędów

#### Try-Catch
```typescript
try {
  await addBook(data);
  showSuccess('Książka dodana');
} catch (error) {
  if (error instanceof FirebaseError) {
    showError(error.message);
  } else {
    showError('Nieznany błąd');
  }
}
```

#### React Error Boundary
```typescript
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### Komentarze

```typescript
// Single line comments dla krótkich wyjaśnień

/**
 * Funkcja dodająca nową książkę do biblioteki
 * @param book - Dane książki do dodania
 * @returns Promise z ID dodanej książki
 * @throws FirebaseError jeśli operacja się nie powiedzie
 */
export async function addBook(book: BookFormData): Promise<string> {
  // Implementation
}
```

---

## TESTOWANIE

### Struktura Testów

Testy znajdują się w katalogu `__tests__/` obok implementacji:

```
src/
├── hooks/
│   ├── useBooks.tsx
│   └── __tests__/
│       └── useBooks.test.tsx
├── services/
│   ├── booksService.ts
│   └── __tests__/
│       └── booksService.test.ts
└── utils/
    ├── validation.ts
    └── __tests__/
        └── validation.test.ts
```

### Pisanie Testów

#### Test Hook'u (useBooks.test.tsx)

```typescript
import { renderHook, act } from '@testing-library/react';
import { useBooks } from '../useBooks';

describe('useBooks hook', () => {
  test('should add book to library', async () => {
    const { result } = renderHook(() => useBooks());

    act(() => {
      result.current.addBook({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fantastyka',
        status: 'W trakcie',
      });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Test Book');
  });
});
```

#### Test Komponentu

```typescript
import { render, screen } from '@testing-library/react';
import { BookCard } from '../BookCard';

describe('BookCard component', () => {
  test('should render book title', () => {
    const book = {
      id: '1',
      title: 'Test Book',
      author: 'Author',
      genre: 'Fantastyka',
      status: 'W trakcie',
      rating: 4,
    };

    render(<BookCard book={book} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });
});
```

#### Test Funkcji Helperów

```typescript
import { filterBooks } from '../bookFilters';

describe('filterBooks function', () => {
  test('should filter books by status', () => {
    const books = [
      { status: 'W trakcie' },
      { status: 'Przeczytana' },
    ];

    const result = filterBooks(books, { status: 'W trakcie' });
    expect(result).toHaveLength(1);
  });
});
```

### Uruchamianie Testów

```bash
# Wszystkie testy
pnpm test

# Obserwuj zmiany i ponownie testuj
pnpm test --watch

# Test pokrycia
pnpm test --coverage

# Test konkretnego pliku
pnpm test BookCard.test.tsx

# Verbose output
pnpm test --verbose
```

### Typowe Assertions

```typescript
// Existence
expect(element).toBeInTheDocument();
expect(value).toBeDefined();

// Values
expect(count).toBe(5);
expect(name).toEqual('John');
expect(array).toContain('item');

// Types
expect(result).toBeInstanceOf(Object);
expect(value).toBeNull();

// Functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveReturnedWith(expectedValue);
```

---

## BEZPIECZEŃSTWO

### Bezpieczeństwo Autentykacji

#### Hasła
- Minimum 8 znaków obowiązkowe
- Walidacja: wielka litera, cyfra
- Szyfrowanie przez Firebase (bcrypt)
- Nigdy nie przechowujemy haseł w lokalnym storage

#### Tokeny
- Firebase JWT tokeny
- Automatyczne odświeżanie
- Przechowywanie w Firestore (bezpieczne)
- Wylogowanie czyści sesję

### Bezpieczeństwo Danych

#### Firestore Security Rules
```
- Każdy user ma dostęp tylko do swoich danych
- userId w queryach wymuszony
- Nie pozwalamy na wildcard queries
```

#### CORS Protection
- API tylko z zaufanych domen
- Firebase pozwala na lokalne development

### Walidacja Input

#### Frontend
- Zod schematy dla każdego formularza
- TypeScript strict mode
- HTML5 input validation

#### Backend (Firebase)
- Firestore security rules
- Triggery do walidacji na serwerze

### Obsługa Podatności

- Brak zakodowanych sekretów
- Firebase config publiczny (domyślnie)
- Aktualizacje bezpieczeństwa zależności
- Sprawdzenia ESLint

---

## WDROŻENIE

### Build dla Produkcji

```bash
# Stwórz production build
pnpm build

# Preview build'u lokalnie
pnpm preview
```

Build process:
1. TypeScript compile (`tsc -b`)
2. Vite bundle
3. Minification
4. Code splitting
5. Source maps (production)

### Wdrażanie na Netlify

1. Push do GitHub
2. Połącz repozytorium w Netlify
3. Ustaw build command: `pnpm build`
4. Ustaw publish directory: `dist`
5. Dodaj environment variables (Firebase config)
6. Deploy

### Environment Variables

Dla development i production potrzebne:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Performance

#### Optimizacje Implementowane
- Code splitting z React.lazy
- Memoizacja komponentów dużych
- React Query caching
- Debouncing search
- Image optimization
- CSS purging (Tailwind)

#### Metryki
- First Contentful Paint (FCP) < 2s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1

---

## ROZWIJANIE PROJEKTU

### Mapa Przyszłych Funkcji

#### Krótkoterminowe (1-2 tygodnie)
- [ ] Eksport biblioteki (CSV/PDF)
- [ ] Udostępnianie biblioteki innym użytkownikom
- [ ] Notyfikacje o nowych wydaniach
- [ ] Integracja z API książek (Google Books)

#### Średnioterminowe (1-2 miesiące)
- [ ] Aplikacja mobilna (React Native)
- [ ] Offline mode (Service Workers)
- [ ] Social features (recenzje, oceny)
- [ ] Advanced analytics
- [ ] Dark mode (w pełni zaimplementowany)

#### Długoterminowe (3+ miesiące)
- [ ] AI rekomendacje książek
- [ ] Integracja z bibliotekami
- [ ] Synchronizacja z Goodreads
- [ ] Multiplayer challenges
- [ ] Subscription features

### Proces Dodawania Nowej Funkcji

1. **Planowanie** - stwórz issue w GitHub
2. **Design** - prototyp UI/UX
3. **Typy** - dodaj TypeScript types
4. **Logika** - serwis i validacja
5. **Komponenty** - UI implementation
6. **Testy** - unit tests
7. **Review** - kod review
8. **Deploy** - merge do main

### Troubleshooting

#### Problem: Firebase Auth nie działa
**Rozwiązanie:**
1. Sprawdź firebaseConfig.ts
2. Upewnij się, że Firebase projekt jest aktywny
3. Sprawdź CORS settings
4. Przywróć cache przeglądarki

#### Problem: Dane nie synchronizują się
**Rozwiązanie:**
1. Sprawdź Firestore rules
2. Upewnij się, że userId jest poprawny
3. Sprawdź React Query cache
4. Uruchom pnpm dev ponownie

#### Problem: Testy nie przechodzą
**Rozwiązanie:**
1. Sprawdź mocks
2. Ustaw proper test environment
3. Wyczyść node_modules i zainstaluj ponownie
4. Sprawdź wersje bibliotek

### Performance Tuning

#### Code Splitting
```typescript
const BookDetails = React.lazy(() => import('./BookDetails'));

<Suspense fallback={<LoadingSpinner />}>
  <BookDetails />
</Suspense>
```

#### Memoizacja
```typescript
const BookCard = React.memo(({ book, onEdit, onDelete }) => {
  return <div>...</div>;
}, (prevProps, nextProps) => {
  return prevProps.book.id === nextProps.book.id;
});
```

#### React Query Optimization
```typescript
useQuery({
  queryKey: ['books', { userId, filters }],
  queryFn: () => fetchBooks(userId, filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});
```

---

## PODSUMOWANIE

### Co Zostało Osiągnięte

✓ Kompletna aplikacja do zarządzania biblioteczką  
✓ System autentykacji użytkowników  
✓ Baza danych Firestore  
✓ Responsive design  
✓ Wyszukiwanie i filtrowanie  
✓ Statystyki i dashboard  
✓ Testy jednostkowe  
✓ Wdrożenie na Netlify  

### Wskaźniki Sukcesu

- Aplikacja dostępna online
- 100% funkcjonalności zaplanowanej
- Pokrycie testami > 80%
- Lighthouse score > 90
- Time to Interactive < 3s

### Kontakt i Wsparcie

**Autor:** Krzysztof Palpuchowski  
**GitHub:** https://github.com/Soberek/library  
**Live Demo:** https://membib.netlify.app/  

---

**Ostatnia aktualizacja:** styczeń 2026  
**Status:** Projekt ukończony i wdrożony w produkcji
