import { useState, useRef, useEffect } from "react";

export function useOiiaiu(audioSrc = "audio/Oiiaiu.mp3") {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(audioSrc);
    
    const handleEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current.removeEventListener("ended", handleEnded);
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return { isPlaying, toggle, stop };
}
