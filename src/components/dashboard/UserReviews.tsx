
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Review, Movie } from "@/lib/types";
import StarRating from "../reviews/StarRating";
import { format } from "date-fns";
import Link from "next/link";
import { deleteReview } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import EditReviewModal from "./EditReviewModal";

interface ReviewWithMovie extends Review {
    movie?: Movie;
}

interface UserReviewsProps {
  reviews: ReviewWithMovie[];
}

export default function UserReviews({ reviews: initialReviews }: UserReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [reviewToEdit, setReviewToEdit] = useState<ReviewWithMovie | null>(null);
  const { toast } = useToast();
  
  const handleDelete = async (reviewId: string) => {
    // Optimistic deletion
    const originalReviews = reviews;
    setReviews(currentReviews => currentReviews.filter(r => r.id !== reviewId));

    const result = await deleteReview(reviewId);

    if(result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
      // Revert if error
      setReviews(originalReviews);
    } else {
      toast({ title: "Success", description: "Your review has been deleted." });
    }
  }

  const handleUpdateOptimistic = (updatedReview: ReviewWithMovie) => {
     setReviews(currentReviews => currentReviews.map(r => r.id === updatedReview.id ? updatedReview : r));
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
        <CardDescription>View, edit, or delete your past reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Movie</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length > 0 ? reviews.map(review => (
              <TableRow key={review.id}>
                <TableCell className="hidden sm:table-cell font-medium">
                  <Link href={`/movies/${review.movieId}`} className="hover:underline">
                    {review.movie?.title || `Movie ID: ${review.movieId}`}
                  </Link>
                </TableCell>
                <TableCell>
                  <StarRating rating={review.rating} size={16} isInteractive={false} />
                </TableCell>
                <TableCell className="max-w-[250px] truncate">{review.text}</TableCell>
                <TableCell className="hidden md:table-cell">{format(new Date(review.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setReviewToEdit(review)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your review from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(review.id)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                   </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  You haven't written any reviews yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    {reviewToEdit && (
        <EditReviewModal
          review={reviewToEdit}
          isOpen={!!reviewToEdit}
          onClose={() => setReviewToEdit(null)}
          onUpdateOptimistic={handleUpdateOptimistic}
        />
    )}
    </>
  );
}
