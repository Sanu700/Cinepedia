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
import type { Review } from "@/lib/types";
import { mockMovies } from "@/lib/data";
import StarRating from "../reviews/StarRating";
import { format } from "date-fns";

interface UserReviewsProps {
  reviews: Review[];
}

export default function UserReviews({ reviews }: UserReviewsProps) {
  // In a real app, this data would likely be joined in the query or fetched separately.
  const getMovieTitle = (movieId: string) => {
    return mockMovies.find(m => m.id === movieId)?.title || "Unknown Movie";
  }

  return (
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
                <TableCell className="hidden sm:table-cell font-medium">{getMovieTitle(review.movieId)}</TableCell>
                <TableCell>
                  <StarRating rating={review.rating} size={16} isInteractive={false} />
                </TableCell>
                <TableCell className="max-w-[250px] truncate">{review.text}</TableCell>
                <TableCell className="hidden md:table-cell">{format(new Date(review.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
  );
}
