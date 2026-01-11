import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CRTEffectProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  showNoise?: boolean;
  showScanlines?: boolean;
  showVignette?: boolean;
  showFlicker?: boolean;
  tint?: 'cyan' | 'green' | 'amber';
}

export const CRTEffect = ({
  className,
  intensity = 'medium',
  showNoise = true,
  showScanlines = true,
  showVignette = true,
  showFlicker = false,
  tint = 'cyan'
}: CRTEffectProps) => {
  const [noiseOffset, setNoiseOffset] = useState(0);
  const [flickerOpacity, setFlickerOpacity] = useState(1);

  useEffect(() => {
    if (!showNoise) return;
    const interval = setInterval(() => {
      setNoiseOffset(Math.random() * 100);
    }, 50);
    return () => clearInterval(interval);
  }, [showNoise]);

  useEffect(() => {
    if (!showFlicker) return;
    const interval = setInterval(() => {
      setFlickerOpacity(0.97 + Math.random() * 0.03);
    }, 100);
    return () => clearInterval(interval);
  }, [showFlicker]);

  const intensityValues = {
    low: { scanlineOpacity: 0.1, noiseOpacity: 0.02, vignetteSize: '60%' },
    medium: { scanlineOpacity: 0.2, noiseOpacity: 0.04, vignetteSize: '50%' },
    high: { scanlineOpacity: 0.35, noiseOpacity: 0.08, vignetteSize: '40%' }
  };

  const tintColors = {
    cyan: 'rgba(0, 255, 255, 0.03)',
    green: 'rgba(0, 255, 0, 0.03)',
    amber: 'rgba(255, 191, 0, 0.03)'
  };

  const { scanlineOpacity, noiseOpacity, vignetteSize } = intensityValues[intensity];

  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none z-50 overflow-hidden", className)}
      style={{ opacity: flickerOpacity }}
    >
      {/* Color tint overlay */}
      <div 
        className="absolute inset-0"
        style={{ background: tintColors[tint] }}
      />

      {/* Scanlines */}
      {showScanlines && (
        <div 
          className="absolute inset-0 crt-scanlines"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, ${scanlineOpacity}) 2px,
              rgba(0, 0, 0, ${scanlineOpacity}) 4px
            )`
          }}
        />
      )}

      {/* Horizontal interlace effect */}
      {showScanlines && (
        <div 
          className="absolute inset-0 animate-interlace"
          style={{
            background: `linear-gradient(
              180deg,
              transparent 0%,
              rgba(255, 255, 255, 0.02) 50%,
              transparent 100%
            )`,
            backgroundSize: '100% 4px'
          }}
        />
      )}

      {/* Noise/grain */}
      {showNoise && (
        <div 
          className="absolute inset-0"
          style={{
            opacity: noiseOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundPosition: `${noiseOffset}px ${noiseOffset}px`
          }}
        />
      )}

      {/* Vignette */}
      {showVignette && (
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent ${vignetteSize}, rgba(0, 0, 0, 0.7) 100%)`
          }}
        />
      )}

      {/* CRT curvature effect - subtle barrel distortion simulation */}
      <div 
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.3)'
        }}
      />

      {/* Chromatic aberration edges */}
      <div 
        className="absolute inset-0"
        style={{
          boxShadow: `
            inset 2px 0 4px rgba(255, 0, 0, 0.05),
            inset -2px 0 4px rgba(0, 255, 255, 0.05)
          `
        }}
      />
    </div>
  );
};
