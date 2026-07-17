# Navigation Architecture

## Overview

MyLibrary uses a single-page shell: one sticky navbar on desktop, one on mobile.

```
App
├── Navbar (desktop, md+) — logo | search | UserMenu
├── MobileNavbar (xs–sm) — brand + drawer + search
└── Outlet → Books page
```

## Desktop (`md+`)

- **Navbar** — unified AppBar: MyLibrary brand (left), SearchBar (center), UserMenu (right)
- No secondary bar, no duplicate stats in the header

## Mobile (`xs–sm`)

- **MobileNavbar** — compact brand row + hamburger
- **SearchBar** — below the toolbar
- **MobileDrawer** — „Moja biblioteka” + wylogowanie (bez martwych tras)
- **AddBookFab** — floating „Dodaj” on the Books page (not a bottom tab bar)

## Data flow

```
SearchBar / FilterStatisticsPanel / BookTable headers
        ↓
   filterStore (Zustand)
        ↓
   useBookFilters → filtered books → Grid / Table
```

## File map

```
navigation/
├── Navbar.tsx          # Desktop unified AppBar
├── MobileNavbar.tsx    # Mobile top bar + search
├── MobileDrawer.tsx    # Side drawer
├── SearchBar.tsx       # Global search (filterStore)
└── UserMenu.tsx        # Avatar + logout
```

## Responsive breakpoints

| Breakpoint | Navigation |
|------------|------------|
| xs–sm      | MobileNavbar + AddBookFab |
| md+        | Navbar only |
