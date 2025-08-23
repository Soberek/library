import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { UserProvider } from "./providers/UserContext.tsx";

import { ThemeProvider } from "@mui/material";
import { SearchProvider } from "./providers/SearchProvider.tsx";
import theme from "./providers/ThemeProvider.tsx";
import RouterProviderWrapper from "./providers/RouterProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider theme={theme}>
        <SearchProvider>
          <RouterProviderWrapper />
        </SearchProvider>
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
);
