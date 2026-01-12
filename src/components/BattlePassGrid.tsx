import { useState, useRef, useEffect } from 'react';
import { 
  Trophy, Star, Gift, Lock, Check, Clock, ChevronLeft, ChevronRight,
  Sparkles, Crown, Zap, AlertCircle, Award, Palette, Medal
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBattlePass } from '@/hooks/useBattlePass';
import { cn } from '@/lib/utils';

interface BattlePassGridProps {
  userId?: string;
}

const getRewardIcon = (type: string) => {
  switch (type) {
    case 'points': return <Star className="w-5 h-5" />;
    case 'title': return <Award className="w-5 h-5" />;
    case 'theme': return <Palette className="w-5 h-5" />;
    case 'badge': return <Medal className="w-5 h-5" />;
    case 'certificate': return <Trophy className="w-5 h-5" />;
    default: return <Gift className="w-5 h-5" />;
  }
};

const getRewardColor = (type: string) => {
  switch (type) {
    case 'points': return 'from-yellow-500/30 to-orange-500/30 border-yellow-500/50';
    case 'title': return 'from-purple-500/30 to-pink-500/30 border-purple-500/50';
    case 'theme': return 'from-cyan-500/30 to-blue-500/30 border-cyan-500/50';
    case 'badge': return 'from-green-500/30 to-emerald-500/30 border-green-500/50';
    case 'certificate': return 'from-amber-500/30 to-yellow-500/30 border-amber-500/50';
    default: return 'from-muted/30 to-muted/50 border-border';
  }
};

export const BattlePassGrid = ({ userId }: BattlePassGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const { 
    season, 
    progress, 
    loading,
    getLevelProgress, 
    getXpNeeded, 
    getTimeRemaining,
    claimReward,
    canClaimReward,
    isRewardUnlocked
  } = useBattlePass(userId);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [season]);

  // Auto-scroll to current level on load
  useEffect(() => {
    if (scrollRef.current && progress && season) {
      const currentLevelIndex = season.rewards.findIndex(r => r.level > progress.current_level);
      const targetIndex = currentLevelIndex > 0 ? currentLevelIndex - 1 : 0;
      const cardWidth = 120; // approximate card width + gap
      scrollRef.current.scrollLeft = Math.max(0, targetIndex * cardWidth - 100);
    }
  }, [progress, season]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ 
      left: direction === 'left' ? -amount : amount, 
      behavior: 'smooth' 
    });
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
        <p className="font-medium">Sign in to access Battle Pass</p>
        <p className="text-sm mt-1">Go to Settings → Account to sign in</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!season) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Trophy className="w-10 h-10 mb-3 opacity-50" />
        <p className="font-medium">No Active Season</p>
        <p className="text-sm mt-1">Check back later for the next Battle Pass!</p>
      </div>
    );
  }

  const levelProgress = getLevelProgress();
  const xpNeeded = getXpNeeded();
  const timeRemaining = getTimeRemaining();

  return (
    <div className="space-y-4">
      {/* Season Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{season.name}</h3>
            <p className="text-xs text-muted-foreground">{season.description}</p>
          </div>
        </div>
        {timeRemaining && (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {timeRemaining}
          </Badge>
        )}
      </div>

      {/* Level & XP Bar */}
      <div className="flex items-center gap-4 p-3 rounded-xl bg-card/50 border border-border/50">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-black text-primary-foreground shadow-lg shadow-primary/20">
            {progress?.current_level || 1}
          </div>
          {(progress?.current_level || 1) >= 50 && (
            <Crown className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500 drop-shadow-lg" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Level {progress?.current_level || 1}</span>
            <span className="text-xs text-muted-foreground">
              {progress?.current_xp || 0} / {xpNeeded} XP
            </span>
          </div>
          <Progress value={levelProgress} className="h-2" />
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-primary">{progress?.total_xp_earned || 0}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Total XP</p>
        </div>
      </div>

      {/* Horizontal Reward Grid - Fortnite Style */}
      <div className="relative">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-10 rounded-none bg-gradient-to-r from-background via-background/80 to-transparent hover:bg-transparent"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-10 rounded-none bg-gradient-to-l from-background via-background/80 to-transparent hover:bg-transparent"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}

        {/* Scrollable Grid */}
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {season.rewards.map((reward, index) => {
            const unlocked = isRewardUnlocked(reward.level);
            const claimed = progress?.claimed_rewards.includes(reward.level);
            const canClaim = canClaimReward(reward.level);
            const isCurrentLevel = progress?.current_level === reward.level;
            const isPastLevel = (progress?.current_level || 0) > reward.level;

            return (
              <div
                key={reward.level}
                className="flex flex-col flex-shrink-0"
                style={{ width: '100px' }}
              >
                {/* Reward Card (Top Row) */}
                <div
                  className={cn(
                    "relative h-24 rounded-t-lg border-2 flex flex-col items-center justify-center p-2 transition-all cursor-pointer",
                    "bg-gradient-to-b",
                    claimed 
                      ? "from-green-500/20 to-green-600/30 border-green-500/60"
                      : unlocked
                        ? getRewardColor(reward.type)
                        : "from-muted/10 to-muted/20 border-border/30 opacity-50"
                  )}
                  onClick={() => canClaim && claimReward(reward.level)}
                >
                  {/* Status Icon */}
                  {claimed ? (
                    <div className="absolute top-1 right-1">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  ) : !unlocked ? (
                    <div className="absolute top-1 right-1">
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </div>
                  ) : canClaim ? (
                    <div className="absolute top-1 right-1">
                      <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                    </div>
                  ) : null}

                  {/* Reward Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-1",
                    claimed ? "text-green-400" : unlocked ? "text-primary" : "text-muted-foreground"
                  )}>
                    {getRewardIcon(reward.type)}
                  </div>

                  {/* Reward Name */}
                  <p className={cn(
                    "text-[9px] text-center font-medium leading-tight line-clamp-2",
                    claimed ? "text-green-400" : unlocked ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {reward.name}
                  </p>

                  {/* Claim Overlay */}
                  {canClaim && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-t-lg opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-xs font-bold text-primary">CLAIM</span>
                    </div>
                  )}
                </div>

                {/* Level Card (Bottom Row) */}
                <div
                  className={cn(
                    "h-8 rounded-b-lg border-x-2 border-b-2 flex items-center justify-center gap-1 transition-all",
                    isCurrentLevel 
                      ? "bg-primary/30 border-primary/60"
                      : isPastLevel || claimed
                        ? "bg-muted/30 border-border/40"
                        : "bg-muted/10 border-border/20"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold",
                    isCurrentLevel ? "text-primary" : "text-muted-foreground"
                  )}>
                    Lv.{reward.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-lg font-bold text-primary">{progress?.claimed_rewards.length || 0}</p>
          <p className="text-[10px] text-muted-foreground uppercase">Claimed</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-lg font-bold text-foreground">
            {season.rewards.filter(r => canClaimReward(r.level)).length}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase">Available</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/20 border border-border/30 text-center">
          <p className="text-lg font-bold text-muted-foreground">
            {season.rewards.length - (progress?.current_level || 1)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase">Locked</p>
        </div>
      </div>
    </div>
  );
};