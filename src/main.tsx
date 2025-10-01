import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./providers/UserContext.tsx";

import { SearchProvider } from "./providers/SearchProvider.tsx";
import { ThemeProvider } from "./theme";
import RouterProviderWrapper from "./providers/RouterProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider>
        <SearchProvider>
          <RouterProviderWrapper />
        </SearchProvider>
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
);
