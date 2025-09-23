import Link from 'next/link';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

export function HomeButton() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link href="/" passHref>
        <Button variant="outline" size="icon" aria-label="Home">
          <Home className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
