import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Copy, Check, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FORTUNES = [
  // Mysterious & Cryptic
  "The anomaly you seek is closer than you think.",
  "Trust the protocol, but verify the containment.",
  "In the depths of Sector 7, answers await the curious.",
  "The shadows remember what the light forgets.",
  "Not all breaches are visible to the naked eye.",
  "The next shift change brings unexpected visitors.",
  "Your clearance level will soon be... reconsidered.",
  "The cafeteria knows more than it should.",
  
  // Encouraging
  "Your dedication to containment does not go unnoticed.",
  "Excellence in protocol adherence leads to promotion.",
  "The Foundation values your silence and service.",
  "Great discoveries await those who document thoroughly.",
  "Your next report will impress the O5 Council.",
  "Persistence in the face of [REDACTED] builds character.",
  
  // Ominous
  "Avoid Hallway C-7 during the night shift.",
  "The next full moon brings... complications.",
  "Someone has been reading your personnel file.",
  "The cameras in your sector have blind spots.",
  "Your predecessor left something in your locker.",
  "The emergency protocols exist for a reason.",
  
  // Humorous
  "The vending machine in Break Room 3 is sentient. Tip well.",
  "Dr. Bright is NOT allowed to read your fortune.",
  "Your lucky SCP today is... actually, ignorance is bliss.",
  "The D-Class lottery has not selected you. Today.",
  "Coffee in Sector 4 is safe. Probably.",
  "Your desk plant is normal. Do not speak to it.",
  
  // Meta / Fourth Wall
  "The simulation appreciates your participation.",
  "Reality is stable. For now.",
  "Your session has been logged for quality assurance.",
  "The developer thanks you for testing this feature.",
  "Error 418: Your fortune is a teapot.",
];

const LUCKY_NUMBERS = () => {
  const nums = new Set<number>();
  while (nums.size < 6) {
    nums.add(Math.floor(Math.random() * 49) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
};

const LUCKY_SECTORS = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Omega"];
const LUCKY_COLORS = ["Cyan", "Crimson", "Violet", "Amber", "Emerald", "Obsidian", "Silver", "Gold"];

export const FortuneApp = () => {
  const [fortune, setFortune] = useState<string>("");
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [luckySector, setLuckySector] = useState("");
  const [luckyColor, setLuckyColor] = useState("");
  const [isRevealing, setIsRevealing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fortuneCount, setFortuneCount] = useState(() => {
    return parseInt(localStorage.getItem("urbanshade_fortune_count") || "0");
  });

  useEffect(() => {
    // Generate initial fortune
    generateFortune();
  }, []);

  const generateFortune = () => {
    setIsRevealing(true);
    
    setTimeout(() => {
      setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      setLuckyNumbers(LUCKY_NUMBERS());
      setLuckySector(LUCKY_SECTORS[Math.floor(Math.random() * LUCKY_SECTORS.length)]);
      setLuckyColor(LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)]);
      setIsRevealing(false);
      
      const newCount = fortuneCount + 1;
      setFortuneCount(newCount);
      localStorage.setItem("urbanshade_fortune_count", String(newCount));
    }, 800);
  };

  const copyFortune = () => {
    navigator.clipboard.writeText(fortune);
    setCopied(true);
    toast.success("Fortune copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-amber-500/5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Fortune Cookie</h1>
            <p className="text-xs text-muted-foreground">Glimpse into your future... maybe</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Fortunes Read</div>
          <div className="text-lg font-bold text-amber-400">{fortuneCount}</div>
        </div>
      </div>

      {/* Fortune Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div 
          className={`w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center transition-all duration-500 ${
            isRevealing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <Quote className="w-8 h-8 text-amber-400/30 mx-auto mb-4" />
          
          <p className="text-xl font-medium leading-relaxed mb-6 text-foreground">
            "{fortune}"
          </p>
          
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyFortune}
              className="gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        {/* Lucky Info */}
        <div className={`mt-6 grid grid-cols-3 gap-4 w-full max-w-md transition-all duration-500 ${
          isRevealing ? "opacity-0" : "opacity-100"
        }`}>
          <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
            <div className="text-xs text-muted-foreground mb-1">Lucky Sector</div>
            <div className="font-bold text-amber-400">{luckySector}</div>
          </div>
          <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
            <div className="text-xs text-muted-foreground mb-1">Lucky Color</div>
            <div className="font-bold text-amber-400">{luckyColor}</div>
          </div>
          <div className="p-3 rounded-xl bg-muted/30 border border-border text-center">
            <div className="text-xs text-muted-foreground mb-1">Luck Rating</div>
            <div className="flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i <= Math.floor(Math.random() * 3) + 3
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lucky Numbers */}
        <div className={`mt-4 p-4 rounded-xl bg-muted/20 border border-border w-full max-w-md transition-all duration-500 ${
          isRevealing ? "opacity-0" : "opacity-100"
        }`}>
          <div className="text-xs text-muted-foreground text-center mb-2">Lucky Numbers</div>
          <div className="flex justify-center gap-2">
            {luckyNumbers.map((num, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Fortune Button */}
      <Button
        size="lg"
        onClick={generateFortune}
        disabled={isRevealing}
        className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white mt-4"
      >
        {isRevealing ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {isRevealing ? "Reading the stars..." : "New Fortune"}
      </Button>
    </div>
  );
};
