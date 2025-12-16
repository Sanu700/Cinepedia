
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useEffect } from 'react';
import { useUser } from '@/firebase';
import { ReviewSchema } from '@/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import AiSuggestion from '../shared/AiSuggestion';
import { submitReview } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

interface ReviewFormProps {
  movieId: string;
  movieSynopsis: string;
}

export default function ReviewForm({ movieId, movieSynopsis }: ReviewFormProps) {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      text: '',
      movieId: movieId,
      userId: user?.uid,
    },
  });

  // Keep form values in sync with the user state
  useEffect(() => {
    form.setValue('userId', user?.uid);
  }, [user, form]);

  const reviewText = form.watch('text');

  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to post a review.", variant: "destructive"});
        return;
    }
    
    // Ensure the latest userId is included on submission, as the form value might be stale
    const finalValues = { ...values, userId: user.uid };

    startTransition(async () => {
        const result = await submitReview(finalValues);
         if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive"});
        }
        if (result.success) {
            toast({ title: "Success!", description: result.success });
            form.reset({
              rating: 0,
              text: '',
              movieId: movieId,
              userId: user.uid,
            });
        }
    });
  };

  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Join the Conversation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <p className="text-muted-foreground">You must be logged in to post a review.</p>
                    <Button asChild>
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Log In
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Write a Review</CardTitle>
        <CardDescription>Share your thoughts with the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <StarRating rating={field.value} setRating={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What did you think of the movie?"
                      rows={5}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <AiSuggestion movieSynopsis={movieSynopsis} reviewContext={reviewText} />
            </div>

            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
