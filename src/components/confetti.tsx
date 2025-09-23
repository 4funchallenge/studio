'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiPiece {
  id: number;
  style: React.CSSProperties;
}

const colors = ['#F48FB1', '#FFDA63', '#81C784', '#64B5F6', '#BA68C8'];

export const Confetti = ({ active }: { active: boolean }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 150 }).map((_, i) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return {
          id: i,
          style: {
            left: `${Math.random() * 100}%`,
            backgroundColor: randomColor,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${Math.random() * 2 + 3}s ${Math.random() * 2}s linear forwards`,
            opacity: 1,
          },
        };
      });
      setPieces(newPieces);
      
      const timer = setTimeout(() => {
        setPieces([]);
      }, 7000); // Clear pieces after longest animation + delay

      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active) return null;

  return (
    <>
      <style>
        {`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        `}
      </style>
      <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
        {pieces.map(({ id, style }) => (
          <div
            key={id}
            className={cn('absolute top-[-20px] h-4 w-2 rounded-sm')}
            style={style}
          />
        ))}
      </div>
    </>
  );
};
