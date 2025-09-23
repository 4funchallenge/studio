import { MemoryGame } from '@/components/memory-game';

export default function GamePage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-8">
      <MemoryGame />
    </div>
  );
}
