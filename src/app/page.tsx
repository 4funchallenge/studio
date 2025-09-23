import { CountdownTimer } from '@/components/countdown-timer';
import Link from 'next/link';
import { Gamepad2, Gift, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const navLinks = [
  { href: '/game', label: 'Play Game', icon: Gamepad2 },
  { href: '/wishes', label: 'Birthday Wishes', icon: Gift },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function Home() {
  // Admin can configure this date. For now, it's set to a future date.
  const birthdayDate = new Date('2025-01-01T00:00:00');

  return (
    <div className="container relative mx-auto flex h-screen flex-col items-center justify-center text-center p-4">
       <div 
        className="absolute inset-0 -z-10 h-full w-full bg-transparent"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background via-purple-900/10 to-pink-500/10" />

      <h2 className="font-cursive text-4xl text-secondary drop-shadow-lg md:text-5xl">Wishing Afnan a very</h2>
      <h1 className="font-arcade text-6xl font-bold tracking-widest text-primary drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)] md:text-8xl lg:text-9xl">
        Happy Birthday
      </h1>
      
      <div className="mt-12 flex flex-col items-center gap-4 w-full max-w-xs">
        {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
                key={href}
                href={href}
                className={cn(
                    buttonVariants({ variant: 'default', size: 'lg' }),
                    'w-full text-lg font-timer tracking-wider'
                )}
            >
                <Icon className="mr-3 h-6 w-6" />
                {label}
            </Link>
        ))}
      </div>

      <div className="mt-12 scale-90 md:scale-100">
        <CountdownTimer targetDate={birthdayDate} />
      </div>

      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        Credit to Afnan's fans league <Gift className="inline-block h-4 w-4 text-primary" />
      </footer>
    </div>
  );
}
