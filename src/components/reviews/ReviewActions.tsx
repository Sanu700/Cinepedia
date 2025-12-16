
"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { likeReview } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

interface ReviewActionsProps {
  reviewId: string;
  initialLikes: number;
}

export default function ReviewActions({ reviewId, initialLikes }: ReviewActionsProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to like a review.",
        variant: "destructive"
      });
      return;
    }

    if (isLiked) {
       toast({
        title: "Already Liked",
        description: "You can only like a review once.",
      });
      return;
    }

    startTransition(async () => {
      // Optimistic UI update
      setLikes(prev => prev + 1);
      setIsLiked(true);

      const result = await likeReview(reviewId);

      if (result.error) {
        // Revert optimistic update on error
        setLikes(prev => prev - 1);
        setIsLiked(false);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="mt-4 flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isPending || isLiked}
      >
        <ThumbsUp className={cn("mr-2 h-4 w-4", isLiked && "fill-primary text-primary")} />
        Helpful ({likes})
      </Button>
    </div>
  );
}
