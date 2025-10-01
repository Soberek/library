# Navigation Components

This directory contains all navigation-related components for the application.

## Component Architecture

### Desktop Navigation

```
Navbar.tsx (Wrapper)
├── DesktopNavbar.tsx (Brand/Logo)
├── SearchBar.tsx (Search input - desktop variant)
└── UserMenu.tsx (User actions & stats)
```

### Mobile Navigation

```
MobileNavbar.tsx
├── Brand/Logo section
├── SearchBar.tsx (Search input - mobile variant)
└── MobileDrawer.tsx (Slide-out menu)

BottomNav.tsx (Mobile bottom navigation)
```

## Components

### `Navbar.tsx`

Main wrapper for desktop navigation. Combines the brand navbar with secondary bar containing search and user menu.

**Display**: Desktop only (`md+`)

### `DesktopNavbar.tsx`

Top brand bar with logo and application name.

**Features**:

- Centered brand layout
- Animated logo with hover effects
- Gradient text styling
- Click to navigate home

### `MobileNavbar.tsx`

Mobile-specific navigation bar with hamburger menu.

**Features**:

- Brand logo and name
- Hamburger menu button
- Integrated search bar
- Optimized for mobile screens

### `SearchBar.tsx`

Reusable search component with variant support.

**Props**:

- `variant`: `"desktop" | "mobile"` - Adapts styling based on context
- `placeholder`: Optional custom placeholder text

**Features**:

- Adaptive styling (mobile/desktop)
- Smooth focus transitions
- Real-time search integration

### `UserMenu.tsx`

User account menu with stats and actions.

**Features**:

- User avatar and email
- Book statistics chips (desktop)
- Notifications badge
- Dropdown menu with profile/settings/logout
- Login button for unauthenticated users

### `MobileDrawer.tsx`

Slide-out navigation drawer for mobile.

**Features**:

- User profile section with stats
- Navigation menu items
- Animated transitions
- Logout functionality

### `BottomNav.tsx`

Fixed bottom navigation for mobile devices.

**Features**:

- Floating action button (FAB) for adding books
- Quick navigation tabs
- Active state indicators
- Smooth animations

## Styling Patterns

### Design System

- **Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Glassmorphism**: `backdrop-filter: blur(20px)` with semi-transparent backgrounds
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` for smooth animations
- **Shadows**: Layered shadows for depth

### Constants

Each component uses style constants for:

- Better maintainability
- Type safety with `as const`
- Easier theming updates
- Reduced inline style complexity

Example:

```typescript
const NAVBAR_STYLES = {
  appBar: {
    display: { xs: "none", md: "block" },
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    // ...
  },
} as const;
```

### Performance Optimizations

- `useCallback` hooks for event handlers
- Memoized style objects
- Conditional rendering based on screen size
- Optimized animation timings

## Responsive Behavior

### Breakpoints

- **Mobile** (`xs`): `< 768px` - Shows MobileNavbar + BottomNav
- **Desktop** (`md+`): `≥ 768px` - Shows Navbar (DesktopNavbar + secondary bar)

### Adaptive Features

- Search bar styling adjusts per variant
- User stats chips hidden on small screens
- Different menu structures (dropdown vs drawer)
- Bottom navigation only on mobile

## Usage Example

```tsx
import { Navbar, MobileNavbar, BottomNav } from "./components/navigation";

function App() {
  return (
    <>
      <Navbar />           {/* Desktop */}
      <MobileNavbar />     {/* Mobile */}

      {/* Your content */}

      <BottomNav           {/* Mobile bottom nav */}
        handleBookModalOpen={handleModalOpen}
      />
    </>
  );
}
```

## Maintenance Notes

### Adding New Navigation Items

1. **Desktop**: Add to `UserMenu.tsx` dropdown or create new toolbar section
2. **Mobile**: Add to `MobileDrawer.tsx` menu list

### Styling Updates

- Update style constants at top of each component
- Maintain consistency across desktop/mobile variants
- Test responsive behavior at all breakpoints

### Performance Considerations

- Keep style objects outside render when possible
- Use `React.memo` for expensive child components
- Minimize re-renders with proper hook usage

## Dependencies

- `@mui/material` - UI components
- `@mui/icons-material` - Icons
- `react-router-dom` - Navigation
- `firebase/auth` - Authentication
- Custom hooks: `useSearch`, `useUser`, `useBooks`
