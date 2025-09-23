'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Music4, VolumeX } from 'lucide-react';

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We need to initialize Audio on the client side.
    if (!audioRef.current) {
      audioRef.current = new Audio('/music/arcade-birthday.mp3');
      audioRef.current.loop = true;
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // play() returns a promise which can be rejected if user hasn't interacted with page.
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button variant="outline" size="icon" onClick={togglePlayPause} aria-label="Toggle music">
        {isPlaying ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Music4 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
