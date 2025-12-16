import Link from 'next/link';
import Image from 'next/image';
import { MotionCard } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface MovieCardProps {
  movie: Movie;
}

const getPosterURL = (path: string | null) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/no-poster.svg';
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getPosterURL(movie.poster_path);

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
        <MotionCard 
            className="h-full flex flex-col overflow-hidden transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0px 10px 20px hsla(var(--primary) / 0.2)" }}
        >
            <div className="p-0 relative aspect-[2/3] w-full overflow-hidden">
                {posterUrl ? (
                    <Image
                        src={posterUrl}
                        alt={`Poster for ${movie.title}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="bg-muted flex items-center justify-center h-full">
                        <span className="text-muted-foreground text-center text-sm p-2">{movie.title}</span>
                    </div>
                )}
            </div>
            <div className="flex-grow p-4">
                <h2 className="font-headline text-xl leading-tight truncate" title={movie.title}>{movie.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{movie.releaseYear}</p>
            </div>
            <div className="p-4 pt-0">
                <div className="flex items-center gap-2 text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-bold text-lg text-foreground">{movie.avgRating > 0 ? movie.avgRating.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        </MotionCard>
    </Link>
  );
}

export const MovieCardSkeleton = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden rounded-lg border bg-card">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="flex-grow p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="p-4 pt-0">
                <Skeleton className="h-6 w-1/2" />
            </div>
        </div>
    );
};
