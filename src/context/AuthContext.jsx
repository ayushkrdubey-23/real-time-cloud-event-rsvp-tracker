import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get the user's profile from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const profileData = userSnapshot.data();

          // Combine Firebase Auth information
          // with Firestore profile information.
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: profileData.name || firebaseUser.displayName || "",
            role: profileData.role || "",
            createdAt: profileData.createdAt || null,
          });
        } else {
          // Firebase account exists but Firestore profile
          // does not exist.
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "",
            role: "",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);

        // Keep the authenticated Firebase user available
        // even if the Firestore profile cannot be loaded.
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || "",
          role: "",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function register(name, email, password, role) {
    return registerUser(name, email, password, role);
  }

  async function login(email, password) {
    return loginUser(email, password);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}