import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MemeticEffectsProps {
  intensity: number; // 0-1
  enabled: boolean;
}

export const MemeticEffects = ({ intensity, enabled }: MemeticEffectsProps) => {
  const effects = useMemo(() => {
    if (!enabled || intensity < 0.1) return null;

    const staticOpacity = Math.min(0.15, intensity * 0.2);
    const scanlineOpacity = Math.min(0.3, intensity * 0.4);
    const chromaticAberration = Math.min(3, intensity * 5);
    const shake = intensity > 0.7 ? Math.random() * 2 - 1 : 0;

    return {
      staticOpacity,
      scanlineOpacity,
      chromaticAberration,
      shake
    };
  }, [intensity, enabled]);

  if (!effects) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Static noise */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: effects.staticOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          animation: intensity > 0.5 ? 'noise 0.1s infinite' : undefined
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          opacity: effects.scanlineOpacity,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Chromatic aberration edges */}
      {intensity > 0.3 && (
        <>
          <div
            className="absolute inset-0"
            style={{
              boxShadow: `inset ${effects.chromaticAberration}px 0 10px rgba(255,0,0,0.1), inset -${effects.chromaticAberration}px 0 10px rgba(0,255,255,0.1)`,
              pointerEvents: 'none'
            }}
          />
        </>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent ${60 - intensity * 20}%, rgba(0,0,0,${0.3 + intensity * 0.4}) 100%)`,
          pointerEvents: 'none'
        }}
      />

      {/* Random glitch bars */}
      {intensity > 0.5 && Math.random() < 0.1 && (
        <div
          className="absolute left-0 right-0 bg-red-500/20"
          style={{
            top: `${Math.random() * 100}%`,
            height: `${Math.random() * 5 + 2}px`,
            transform: `translateX(${Math.random() * 10 - 5}px)`
          }}
        />
      )}

      {/* Flicker effect */}
      {intensity > 0.8 && Math.random() < 0.05 && (
        <div className="absolute inset-0 bg-white/10" />
      )}

      <style>{`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, 0%); }
          60% { transform: translate(1%, 0%); }
          70% { transform: translate(0%, 1%); }
          80% { transform: translate(0%, -1%); }
          90% { transform: translate(1%, 1%); }
        }
      `}</style>
    </div>
  );
};
