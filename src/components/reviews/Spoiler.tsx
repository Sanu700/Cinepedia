
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpoilerProps {
  children: React.ReactNode;
}

export default function Spoiler({ children }: SpoilerProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "transition-all duration-300",
          !isRevealed && "blur-md select-none"
        )}
      >
        {children}
      </div>
      {!isRevealed && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Button
            variant="secondary"
            onClick={() => setIsRevealed(true)}
            className="shadow-lg"
          >
            <Eye className="mr-2 h-4 w-4" />
            Reveal Spoiler
          </Button>
        </div>
      )}
    </div>
  );
}

    