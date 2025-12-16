
"use client";

import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { initializeFirebase } from "@/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";


const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case "auth/invalid-email":
            return "The email address is not valid.";
        case "auth/user-disabled":
            return "This user account has been disabled.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Invalid email or password.";
        case 'auth/popup-closed-by-user':
            return 'Sign-in process was cancelled.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email address but different sign-in credentials.';
        default:
            return "An unexpected error occurred. Please try again.";
    }
};

export async function signInWithEmail(values: z.infer<typeof LoginSchema>) {
    const { auth } = initializeFirebase();
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: "Logged in successfully!" };
    } catch (error: any) {
        const knownError = getAuthErrorMessage(error.code);
        if (knownError !== "An unexpected error occurred. Please try again.") {
            return { error: knownError };
        }
        return { error: error.message || "An unexpected error occurred. Please try again." };
    }
}

export async function signInWithGoogle() {
  const { auth, firestore } = initializeFirebase();
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile already exists
    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create a new user profile in Firestore
      await setDoc(userRef, {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        isEmailVerified: user.emailVerified,
        creationTimestamp: serverTimestamp(),
        trustScore: 0,
      });

      // Create initial streak document for the new user
      const streakRef = doc(firestore, "streaks", user.uid);
      await setDoc(streakRef, {
          userId: user.uid,
          currentStreak: 0,
          lastActivityDate: serverTimestamp(),
          startDate: serverTimestamp(),
      });
      
    }
    
    return { success: "Logged in successfully!" };
  } catch (error: any) {
    const knownError = getAuthErrorMessage(error.code);
    if (knownError !== "An unexpected error occurred. Please try again.") {
      return { error: knownError };
    }
    // For unknown errors, return the actual firebase error message
    return { error: error.message || "An unexpected error occurred. Please try again." };
  }
}
