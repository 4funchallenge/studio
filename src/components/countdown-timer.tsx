'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft | null => {
  const difference = +targetDate - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
};

const TimeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-card p-4 md:p-6 shadow-lg min-w-[70px] md:min-w-[90px]">
    <span className="font-headline text-4xl md:text-6xl font-bold text-primary">
      {String(value).padStart(2, '0')}
    </span>
    <span className="mt-1 text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
  </div>
);


export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  
  useEffect(() => {
    // Set initial value on client
    setTimeLeft(calculateTimeLeft(targetDate));
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center">
        <h2 className="font-headline text-4xl font-bold text-accent">The party is now!</h2>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <TimeBox value={timeLeft.days} label="Days" />
      <span className="text-4xl text-muted-foreground animate-pulse">:</span>
      <TimeBox value={timeLeft.hours} label="Hours" />
      <span className="text-4xl text-muted-foreground animate-pulse">:</span>
      <TimeBox value={timeLeft.minutes} label="Minutes" />
      <span className="text-4xl text-muted-foreground animate-pulse">:</span>
      <TimeBox value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
