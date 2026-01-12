import { useState, useEffect, useCallback } from 'react';
import { 
  Play, Users, Bot, Trophy, Sparkles, RotateCcw, Hand, 
  Square, Crown, Loader2, Plus, Minus, ArrowRight, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  trackUCGRoundWin, 
  trackUCGGameComplete, 
  trackUCGCloseCall 
} from '@/hooks/useAchievementTriggers';

type CardSuit = '♠' | '♥' | '♦' | '♣';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface Card {
  suit: CardSuit;
  value: CardValue;
  numericValue: number;
}

interface Player {
  id: string;
  name: string;
  isBot: boolean;
  botDifficulty?: 'easy' | 'medium' | 'hard';
  hand: Card[];
  score: number;
  isStanding: boolean;
  isBust: boolean;
  isWinner: boolean;
}

type GameState = 'menu' | 'setup' | 'playing' | 'roundEnd' | 'gameEnd';

const SUITS: CardSuit[] = ['♠', '♥', '♦', '♣'];
const VALUES: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      let numericValue: number;
      if (value === 'A') numericValue = 11;
      else if (['J', 'Q', 'K'].includes(value)) numericValue = 10;
      else numericValue = parseInt(value);
      
      deck.push({ suit, value, numericValue });
    }
  }
  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateHandValue = (hand: Card[]): number => {
  let value = 0;
  let aces = 0;
  
  for (const card of hand) {
    if (card.value === 'A') {
      aces++;
      value += 11;
    } else {
      value += card.numericValue;
    }
  }
  
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  
  return value;
};

const getBotDecision = (hand: Card[], difficulty: 'easy' | 'medium' | 'hard'): 'hit' | 'stand' => {
  const value = calculateHandValue(hand);
  
  switch (difficulty) {
    case 'easy':
      // Simple: stand at 15+
      return value >= 15 ? 'stand' : 'hit';
    case 'medium':
      // Medium: stand at 17+, maybe hit on 16
      if (value >= 17) return 'stand';
      if (value === 16) return Math.random() > 0.5 ? 'stand' : 'hit';
      return 'hit';
    case 'hard':
      // Hard: smart decisions based on probability
      if (value >= 18) return 'stand';
      if (value === 17) return Math.random() > 0.3 ? 'stand' : 'hit';
      if (value >= 13 && value <= 16) {
        // Consider cards left
        const safeCards = (21 - value);
        const hitChance = safeCards / 13;
        return Math.random() < hitChance ? 'hit' : 'stand';
      }
      return 'hit';
  }
};

const CardComponent = ({ card, hidden = false, className = '' }: { card: Card; hidden?: boolean; className?: string }) => {
  const isRed = card.suit === '♥' || card.suit === '♦';
  
  if (hidden) {
    return (
      <div className={cn(
        "w-16 h-24 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg",
        className
      )}>
        <div className="text-primary/50 text-2xl font-bold">?</div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "w-16 h-24 rounded-lg border-2 bg-card shadow-lg flex flex-col items-center justify-between p-1.5 transition-all hover:scale-105",
      isRed ? "border-red-400/50 text-red-500" : "border-foreground/20 text-foreground",
      className
    )}>
      <div className="self-start text-xs font-bold">{card.value}</div>
      <div className="text-2xl">{card.suit}</div>
      <div className="self-end text-xs font-bold rotate-180">{card.value}</div>
    </div>
  );
};

