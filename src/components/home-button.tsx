import Link from 'next/link';
import { Button } from './ui/button';
import { Home } from 'lucide-react';
import { AudioPlayer } from './audio-player';

export function HomeButton() {
  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-4">
      <Link href="/" passHref>
        <Button variant="outline" size="icon" aria-label="Home">
          <Home className="h-5 w-5" />
        </Button>
      </Link>
      <AudioPlayer />
    </div>
  );
}
