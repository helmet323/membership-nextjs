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
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  signup: (
    email: string,
    password: string,
    referredBy?: string
  ) => Promise<void>;
  adminSignup: (
    email: string,
    role: string,
    referredBy?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkReferral: (referralEmail: string) => Promise<string>;
}

interface FirestoreUser {
  email: string;
  role: string;
  referralCode: string;
  createdAt: Timestamp;
}

interface UserData {
  email: string;
  role: string;
  referralCode: string;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

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
          setUserData({
            email: userData.email,
            role: userData.role,
            referralCode: userData.referralCode,
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const signup = async (
    email: string,
    password: string,
    referredBy?: string
  ): Promise<void> => {
    try {
      // Check if email already exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      // Create user in Firebase Authentication regardless of Firestore existence
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if user.email is null
      if (!user.email) {
        throw new Error("User email is null.");
      }

      // If the email is not already in Firestore, create the record in Firestore
      if (querySnapshot.empty) {
        const userRef = doc(db, "users", email); // Using email as document ID
        const userData = {
          email,
          role: "user",
          referralCode: uuidv4(),
          referredBy: referredBy || "",
          createdAt: serverTimestamp(),
        };

        await setDoc(userRef, userData); // Add user to Firestore
      }

      // Set user data in context
      setUserData({
        email: user.email,
        role: "user",
        referralCode: uuidv4(),
      });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  // Admin signup
  const adminSignup = async (
    email: string,
    role: string,
    referredBy?: string
  ): Promise<void> => {
    try {
      // Check if the email already exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      // If the email already exists, do not create a new record
      if (!querySnapshot.empty) {
        throw new Error("User already exists with this email.");
      }

      // Create a user object
      const user = {
        email,
        role,
        referralCode: uuidv4(),
        referredBy: referredBy || "",
        createdAt: serverTimestamp(),
      };

      // Store the user data in Firestore, using email as the document ID
      await setDoc(doc(db, "users", email), user);
      console.log("User added successfully!");
    } catch (error) {
      console.error("Add user failed:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      ); // Firebase login
      const user = userCredential.user;

      // Query Firestore for the user document that matches the email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as FirestoreUser;
        setUserData({
          email: userData.email,
          role: userData.role,
          referralCode: userData.referralCode,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Ensure currentUser is cleared
      setUserData(null); // Ensure userData is cleared
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const checkReferral = async (referralEmail: string): Promise<string> => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", referralEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data() as UserData; // Cast to UserData type
        return userData.referralCode;
      }

      return ""; // If no user is found
    } catch (error) {
      console.error("Error checking referral:", error);
      throw new Error("Failed to check referral.");
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    signup,
    adminSignup,
    login,
    logout,
    checkReferral,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
