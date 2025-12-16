'use server';
/**
 * @fileOverview A movie suggestion AI agent that recommends movies based on user's mood and preferences.
 *
 * - suggestMovies - A function that handles the movie suggestion process.
 * - MovieSuggesterInput - The input type for the suggestMovies function.
 * - MovieSuggesterOutput - The return type for the suggestMovies function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getMovies, getWatchProviders } from '@/lib/data';
import type { Movie } from '@/lib/types';

// Define moods and preferences from the prompt
const moods = [
  'Chill & Relaxed',
  'Sad / Emotional',
  'Romantic',
  'Stressed / Angry',
  'Mind-bending',
  'Action / Adrenaline',
  'Low energy',
] as const;

const preferences = [
  'Popular',
  'Hidden Gem',
  'Short',
  'Long',
  'Highly Rated',
  'No heavy thinking',
] as const;

const MovieSuggesterInputSchema = z.object({
  mood: z.enum(moods).describe('The user\'s current mood.'),
  preferences: z.array(z.enum(preferences)).optional().describe('Optional user preferences.'),
});
export type MovieSuggesterInput = z.infer<typeof MovieSuggesterInputSchema>;

// Internal schema for AI to generate search parameters
const TMDBFilterSchema = z.object({
  genres: z.array(z.number()).describe('A list of TMDB genre IDs.'),
  keywords: z.array(z.string()).describe('A list of keywords to search for.'),
  ratingThreshold: z.number().min(0).max(10).describe('The minimum TMDB rating.'),
  yearRange: z
    .object({
      start: z.number().optional(),
      end: z.number().optional(),
    })
    .optional(),
});

const MovieSuggestionSchema = z.object({
  tmdbId: z.number().describe('The TMDB ID of the movie.'),
  title: z.string().describe('The title of the movie.'),
  reason: z.string().describe('A short, compelling reason (1-2 sentences) why this movie fits the user\'s mood and preferences.'),
});

const MovieSuggesterOutputSchema = z.object({
  suggestions: z.array(MovieSuggestionSchema),
});
export type MovieSuggesterOutput = MovieSuggestionSchema & { movie: Movie };


// Main exported function to be called from the client
export async function suggestMovies(input: MovieSuggesterInput): Promise<MovieSuggesterOutput> {
  return movieSuggesterFlow(input);
}


// 1. AI Flow to map Mood/Preferences to TMDB Filters
const filterGeneratorPrompt = ai.definePrompt({
  name: 'movieFilterGeneratorPrompt',
  input: { schema: MovieSuggesterInputSchema },
  output: { schema: TMDBFilterSchema },
  prompt: `You are an expert movie curator. Your task is to translate a user's mood and preferences into a set of filters for querying The Movie Database (TMDB).

  User's Mood: {{{mood}}}
  User's Preferences: {{#if preferences}}{{#each preferences}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

  Based on this, generate a list of relevant TMDB genre IDs, keywords, a minimum rating threshold, and an optional year range.
  - For 'Popular', prefer recent years. For 'Hidden Gem', prefer older years or lower vote counts.
  - For 'Highly Rated', set a higher ratingThreshold.
  - 'No heavy thinking' should avoid complex genres like psychological thrillers.

  Here are some TMDB Genre IDs for your reference:
  - Action: 28
  - Adventure: 12
  - Animation: 16
  - Comedy: 35
  - Crime: 80
  - Documentary: 99
  - Drama: 18
  - Family: 10751
  - Fantasy: 14
  - History: 36
  - Horror: 27
  - Music: 10402
  - Mystery: 9648
  - Romance: 10749
  - Science Fiction: 878
  - Thriller: 53
  - War: 10752
  - Western: 37

  Provide a diverse but relevant set of filters.`,
});

// 2. AI Flow to generate reasons for each movie
const reasonGeneratorPrompt = ai.definePrompt({
    name: 'movieReasonGeneratorPrompt',
    input: { schema: z.object({
        movieTitle: z.string(),
        movieSynopsis: z.string(),
        mood: z.string(),
        preferences: z.array(z.string()),
    })},
    output: { schema: z.object({ reason: z.string() }) },
    prompt: `You are a movie recommendation assistant. Given a movie title, its synopsis, and the user's mood/preferences, write a short, compelling reason (1-2 sentences) why this specific movie is a great fit.

    Movie: {{{movieTitle}}}
    Synopsis: {{{movieSynopsis}}}
    User's Mood: {{{mood}}}
    User's Preferences: {{#if preferences}}{{#each preferences}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

    Example output: "With its breathtaking visuals and mind-bending plot, this sci-fi epic is the perfect escape if you're looking for something to challenge your perspective."
    `
});


// 3. The main orchestrating flow
const movieSuggesterFlow = ai.defineFlow(
  {
    name: 'movieSuggesterFlow',
    inputSchema: MovieSuggesterInputSchema,
    outputSchema: MovieSuggesterOutputSchema,
  },
  async (input) => {
    // Step 1: Generate TMDB filters from mood
    const { output: filters } = await filterGeneratorPrompt(input);
    if (!filters) {
      throw new Error('Could not generate movie filters.');
    }

    // Step 2: Fetch movies from TMDB using the generated filters
    const movies = await getMovies({
        with_genres: filters.genres.join('|'),
        with_keywords: filters.keywords.join('|'),
        'vote_average.gte': String(filters.ratingThreshold),
        sort_by: input.preferences?.includes('Popular') ? 'popularity.desc' : 'vote_average.desc',
    });

    const topMovies = movies.slice(0, 5); // Limit to 5 suggestions for now

    // Step 3: For each movie, generate a personalized reason
    const suggestionsWithReasons = await Promise.all(
        topMovies.map(async (movie) => {
            const { output: reasonOutput } = await reasonGeneratorPrompt({
                movieTitle: movie.title,
                movieSynopsis: movie.overview,
                mood: input.mood,
                preferences: input.preferences || [],
            });

            // Fetch watch providers in parallel
            const providers = await getWatchProviders(movie.id);

            return {
                tmdbId: movie.id,
                title: movie.title,
                reason: reasonOutput?.reason || 'A great choice for your current mood!',
                movie: { ...movie, watchProviders: providers }, // Attach full movie object with providers
            };
        })
    );
    
    return {
        suggestions: suggestionsWithReasons,
    };
  }
);
