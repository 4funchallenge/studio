'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { Gamepad2, Gift, Mail } from 'lucide-react';

const links = [
  { href: '/game', label: 'Play', icon: Gamepad2 },
  { href: '/wishes', label: 'Wishes', icon: Gift },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2 md:space-x-4">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            buttonVariants({
              variant: pathname === href ? 'secondary' : 'ghost',
              size: 'sm',
            }),
            'flex items-center gap-2'
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden md:inline">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