export const UntitledCardGame = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [botCount, setBotCount] = useState(1);
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [roundNumber, setRoundNumber] = useState(1);
  const [maxRounds, setMaxRounds] = useState(5);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [playerRoundsWon, setPlayerRoundsWon] = useState(0);

  const startGame = useCallback(() => {
    const newPlayers: Player[] = [
      { id: 'player', name: 'You', isBot: false, hand: [], score: 0, isStanding: false, isBust: false, isWinner: false }
    ];
    
    for (let i = 0; i < botCount; i++) {
      newPlayers.push({
        id: `bot-${i}`,
        name: `Bot ${i + 1}`,
        isBot: true,
        botDifficulty,
        hand: [],
        score: 0,
        isStanding: false,
        isBust: false,
        isWinner: false
      });
    }
    
    setPlayers(newPlayers);
    setRoundNumber(1);
    startRound(newPlayers);
  }, [botCount, botDifficulty]);

  const startRound = (currentPlayers: Player[]) => {
    const newDeck = createDeck();
    const updatedPlayers = currentPlayers.map(p => ({
      ...p,
      hand: [],
      isStanding: false,
      isBust: false,
      isWinner: false
    }));
    
    // Deal 2 cards to each player
    let deckIndex = 0;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < updatedPlayers.length; j++) {
        updatedPlayers[j].hand.push(newDeck[deckIndex++]);
      }
    }
    
    setDeck(newDeck.slice(deckIndex));
    setPlayers(updatedPlayers);
    setCurrentPlayerIndex(0);
    setGameState('playing');
    setMessage('Your turn! Hit or Stand?');
  };

  const drawCard = useCallback(() => {
    if (deck.length === 0) return;
    
    const card = deck[0];
    const newDeck = deck.slice(1);
    
    setDeck(newDeck);
    setPlayers(prev => {
      const updated = [...prev];
      updated[currentPlayerIndex].hand.push(card);
      
      const handValue = calculateHandValue(updated[currentPlayerIndex].hand);
      if (handValue > 21) {
        updated[currentPlayerIndex].isBust = true;
        updated[currentPlayerIndex].isStanding = true;
      }
      
      return updated;
    });
    
    return card;
  }, [deck, currentPlayerIndex]);

  const handleHit = useCallback(() => {
    if (isProcessing) return;
    drawCard();
  }, [drawCard, isProcessing]);

  const handleStand = useCallback(() => {
    if (isProcessing) return;
    
    setPlayers(prev => {
      const updated = [...prev];
      updated[currentPlayerIndex].isStanding = true;
      return updated;
    });
    
    moveToNextPlayer();
  }, [currentPlayerIndex, isProcessing]);

  const moveToNextPlayer = useCallback(() => {
    setCurrentPlayerIndex(prev => {
      let next = prev + 1;
      
      // Find next player who hasn't stood or busted
      while (next < players.length) {
        if (!players[next].isStanding && !players[next].isBust) {
          return next;
        }
        next++;
      }
      
      // All players done, end round
      return -1;
    });
  }, [players]);

  // Handle bot turns
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (currentPlayerIndex === -1) {
      // Round ended
      endRound();
      return;
    }
    
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;
    
    // Check if current player busted
    if (currentPlayer.isBust || currentPlayer.isStanding) {
      moveToNextPlayer();
      return;
    }
    
    if (currentPlayer.isBot) {
      setIsProcessing(true);
      setMessage(`${currentPlayer.name} is thinking...`);
      
      const delay = 800 + Math.random() * 700;
      const timer = setTimeout(() => {
        const decision = getBotDecision(currentPlayer.hand, currentPlayer.botDifficulty || 'medium');
        
        if (decision === 'hit') {
          setMessage(`${currentPlayer.name} hits!`);
          drawCard();
        } else {
          setMessage(`${currentPlayer.name} stands at ${calculateHandValue(currentPlayer.hand)}`);
          setPlayers(prev => {
            const updated = [...prev];
            updated[currentPlayerIndex].isStanding = true;
            return updated;
          });
          moveToNextPlayer();
        }
        
        setIsProcessing(false);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setMessage('Your turn! Hit or Stand?');
    }
  }, [currentPlayerIndex, gameState, players]);

  const endRound = () => {
    // Calculate winners
    const activePlayers = players.filter(p => !p.isBust);
    let highestScore = 0;
    
    activePlayers.forEach(p => {
      const value = calculateHandValue(p.hand);
      if (value <= 21 && value > highestScore) {
        highestScore = value;
      }
    });
    
    const updatedPlayers = players.map(p => {
      const value = calculateHandValue(p.hand);
      const isWinner = !p.isBust && value === highestScore;
      return {
        ...p,
        score: p.score + (isWinner ? 1 : 0),
        isWinner
      };
    });
    
    setPlayers(updatedPlayers);
    setGameState('roundEnd');
    
    const winners = updatedPlayers.filter(p => p.isWinner);
    const player = updatedPlayers.find(p => p.id === 'player');
    
    // Track achievements for player wins
    if (player?.isWinner) {
      const playerHandValue = calculateHandValue(player.hand);
      const wasBlackjack = player.hand.length === 2 && playerHandValue === 21;
      trackUCGRoundWin(playerHandValue, wasBlackjack);
      setPlayerRoundsWon(prev => prev + 1);
      
      // Check for close call achievement
      const opponents = activePlayers.filter(p => p.id !== 'player');
      const highestOpponentScore = Math.max(...opponents.map(p => calculateHandValue(p.hand)));
      if (playerHandValue === 20 && highestOpponentScore === 19) {
        trackUCGCloseCall(playerHandValue, highestOpponentScore);
      }
    }
    
    if (winners.length === 1) {
      setMessage(`${winners[0].name} wins the round with ${highestScore}!`);
    } else if (winners.length > 1) {
      setMessage(`Tie! ${winners.map(w => w.name).join(' & ')} tied with ${highestScore}!`);
    } else {
      setMessage('Everyone busted! No winner this round.');
    }
  };

  const nextRound = () => {
    if (roundNumber >= maxRounds) {
      setGameState('gameEnd');
      const winner = [...players].sort((a, b) => b.score - a.score)[0];
      setMessage(`Game Over! ${winner.name} wins with ${winner.score} points!`);
      
      // Track game completion achievement
      trackUCGGameComplete(maxRounds, playerRoundsWon, botDifficulty, botCount);
    } else {
      setRoundNumber(prev => prev + 1);
      startRound(players);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setPlayers([]);
    setPlayerRoundsWon(0);
    setDeck([]);
    setCurrentPlayerIndex(0);
    setRoundNumber(1);
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-muted/30">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
            <span className="text-3xl font-black text-white">UCG</span>
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">UNTITLED CARD GAME</h1>
          <p className="text-muted-foreground">Get as close to 21 as you can!</p>
        </div>
        
        <div className="space-y-3 w-full max-w-xs">
          <Button 
            className="w-full h-14 text-lg gap-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            onClick={() => setGameState('setup')}
          >
            <Play className="w-5 h-5" />
            Play vs Bots
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-14 text-lg gap-3"
            disabled
          >
            <Users className="w-5 h-5" />
            Online (Coming Soon)
          </Button>
        </div>
        
        <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50 max-w-sm">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            How to Play
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Draw cards to get close to 21</li>
            <li>• Going over 21 = Bust (you lose)</li>
            <li>• Highest hand under 21 wins</li>
            <li>• Aces count as 11 or 1</li>
          </ul>
        </div>
      </div>
    );
  }

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-8">Game Setup</h2>
        
        <div className="w-full max-w-sm space-y-6">
          {/* Bot Count */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                Bots
              </span>
              <span className="text-2xl font-bold text-primary">{botCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setBotCount(Math.max(1, botCount - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Progress value={(botCount / 3) * 100} className="flex-1" />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setBotCount(Math.min(3, botCount + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Bot Difficulty */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="font-medium mb-3 block">Bot Difficulty</span>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={botDifficulty === diff ? 'default' : 'outline'}
                  onClick={() => setBotDifficulty(diff)}
                  className="capitalize"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Rounds */}
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Rounds
              </span>
              <span className="text-2xl font-bold text-amber-500">{maxRounds}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setMaxRounds(Math.max(1, maxRounds - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Progress value={(maxRounds / 10) * 100} className="flex-1" />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setMaxRounds(Math.min(10, maxRounds + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={resetGame} className="flex-1">
              Back
            </Button>
            <Button onClick={startGame} className="flex-1 gap-2 bg-gradient-to-r from-violet-500 to-purple-600">
              <ArrowRight className="w-4 h-4" />
              Start Game
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  const currentPlayer = players[currentPlayerIndex] || players[0];
  const isPlayerTurn = currentPlayerIndex === 0 && !players[0]?.isStanding && !players[0]?.isBust;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-violet-900/20 via-background to-background">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b border-border/50 flex items-center justify-between bg-background/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={resetGame}>
            <Home className="w-4 h-4" />
          </Button>
          <Badge variant="outline" className="gap-1">
            <Trophy className="w-3 h-3" />
            Round {roundNumber}/{maxRounds}
          </Badge>
        </div>
        <div className="text-sm font-medium text-muted-foreground">{message}</div>
      </div>
      
      {/* Game Area */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Other Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.filter(p => p.id !== 'player').map((player, idx) => {
              const handValue = calculateHandValue(player.hand);
              const isActive = currentPlayerIndex === idx + 1;
              
              return (
                <div
                  key={player.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border/50 bg-card/50",
                    player.isBust && "border-red-500/50 bg-red-500/5",
                    player.isWinner && "border-amber-500/50 bg-amber-500/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{player.name}</span>
                      <Badge variant="outline" className="text-[10px]">{player.botDifficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{player.score} pts</Badge>
                      {player.isWinner && <Crown className="w-4 h-4 text-amber-500" />}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-2 flex-wrap">
                    {player.hand.map((card, i) => (
                      <CardComponent 
                        key={i} 
                        card={card} 
                        hidden={gameState === 'playing' && !player.isStanding && !player.isBust}
                        className="w-10 h-14 text-xs"
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    {(player.isStanding || player.isBust || gameState !== 'playing') && (
                      <span className={cn(
                        "font-bold",
                        player.isBust ? "text-red-500" : player.isWinner ? "text-amber-500" : "text-foreground"
                      )}>
                        {handValue}
                      </span>
                    )}
                    {player.isBust && <Badge variant="destructive">BUST</Badge>}
                    {player.isStanding && !player.isBust && <Badge variant="secondary">Standing</Badge>}
                    {isActive && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Player's Hand */}
          <div className={cn(
            "p-6 rounded-2xl border-2 transition-all",
            isPlayerTurn ? "border-primary bg-primary/5" : "border-border bg-card/50",
            players[0]?.isBust && "border-red-500 bg-red-500/5",
            players[0]?.isWinner && "border-amber-500 bg-amber-500/5"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">Your Hand</span>
                <Badge variant="secondary">{players[0]?.score || 0} pts</Badge>
                {players[0]?.isWinner && <Crown className="w-5 h-5 text-amber-500" />}
              </div>
              <div className={cn(
                "text-3xl font-black",
                players[0]?.isBust ? "text-red-500" : "text-primary"
              )}>
                {calculateHandValue(players[0]?.hand || [])}
              </div>
            </div>
            
            <div className="flex gap-2 mb-4 flex-wrap justify-center">
              {players[0]?.hand.map((card, i) => (
                <CardComponent key={i} card={card} />
              ))}
            </div>
            
            {players[0]?.isBust && (
              <Badge variant="destructive" className="text-lg px-4 py-2">BUST!</Badge>
            )}
            {players[0]?.isStanding && !players[0]?.isBust && (
              <Badge variant="secondary" className="text-lg px-4 py-2">Standing</Badge>
            )}
          </div>
        </div>
      </ScrollArea>
      
      {/* Action Buttons */}
      <div className="flex-shrink-0 p-4 border-t border-border/50 bg-background/80 backdrop-blur">
        {gameState === 'playing' && isPlayerTurn && (
          <div className="flex gap-3">
            <Button 
              className="flex-1 h-14 text-lg gap-2 bg-gradient-to-r from-green-500 to-emerald-600"
              onClick={handleHit}
              disabled={isProcessing}
            >
              <Hand className="w-5 h-5" />
              Hit
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-14 text-lg gap-2"
              onClick={handleStand}
              disabled={isProcessing}
            >
              <Square className="w-5 h-5" />
              Stand
            </Button>
          </div>
        )}
        
        {gameState === 'roundEnd' && (
          <Button 
            className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-violet-500 to-purple-600"
            onClick={nextRound}
          >
            {roundNumber >= maxRounds ? (
              <>
                <Trophy className="w-5 h-5" />
                See Final Results
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Next Round
              </>
            )}
          </Button>
        )}
        
        {gameState === 'gameEnd' && (
          <div className="space-y-3">
            {/* Final Scoreboard */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Final Scores
              </h3>
              <div className="space-y-2">
                {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
                  <div 
                    key={p.id} 
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg",
                      i === 0 && "bg-amber-500/10"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {i === 0 && <Crown className="w-4 h-4 text-amber-500" />}
                      <span className={i === 0 ? "font-bold" : ""}>{p.name}</span>
                    </div>
                    <span className="font-bold">{p.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full h-14 text-lg gap-2"
              onClick={resetGame}
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </Button>
          </div>
        )}
        
        {gameState === 'playing' && !isPlayerTurn && !players[0]?.isBust && !players[0]?.isStanding && (
          <div className="text-center text-muted-foreground py-4">
            Waiting for other players...
          </div>
        )}
      </div>
    </div>
  );
};
