import Link from 'next/link';
import { AudioPlayer } from './audio-player';
import { CakeSlice, Home } from 'lucide-react';
import { Button } from './ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" passHref>
          <Button variant="ghost">
            <Home className="h-5 w-5 mr-2" />
            Home
          </Button>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <AudioPlayer />
        </div>
      </div>
    </header>
  );
}
