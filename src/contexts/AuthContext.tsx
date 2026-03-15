'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { authApi, expertApi } from '@/lib/api';
import { UserProfile, UserRole } from '@/lib/types';

interface MentorStatus {
  hasProfile: boolean;
  mentorStatus?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  mentorStatusInfo: MentorStatus | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (role: UserRole) => void;
  refreshMentorStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mentorStatusInfo, setMentorStatusInfo] = useState<MentorStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Check mentor expert profile status
  const checkMentorStatus = useCallback(async () => {
    try {
      const res = await expertApi.getMyProfile();
      if (res.success && res.data) {
        setMentorStatusInfo({
          hasProfile: true,
          mentorStatus: res.data.mentorStatus || 'approved',
        });
      } else {
        setMentorStatusInfo({ hasProfile: false });
      }
    } catch {
      setMentorStatusInfo({ hasProfile: false });
    }
  }, []);

  const refreshMentorStatus = useCallback(async () => {
    await checkMentorStatus();
  }, [checkMentorStatus]);

  // Demo mode
  const setDemoUser = (role: UserRole) => {
    setUserProfile({
      uid: 'user-demo',
      name: role === 'mentor' ? 'Demo Mentor' : role === 'admin' ? 'Admin User' : 'Demo User',
      email: 'demo@konnect.com',
      avatar: '',
      role,
      createdAt: new Date(),
    });
    if (role === 'mentor') {
      setMentorStatusInfo({ hasProfile: true, mentorStatus: 'approved' });
    }
    setLoading(false);
  };

  useEffect(() => {
    let redirectHandled = false;

    // Check for pending Google redirect result first
    getRedirectResult(auth).then((result) => {
      redirectHandled = true;
      // If result exists, onAuthStateChanged will handle the user
      if (result?.user) {
        console.log('Google redirect sign-in successful');
      }
    }).catch((err) => {
      redirectHandled = true;
      console.error('Google redirect error:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // New user (e.g. first Google sign-in) — default to mentor on this portal
            const profile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Mentor',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
              role: 'mentor',
              createdAt: new Date(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
            setUserProfile(profile);
          }
          // Check mentor expert profile
          await checkMentorStatus();
        } catch {
          setDemoUser('mentor');
          return;
        }
      } else {
        setUserProfile(null);
        setMentorStatusInfo(null);
      }
      setLoading(false);
    });

    // Only fall back to demo mode after 8 seconds (give redirect time to complete)
    const timeout = setTimeout(() => {
      if (loading && redirectHandled) {
        setDemoUser('mentor');
      }
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    try { await authApi.verify(); } catch {}
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const profile: UserProfile = {
      uid: cred.user.uid,
      name,
      email,
      avatar: '',
      role,
      createdAt: new Date(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    setUserProfile(profile);
  };

  const loginWithGoogle = async () => {
    try {
      // Try popup first (works on most browsers)
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      // If popup blocked or unavailable, fall back to redirect
      if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw err;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
    setMentorStatusInfo(null);
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, mentorStatusInfo, loading,
      login, signup, loginWithGoogle, logout, setDemoUser, refreshMentorStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
