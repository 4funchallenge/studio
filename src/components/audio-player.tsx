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

  useEffect(() => {
    // Initialize Audio on the client side.
    if (!audioRef.current) {
      audioRef.current = new Audio(defaultSrc);
      audioRef.current.loop = true;
    }
  }, [defaultSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack && audio.src !== new URL(currentTrack, window.location.origin).toString()) {
        const wasPlaying = !audio.paused;
        audio.src = currentTrack;
        if(wasPlaying) {
            audio.play().catch(error => console.error("Audio play failed on src change:", error));
        }
    }

    if (isPlaying && audio.paused) {
        audio.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && !audio.paused) {
        audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const contextValue = useMemo(() => ({
    setTrack: (src: string | null) => {
      // If null, revert to default. If a new track, set it.
      setCurrentTrack(src || defaultSrc);
    }
  }), [defaultSrc]);

  return (
    <AudioContext.Provider value={contextValue}>
        {children}
        <div className="fixed top-4 right-4 z-50">
            <Button variant="outline" size="icon" onClick={togglePlayPause} aria-label="Toggle music">
                {isPlaying ? (
                <VolumeX className="h-5 w-5" />
                ) : (
                <Music4 className="h-5 w-5" />
                )}
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

// This component now just sets the track for its page context
export function PageSpecificAudio({ src }: { src: string | null }) {
    const { setTrack } = useAudio();
    const pathname = usePathname();

    useEffect(() => {
        setTrack(src);

        // When component unmounts (page changes), revert to default
        return () => {
            // A small timeout helps prevent race conditions between pages
            setTimeout(() => {
                setTrack(null);
            }, 10);
        }
    }, [src, setTrack, pathname]);

    return null; // This component does not render anything
}
