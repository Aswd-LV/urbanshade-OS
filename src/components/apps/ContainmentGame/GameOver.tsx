import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skull, RotateCcw, Home } from 'lucide-react';
import { getSubjectById } from './data/subjects';

interface GameOverProps {
  subjectId: string | null;
  night: number;
  onRetry: () => void;
  onMainMenu: () => void;
}

export const GameOver = ({ subjectId, night, onRetry, onMainMenu }: GameOverProps) => {
  const [showContent, setShowContent] = useState(false);
  const [staticPhase, setStaticPhase] = useState(0);

  const subject = subjectId ? getSubjectById(subjectId) : null;

  // Static animation sequence
  useEffect(() => {
    const phases = [
      { delay: 0, phase: 1 },    // Intense static
      { delay: 500, phase: 2 },  // Lighter static
      { delay: 1000, phase: 3 }, // Fade to black
      { delay: 1500, phase: 4 }  // Show content
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => {
        setStaticPhase(phase);
        if (phase === 4) setShowContent(true);
      }, delay);
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {/* Static effect */}
      {staticPhase < 4 && (
        <div 
          className="absolute inset-0"
          style={{
            opacity: staticPhase === 1 ? 1 : staticPhase === 2 ? 0.5 : 0,
            transition: 'opacity 0.3s',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            animation: 'gameOverStatic 0.05s infinite'
          }}
        />
      )}

      {/* Content */}
      {showContent && (
        <div className="text-center px-6 animate-in fade-in duration-500">
          <Skull className="w-16 h-16 text-red-500 mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-red-500 mb-2 font-mono tracking-wider">
            CONTAINMENT BREACH
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6">
            Night {night} - Failed
          </p>

          {subject && (
            <div className="bg-muted/20 border border-red-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-2">
                You were killed by:
              </p>
              <p className="text-xl font-bold text-red-400 mb-2">
                {subject.id}: "{subject.name}"
              </p>
              <p className="text-sm text-muted-foreground italic">
                {subject.deathHint}
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button onClick={onRetry} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={onMainMenu} className="gap-2">
              <Home className="w-4 h-4" />
              Main Menu
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gameOverStatic {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-2%, 2%); }
          50% { transform: translate(2%, -2%); }
          75% { transform: translate(-2%, -2%); }
          100% { transform: translate(2%, 2%); }
        }
      `}</style>
    </div>
  );
};
