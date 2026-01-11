import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number;
  glitchDuration?: number;
  enabled?: boolean;
}

export const GlitchText = ({
  text,
  className,
  glitchInterval = 5000,
  glitchDuration = 150,
  enabled = true
}: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      return;
    }

    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
    
    const triggerGlitch = () => {
      setIsGlitching(true);
      
      // Randomly corrupt some characters
      const corrupted = text.split('').map((char, i) => {
        if (Math.random() < 0.3) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      }).join('');
      
      setDisplayText(corrupted);
      
      setTimeout(() => {
        setDisplayText(text);
        setIsGlitching(false);
      }, glitchDuration);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        triggerGlitch();
      }
    }, glitchInterval);

    return () => clearInterval(interval);
  }, [text, glitchInterval, glitchDuration, enabled]);

  return (
    <span 
      className={cn(
        "relative inline-block",
        isGlitching && "animate-glitch-shake",
        className
      )}
      style={{
        textShadow: isGlitching 
          ? '2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5)' 
          : undefined
      }}
    >
      {displayText}
    </span>
  );
};
