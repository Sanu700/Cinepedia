"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { enhanceReviewSuggestion } from "@/ai/flows/review-suggestion-enhancement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

interface AiSuggestionProps {
  movieSynopsis: string;
  reviewContext: string;
}

export default function AiSuggestion({ movieSynopsis, reviewContext }: AiSuggestionProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const getSuggestions = () => {
    if (reviewContext.length < 20) {
        toast({
            title: "Write a bit more!",
            description: "Please write at least 20 characters before asking for suggestions.",
            variant: "default"
        });
        return;
    }

    startTransition(async () => {
      setSuggestions([]);
      const result = await enhanceReviewSuggestion({ movieSynopsis, reviewContext });
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
         toast({
            title: "Something went wrong",
            description: "Couldn't generate suggestions at this time. Please try again later.",
            variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <Button onClick={getSuggestions} disabled={isPending} type="button">
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Get AI Suggestions
      </Button>

      {isPending && (
         <p className="text-sm text-muted-foreground flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating ideas...
         </p>
      )}

      {suggestions.length > 0 && (
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="text-primary w-5 h-5"/>
              Here are some ideas!
            </CardTitle>
            <CardDescription>
                Consider these points to make your review even better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc list-inside text-foreground/90">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
