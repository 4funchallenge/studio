
'use client';

import { useState, useRef, useEffect, createContext, useContext, useMemo } from 'react';
import { Button } from './ui/button';
import { Music4, VolumeX } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AudioContextType {
  setTrack: (src: string | null) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ 
    children,
    defaultSrc 
}: { 
    children: React.ReactNode,
    defaultSrc: string,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(defaultSrc);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  // Initialize Audio on the client side.
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
  }, []);

  // Effect to manage the audio source and play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Determine the correct track to play.
    // On the homepage ('/'), always use the default.
    // On other pages, use the track set by PageSpecificAudio.
    const trackToPlay = pathname === '/' ? defaultSrc : currentTrack;

    if (trackToPlay) {
      // Check if the source needs to be changed
      const currentSrc = audio.src ? new URL(audio.src).pathname : '';
      const newSrc = new URL(trackToPlay, window.location.origin).pathname;

      if (currentSrc !== newSrc) {
        audio.src = trackToPlay;
        // If it was playing before the source change, play the new track.
        if (isPlaying) {
          audio.play().catch(error => console.error("Audio play failed on src change:", error));
        }
      }
    }

    // Handle manual play/pause toggle
    if (isPlaying && audio.paused && audio.src) {
      audio.play().catch(e => console.error("Audio play failed on toggle:", e));
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying, currentTrack, defaultSrc, pathname]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const contextValue = useMemo(() => ({
    setTrack: (src: string | null) => {
      setCurrentTrack(src);
    }
  }), []);

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

// This component's only job is to tell the provider which track to play.
export function PageSpecificAudio({ src }: { src: string | null }) {
    const { setTrack } = useAudio();

    useEffect(() => {
        // On mount, set the track for this page
        setTrack(src);

        // On unmount (when navigating away), tell the provider to fall back to default.
        return () => {
            setTrack(null);
        }
    }, [src, setTrack]);

    return null; // This component does not render anything.
}
