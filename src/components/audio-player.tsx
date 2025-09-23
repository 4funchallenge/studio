
'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Button } from './ui/button';
import { Music4, VolumeX } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Map paths to their respective audio tracks
const trackMap: { [key: string]: string } = {
  '/': 'https://cdn.pixabay.com/audio/2023/08/26/audio_45bbec8ec1.mp3',
  '/game': 'https://cdn.pixabay.com/audio/2022/10/16/audio_a53c4a28d7.mp3',
  '/wishes': 'https://storage.googleapis.com/studiopanda-assets/wishes-music.mp3',
  '/contact': 'https://storage.googleapis.com/studiopanda-assets/contact-music.mp3',
  '/admin': 'https://storage.googleapis.com/studiopanda-assets/arcade-birthday.mp3',
};


interface AudioContextType {
  isPlaying: boolean;
  togglePlayPause: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();
  
  // Initialize Audio on the client side.
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audioRef.current = audio;
      
      // Try to play when audio is first initialized
      if (isPlaying) {
        audio.play().catch(e => console.error("Audio play failed on init:", e));
      }
    }
  }, [isPlaying]);

  // Effect to decide which track to play based on the current path
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Find the track for the current path, falling back to the homepage track.
    const trackForPath = trackMap[pathname] ?? trackMap['/'];

    // If the track is different, update the source and play if needed.
    if (audio.src !== trackForPath) {
      audio.src = trackForPath;
      if (isPlaying) {
         audio.play().catch(e => console.error("Audio play failed on path change:", e));
      }
    }
    
  }, [pathname, isPlaying]);

  // Effect to manage play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audio.paused) {
      audio.play().catch(e => console.error("Audio play failed on state change:", e));
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);


  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause }}>
      {children}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={togglePlayPause} aria-label="Toggle music">
          {isPlaying ? <Music4 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>
    </AudioContext.Provider>
  );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
