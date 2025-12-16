
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMovieById, placeholderImages } from '@/lib/data';
import { Star } from 'lucide-react';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { Separator } from '@/components/ui/separator';

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movie = await getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  const poster = placeholderImages.find(p => p.id === movie.posterId);

  return (
    <div className="space-y-12">
      <section className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
             {poster ? (
                <Image
                    src={poster.imageUrl}
                    alt={`Poster for ${movie.title}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    data-ai-hint={poster.imageHint}
                    priority
                />
            ) : (
                <div className="bg-muted flex items-center justify-center h-full">
                    <span className="text-muted-foreground">No Image</span>
                </div>
            )}
          </div>
        </div>

        <div className="flex-grow">
          <h1 className="text-4xl lg:text-5xl font-headline font-bold">{movie.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{movie.releaseYear}</p>
          
          <div className="flex items-center gap-3 mt-4 text-amber-400">
            <Star className="w-7 h-7 fill-current" />
            <span className="font-bold text-3xl text-foreground">{movie.avgRating > 0 ? movie.avgRating.toFixed(1) : 'N/A'}</span>
            <span className="text-sm text-muted-foreground self-end">/ 5</span>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-headline font-bold">Synopsis</h2>
            <p className="mt-2 text-foreground/90 leading-relaxed max-w-prose">
              {movie.synopsis}
            </p>
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-3xl font-headline font-bold mb-6">Community Reviews</h2>
        <ReviewList reviews={movie.reviews} />
      </section>

      <Separator />

      <section id="write-review">
        <ReviewForm movieId={movie.id} movieSynopsis={movie.synopsis} />
      </section>
    </div>
  );
}
