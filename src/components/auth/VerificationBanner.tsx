"use client";

import { useUser } from "@/firebase";
import { AlertCircle, MailCheck } from "lucide-react";
import { Button } from "../ui/button";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";

export default function VerificationBanner() {
    const { user } = useUser();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleResend = () => {
        if (!user) return;
        
        startTransition(async () => {
            try {
                await sendEmailVerification(user);
                toast({
                    title: "Email Sent!",
                    description: "A new verification email has been sent to your address."
                });
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: "Failed to send verification email. Please try again later.",
                    variant: "destructive"
                });
            }
        });
    }

    if (!user || user.emailVerified) {
        return null;
    }

    // Don't show banner for users logged in via providers that don't need email verification (like Google)
    if(user.providerData.some(p => p.providerId !== 'password')) {
        return null;
    }

    return (
        <div className="bg-yellow-600 text-yellow-50">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">
                        Please verify your email address to get full access.
                    </p>
                </div>
                <Button
                    size="sm"
                    variant="link"
                    className="text-yellow-50 h-auto p-0 hover:underline"
                    onClick={handleResend}
                    disabled={isPending}
                >
                    {isPending ? 'Sending...' : 'Resend verification email'}
                </Button>
            </div>
        </div>
    );
}
