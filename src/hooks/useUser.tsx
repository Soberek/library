// Hook do łatwego użycia kontekstu w innych komponentach

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";

export const UserContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function useUser() {
  return useContext(UserContext);
}
