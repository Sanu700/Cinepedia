"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock implementation of getting a user profile from your DB
const getAppUser = (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) return null;
    // In a real app, you'd fetch this from Firestore using firebaseUser.uid
    // For now, we'll find a mock user by email or just use the first one
    return mockUsers.find(u => u.email === firebaseUser.email) || {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'New User',
        avatarUrl: firebaseUser.photoURL || undefined
    };
}


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      const appUser = getAppUser(firebaseUser);
      setUser(appUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const value = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
