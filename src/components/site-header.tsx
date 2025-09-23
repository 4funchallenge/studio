import Link from 'next/link';
import { MainNav } from './main-nav';
import { AudioPlayer } from './audio-player';
import { CakeSlice } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <CakeSlice className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block font-headline">
            Afnan's Birthday Blast
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <MainNav />
            <AudioPlayer />
        </div>
      </div>
    </header>
  );
}
