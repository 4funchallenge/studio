
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

  useEffect(() => {
    // Initialize Audio on the client side.
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Use currentTrack if set, otherwise fallback to defaultSrc, especially for the homepage.
    // pathname check ensures default is used on the home page when navigating back.
    const trackToPlay = (pathname !== '/' && currentTrack) ? currentTrack : defaultSrc;
    
    // Check if we need to change the source
    const currentSrc = audio.src ? new URL(audio.src).pathname : '';
    const newSrc = new URL(trackToPlay, window.location.origin).pathname;

    if (currentSrc !== newSrc) {
      const wasPlaying = !audio.paused;
      audio.src = trackToPlay;
      if (wasPlaying || isPlaying) {
        audio.play().catch(error => console.error("Audio play failed on src change:", error));
      }
    }
    
    // Handle play/pause state
    if (isPlaying && audio.paused) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying, currentTrack, defaultSrc, pathname]);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const contextValue = useMemo(() => ({
    setTrack: (src: string | null) => {
      // When a track is set, update the state.
      // If src is null, it means we should revert to the page's default.
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

// This component now just sets the track for its page context
export function PageSpecificAudio({ src }: { src: string | null }) {
    const { setTrack } = useAudio();

    useEffect(() => {
        // On mount, set the track for this page
        setTrack(src);

        // On unmount (page change), reset the track to null.
        // The provider will then fall back to the default track if on the home page.
        return () => {
            setTrack(null);
        }
    }, [src, setTrack]);

    return null; // This component does not render anything
}
