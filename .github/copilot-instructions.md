# Library App - AI Coding Guidelines

## Project Overview

This is a React TypeScript book tracking application using Firebase for authentication and data storage. The app allows users to manage their personal book collections with reading status, ratings, and progress tracking.

## Architecture & Data Flow

- **Frontend**: React 19 + TypeScript with functional components and hooks
- **Routing**: React Router with protected routes (`src/providers/RouterProvider.tsx`)
- **Authentication**: Firebase Auth with user context (`src/providers/UserContext.tsx`)
- **Data Layer**: Firestore with user-scoped queries (`src/services/booksService.ts`)
- **State Management**: Custom hooks (`src/hooks/useBooks.tsx`, `src/hooks/useUser.tsx`)
- **Validation**: Zod schemas with Polish error messages (`src/schemas/bookSchema.ts`)
- **UI**: Material-UI + Tailwind CSS hybrid (`src/theme/theme.ts`)

## Key Conventions

### Book Status Cycle

Book statuses rotate in this Polish-language sequence:

```typescript
"W trakcie" → "Przeczytana" → "Porzucona" → "W trakcie"
```

Use `getNextBookStatus()` from `src/constants/bookStatus.ts` for transitions.

### Validation & Error Handling

- All forms use React Hook Form + Zod validation
- Error messages are in Polish (stored in `src/constants/validation.ts`)
- Firebase errors are wrapped with custom error types (`src/types/Error.ts`)
- Use `ErrorBoundary` component for UI error catching

### Component Organization

- Barrel exports in `src/components/index.ts` for clean imports
- Components are grouped by feature: `book/`, `forms/`, `navigation/`, `statistics/`
- Custom hooks in `src/hooks/` with individual exports in `index.ts`

### Styling Patterns

- MUI components with custom theme palette
- Tailwind utilities for responsive design and spacing
- Status-based color coding (green/amber/red gradients in `BookCard.tsx`)

### Data Models

- Books include `userId` for multi-tenancy
- `BookFormData` excludes `id` and `createdAt` for forms
- `BookUpdateData` is partial for PATCH operations

## Development Workflow

### Build & Run

```bash
npm run dev      # Vite dev server
npm run build    # TypeScript + Vite build
npm run preview  # Preview production build
```

### Testing

```bash
npm test         # Jest with jsdom environment
```

- Tests in `__tests__/` directories alongside implementation
- Uses React Testing Library + jsdom

### Code Quality

```bash
npm run lint     # ESLint
npm run format   # Prettier with Tailwind plugin
```

## Integration Points

### Firebase Configuration

- Auth state managed via `onAuthStateChanged` listener
- Firestore queries filtered by `userId` for data isolation
- Error handling distinguishes network vs Firebase errors

### External Dependencies

- Lucide React icons (not Material Icons)
- Emotion for MUI styling (not styled-components)
- React Hook Form for complex form state

## Common Patterns

### Adding New Features

1. Define types in `src/types/`
2. Add Zod schema in `src/schemas/`
3. Implement service methods in `src/services/`
4. Create custom hook in `src/hooks/`
5. Build components in `src/components/`
6. Update barrel exports

### Form Handling

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<BookFormData>({
  resolver: zodResolver(bookFormSchema),
});
```

### Firebase Operations

```typescript
const booksRef = collection(db, "books");
const q = query(booksRef, where("userId", "==", userId));
```

### Error Boundaries

Wrap components with `<ErrorBoundary>` for graceful error handling.

## File Structure Reference

- `src/components/book/` - Book display and interaction components
- `src/hooks/` - Custom hooks for data and state management
- `src/services/` - Firebase service layer
- `src/types/` - TypeScript type definitions
- `src/schemas/` - Zod validation schemas
- `src/constants/` - App constants (statuses, validation rules, genres)</content>
  <parameter name="filePath">/Users/krzysztofpalpuchowski/Documents/GitHub/library/.github/copilot-instructions.md
