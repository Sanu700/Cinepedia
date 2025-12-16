import { Button } from "@/components/ui/button";
import { MotionCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Star, Vote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroImage = {
    id: "hero",
    imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2574&auto=format&fit=crop",
    description: "A movie theater with red seats",
    imageHint: "movie theater seats"
}

export default function Home() {

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center rounded-lg overflow-hidden">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover object-top"
                data-ai-hint={heroImage.imageHint}
                priority
             />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative z-10 p-6 md:p-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-white tracking-tight">
            Cinepedia
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-accent max-w-2xl mx-auto">
            Where real people review real movies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="font-bold w-full sm:w-auto transition-transform hover:scale-105">
              <Link href="/movies">Browse Movies</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold w-full sm:w-auto transition-transform hover:scale-105">
              <Link href="/polls">Vote on Polls</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-4xl font-headline font-bold">Features</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Everything you need for your cinematic journey.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <MotionCard 
            className="text-left"
            whileHover={{ y: -8, boxShadow: "0 10px 20px hsla(var(--primary)/0.2)" }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Film className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Browse & Review</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explore a vast collection of movies. Read community reviews and
                share your own thoughts with our rating system.
              </p>
            </CardContent>
          </MotionCard>
           <MotionCard 
            className="text-left"
            whileHover={{ y: -8, boxShadow: "0 10px 20px hsla(var(--primary)/0.2)" }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Vote className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Random Movie Polls</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Participate in fun movie polls. Vote for your favorite in random
                matchups and see how the community voted.
              </p>
            </CardContent>
          </MotionCard>
          <MotionCard 
            className="text-left"
            whileHover={{ y: -8, boxShadow: "0 10px 20px hsla(var(--primary)/0.2)" }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                   <Star className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">AI-Powered Suggestions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get smart suggestions to enhance your reviews and find what to watch next based on your mood.
              </p>
            </CardContent>
          </MotionCard>
        </div>
      </section>
    </div>
  );
}
