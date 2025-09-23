
'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import {
  generatePersonalizedMessage,
  type PersonalizedMessageOutput,
  type LevelMessage,
} from '@/ai/flows/personalized-level-messages';

interface LevelCompleteDialogProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
  onNextLevel: () => void;
  selectedMessage: LevelMessage | null;
}

export const LevelCompleteDialog = ({
  level,
  isOpen,
  onClose,
  onNextLevel,
  selectedMessage,
}: LevelCompleteDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedMessageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
        const getMessage = async () => {
          setIsLoading(true);
          setError(null);
          setResult(null);
          try {
            // The AI flow now handles the fallback logic.
            // We pass an array containing the selected message, or an empty array if none.
            const response = await generatePersonalizedMessage({
              levelCompleted: level,
              userMessages: [], // Not used
              levelMessages: selectedMessage ? [selectedMessage] : [],
            });
            setResult(response);
          } catch (e) {
            console.error(e);
            setError('Could not generate a special message. Please try again!');
          } finally {
            setIsLoading(false);
          }
        };
        getMessage();
    }
  }, [isOpen, level, selectedMessage]);

  useEffect(() => {
    // If the result has a data URI, use it. Otherwise, do nothing.
    if (result?.audioDataUri) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = result.audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [result]);


  const handleNextLevel = () => {
    onNextLevel();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-accent" />
            Level {level} Complete!
          </DialogTitle>
          <DialogDescription>
            You did an amazing job! Here's a special message for you.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 flex min-h-[250px] items-center justify-center rounded-lg bg-card p-4">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating your surprise...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {result && result.message && (
            <div className="flex flex-col items-center gap-4 text-center">
              {result.imageDataUri && (
                <Image
                  src={result.imageDataUri}
                  alt="AI Generated Image"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-lg"
                  unoptimized // Required for external URLs and data URIs
                />
              )}
              <p className="text-lg font-medium">{result.message}</p>
            </div>
          )}
        </div>
        <Button onClick={handleNextLevel} className="w-full" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Continue'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
