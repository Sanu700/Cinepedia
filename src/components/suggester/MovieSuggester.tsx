'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SuggesterForm from './SuggesterForm';

interface MovieSuggesterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MovieSuggester({ open, onOpenChange }: MovieSuggesterProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-3xl font-headline">What should I watch right now?</DialogTitle>
          <DialogDescription>Let's find the perfect movie for your mood.</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2 -mr-6">
          <SuggesterForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
