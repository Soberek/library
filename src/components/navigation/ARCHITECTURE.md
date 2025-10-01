# Navigation Component Architecture

## Component Hierarchy

```
App.tsx
├── Navbar (Desktop only - md+)
│   ├── DesktopNavbar
│   │   └── Brand Logo + Title
│   └── AppBar (Secondary)
│       ├── SearchBar (variant="desktop")
│       └── UserMenu
│           ├── Stats Chips (lg+)
│           ├── Notifications Badge
│           └── User Avatar + Dropdown
│
├── MobileNavbar (Mobile only - xs to md)
│   ├── AppBar (Primary)
│   │   ├── Brand Logo + Title
│   │   ├── SearchBar (variant="mobile")
│   │   └── Menu Button
│   └── MobileDrawer
│       ├── User Profile Section
│       ├── Navigation Menu
│       └── Logout Button
│
└── BottomNav (Mobile only - xs to md)
    ├── FAB (Add Book)
    └── Bottom Tabs
        ├── Library
        ├── Statistics
        └── Profile
```

## Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────┐
│                    Screen Sizes                          │
├─────────────────────────────────────────────────────────┤
│  xs (0-600px)    sm (600-900px)   md+ (900px+)          │
│  ├─ Mobile ─────┤                 ├─ Desktop ─────────┤ │
│                                                          │
│  MobileNavbar   MobileNavbar      Navbar (Desktop)      │
│  BottomNav      BottomNav         (No BottomNav)        │
│  MobileDrawer   MobileDrawer      (No Drawer)           │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Actions
    │
    ├─→ Navigate
    │       └─→ useNavigate() → Router
    │
    ├─→ Search
    │       └─→ SearchBar → useSearch() → SearchContext
    │
    ├─→ User Menu
    │       └─→ UserMenu → useUser() → UserContext
    │
    └─→ Book Actions
            └─→ BottomNav FAB → handleBookModalOpen
```

## State Management

```
┌─────────────────────────────────┐
│    Navigation State             │
├─────────────────────────────────┤
│                                 │
│  Local State:                   │
│  ├─ drawerOpen (MobileNavbar)   │
│  ├─ anchorEl (UserMenu)         │
│  └─ value (BottomNav)           │
│                                 │
│  Context/Hooks:                 │
│  ├─ useSearch() → searchTerm    │
│  ├─ useUser() → user, loading   │
│  └─ useBooks() → booksStats     │
│                                 │
└─────────────────────────────────┘
```

## Component Communication

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Parent Component (Books.tsx)                       │
│        │                                            │
│        ├─→ Navbar/MobileNavbar                     │
│        │       └─→ Uses Router context             │
│        │                                            │
│        └─→ BottomNav                               │
│                └─→ Receives handleBookModalOpen    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Style Inheritance

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Theme (theme.ts)                                  │
│    ├─ Primary Colors (#667eea, #764ba2)           │
│    ├─ Typography                                   │
│    └─ Breakpoints                                  │
│                                                     │
│  Component Style Constants                         │
│    ├─ NAVBAR_STYLES                               │
│    ├─ MOBILE_NAVBAR_STYLES                        │
│    └─ Individual component styles                  │
│                                                     │
│  Inline Overrides                                  │
│    └─ Specific sx props for unique cases          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Interaction Flow Examples

### Desktop User Login Flow

```
1. User clicks "Zaloguj się" button
   └─→ UserMenu → navigate("/sign-in")

2. After login, UserMenu shows:
   ├─→ User email
   ├─→ Stats chips (books count)
   ├─→ Notifications badge
   └─→ Avatar with dropdown
```

### Mobile Navigation Flow

```
1. User taps hamburger menu
   └─→ MobileNavbar → setDrawerOpen(true)

2. Drawer slides in from right
   └─→ MobileDrawer appears

3. User selects menu item
   └─→ Navigate to route
   └─→ setDrawerOpen(false)
   └─→ Drawer slides out
```

### Search Flow (Both Mobile & Desktop)

```
1. User types in search box
   └─→ SearchBar → searchContext.setSearchTerm(value)

2. SearchContext updates
   └─→ Books.tsx receives updated searchTerm

3. Books filtered in real-time
   └─→ BookList re-renders with filtered results
```

## File Organization

```
src/components/navigation/
├── index.ts                 # Barrel exports
├── README.md               # Component documentation
├── REFACTORING.md          # Refactoring summary
├── ARCHITECTURE.md         # This file
│
├── Navbar.tsx              # Desktop wrapper
├── DesktopNavbar.tsx       # Desktop brand bar
├── MobileNavbar.tsx        # Mobile app bar
│
├── SearchBar.tsx           # Reusable search
├── UserMenu.tsx            # User dropdown/menu
├── MobileDrawer.tsx        # Mobile slide-out
└── BottomNav.tsx           # Mobile bottom tabs
```

## Performance Considerations

### Optimization Strategies

```
1. Memoization
   └─→ useCallback for event handlers

2. Conditional Rendering
   └─→ Display logic based on breakpoints

3. Code Splitting
   └─→ Mobile vs Desktop components

4. Style Optimization
   └─→ Extracted constants (computed once)

5. Animation Performance
   └─→ CSS transforms (GPU-accelerated)
```

### Re-render Triggers

```
Component          Triggers Re-render When
─────────────────  ─────────────────────────
DesktopNavbar      Rarely (static content)
MobileNavbar       drawerOpen state changes
SearchBar          searchTerm changes
UserMenu           anchorEl, user, booksStats changes
MobileDrawer       open prop changes
BottomNav          value (tab selection) changes
```

## Accessibility

```
ARIA Labels & Roles
├─ Menu button: aria-label="menu"
├─ FAB: aria-label="Dodaj książkę"
├─ Navigation: role="navigation"
└─ Drawer: role="presentation"

Keyboard Navigation
├─ Tab through interactive elements
├─ Enter/Space to activate buttons
├─ Escape to close drawer/menu
└─ Focus management in modals
```

## Browser Support

```
Feature              Support
──────────────────  ─────────────────────
CSS Grid            ✅ All modern browsers
Flexbox             ✅ All modern browsers
backdrop-filter     ⚠️  Safari 14+, Chrome 76+
CSS Custom Props    ✅ All modern browsers
Transforms          ✅ All modern browsers
```

## Future Roadmap

- [ ] Add keyboard shortcuts
- [ ] Implement breadcrumb navigation
- [ ] Add theme switcher (light/dark)
- [ ] Improve accessibility (WCAG 2.1 AA)
- [ ] Add internationalization (i18n)
- [ ] Performance monitoring
- [ ] A/B test different layouts
