"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface AuthUser {
  id: string;
  role: "student" | "mentor" | "recruiter" | "admin";
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "mentor" | "recruiter" | "admin";
  college?: string;
  mobile?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch custom user profile from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Fetch extended profile
            const profileDoc = await getDoc(doc(db, "profiles", firebaseUser.uid));
            const profileData = profileDoc.exists() ? profileDoc.data() : {};

            setUser({
              id: firebaseUser.uid,
              role: data.role || "student",
              name: profileData.fullName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email!,
              avatar: profileData.avatarUrl,
            });
          } else {
            // Fallback if firestore doc missing
            setUser({
              id: firebaseUser.uid,
              role: "student",
              name: firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email!,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login Error:", error);
      let message = "Invalid email or password.";
      if (error.code === "auth/invalid-api-key") {
        message = "Firebase API Key is invalid or missing. Please configure your .env file.";
      }
      return { success: false, error: message };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = userCredential.user.uid;

      // 2. Create basic user record
      await setDoc(doc(db, "users", uid), {
        email: data.email,
        role: data.role,
        createdAt: serverTimestamp(),
      });

      // 3. Create extended profile
      await setDoc(doc(db, "profiles", uid), {
        fullName: data.fullName || data.name,
        university: data.university || "",
        graduationYear: data.graduationYear || "",
        currentRole: data.currentRole || "",
        linkedInUrl: data.linkedInUrl || "",
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error: any) {
      console.error("Register Error:", error);
      let message = "Could not create account.";
      if (error.code === "auth/email-already-in-use") message = "Email already exists.";
      if (error.code === "auth/weak-password") message = "Password is too weak.";
      return { success: false, error: message };
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
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      let message = "Failed to send reset email.";
      if (error.code === "auth/user-not-found") message = "No account found with this email.";
      if (error.code === "auth/invalid-api-key") message = "Firebase API Key is missing. Configure .env first.";
      return { success: false, error: message };
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
