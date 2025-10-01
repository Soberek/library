# Theme System

This directory contains the application's theme configuration and provider components.

## Overview

The theme system provides:

- Consistent colors, typography, and spacing
- Reusable style constants
- Material-UI theme customization
- Responsive design tokens
- Component style overrides

## Architecture

```
theme/
├── ThemeProvider.tsx       # Wraps app with MUI theme
├── theme.ts               # Theme configuration & constants
└── index.ts               # Barrel exports
```

## Files

### `ThemeProvider.tsx`

Wraps the application with Material-UI's ThemeProvider and CssBaseline.

**Usage:**

```tsx
import { ThemeProvider } from "./theme";

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

**Features:**

- Applies global CSS reset
- Enables color scheme support
- Provides theme context to all components

### `theme.ts`

Defines the application theme and reusable style constants.

**Exports:**

- `theme` (default) - Complete MUI theme object
- `THEME_CONSTANTS` - Reusable style constants

### `index.ts`

Barrel exports for clean imports:

```tsx
export { ThemeProvider } from "./theme";
export { theme, THEME_CONSTANTS } from "./theme";
```

## Theme Constants

### Usage in Components

Instead of repeating values, use `THEME_CONSTANTS`:

**Before:**

```tsx
const styles = {
  button: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: 12,
  },
};
```

**After:**

```tsx
import { THEME_CONSTANTS } from "../theme";

const styles = {
  button: {
    background: THEME_CONSTANTS.gradient.primary,
    transition: THEME_CONSTANTS.transitions.smooth,
    borderRadius: THEME_CONSTANTS.borderRadius.medium,
  },
};
```

### Available Constants

#### **Gradients**

```typescript
THEME_CONSTANTS.gradient.primary; // Main brand gradient
THEME_CONSTANTS.gradient.primaryHover; // Hover state gradient
```

#### **Transitions**

```typescript
THEME_CONSTANTS.transitions.default; // 0.2s cubic-bezier
THEME_CONSTANTS.transitions.smooth; // 0.3s cubic-bezier
```

#### **Border Radius**

```typescript
THEME_CONSTANTS.borderRadius.small; // 8px
THEME_CONSTANTS.borderRadius.medium; // 12px
THEME_CONSTANTS.borderRadius.large; // 16px
THEME_CONSTANTS.borderRadius.xlarge; // 20px
```

#### **Shadows**

```typescript
THEME_CONSTANTS.shadows.light; // Subtle shadow
THEME_CONSTANTS.shadows.medium; // Standard shadow
THEME_CONSTANTS.shadows.large; // Elevated shadow
THEME_CONSTANTS.shadows.xlarge; // Modal/dialog shadow
```

#### **Glassmorphism**

```typescript
THEME_CONSTANTS.glass.background; // Semi-transparent bg
THEME_CONSTANTS.glass.backdropFilter; // Blur effect
THEME_CONSTANTS.glass.border; // Glass border
```

## Color Palette

### Primary Colors

```typescript
primary: {
  main: "#667eea",      // Primary brand color
  light: "#8fa4f3",     // Lighter variant
  dark: "#4c63d2",      // Darker variant
  contrastText: "#fff"  // Text on primary
}
```

### Secondary Colors

```typescript
secondary: {
  main: "#764ba2",      // Secondary brand color
  light: "#9c7bb8",     // Lighter variant
  dark: "#5a3a7a",      // Darker variant
  contrastText: "#fff"  // Text on secondary
}
```

### Background Colors

```typescript
background: {
  default: "#f8fafc",   // Page background
  paper: "#ffffff"      // Card/surface background
}
```

### Text Colors

```typescript
text: {
  primary: "#1a202c",   // Main text
  secondary: "#4a5568"  // Muted text
}
```

### Status Colors

```typescript
success: {
  main: "#22c55e";
} // Green
warning: {
  main: "#f59e0b";
} // Amber
error: {
  main: "#ef4444";
} // Red
info: {
  main: "#3b82f6";
} // Blue
```

## Typography

### Font Family

```typescript
fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif";
```

### Variants

```typescript
h1: { fontWeight: 800, fontSize: "2.5rem" }
h2: { fontWeight: 700, fontSize: "2rem" }
h3: { fontWeight: 700, fontSize: "1.5rem" }
h4: { fontWeight: 600, fontSize: "1.25rem" }
h5: { fontWeight: 600, fontSize: "1.125rem" }
h6: { fontWeight: 600, fontSize: "1rem" }
body1: { fontSize: "1rem" }
body2: { fontSize: "0.875rem" }
button: { fontWeight: 600, textTransform: "none" }
```

## Component Overrides

The theme includes custom styles for Material-UI components:

### Button

- Rounded corners (12px)
- Gradient background for contained variant
- Hover lift effect
- Custom shadows

### TextField

- Rounded corners (12px)
- Smooth hover/focus transitions
- Custom border colors

### Card

- Rounded corners (16px)
- Hover elevation effect
- Clean shadows

### Chip

- Rounded corners (8px)
- Bold text

### Dialog

- Rounded corners (16px)
- Large shadow

### Paper

- No background image
- Custom elevation shadows

### LinearProgress

- Rounded corners (8px)
- 8px height

### Rating

- Custom gold colors

## Best Practices

### ✅ Do

1. **Use theme constants:**

   ```tsx
   import { THEME_CONSTANTS } from "../theme";
   sx={{ borderRadius: THEME_CONSTANTS.borderRadius.medium }}
   ```

2. **Reference theme in sx prop:**

   ```tsx
   sx={{
     color: "primary.main",
     bgcolor: "background.paper"
   }}
   ```

3. **Use theme hook for dynamic styles:**
   ```tsx
   import { useTheme } from "@mui/material/styles";
   const theme = useTheme();
   const color = theme.palette.primary.main;
   ```

### ❌ Don't

1. **Hardcode colors:**

   ```tsx
   // Bad
   sx={{ color: "#667eea" }}

   // Good
   sx={{ color: "primary.main" }}
   ```

2. **Duplicate style values:**

   ```tsx
   // Bad
   const styles = {
     borderRadius: 12, // Repeated everywhere
   };

   // Good
   import { THEME_CONSTANTS } from "../theme";
   const styles = {
     borderRadius: THEME_CONSTANTS.borderRadius.medium,
   };
   ```

3. **Mix theme systems:**

   ```tsx
   // Bad - mixing inline styles with theme
   <Button style={{ color: "red" }} />

   // Good - use sx or theme
   <Button sx={{ color: "error.main" }} />
   ```

## Examples

### Using THEME_CONSTANTS in Components

```tsx
import { Box } from "@mui/material";
import { THEME_CONSTANTS } from "../../theme";

