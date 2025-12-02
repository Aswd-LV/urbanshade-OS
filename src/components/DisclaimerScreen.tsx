import { useState } from "react";
import { Smile, Github, Coffee, Heart, Sparkles } from "lucide-react";

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export const DisclaimerScreen = ({ onAccept }: DisclaimerScreenProps) => {
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 text-foreground flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center animate-scale-in">
            <Smile className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to UrbanShade OS! 🌊
          </h1>
          <p className="text-xl text-muted-foreground">Your Friendly Deep-Sea Desktop Simulator</p>
          <p className="text-sm text-muted-foreground mt-2">Version 2.2 • Made with love</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/10 border border-primary/30">
            <Sparkles className="w-7 h-7 text-primary flex-shrink-0 mt-1 animate-pulse" />
            <div className="space-y-3">
              <h3 className="font-bold text-primary text-xl">Hey there, explorer! 👋</h3>
              <p className="text-base leading-relaxed">
                This is a <strong className="text-primary">fun simulation</strong> of a fictional underwater facility OS.
                It's like a playground for your browser - totally safe, completely imaginary, and hopefully entertaining!
              </p>
              <p className="text-sm italic text-muted-foreground">
                (Don't worry, the scary containment breaches aren't real. We checked. Twice. 😅)
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-5 rounded-xl bg-muted/50 border border-border">
              <h4 className="font-bold text-primary mb-3 text-base flex items-center gap-2">
                <Heart className="w-5 h-5" />
                What You're Getting Into:
              </h4>
              <ul className="space-y-2 ml-6 text-muted-foreground">
                <li>• A browser-based retro desktop experience inspired by "Pressure"</li>
                <li>• Simulated apps, files, and system tools (none of it's real!)</li>
                <li>• Easter eggs, jokes, and references scattered everywhere</li>
                <li>• All your data stays in your browser - we can't see it, promise!</li>
                <li>• Zero actual monsters or underwater facilities involved 🦑</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <h4 className="font-bold text-blue-400 mb-3 text-base flex items-center gap-2">
                <Coffee className="w-5 h-5" />
                The Technical Stuff (If You Care):
              </h4>
              <ul className="space-y-2 ml-6 text-muted-foreground">
                <li>• Everything is stored in your browser's localStorage</li>
                <li>• No servers, no tracking, no data collection</li>
                <li>• Clearing browser data will reset everything</li>
                <li>• Private/incognito mode won't save your progress</li>
                <li>• It's basically a really fancy website pretending to be an OS</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30">
              <h4 className="font-bold text-primary mb-3 text-base flex items-center gap-2">
                <Github className="w-5 h-5" />
                Open Source & Community
              </h4>
              <p className="mb-3">
                Made with ❤️ (and lots of coffee ☕) by aswdbatch and friends!
                This project is open source and we'd love to see what you create with it.
              </p>
              <a
                href="https://github.com/aswdBatch/urbanshade-7e993958"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/20 border border-primary/40 hover:bg-primary/30 transition-all font-semibold text-sm"
              >
                <Github className="w-4 h-4" />
                Check it out on GitHub!
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="text-base">
                📚 New here? Check out the{" "}
                <a 
                  href="/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold"
                >
                  User Guide
                </a>
                {" "}for tips, tricks, and way too many puns.
              </p>
            </div>

            <label className="flex items-start gap-4 cursor-pointer p-5 rounded-xl bg-card border border-border hover:border-primary/40 transition-all group">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="w-6 h-6 mt-1 cursor-pointer accent-primary"
              />
              <div className="flex-1">
                <div className="font-bold text-primary mb-2 text-lg group-hover:text-primary/80 transition-colors">
                  ✓ I'm Ready to Dive In!
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  I understand this is a fun simulation for entertainment. My settings will be saved locally
                  in my browser. I won't enter real passwords or sensitive info. Most importantly, I'm here
                  to have a good time exploring this fictional underwater world! 🐠
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={onAccept}
            disabled={!understood}
            className="w-full px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-lg hover:shadow-primary/20 hover:scale-[1.02] disabled:hover:scale-100"
          >
            {understood ? (
              <>
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Let's Go! Start the Experience
              </>
            ) : (
              <>
                <Smile className="w-5 h-5" />
                Please check the box above to continue
              </>
            )}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to have fun and not take this too seriously. 
            Also, remember: the fish can't actually see you. Probably. 🐟
          </p>
        </div>
      </div>
    </div>
  );
};