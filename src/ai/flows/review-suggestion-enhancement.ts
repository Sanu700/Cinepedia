'use server';

/**
 * @fileOverview Provides AI-powered suggestions to enhance movie reviews.
 * 
 * - enhanceReviewSuggestion - A function that generates review suggestions based on movie synopsis and review context.
 * - EnhanceReviewSuggestionInput - The input type for the enhanceReviewSuggestion function.
 * - EnhanceReviewSuggestionOutput - The return type for the enhanceReviewSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceReviewSuggestionInputSchema = z.object({
  movieSynopsis: z.string().describe('The synopsis of the movie.'),
  reviewContext: z.string().describe('The current review text the user has written.'),
});

export type EnhanceReviewSuggestionInput = z.infer<
  typeof EnhanceReviewSuggestionInputSchema
>;

const EnhanceReviewSuggestionOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A list of helpful suggestions to improve the review.')
  ).describe('AI-powered suggestions to enhance the review.'),
});

export type EnhanceReviewSuggestionOutput = z.infer<
  typeof EnhanceReviewSuggestionOutputSchema
>;

export async function enhanceReviewSuggestion(
  input: EnhanceReviewSuggestionInput
): Promise<EnhanceReviewSuggestionOutput> {
  return enhanceReviewSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceReviewSuggestionPrompt',
  input: {schema: EnhanceReviewSuggestionInputSchema},
  output: {schema: EnhanceReviewSuggestionOutputSchema},
  prompt: `You are an AI assistant providing suggestions to enhance a user's movie review.

  Movie Synopsis: {{{movieSynopsis}}}
  Review Context: {{{reviewContext}}}

  Provide a list of suggestions that the user could incorporate into their review to make it more informative and engaging. The suggestions should be helpful and relevant to the movie synopsis and current review text.  Return no more than 3 suggestions.
  `,
});

const enhanceReviewSuggestionFlow = ai.defineFlow(
  {
    name: 'enhanceReviewSuggestionFlow',
    inputSchema: EnhanceReviewSuggestionInputSchema,
    outputSchema: EnhanceReviewSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
