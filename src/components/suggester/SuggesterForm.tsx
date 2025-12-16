

'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Film, Tv, Star, Clock } from 'lucide-react';
import { suggestMovies, type MovieSuggesterInput, type SingleMovieSuggestion } from '@/ai/flows/movie-suggester';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';

const moods = [
  'Chill & Relaxed', 'Sad / Emotional', 'Romantic', 'Stressed / Angry',
  'Mind-bending', 'Action / Adrenaline', 'Low energy'
] as const;

const preferences = [
    { id: 'Popular', label: 'Popular' },
    { id: 'Hidden Gem', label: 'Hidden Gems' },
    { id: 'Short', label: 'Short (< 1.5h)' },
    { id: 'Long', label: 'Long (> 2h)' },
    { id: 'Highly Rated', label: 'Highly Rated Only' },
    { id: 'No heavy thinking', label: 'No Heavy Thinking' }
] as const;

type Step = 'mood' | 'preferences' | 'loading' | 'results';

const getPosterURL = (path: string | null) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/no-poster.svg';
};

export default function SuggesterForm() {
  const [step, setStep] = useState<Step>('mood');
  const [selectedMood, setSelectedMood] = useState<MovieSuggesterInput['mood'] | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<MovieSuggesterInput['preferences']>([]);
  const [results, setResults] = useState<SingleMovieSuggestion[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();


  const handleMoodSelect = (mood: MovieSuggesterInput['mood']) => {
    setSelectedMood(mood);
    setStep('preferences');
  };

  const handlePreferenceToggle = (prefId: (typeof preferences)[number]['id']) => {
    setSelectedPreferences(prev =>
      prev.includes(prefId) ? prev.filter(p => p !== prefId) : [...prev, prefId]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    setStep('loading');
    startTransition(async () => {
      try {
        const response = await suggestMovies({
          mood: selectedMood,
          preferences: selectedPreferences,
        });

        if (response && response.suggestions && response.suggestions.length > 0) {
          setResults(response.suggestions);
          setStep('results');
        } else {
          toast({
            title: "No suggestions found",
            description: "We couldn't find any movies for that combination. Please try a different mood.",
            variant: "default"
          });
          reset();
        }
      } catch (error) {
        console.error("Movie suggestion error:", error);
        toast({
          title: "AI Service Error",
          description: "The movie suggestion service is currently unavailable. Please try again in a moment.",
          variant: "destructive",
        });
        reset(); // Go back to the initial state
      }
    });
  };
  
  const reset = () => {
    setStep('mood');
    setSelectedMood(null);
    setSelectedPreferences([]);
    setResults(null);
  }

  const surpriseMe = () => {
    if (results && results.length > 0) {
      const randomIndex = Math.floor(Math.random() * results.length);
      const surpriseMovie = results[randomIndex];
      setResults([surpriseMovie]);
    }
  }


  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="py-6">
      <AnimatePresence mode="wait">
        {step === 'mood' && (
          <motion.div
            key="mood"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {moods.map(mood => (
              <motion.div key={mood} variants={itemVariants}>
                <Card
                  onClick={() => handleMoodSelect(mood)}
                  className="p-6 text-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors h-full flex items-center justify-center"
                >
                  <span className="text-lg font-medium">{mood}</span>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {step === 'preferences' && (
          <motion.div
            key="preferences"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Any preferences? (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {preferences.map(pref => (
                  <motion.div
                    key={pref.id}
                    variants={itemVariants}
                    onClick={() => handlePreferenceToggle(pref.id)}
                    className={cn(
                      "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedPreferences?.includes(pref.id) && "bg-primary text-primary-foreground border-primary"
                    )}
                  >
                    <Checkbox
                      checked={selectedPreferences?.includes(pref.id)}
                      id={pref.id}
                      className="border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                    />
                    <label htmlFor={pref.id} className="font-medium cursor-pointer">{pref.label}</label>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep('mood')}>Back</Button>
              <Button size="lg" onClick={handleSubmit}>Suggest Movies</Button>
            </div>
          </motion.div>
        )}
        
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full min-h-[40vh] space-y-4"
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground text-lg">Curating the perfect movies for you...</p>
          </motion.div>
        )}

        {step === 'results' && results && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
             <div className="space-y-4">
                {results.map((result) => (
                    <motion.div key={result.tmdbId} variants={itemVariants}>
                        <Card className="flex flex-col md:flex-row overflow-hidden">
                             <div className="w-full md:w-40 flex-shrink-0 relative aspect-[2/3]">
                                <Image src={getPosterURL(result.movie.poster_path)} alt={result.title} fill className="object-cover" />
                             </div>
                             <div className="p-6 flex flex-col justify-between">
                                 <div>
                                    <h3 className="text-2xl font-headline font-bold">{result.title} <span className="text-muted-foreground font-sans">({result.movie.release_date.split('-')[0]})</span></h3>
                                    <p className="text-primary italic mt-2">"{result.reason}"</p>
                                    <p className="text-foreground/80 mt-3 max-w-prose line-clamp-3">{result.movie.overview}</p>
                                 </div>
                                 <div className='mt-4'>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-foreground">{result.movie.vote_average.toFixed(1)}</span>
                                        </div>
                                        <Separator orientation='vertical' className='h-4' />
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{result.movie.runtime} min</span>
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <h4 className='text-sm font-bold mb-2'>Watch on:</h4>
                                        {result.movie.watchProviders && result.movie.watchProviders.flatrate && result.movie.watchProviders.flatrate.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                {result.movie.watchProviders.flatrate.slice(0, 4).map(p => (
                                                    <Image key={p.provider_id} src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={40} height={40} className="rounded-md" />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Availability may vary by region.</p>
                                        )}
                                    </div>
                                 </div>
                             </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button type="button" onClick={handleSubmit} disabled={isPending}>
                {isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                Show More Like This
              </Button>
              <Button type="button" variant="secondary" onClick={reset}>Change Mood</Button>
              <Button type="button" variant="outline" onClick={surpriseMe}>Surprise Me</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
