import { X, BookOpen, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  onComplete: () => void;
}

export const WelcomeModal = ({ onComplete }: WelcomeModalProps) => {
  const navigate = useNavigate();

  const handleSkip = () => {
    localStorage.setItem("urbanshade_tour_completed", "true");
    onComplete();
  };

  const handleViewDocs = () => {
    localStorage.setItem("urbanshade_tour_completed", "true");
    onComplete();
    navigate("/docs");
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 relative animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <img src="/favicon.svg" alt="Urbanshade OS" className="w-12 h-12" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">Welcome to Urbanshade OS</h2>
            <p className="text-muted-foreground text-sm">
              A browser-based OS simulation with apps, terminal, and more.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleViewDocs}
              className="w-full px-4 py-3 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground font-medium transition-colors flex items-center justify-center gap-2 group"
            >
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Documentation
            </button>
            <button
              onClick={handleSkip}
              className="w-full px-4 py-3 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border text-foreground font-medium transition-colors flex items-center justify-center gap-2 group"
            >
              <Rocket className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
