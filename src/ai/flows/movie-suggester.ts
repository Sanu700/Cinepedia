
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
  mood: z.enum(moods).describe("The user's current mood."),
  preferences: z.array(z.enum(preferences)).optional().describe('Optional user preferences.'),
});
export type MovieSuggesterInput = z.infer<typeof MovieSuggesterInputSchema>;

const MovieSuggestionSchema = z.object({
  tmdbId: z.number().describe('The TMDB ID of the movie.'),
  title: z.string().describe('The title of the movie.'),
  reason: z.string().describe('A short, compelling reason (1-2 sentences) why this movie fits the user\'s mood and preferences.'),
});

const MovieSuggesterOutputSchema = z.object({
  suggestions: z.array(MovieSuggestionSchema),
});
export type MovieSuggesterOutput = {
  suggestions: (z.infer<typeof MovieSuggestionSchema> & { movie: Movie })[];
};

// Main exported function to be called from the client
export async function suggestMovies(input: MovieSuggesterInput): Promise<MovieSuggesterOutput> {
  return movieSuggesterFlow(input);
}

// Simplified prompt to generate suggestions directly from a movie list
const suggestionGeneratorPrompt = ai.definePrompt({
  name: 'movieSuggestionGeneratorPrompt',
  input: { schema: z.object({
      movies: z.array(z.object({
          id: z.number(),
          title: z.string(),
          overview: z.string(),
      })),
      mood: z.string(),
      preferences: z.array(z.string()),
  })},
  output: { schema: MovieSuggesterOutputSchema },
  prompt: `You are an expert movie curator. Given a list of movies, select up to 5 that best match the user's mood and preferences. For each selected movie, provide a compelling reason (1-2 sentences) explaining why it's a great fit.

  User's Mood: {{{mood}}}
  User's Preferences: {{#if preferences}}{{#each preferences}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

  Available Movies:
  {{#each movies}}
  - ID: {{{id}}}, Title: {{{title}}}, Synopsis: {{{overview}}}
  {{/each}}

  Your response must be a JSON object containing a 'suggestions' array. Each item in the array must have 'tmdbId', 'title', and 'reason'.
  `
});

// The main orchestrating flow
const movieSuggesterFlow = ai.defineFlow(
  {
    name: 'movieSuggesterFlow',
    inputSchema: MovieSuggesterInputSchema,
    outputSchema: z.any(), // Allow for flexible output before final structuring
  },
  async (input): Promise<MovieSuggesterOutput> => {
    // Step 1: Fetch a broad list of popular movies. The AI will do the filtering.
    const movies = await getMovies({
        sort_by: 'popularity.desc',
        'vote_count.gte': '200', // Filter out movies with very few votes
    });

    if (!movies || movies.length === 0) {
        throw new Error("Could not fetch movies from the data source.");
    }
    
    // We only need a subset of movie data for the prompt to save tokens
    const movieDataForPrompt = movies.slice(0, 50).map(m => ({
        id: m.id,
        title: m.title,
        overview: m.overview
    }));

    // Step 2: Generate suggestions and reasons in a single AI call
    const { output: suggestionResult } = await suggestionGeneratorPrompt({
        movies: movieDataForPrompt,
        mood: input.mood,
        preferences: input.preferences || [],
    });

    if (!suggestionResult || !suggestionResult.suggestions || suggestionResult.suggestions.length === 0) {
      return { suggestions: [] };
    }
    
    // Step 3: Hydrate the AI suggestions with full movie data and watch providers
    const finalSuggestions = await Promise.all(
      suggestionResult.suggestions.map(async (suggestion) => {
        const fullMovie = movies.find(m => m.id === suggestion.tmdbId);
        if (!fullMovie) return null;

        const providers = await getWatchProviders(fullMovie.id);
        
        return {
          ...suggestion,
          movie: { ...fullMovie, watchProviders: providers },
        };
      })
    );

    return {
      suggestions: finalSuggestions.filter((s): s is NonNullable<typeof s> => s !== null),
    };
  }
);
