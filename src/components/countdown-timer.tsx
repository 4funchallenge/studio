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
  <div className="flex flex-col items-center justify-center rounded-lg bg-card/80 backdrop-blur-sm p-4 md:p-6 shadow-lg border border-primary/20 min-w-[70px] md:min-w-[90px]">
    <span className="font-timer text-4xl md:text-6xl font-bold text-primary drop-shadow-[0_2px_4px_rgba(236,72,153,0.5)]">
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
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      <TimeBox value={timeLeft.days} label="Days" />
      <span className="text-4xl text-muted-foreground animate-pulse font-timer">:</span>
      <TimeBox value={timeLeft.hours} label="Hours" />
      <span className="text-4xl text-muted-foreground animate-pulse font-timer">:</span>
      <TimeBox value={timeLeft.minutes} label="Minutes" />
      <span className="text-4xl text-muted-foreground animate-pulse font-timer">:</span>
      <TimeBox value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}
