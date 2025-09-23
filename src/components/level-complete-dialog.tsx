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
    if (isOpen && selectedMessage) {
      const getMessage = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
          // We now receive the selected message as a prop,
          // so we only need to call the AI for the image and audio.
          const response = await generatePersonalizedMessage({
            levelCompleted: level,
            userMessages: [], // Not used in the current flow
            levelMessages: [selectedMessage], // Pass only the selected message
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
    if (result?.audioDataUri && audioRef.current) {
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
          {result && (
            <div className="flex flex-col items-center gap-4 text-center">
              {result.imageDataUri && (
                <Image
                  src={result.imageDataUri}
                  alt="AI Generated Image"
                  width={200}
                  height={200}
                  className="rounded-lg shadow-lg"
                />
              )}
              <p className="text-lg font-medium">{result.message}</p>
            </div>
          )}
           {!isLoading && !result && !error && (
             <div className="text-center text-muted-foreground">
               <p>No more new messages!</p>
               <p>But you're still doing great!</p>
             </div>
           )}
        </div>
        <Button onClick={handleNextLevel} className="w-full" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Continue'}
        </Button>
        <audio ref={audioRef} />
      </DialogContent>
    </Dialog>
  );
};
