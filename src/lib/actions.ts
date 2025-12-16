"use server";

import { z } from "zod";
import { LoginSchema, SignupSchema, ReviewSchema } from "@/schemas";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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
        case "auth/email-already-in-use":
            return "An account with this email address already exists.";
        case "auth/weak-password":
            return "The password is too weak.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
};

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  
  const { email, password } = validatedFields.data;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: "Logged in successfully!" };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error.code) };
  }
}

export async function signup(values: z.infer<typeof SignupSchema>) {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  
  const { name, email, password } = validatedFields.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return { success: "Account created successfully!" };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error.code) };
  }
}

export async function submitReview(values: z.infer<typeof ReviewSchema>) {
    const validatedFields = ReviewSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid review data!" };
    }

    console.log("Submitting review:", validatedFields.data);

    // In a real app, you'd save this to Firestore
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: "Review submitted successfully!" };
}


export async function submitVote(pollId: string, movieId: string) {
    console.log(`Voting for movie ${movieId} in poll ${pollId}`);
    // In a real app, you'd save this vote to Firestore and update poll counts
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: "Vote cast!" };
}
