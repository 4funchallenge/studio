import { CountdownTimer } from '@/components/countdown-timer';

export default function Home() {
  // Admin can configure this date. For now, it's set to a future date.
  const birthdayDate = new Date('2025-01-01T00:00:00');

  return (
    <div className="container relative mx-auto flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10"></div>
      <h1 className="font-headline text-5xl font-bold tracking-tighter md:text-7xl lg:text-8xl">
        Happy Birthday Afnan!
      </h1>
      <p className="mt-4 max-w-xl text-lg text-foreground/80">
        The countdown to the ultimate birthday bash has begun. Get ready to play,
        share your wishes, and celebrate!
      </p>
      <div className="mt-12">
        <CountdownTimer targetDate={birthdayDate} />
      </div>
    </div>
  );
}
