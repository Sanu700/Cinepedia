

"use server";

import { z } from "zod";
import { SignupSchema, ReviewSchema } from "@/schemas";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { initializeFirebase } from "@/firebase/server";
import { collection, doc, setDoc, serverTimestamp, getDoc, runTransaction, increment, updateDoc, deleteDoc } from "firebase/firestore";
import { format } from 'date-fns';

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

const updateAnalyticsOnSignup = async () => {
    const { firestore } = initializeFirebase();
    const analyticsRef = doc(firestore, 'analytics', 'stats');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    await runTransaction(firestore, async (transaction) => {
        const analyticsDoc = await transaction.get(analyticsRef);
        if (!analyticsDoc.exists()) {
            transaction.set(analyticsRef, {
                totalUsers: 1,
                totalReviews: 0,
                totalVotes: 0,
                dailySignups: { [today]: 1 }
            });
        } else {
            transaction.update(analyticsRef, {
                totalUsers: increment(1),
                [`dailySignups.${today}`]: increment(1)
            });
        }
    });
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
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    // Create user profile in Firestore
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
        id: user.uid,
        displayName: name,
        email: email,
        isEmailVerified: false,
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
    
    // Update analytics
    await updateAnalyticsOnSignup();

    await sendEmailVerification(user);
    
    return { success: "Account created! Please check your email to verify your account." };
  } catch (error: any) {
    return { error: getAuthErrorMessage(error.code) };
  }
}

export async function submitReview(values: z.infer<typeof ReviewSchema>) {
    const { auth, firestore } = initializeFirebase();
    
    const validatedFields = ReviewSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid review data!" };
    }

    const { movieId, rating, text, hasSpoiler, userId } = validatedFields.data;

    if (!userId) {
        return { error: "You must be logged in to post a review." };
    }

    const userDocRef = doc(firestore, 'users', userId);
    const analyticsRef = doc(firestore, 'analytics', 'stats');

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw "User profile not found.";
            }

            const userData = userDoc.data();
            if (!userData.isEmailVerified) {
                throw "You must verify your email to post a review.";
            }

            const accountAge = Date.now() - (userData?.creationTimestamp?.toDate()?.getTime() || Date.now());
            const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
            if (accountAge < twentyFourHoursInMillis) {
                throw "New accounts must wait 24 hours before posting a review to prevent spam.";
            }

            const reviewRef = doc(collection(firestore, "reviews"));
            transaction.set(reviewRef, {
                id: reviewRef.id,
                movieId,
                userId,
                rating,
                reviewText: text,
                hasSpoiler: hasSpoiler || false,
                createdAt: serverTimestamp(),
                likes: 0,
            });

            // Increment total reviews in analytics
            transaction.update(analyticsRef, { totalReviews: increment(1) });
        });

        return { success: "Review submitted successfully!" };

    } catch(e: any) {
        console.error("Review submission error:", e);
        const errorMessage = typeof e === 'string' ? e : "Could not submit review. Please try again.";
        return { error: errorMessage };
    }
}

export async function updateReview(reviewId: string, values: z.infer<typeof ReviewSchema>) {
    const { auth, firestore } = initializeFirebase();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return { error: "You must be logged in to update a review." };
    }

    const validatedFields = ReviewSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid review data!" };
    }

    const { rating, text, hasSpoiler } = validatedFields.data;
    const reviewRef = doc(firestore, "reviews", reviewId);

    try {
        // Security rules will enforce ownership, so we proceed with the update.
        await updateDoc(reviewRef, {
            rating,
            reviewText: text,
            hasSpoiler: hasSpoiler || false,
        });
        return { success: "Review updated successfully!" };
    } catch (e: any) {
        console.error("Update review error:", e);
        return { error: "Could not update review. Please check permissions or try again." };
    }
}


export async function deleteReview(reviewId: string) {
    const { auth, firestore } = initializeFirebase();
    const currentUser = auth.currentUser;
     if (!currentUser) {
        return { error: "You must be logged in to delete a review." };
    }

    const reviewRef = doc(firestore, "reviews", reviewId);

    try {
        // Security rules will enforce that only the owner can delete.
        await deleteDoc(reviewRef);
        return { success: "Review deleted successfully." };
    } catch (e: any) {
        console.error("Delete review error:", e);
        return { error: "Could not delete review. Please check permissions or try again." };
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
    const analyticsRef = doc(firestore, 'analytics', 'stats');

    try {
        await runTransaction(firestore, async (transaction) => {
            const voteDoc = await transaction.get(voteRef);
            if (voteDoc.exists()) {
                throw "You have already voted in this poll.";
            }

            // Create the vote document
            transaction.set(voteRef, {
                pollId,
                userId: currentUser.uid,
                movieId,
                timestamp: serverTimestamp()
            });

            // Increment total votes in analytics
            transaction.update(analyticsRef, { totalVotes: increment(1) });
        });

        return { success: "Vote cast!" };
    } catch (e: any) {
         const errorMessage = typeof e === 'string' ? e : "Failed to cast vote.";
         return { error: errorMessage };
    }
}

export async function likeReview(reviewId: string) {
    const { auth, firestore } = initializeFirebase();
    const currentUser = auth.currentUser;
    if (!currentUser) {
        return { error: "You must be logged in to like a review." };
    }
    if (!currentUser.emailVerified) {
        return { error: "Please verify your email to like reviews." };
    }

    const reviewRef = doc(firestore, "reviews", reviewId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const reviewDoc = await transaction.get(reviewRef);
            if (!reviewDoc.exists()) {
                throw "Review does not exist!";
            }
            // Atomically increment the likes field.
            transaction.update(reviewRef, { likes: increment(1) });
        });
        return { success: true };
    } catch (error) {
        console.error("Like review transaction failed: ", error);
        return { error: "Could not update likes. Please try again." };
    }
}
