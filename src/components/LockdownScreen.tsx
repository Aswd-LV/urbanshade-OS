import { useState } from "react";
import { Lock, Shield, KeyRound } from "lucide-react";

interface LockdownScreenProps {
  onAuthorized: () => void;
  protocolName: string;
}

export const LockdownScreen = ({ onAuthorized, protocolName }: LockdownScreenProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const adminData = localStorage.getItem("urbanshade_admin");
      
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (password === admin.password) {
          onAuthorized();
        } else {
          setError("Incorrect password. Please try again.");
          setLoading(false);
        }
      } else {
        setError("No administrator account found");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-destructive/20 via-background to-destructive/10 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 mb-6 animate-pulse">
            <Shield className="w-16 h-16 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-destructive">
            Lockdown Active
          </h1>
          <div className="text-lg text-muted-foreground font-mono mb-2">
            Emergency Protocol Engaged
          </div>
          <div className="text-sm text-muted-foreground">
            Protocol: <span className="text-primary font-bold">{protocolName}</span>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-destructive/30 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-start gap-3 mb-4">
            <Lock className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
            <div className="text-sm space-y-2">
              <div className="text-destructive font-bold">Current Status:</div>
              <div className="text-muted-foreground space-y-1">
                <div>🔒 All facility access restricted</div>
                <div>🚨 Emergency containment active</div>
                <div>⚠️ Non-essential systems offline</div>
              </div>
            </div>
          </div>
        </div>

        {/* Authorization Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <KeyRound className="w-5 h-5" />
              <span className="font-bold">Administrator Access Required</span>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Enter your admin password to deactivate lockdown
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                placeholder="Password"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-[1.02] disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Deactivate Lockdown"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
          <div>Administrator access logged and monitored</div>
          <div className="opacity-70">This is a simulated security system</div>
        </div>
      </div>
    </div>
  );
};