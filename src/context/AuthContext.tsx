import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface UserProfileData {
  name: string;
  age: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userName: string;
  userAge: number | null;
  loading: boolean;
  isGuest: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, age: number, email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: (guestName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getLocalProfile(uid: string): UserProfileData | null {
  try {
    const raw = localStorage.getItem(`thinklens_user_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore storage parsing issues
  }
  return null;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const stored = getLocalProfile(currentUser.uid);
        if (stored) {
          setProfile(stored);
        } else if (currentUser.displayName) {
          setProfile({
            name: currentUser.displayName,
            age: 0,
            email: currentUser.email || '',
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const stored = getLocalProfile(res.user.uid);
    if (stored) {
      setProfile(stored);
    } else {
      const name = res.user.displayName || email.split('@')[0];
      setProfile({ name, age: 0, email });
    }
  };

  const signUpWithEmail = async (name: string, age: number, email: string, pass: string) => {
    const cleanName = name.trim();
    const cleanAge = Number(age);
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Set display name in Firebase Auth
    if (res.user) {
      try {
        await updateProfile(res.user, { displayName: cleanName });
      } catch (err) {
        console.warn('Could not update Firebase displayName:', err);
      }

      const newProfile: UserProfileData = {
        name: cleanName,
        age: cleanAge,
        email: email.trim(),
      };

      try {
        localStorage.setItem(`thinklens_user_${res.user.uid}`, JSON.stringify(newProfile));
      } catch {
        // LocalStorage quota fallback
      }

      setProfile(newProfile);
    }
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      const name = res.user.displayName || 'Google User';
      const userProfileData: UserProfileData = {
        name,
        age: 0,
        email: res.user.email || '',
      };
      try {
        localStorage.setItem(`thinklens_user_${res.user.uid}`, JSON.stringify(userProfileData));
      } catch {
        // ignore
      }
      setProfile(userProfileData);
    }
  };

  const signInAsGuest = async (guestName = 'Evaluator Guest') => {
    try {
      const res = await signInAnonymously(auth);
      if (res.user) {
        try {
          await updateProfile(res.user, { displayName: guestName });
        } catch {
          // ignore
        }
        const guestProfile: UserProfileData = {
          name: guestName,
          age: 25,
          email: 'guest@thinklens.ai',
        };
        try {
          localStorage.setItem(`thinklens_user_${res.user.uid}`, JSON.stringify(guestProfile));
        } catch {
          // ignore
        }
        setProfile(guestProfile);
      }
    } catch {
      // Fallback for transient guest when anonymous auth not enabled in console
      const mockUid = 'guest-' + Date.now();
      const mockGuest = {
        uid: mockUid,
        email: 'evaluator.guest@thinklens.ai',
        displayName: guestName,
        isAnonymous: true,
      } as unknown as User;

      const guestProfile: UserProfileData = {
        name: guestName,
        age: 25,
        email: 'guest@thinklens.ai',
      };
      setProfile(guestProfile);
      setUser(mockGuest);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
  };

  const isGuest = Boolean(user?.isAnonymous || user?.uid?.startsWith('guest-'));

  const userName =
    profile?.name ||
    user?.displayName ||
    (isGuest ? 'Evaluator Guest' : user?.email?.split('@')[0] || 'Member');

  const userAge = profile?.age && profile.age > 0 ? profile.age : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        userName,
        userAge,
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
