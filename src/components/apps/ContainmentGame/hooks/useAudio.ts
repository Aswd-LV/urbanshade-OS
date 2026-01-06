import { useRef, useCallback, useEffect } from 'react';

interface AudioState {
  ambience: HTMLAudioElement | null;
  enabled: boolean;
}

export const useAudio = () => {
  const audioState = useRef<AudioState>({
    ambience: null,
    enabled: true
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    if (!audioState.current.enabled) return;

    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error('Audio error:', e);
    }
  }, [getAudioContext]);

  const playPingSweep = useCallback(() => {
    // Radar ping sound
    playTone(1200, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(800, 0.15, 'sine', 0.15), 100);
  }, [playTone]);

  const playAlert = useCallback(() => {
    // Urgent beeping
    for (let i = 0; i < 3; i++) {
      setTimeout(() => playTone(880, 0.15, 'square', 0.4), i * 200);
    }
  }, [playTone]);

  const playBreachWarning = useCallback(() => {
    // Intense alarm
    const playBeep = (i: number) => {
      if (i >= 6) return;
      playTone(440 + (i % 2) * 220, 0.2, 'sawtooth', 0.5);
      setTimeout(() => playBeep(i + 1), 250);
    };
    playBeep(0);
  }, [playTone]);

  const playDoorSlam = useCallback(() => {
    // Low thud
    playTone(80, 0.3, 'sine', 0.6);
    playTone(60, 0.4, 'sine', 0.4);
  }, [playTone]);

  const playShock = useCallback(() => {
    // Electric crackle
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(200 + Math.random() * 800, 0.05, 'sawtooth', 0.3);
      }, i * 30);
    }
  }, [playTone]);

  const playLure = useCallback(() => {
    // Melodic lure sound
    playTone(523, 0.2, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.2, 'sine', 0.25), 150);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.2), 300);
  }, [playTone]);

  const playStatic = useCallback(() => {
    // White noise burst
    if (!audioState.current.enabled) return;

    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      const gainNode = ctx.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      source.start();
    } catch (e) {
      console.error('Static audio error:', e);
    }
  }, [getAudioContext]);

  const playVictory = useCallback(() => {
    // Victory fanfare
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.4, 'sine', 0.3), i * 200);
    });
  }, [playTone]);

  const playGameOver = useCallback(() => {
    // Ominous low tone
    playTone(110, 1, 'sawtooth', 0.4);
    playTone(55, 1.5, 'sine', 0.3);
  }, [playTone]);

  const setEnabled = useCallback((enabled: boolean) => {
    audioState.current.enabled = enabled;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    playPingSweep,
    playAlert,
    playBreachWarning,
    playDoorSlam,
    playShock,
    playLure,
    playStatic,
    playVictory,
    playGameOver,
    setEnabled
  };
};
