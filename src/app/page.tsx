import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Star, Vote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { placeholderImages } from "@/lib/data";

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "hero");

  return (
    <div className="space-y-16">
      <section className="relative text-center py-20 rounded-lg overflow-hidden">
        {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
             />
        )}
        <div className="relative bg-black bg-opacity-60 p-10 rounded-lg inline-block">
          <h1 className="text-5xl font-headline font-bold text-white tracking-tight">
            Welcome to Cinepedia
          </h1>
          <p className="mt-4 text-xl text-accent max-w-2xl mx-auto">
            Your ultimate guide to browsing, reviewing, and discovering movies.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/movies">Browse Movies</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
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
          <Card className="text-left">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-md">
                  <Film className="w-6 h-6 text-primary" />
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
          </Card>
          <Card className="text-left">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-md">
                  <Vote className="w-6 h-6 text-primary" />
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
          </Card>
          <Card className="text-left">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 p-3 rounded-md">
                   <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">AI-Powered Suggestions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get smart suggestions to enhance your reviews, powered by AI.
                Make your feedback more engaging and insightful.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
