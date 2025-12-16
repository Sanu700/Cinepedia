
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useEffect } from 'react';
import { ReviewSchema } from '@/schemas';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import StarRating from '../reviews/StarRating';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Review, Movie } from "@/lib/types";
import { updateReview } from '@/lib/actions';

interface ReviewWithMovie extends Review {
    movie?: Movie;
}

interface EditReviewModalProps {
  review: ReviewWithMovie;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOptimistic: (updatedReview: ReviewWithMovie) => void;
}

export default function EditReviewModal({ review, isOpen, onClose, onUpdateOptimistic }: EditReviewModalProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: review.rating,
      text: review.text,
      hasSpoiler: review.hasSpoiler || false,
      movieId: review.movieId,
    },
  });
  
  useEffect(() => {
    form.reset({
      rating: review.rating,
      text: review.text,
      hasSpoiler: review.hasSpoiler || false,
      movieId: review.movieId,
    });
  }, [review, form]);

  const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
    startTransition(async () => {
        // Optimistic update
        onUpdateOptimistic({ ...review, ...values });
        
        const result = await updateReview(review.id, values);
        
        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive"});
            // Revert optimistic update on error
            onUpdateOptimistic(review);
        }
        if (result.success) {
            toast({ title: "Success!", description: result.success });
        }
        onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review for {review.movie?.title}</DialogTitle>
          <DialogDescription>Update your rating and thoughts on the movie.</DialogDescription>
        </DialogHeader>
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
            <FormField
              control={form.control}
              name="hasSpoiler"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                   <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>This review contains spoilers</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
