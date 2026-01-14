import { useState } from "react";
import { Dices, RotateCcw, Plus, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DiceResult {
  id: number;
  dice: number[];
  sides: number;
  total: number;
  timestamp: Date;
}

export const DiceRoller = () => {
  const [numDice, setNumDice] = useState(2);
  const [sides, setSides] = useState(6);
  const [currentRoll, setCurrentRoll] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<DiceResult[]>([]);

  const dicePresets = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = () => {
    setIsRolling(true);
    
    // Animate through random values
    let iterations = 0;
    const maxIterations = 10;
    
    const animate = setInterval(() => {
      const tempRoll = Array.from({ length: numDice }, () => 
        Math.floor(Math.random() * sides) + 1
      );
      setCurrentRoll(tempRoll);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(animate);
        const finalRoll = Array.from({ length: numDice }, () => 
          Math.floor(Math.random() * sides) + 1
        );
        setCurrentRoll(finalRoll);
        setIsRolling(false);
        
        const result: DiceResult = {
          id: Date.now(),
          dice: finalRoll,
          sides,
          total: finalRoll.reduce((a, b) => a + b, 0),
          timestamp: new Date(),
        };
        setHistory(prev => [result, ...prev.slice(0, 19)]);
      }
    }, 50);
  };

  const total = currentRoll.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-purple-500/5 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20">
          <Dices className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Dice Roller</h1>
          <p className="text-xs text-muted-foreground">Roll virtual dice for games & decisions</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Dice Configuration */}
        <div className="grid grid-cols-2 gap-4">
          {/* Number of Dice */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="text-sm text-muted-foreground mb-2">Number of Dice</div>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNumDice(Math.max(1, numDice - 1))}
                disabled={numDice <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-3xl font-bold text-purple-400">{numDice}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNumDice(Math.min(10, numDice + 1))}
                disabled={numDice >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Dice Sides */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <div className="text-sm text-muted-foreground mb-2">Sides (d{sides})</div>
            <div className="flex flex-wrap gap-1.5">
              {dicePresets.map(d => (
                <button
                  key={d}
                  onClick={() => setSides(d)}
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all ${
                    sides === d
                      ? "bg-purple-500 text-white"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  d{d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roll Result */}
        <div className="p-6 rounded-xl bg-muted/30 border border-border text-center">
          {currentRoll.length > 0 ? (
            <>
              <div className="flex justify-center gap-3 flex-wrap mb-4">
                {currentRoll.map((value, i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                      isRolling ? "animate-bounce" : "animate-scale-in"
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="text-4xl font-bold text-foreground">
                Total: <span className="text-purple-400">{total}</span>
              </div>
              {currentRoll.length > 1 && (
                <div className="text-sm text-muted-foreground mt-1">
                  ({currentRoll.join(" + ")})
                </div>
              )}
            </>
          ) : (
            <div className="text-muted-foreground py-8">
              <Dices className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Click roll to start</p>
            </div>
          )}
        </div>

        {/* Roll Button */}
        <Button
          size="lg"
          onClick={rollDice}
          disabled={isRolling}
          className="w-full gap-2 bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
        >
          {isRolling ? (
            <RotateCcw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {isRolling ? "Rolling..." : `Roll ${numDice}d${sides}`}
        </Button>

        {/* History */}
        {history.length > 0 && (
          <div className="flex-1 min-h-0">
            <div className="text-sm font-medium mb-2 text-muted-foreground">History</div>
            <ScrollArea className="h-[120px]">
              <div className="space-y-1.5">
                {history.map(result => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/20 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {result.dice.length}d{result.sides}: [{result.dice.join(", ")}]
                    </span>
                    <span className="font-bold text-purple-400">= {result.total}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
