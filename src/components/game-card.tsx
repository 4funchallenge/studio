'use client';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { PartyPopper } from 'lucide-react';

interface GameCardProps {
  icon: LucideIcon;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export const GameCard = ({ icon: Icon, isFlipped, isMatched, onClick }: GameCardProps) => {
  return (
    <div
      className={cn(
        'relative h-24 w-24 cursor-pointer transition-transform duration-300 [transform-style:preserve-3d]',
        { 'pointer-events-none': isFlipped || isMatched },
        isFlipped ? '[transform:rotateY(180deg)]' : ''
      )}
      onClick={onClick}
    >
      {/* Back of the card */}
      <div className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-primary/50 bg-card shadow-lg transition-colors hover:border-primary">
        <PartyPopper className="h-10 w-10 text-primary/50" />
      </div>

      {/* Front of the card */}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-lg bg-accent shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]',
          isMatched ? 'border-4 border-green-500' : 'border-2 border-accent-foreground'
        )}
      >
        <Icon className="h-12 w-12 text-accent-foreground" />
      </div>
    </div>
  );
};
