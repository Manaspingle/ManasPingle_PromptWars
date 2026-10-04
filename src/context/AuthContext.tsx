import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  signInAnonymously,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch {
      // If anonymous auth is disabled on the firebase console, create a transient local session user object
      const mockGuest = {
        uid: 'guest-' + Date.now(),
        email: 'evaluator.guest@thinklens.ai',
        displayName: 'Guest Evaluator',
        isAnonymous: true,
      } as unknown as User;
      setUser(mockGuest);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const isGuest = Boolean(user?.isAnonymous || user?.uid?.startsWith('guest-'));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGuest,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
