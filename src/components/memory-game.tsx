
'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GameCard } from './game-card';
import type { LucideIcon } from 'lucide-react';
import {
  CakeSlice, Gift, PartyPopper, Camera, Music, Heart, Smile, Star,
  Ship, Rocket, Car, Gem, Diamond, Trophy, Sun, Pizza
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LevelCompleteDialog } from './level-complete-dialog';
import { Confetti } from './confetti';
import type { LevelMessage } from '@/ai/flows/personalized-level-messages';
import { getLevelMessages, getWishes, type Wish } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const levelIcons: LucideIcon[][] = [
  [CakeSlice, Gift, PartyPopper, Camera], // Level 1: 4 pairs (8 cards)
  [Music, Heart, Smile, Star, Ship, Rocket], // Level 2: 6 pairs (12 cards)
  [Car, Gem, Diamond, Trophy, Sun, Pizza, CakeSlice, Gift], // Level 3: 8 pairs (16 cards)
];

interface CardState {
  id: number;
  icon: LucideIcon;
  isFlipped: boolean;
  isMatched: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export function MemoryGame() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<LevelMessage | null>(null);

  // State for managing messages from the database
  const [allLevelMessages, setAllLevelMessages] = useState<LevelMessage[]>([]);
  const [allWishes, setAllWishes] = useState<Wish[]>([]);
  const [unseenMessages, setUnseenMessages] = useState<LevelMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const { toast } = useToast();

  const wishesAsLevelMessages = useMemo((): LevelMessage[] => allWishes.map(wish => ({
      id: wish.id,
      message: `From ${wish.author}: "${wish.message}"`,
      // Wishes don't have images or audio by default
  })), [allWishes]);

  const fetchMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
        const [dbLevelMessages, dbWishes] = await Promise.all([
            getLevelMessages(),
            getWishes()
        ]);
        setAllLevelMessages(dbLevelMessages);
        setAllWishes(dbWishes);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load game messages from the database."
        });
    } finally {
        setIsLoadingMessages(false);
    }
  }, [toast]);

  // Initial fetch of all messages
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Reset unseen messages when all messages change (initial load or full reset)
  useEffect(() => {
      const allMessages = [...allLevelMessages, ...wishesAsLevelMessages];
      setUnseenMessages(shuffleArray(allMessages));
  }, [allLevelMessages, wishesAsLevelMessages]);


  const flipAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!flipAudioRef.current) {
      flipAudioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/24/audio_43073b8586.mp3');
    }
  }, []);

  const playFlipSound = () => {
    if (flipAudioRef.current) {
      flipAudioRef.current.currentTime = 0;
      flipAudioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  const setupLevel = useCallback((currentLevel: number) => {
    const iconsForLevel = levelIcons[currentLevel - 1];
    const cardPairs = iconsForLevel.flatMap((Icon, i) => [
      { id: i * 2, icon: Icon, isFlipped: false, isMatched: false },
      { id: i * 2 + 1, icon: Icon, isFlipped: false, isMatched: false },
    ]);
    setCards(shuffleArray(cardPairs));
    setMoves(0);
    setFlippedIndices([]);
    setIsLevelComplete(false);
  }, []);
  
  useEffect(() => {
    setupLevel(level);
  }, [level, setupLevel]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        setCards(prevCards =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(m => m + 1);
    }
  }, [flippedIndices, cards]);

  const selectNextMessage = useCallback(() => {
      if (unseenMessages.length > 0) {
        const hasUnseenLevelMessages = unseenMessages.some(m => allLevelMessages.find(alm => alm.id === m.id));
        const hasUnseenWishes = unseenMessages.some(m => wishesAsLevelMessages.find(w => w.id === m.id));

        let messageSourcePool: LevelMessage[];

        if (hasUnseenLevelMessages && hasUnseenWishes) {
            const isLevelMessage = Math.random() < 0.65;
            messageSourcePool = isLevelMessage
                ? unseenMessages.filter(m => allLevelMessages.find(alm => alm.id === m.id))
                : unseenMessages.filter(m => wishesAsLevelMessages.find(w => w.id === m.id));
             if (messageSourcePool.length === 0) {
                // Fallback to the other pool if the chosen one is empty
                 messageSourcePool = isLevelMessage
                    ? unseenMessages.filter(m => wishesAsLevelMessages.find(w => w.id === m.id))
                    : unseenMessages.filter(m => allLevelMessages.find(alm => alm.id === m.id));
            }
        } else {
            messageSourcePool = unseenMessages;
        }
        
        if (messageSourcePool.length > 0) {
            const index = Math.floor(Math.random() * messageSourcePool.length);
            const message = messageSourcePool[index];
            setSelectedMessage(message);
            setUnseenMessages(prev => prev.filter(m => m.id !== message.id));
        } else {
            // This case happens if logic is complex, should ideally go to the outer else
            setSelectedMessage(null);
        }

      } else {
        // No more unseen messages, AI will be used as fallback
        setSelectedMessage(null);
      }
  }, [unseenMessages, allLevelMessages, wishesAsLevelMessages]);


  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(c => c.isMatched);
    if (allMatched) {
        selectNextMessage();
        setIsLevelComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [cards, selectNextMessage]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || flippedIndices.length === 2) {
      return;
    }
    playFlipSound();
    setCards(prev => prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c)));
    setFlippedIndices(prev => [...prev, index]);
  };

  const goToNextLevel = () => {
    // Reset unseen messages if all have been seen
    if (unseenMessages.length === 0) {
        const allMessages = [...allLevelMessages, ...wishesAsLevelMessages];
        setUnseenMessages(shuffleArray(allMessages));
        toast({ title: "Messages Reloaded!", description: "You've seen all the messages. Starting over!" });
    }
    const nextLevel = level < levelIcons.length ? level + 1 : 1; // Loop back to level 1
    setLevel(nextLevel);
  };

  const gridClass = level === 1 ? 'grid-cols-4' : level === 2 ? 'grid-cols-4' : 'grid-cols-4';
  
  if (isLoadingMessages) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Game Assets...</p>
        </div>
    );
  }

  return (
    <>
      <Confetti active={showConfetti} />
      <LevelCompleteDialog
        level={level}
        isOpen={isLevelComplete}
        onClose={() => setIsLevelComplete(false)}
        onNextLevel={goToNextLevel}
        selectedMessage={selectedMessage}
      />
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-3xl">Memory Game</CardTitle>
              <CardDescription>Match the pairs to clear the level!</CardDescription>
            </div>
            <div className="flex gap-4 text-right">
                <div className="text-lg">
                    <span className="font-bold text-primary">Level:</span> {level}
                </div>
                <div className="text-lg">
                    <span className="font-bold text-primary">Moves:</span> {moves}
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`grid ${gridClass} ${level === 2 ? 'md:grid-cols-6' : level === 3 ? 'md:grid-cols-4' : 'sm:grid-cols-4'} gap-4 justify-center`}>
            {cards.map((card, index) => (
              <GameCard
                key={`${level}-${card.id}`}
                icon={card.icon}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      {level > levelIcons.length && (
        <div className="text-center mt-8">
            <h2 className="font-headline text-2xl">You've completed all levels!</h2>
            <Button onClick={() => setLevel(1)} className="mt-4">Play Again</Button>
        </div>
      )}
    </>
  );
}
