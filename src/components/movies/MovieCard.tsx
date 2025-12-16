import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { placeholderImages } from '@/lib/data';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const poster = placeholderImages.find(p => p.id === movie.posterId);

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/50">
            <CardHeader className="p-0 relative aspect-[2/3] w-full">
                {poster ? (
                    <Image
                        src={poster.imageUrl}
                        alt={`Poster for ${movie.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        data-ai-hint={poster.imageHint}
                    />
                ) : (
                    <div className="bg-muted flex items-center justify-center h-full">
                        <span className="text-muted-foreground">No Image</span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <CardTitle className="font-headline text-xl leading-tight">{movie.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{movie.releaseYear}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex items-center gap-2 text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold text-lg text-foreground">{movie.avgRating > 0 ? movie.avgRating.toFixed(1) : 'N/A'}</span>
                </div>
            </CardFooter>
        </Card>
    </Link>
  );
}
