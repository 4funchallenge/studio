
'use client';

import { useState, useRef, useEffect, createContext, useContext, useMemo } from 'react';
import { Button } from './ui/button';
import { Music4, VolumeX } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AudioContextType {
  setTrack: (src: string) => void;
  trackMap: Map<string, string>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();
  
  // A map to store the track for each path
  const trackMap = useMemo(() => new Map<string, string>(), []);
  
  // The currently playing track's source
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  // Initialize Audio on the client side.
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audioRef.current = audio;
    }
  }, []);

  // Effect to decide which track to play based on the current path
  useEffect(() => {
    // The homepage track is the default
    const trackForPath = trackMap.get(pathname) ?? trackMap.get('/') ?? null;
    setCurrentTrack(trackForPath);
  }, [pathname, trackMap]);
  
  // Effect to manage the audio element itself
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = () => {
      if (isPlaying && audio.paused && audio.src) {
        audio.play().catch(e => console.error("Audio play failed:", e));
      }
    };
    
    if (currentTrack && audio.src !== new URL(currentTrack, window.location.origin).href) {
        audio.src = currentTrack;
        playAudio();
    } else if (!currentTrack) {
        audio.pause();
        audio.removeAttribute('src');
    }

    if (isPlaying && audio.paused && audio.src) {
        playAudio();
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }

  }, [isPlaying, currentTrack]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const contextValue = useMemo(() => ({
    setTrack: (src: string) => {
      // For the homepage, we set a default track.
      if (!trackMap.has('/')) {
        trackMap.set('/', src);
      }
    },
    trackMap,
  }), [trackMap]);

  // Set the default track for the homepage
  useEffect(() => {
    contextValue.trackMap.set('/', '/music/arcade-birthday.mp3');
  }, [contextValue.trackMap]);

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={togglePlayPause} aria-label="Toggle music">
          {isPlaying ? <VolumeX className="h-5 w-5" /> : <Music4 className="h-5 w-5" />}
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

// This component's only job is to tell the provider which track to play for a given path.
export function PageSpecificAudio({ src }: { src: string | null }) {
    const { trackMap } = useAudio();
    const pathname = usePathname();

    useEffect(() => {
      if (src) {
        trackMap.set(pathname, src);
      }
        // No cleanup needed, we want the track map to persist
    }, [src, pathname, trackMap]);

    return null; // This component does not render anything.
}
