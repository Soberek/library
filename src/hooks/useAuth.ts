import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

// Hook für Auth-State mit React Query
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

// Alternative: Query-basierte Implementierung
// Dies könnte für komplexere Auth-Szenarien nützlich sein
export const useAuthQuery = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return useQuery({
    queryKey: ['auth', user?.uid],
    queryFn: async () => {
      return user;
    },
    enabled: !!user,
    initialData: user,
  });
};

