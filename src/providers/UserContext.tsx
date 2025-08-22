import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

const UserContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do łatwego użycia kontekstu w innych komponentach
export function useUser() {
  return useContext(UserContext);
}
