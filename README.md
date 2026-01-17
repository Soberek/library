# Library App - Krzysztof Palpuchowski Student AJP II rok

## Description

A modern, production-ready web application built with React and TypeScript to help you keep track of books you have read. Features a clean, intuitive interface with comprehensive error handling, validation, and performance optimizations.

## Live Demo

Try the app live here: [https://membib.netlify.app/](https://membib.netlify.app/)

## Features

### Core Functionality
- ✅ Add books with title, author, genre, reading status, rating
- ✅ Search and filter books by title
- ✅ Mark books as read, unread or dropped
- ✅ View reading progress and statistics
- ✅ Edit and delete books
- ✅ Responsive design for mobile and desktop

### Technical Features
- ✅ **Type Safety**: Strict TypeScript with union types and proper error handling
- ✅ **Validation**: Zod schema validation for forms and API responses
- ✅ **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- ✅ **Performance**: Memoized components and optimized re-renders
- ✅ **Testing**: Unit tests for hooks, services, and utilities
- ✅ **Accessibility**: ARIA labels and keyboard navigation support
- ✅ **Code Quality**: ESLint, Prettier, and consistent code organization

### Database & Authentication
- ✅ Firestore database integration
- ✅ Firebase Authentication (email/password)
- ✅ User-specific data isolation

### TODO
- [ ] Social authentication (Google, Facebook)
- [ ] Book cover image upload
- [ ] Reading progress tracking with dates
- [ ] Book recommendations
- [ ] Export/import functionality

## Technologies Used

### Frontend
- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Strict type safety and better developer experience
- **Material-UI (MUI)** - Component library for consistent UI
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation library

### Backend & Services
- **Firebase Auth** - User authentication
- **Firebase Firestore** - NoSQL database
- **Vite** - Fast build tool and development server

### Development & Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddBookForm/     # Book form component
│   ├── ErrorBoundary.tsx # Error boundary component
│   ├── ErrorDisplay.tsx # Error message display
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── index.ts         # Barrel exports
├── constants/           # Application constants
│   ├── bookStatus.ts    # Book status definitions
│   ├── genres.ts        # Genre options
│   ├── validation.ts    # Validation rules and messages
│   └── index.ts         # Barrel exports
├── hooks/               # Custom React hooks
│   ├── useBooks.tsx     # Books data management
│   ├── useDebounce.ts   # Debouncing utility
│   ├── useLocalStorage.ts # Local storage hook
│   └── index.ts         # Barrel exports
├── pages/               # Page components
├── providers/           # Context providers
├── schemas/             # Zod validation schemas
│   ├── bookSchema.ts    # Book validation schema
│   └── index.ts         # Barrel exports
├── services/            # API and external service integrations
│   ├── booksService.ts  # Firestore operations
│   └── index.ts         # Barrel exports
├── types/               # TypeScript type definitions
│   ├── Book.ts          # Book-related types
│   ├── Error.ts         # Error type definitions
│   ├── User.ts          # User type definitions
│   └── index.ts         # Barrel exports
└── utils/               # Utility functions
    ├── validation.ts    # Validation helpers
    └── index.ts         # Barrel exports
```

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