const MyComponent = () => {
  return (
    <Box
      sx={{
        background: THEME_CONSTANTS.gradient.primary,
        borderRadius: THEME_CONSTANTS.borderRadius.large,
        boxShadow: THEME_CONSTANTS.shadows.medium,
        transition: THEME_CONSTANTS.transitions.smooth,
        "&:hover": {
          boxShadow: THEME_CONSTANTS.shadows.large,
          transform: "translateY(-2px)",
        },
      }}
    >
      Content
    </Box>
  );
};
```

### Creating Style Constants

```tsx
import { THEME_CONSTANTS } from "../../theme";

export const COMPONENT_STYLES = {
  container: {
    background: THEME_CONSTANTS.glass.background,
    backdropFilter: THEME_CONSTANTS.glass.backdropFilter,
    border: THEME_CONSTANTS.glass.border,
    borderRadius: THEME_CONSTANTS.borderRadius.large,
    transition: THEME_CONSTANTS.transitions.smooth,
  },
  button: {
    background: THEME_CONSTANTS.gradient.primary,
    borderRadius: THEME_CONSTANTS.borderRadius.medium,
    boxShadow: THEME_CONSTANTS.shadows.medium,
    "&:hover": {
      background: THEME_CONSTANTS.gradient.primaryHover,
      boxShadow: THEME_CONSTANTS.shadows.large,
    },
  },
} as const;
```

### Using Theme Hook

```tsx
import { useTheme } from "@mui/material/styles";
import { THEME_CONSTANTS } from "../../theme";

const MyComponent = () => {
  const theme = useTheme();

  // Access theme values
  const primaryColor = theme.palette.primary.main;
  const spacing = theme.spacing(2);
  const breakpoint = theme.breakpoints.up("md");

  // Combine with constants
  const gradient = THEME_CONSTANTS.gradient.primary;

  return <Box sx={{ color: primaryColor }}>Content</Box>;
};
```

## Customization

### Adding New Constants

To add new theme constants:

1. Open `theme.ts`
2. Add to `THEME_CONSTANTS` object:

```typescript
export const THEME_CONSTANTS = {
  // ... existing constants

  // New constants
  animations: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
} as const;
```

3. Use in components:

```tsx
import { THEME_CONSTANTS } from "../theme";
sx={{ animation: THEME_CONSTANTS.animations.normal }}
```

### Modifying Theme

To modify the theme:

1. Open `theme.ts`
2. Update the `createTheme()` configuration
3. Changes apply globally

Example:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: "#your-color", // Change primary color
    },
  },
});
```

## Testing

### Theme Provider Tests

```tsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "./theme";

test("renders with theme", () => {
  const { container } = render(
    <ThemeProvider>
      <div>Test</div>
    </ThemeProvider>,
  );
  expect(container).toBeInTheDocument();
});
```

### Theme Constants Tests

```tsx
import { THEME_CONSTANTS } from "./theme";

test("has required constants", () => {
  expect(THEME_CONSTANTS.gradient.primary).toBeDefined();
  expect(THEME_CONSTANTS.borderRadius.medium).toBe(12);
  expect(THEME_CONSTANTS.transitions.default).toContain("cubic-bezier");
});
```

## Performance

### Optimization Tips

1. **Extract style objects:**

   ```tsx
   // Bad - recreated on every render
   <Box sx={{ borderRadius: 12, ... }}>

   // Good - defined once
   const STYLES = { borderRadius: 12, ... } as const;
   <Box sx={STYLES}>
   ```

2. **Use theme constants:**
   - Constants are computed once at import
   - Avoid recalculating values

3. **Memoize complex styles:**
   ```tsx
   const styles = useMemo(
     () => ({
       complex: "calculation",
     }),
     [dependencies],
   );
   ```

## Troubleshooting

### Theme Not Applying

**Problem:** Styles not appearing
**Solution:** Ensure `ThemeProvider` wraps your app in `main.tsx`

### TypeScript Errors

**Problem:** Type errors with theme
**Solution:** Import from `@mui/material` and use theme hooks

### Constants Not Found

**Problem:** `THEME_CONSTANTS` undefined
**Solution:** Import from `"./theme"` not `"./theme/index"`

## Related Documentation

- [Navigation Components](../components/navigation/README.md)
- [Material-UI Theme Docs](https://mui.com/material-ui/customization/theming/)
- [CSS-in-JS Best Practices](https://mui.com/system/basics/#api)
