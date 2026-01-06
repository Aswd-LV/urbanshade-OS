import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sun, ArrowRight, Home, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VictoryScreenProps {
  night: number;
  powerRemaining: number;
  hasNextNight: boolean;
  onContinue: () => void;
  onMainMenu: () => void;
  onViewLore: () => void;
}

export const VictoryScreen = ({ 
  night, 
  powerRemaining, 
  hasNextNight,
  onContinue, 
  onMainMenu,
  onViewLore
}: VictoryScreenProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500);
  }, []);

  // Calculate rating based on power remaining
  const getRating = () => {
    if (powerRemaining >= 50) return { stars: 3, label: 'EXCELLENT' };
    if (powerRemaining >= 25) return { stars: 2, label: 'GOOD' };
    return { stars: 1, label: 'SURVIVED' };
  };

  const rating = getRating();

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-amber-900/20 to-background overflow-hidden flex items-center justify-center">
      {/* Sunrise effect */}
      <div 
        className="absolute top-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.2), transparent)'
        }}
      />

      {/* Content */}
      {showContent && (
        <div className="text-center px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sun className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          
          <h1 className="text-4xl font-bold text-amber-400 mb-2 font-mono">
            6:00 AM
          </h1>
          
          <p className="text-xl text-emerald-400 mb-6 font-mono">
            NIGHT {night} COMPLETE
          </p>

          {/* Rating */}
          <div className="mb-6">
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3].map(star => (
                <div
                  key={star}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    star <= rating.stars 
                      ? "border-amber-400 bg-amber-400/20 text-amber-400" 
                      : "border-muted bg-muted/20 text-muted"
                  )}
                >
                  ★
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{rating.label}</p>
          </div>

          {/* Stats */}
          <div className="bg-muted/20 border border-border rounded-lg p-4 mb-6 max-w-xs mx-auto">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Power Remaining</span>
              <span className={cn(
                "font-bold",
                powerRemaining >= 50 ? "text-emerald-400" : powerRemaining >= 25 ? "text-amber-400" : "text-red-400"
              )}>
                {Math.round(powerRemaining)}%
              </span>
            </div>
          </div>

          {/* New lore notification */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="gap-2 text-purple-400 hover:text-purple-300"
              onClick={onViewLore}
            >
              <BookOpen className="w-4 h-4" />
              New Documents Unlocked
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            {hasNextNight ? (
              <Button onClick={onContinue} className="gap-2">
                <ArrowRight className="w-4 h-4" />
                Night {night + 1}
              </Button>
            ) : (
              <Button onClick={onMainMenu} className="gap-2">
                <Home className="w-4 h-4" />
                You Won!
              </Button>
            )}
            <Button variant="outline" onClick={onMainMenu} className="gap-2">
              <Home className="w-4 h-4" />
              Menu
            </Button>
          </div>

          {night >= 5 && (
            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg max-w-md mx-auto">
              <p className="text-emerald-400 font-bold mb-2">🎉 CONGRATULATIONS 🎉</p>
              <p className="text-sm text-muted-foreground">
                You survived all 5 nights. The morning shift has arrived.
                But remember Dr. Morrison's warning...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
