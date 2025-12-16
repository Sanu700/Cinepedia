'use client';

import { Button } from '@/components/ui/button';
import { WandSparklesIcon } from '@/components/icons/WandSparklesIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FabProps {
    onClick: () => void;
}

export default function Fab({ onClick }: FabProps) {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={onClick}
                    className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50"
                    size="icon"
                >
                    <WandSparklesIcon className="h-8 w-8" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>What should I watch?</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  );
}
