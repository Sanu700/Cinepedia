"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: number;
  isInteractive?: boolean;
}

export default function StarRating({ rating, setRating, size = 24, isInteractive = true }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseOver = (index: number) => {
    if (isInteractive && setRating) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive && setRating) {
      setHoverRating(0);
    }
  };

  const handleClick = (index: number) => {
    if (isInteractive && setRating) {
      setRating(index);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const index = i + 1;
        return (
          <Star
            key={index}
            className={cn(
              'transition-colors',
              (hoverRating >= index || rating >= index) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground',
              isInteractive && setRating ? 'cursor-pointer' : ''
            )}
            style={{ width: size, height: size }}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
}
