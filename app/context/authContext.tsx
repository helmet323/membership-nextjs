"use client";

import { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  role: string | null;
  signup: (email: string, password: string, role: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

interface FirestoreUser {
  email: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Query Firestore for the user document that matches the email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]; // We assume the email is unique
          const userData = userDoc.data() as FirestoreUser; // Cast to FirestoreUser type
          setRole(userData.role || null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const signup = async (
    email: string,
    password: string,
    role: string
  ): Promise<void> => {
    try {
      setError(null); // Reset previous errors
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // After user is created, store their role in Firestore using their email
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role, // Save role to Firestore
      });
      setRole(role); // Set the role in context
    } catch (error: unknown) {
      console.error("Signup failed:", error);
      if (error instanceof Error) {
        setError(error.message); // Handle known error
      } else {
        setError("An unknown error occurred during signup.");
      }
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null); // Reset previous errors
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        setError(error.message); // Handle known error
      } else {
        setError("An unknown error occurred during login.");
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null); // Reset previous errors
      await signOut(auth);
    } catch (error: unknown) {
      console.error("Logout failed:", error);
      if (error instanceof Error) {
        setError(error.message); // Handle known error
      } else {
        setError("An unknown error occurred during logout.");
      }
    }
  };

  const value: AuthContextType = {
    currentUser,
    role,
    signup,
    login,
    logout,
    error,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
