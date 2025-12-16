"use server";

import { z } from "zod";
import { SignupSchema, ReviewSchema } from "@/schemas";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { initializeFirebase } from "@/firebase/server";
import { collection, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

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
        case 'auth/popup-closed-by-user':
            return 'Sign-in process was cancelled.';
        default:
            return "An unexpected error occurred. Please try again.";
    }
};

export async function signup(values: z.infer<typeof SignupSchema>) {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  
  const { name, email, password } = validatedFields.data;
  const { auth, firestore } = initializeFirebase();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });

    // Create user profile in Firestore
    const userRef = doc(firestore, "users", userCredential.user.uid);
    await setDoc(userRef, {
        id: userCredential.user.uid,
        displayName: name,
        email: email,
        isEmailVerified: false,
        creationTimestamp: serverTimestamp(),
        trustScore: 0,
    });
    
    await sendEmailVerification(userCredential.user);
    
    return { success: "Account created! Please check your email to verify your account." };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error.code) };
  }
}

export async function submitReview(values: z.infer<typeof ReviewSchema>) {
    const { auth, firestore } = initializeFirebase();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        return { error: "You must be logged in to post a review." };
    }
     if (!currentUser.emailVerified) {
        return { error: "You must verify your email to post a review." };
    }

    const userDocRef = doc(firestore, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const accountAge = Date.now() - (userData?.creationTimestamp?.toDate()?.getTime() || Date.now());
    const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

    if (accountAge < twentyFourHoursInMillis) {
        return { error: "New accounts must wait 24 hours before posting a review to prevent spam." };
    }


    const validatedFields = ReviewSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid review data!" };
    }

    const { movieId, rating, text } = validatedFields.data;
    
    const reviewRef = doc(collection(firestore, "reviews"));
    
    try {
        await setDoc(reviewRef, {
            id: reviewRef.id,
            movieId,
            userId: currentUser.uid,
            rating,
            reviewText: text,
            timestamp: serverTimestamp(),
            likes: 0,
        });
        return { success: "Review submitted successfully!" };
    } catch(e: any) {
        return { error: "Could not submit review. Please try again." };
    }
}


export async function submitVote(pollId: string, movieId: string) {
    const { auth, firestore } = initializeFirebase();
    const currentUser = auth.currentUser;
     if (!currentUser) {
        return { error: "You must be logged in to vote." };
    }
    if (!currentUser.emailVerified) {
        return { error: "You must verify your email to vote." };
    }

    const voteRef = doc(firestore, `polls/${pollId}/votes`, currentUser.uid);

    try {
        // Use setDoc to enforce one vote per user per poll
        await setDoc(voteRef, {
            pollId,
            userId: currentUser.uid,
            movieId,
            timestamp: serverTimestamp()
        });
        // In a real app, you might use a transaction to update the poll's vote count as well.
        // For now, this just records the vote.
        return { success: "Vote cast!" };
    } catch (e: any) {
         return { error: "Failed to cast vote. You may have already voted in this poll." };
    }
}
