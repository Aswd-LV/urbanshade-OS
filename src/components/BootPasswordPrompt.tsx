import { useState, useEffect } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { verifyBootPassword } from "@/hooks/useBiosSettings";

interface BootPasswordPromptProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const BootPasswordPrompt = ({ onSuccess, onCancel }: BootPasswordPromptProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyBootPassword(password)) {
      onSuccess();
    } else {
      setError(true);
      setAttempts(prev => prev + 1);
      setPassword("");
      
      if (attempts + 1 >= maxAttempts) {
        // Lock out after max attempts
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  if (attempts >= maxAttempts) {
    return (
      <div className="fixed inset-0 bg-black font-mono flex items-center justify-center">
        <div className="text-center space-y-4 text-red-500">
          <AlertTriangle className="w-16 h-16 mx-auto" />
          <h2 className="text-xl font-bold">Too Many Failed Attempts</h2>
          <p className="text-sm text-red-500/70">System will restart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black font-mono flex items-center justify-center">
      <div className="w-80 space-y-6">
        <div className="text-center">
          <Lock className="w-12 h-12 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-bold text-primary">Boot Password Required</h2>
          <p className="text-sm text-primary/60 mt-2">
            Enter the boot password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className={`w-full p-3 bg-black border rounded font-mono text-center text-lg tracking-widest ${
                error ? 'border-red-500 text-red-500' : 'border-primary/50 text-primary focus:border-primary'
              } outline-none`}
            />
            {error && (
              <p className="text-red-500 text-xs text-center mt-2">
                Incorrect password ({maxAttempts - attempts} attempts remaining)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded text-primary font-bold transition-all"
          >
            Unlock
          </button>
        </form>

        <div className="text-center text-xs text-primary/40">
          Press ESC to restart
        </div>
      </div>
    </div>
  );
};
