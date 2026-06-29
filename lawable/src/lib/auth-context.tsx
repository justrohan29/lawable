"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

type UserRole = "student" | "mentor" | "recruiter" | "admin";

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  college?: string;
  mobile?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeRole(role: unknown): UserRole {
  return role === "mentor" || role === "recruiter" || role === "admin" ? role : "student";
}

function getErrorCode(error: unknown): string {
  return typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
}

function getAuthErrorMessage(error: unknown, fallback: string): string {
  const code = getErrorCode(error);

  if (code === "auth/invalid-api-key") {
    return "Firebase API Key is invalid or missing. Please configure your .env file.";
  }

  if (code === "auth/email-already-in-use") return "Email already exists.";
  if (code === "auth/weak-password") return "Password is too weak.";
  if (code === "auth/user-not-found") return "No account found with this email.";
  if (code === "permission-denied") {
    return "Signed in, but Firestore rules are blocking your user profile. Deploy the Firestore rules and try again.";
  }

  return fallback;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const resolveUserProfile = useCallback(async (firebaseUser: User): Promise<AuthUser> => {
    const userSnapshot = await getDoc(doc(db, "users", firebaseUser.uid));
    const userData = userSnapshot.exists() ? userSnapshot.data() : {};

    let profileData: Record<string, unknown> = {};
    try {
      const profileSnapshot = await getDoc(doc(db, "profiles", firebaseUser.uid));
      profileData = profileSnapshot.exists() ? profileSnapshot.data() : {};
    } catch (error) {
      console.warn("Could not fetch optional profile data:", error);
    }

    const email = firebaseUser.email ?? String(userData.email ?? "");

    return {
      id: firebaseUser.uid,
      role: normalizeRole(userData.role),
      name:
        String(profileData.fullName ?? "").trim() ||
        String(userData.name ?? "").trim() ||
        email.split("@")[0] ||
        "User",
      email,
      avatar: typeof profileData.avatarUrl === "string" ? profileData.avatarUrl : undefined,
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setUser(await resolveUserProfile(firebaseUser));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [resolveUserProfile]);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setUser(await resolveUserProfile(credential.user));
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      setUser(null);
      return { success: false, error: getAuthErrorMessage(error, "Invalid email or password.") };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: data.email,
        name: data.name,
        role: data.role,
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "profiles", uid), {
        fullName: data.name,
        university: data.college || "",
        mobile: data.mobile || "",
        createdAt: serverTimestamp(),
      });

      setUser(await resolveUserProfile(userCredential.user));
      return { success: true };
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, error: getAuthErrorMessage(error, "Could not create account.") };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Reset Password Error:", error);
      return { success: false, error: getAuthErrorMessage(error, "Failed to send reset email.") };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
