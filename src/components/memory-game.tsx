'use client';

import { useState, useEffect, useRef } from 'react';
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
  const flipAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio on the client side
    if (!flipAudioRef.current) {
      flipAudioRef.current = new Audio('/music/card-flip.mp3');
    }
  }, []);

  const playFlipSound = () => {
    if (flipAudioRef.current) {
      flipAudioRef.current.currentTime = 0;
      flipAudioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  const setupLevel = (currentLevel: number) => {
    const iconsForLevel = levelIcons[currentLevel - 1];
    const cardPairs = iconsForLevel.flatMap((Icon, i) => [
      { id: i * 2, icon: Icon, isFlipped: false, isMatched: false },
      { id: i * 2 + 1, icon: Icon, isFlipped: false, isMatched: false },
    ]);
    setCards(shuffleArray(cardPairs));
    setMoves(0);
    setFlippedIndices([]);
    setIsLevelComplete(false);
  };
  
  useEffect(() => {
    setupLevel(level);
  }, [level]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        // It's a match
        setCards(prevCards =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
        setIsChecking(false);
      } else {
        // Not a match
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

  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(c => c.isMatched);
    if (allMatched) {
        setIsLevelComplete(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || flippedIndices.length === 2) {
      return;
    }
    playFlipSound();
    setCards(prev => prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c)));
    setFlippedIndices(prev => [...prev, index]);
  };

  const goToNextLevel = () => {
    const nextLevel = level < levelIcons.length ? level + 1 : 1; // Loop back to level 1
    setLevel(nextLevel);
  };

  const gridClass = level === 1 ? 'grid-cols-4' : level === 2 ? 'grid-cols-4' : 'grid-cols-4';
  const gridLayout = level === 2 ? 'md:grid-cols-6' : 'md:grid-cols-8';

  return (
    <>
      <Confetti active={showConfetti} />
      <LevelCompleteDialog
        level={level}
        isOpen={isLevelComplete}
        onClose={() => setIsLevelComplete(false)}
        onNextLevel={goToNextLevel}
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
