'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Music4, VolumeX } from 'lucide-react';

export function AudioPlayer({ src }: { src?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Store src in a ref to avoid re-triggering useEffect on every render
  const srcRef = useRef(src);
  if (srcRef.current !== src) {
      srcRef.current = src;
  }

  useEffect(() => {
    if (!srcRef.current) return;
    
    // We need to initialize Audio on the client side.
    if (!audioRef.current) {
      audioRef.current = new Audio(srcRef.current);
      audioRef.current.loop = true;
    } else {
        // If the src has changed, update the audio source
        if(audioRef.current.src !== new URL(srcRef.current, window.location.origin).toString()) {
            const wasPlaying = !audioRef.current.paused;
            audioRef.current.src = srcRef.current;
            if(wasPlaying) {
                audioRef.current.play().catch(error => console.error("Audio play failed on src change:", error));
            }
        }
    }
  }, [srcRef, isPlaying]); // Depend on isPlaying to re-evaluate when user tries to play

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

  if (!src) return null;

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
