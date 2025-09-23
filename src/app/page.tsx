import { CountdownTimer } from '@/components/countdown-timer';

export default function Home() {
  // Admin can configure this date. For now, it's set to a future date.
  const birthdayDate = new Date('2025-01-01T00:00:00');

  return (
    <div className="container relative mx-auto flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
       <div 
        className="absolute inset-0 -z-10 h-full w-full bg-transparent"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-background via-purple-900/10 to-pink-500/10" />

      <h2 className="font-cursive text-4xl text-secondary-foreground drop-shadow-lg md:text-5xl">The ultimate</h2>
      <h1 className="font-arcade text-6xl font-bold tracking-widest text-primary drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)] md:text-8xl lg:text-9xl">
        Birthday Blast
      </h1>
      <p className="mt-6 max-w-xl font-handwritten text-2xl text-foreground/80">
        The countdown has begun. Get ready to play, share your wishes, and celebrate Afnan!
      </p>
      <div className="mt-12 scale-110">
        <CountdownTimer targetDate={birthdayDate} />
      </div>
    </div>
  );
}
