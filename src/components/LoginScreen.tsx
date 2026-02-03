import { useState, useEffect } from "react";
import { Lock, User, Shield, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import { trackLogin, startSessionTracking, checkTimeAchievements } from "@/hooks/useAchievementTriggers";
import { VERSION } from "@/lib/versionInfo";

interface LoginScreenProps {
  onLogin: () => void;
}

interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  role: string;
  clearance: number;
  hasPassword: boolean;
  isAdmin: boolean;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<UserAccount | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());

  // Load accounts from localStorage
  useEffect(() => {
    const loadedAccounts: UserAccount[] = [];
    
    const adminData = localStorage.getItem("urbanshade_admin");
    if (adminData) {
      const admin = JSON.parse(adminData);
      loadedAccounts.push({
        id: "admin",
        username: admin.username,
        displayName: admin.displayName || admin.username,
        role: "System Administrator",
        clearance: 5,
        hasPassword: !!admin.password,
        isAdmin: true,
      });
    }
    
    const additionalAccounts = localStorage.getItem("urbanshade_accounts");
    if (additionalAccounts) {
      const parsed = JSON.parse(additionalAccounts);
      parsed.forEach((acc: any, index: number) => {
        loadedAccounts.push({
          id: acc.id || `user-${index}`,
          username: acc.username,
          displayName: acc.displayName || acc.username,
          role: acc.role || "Operator",
          clearance: acc.clearance || 3,
          hasPassword: !!acc.password,
          isAdmin: false,
        });
      });
    }
    
    setAccounts(loadedAccounts);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectAccount = (account: UserAccount) => {
    setSelectedAccount(account);
    setPassword("");
    setError("");
  };

  const handleBack = () => {
    setSelectedAccount(null);
    setPassword("");
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!selectedAccount) return;

    if (selectedAccount.hasPassword && !password) {
      setError("Password required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (selectedAccount.isAdmin) {
        const adminData = localStorage.getItem("urbanshade_admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          if (!selectedAccount.hasPassword || password === admin.password) {
            // Track login achievements
            trackLogin();
            startSessionTracking();
            checkTimeAchievements();
            onLogin();
            return;
          }
        }
      } else {
        const additionalAccounts = localStorage.getItem("urbanshade_accounts");
        if (additionalAccounts) {
          const parsed = JSON.parse(additionalAccounts);
          const account = parsed.find((a: any) => 
            a.username === selectedAccount.username || a.id === selectedAccount.id
          );
          if (account && (!selectedAccount.hasPassword || password === account.password)) {
            // Track login achievements
            trackLogin();
            startSessionTracking();
            checkTimeAchievements();
            onLogin();
            return;
          }
        }
      }

      setError("Incorrect password");
      setLoading(false);
    }, 800);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="h-screen w-full bg-background relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--primary) / 0.08), transparent 50%), linear-gradient(to bottom, hsl(var(--background)), hsl(var(--card)))'
        }}
      />
      
      {/* Account tiles - TOP LEFT */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-2 text-primary text-xs font-mono mb-3 opacity-70">
          <Lock className="w-3.5 h-3.5" />
          <span className="tracking-wider">SELECT USER</span>
        </div>
        
        <div className="space-y-1.5">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleSelectAccount(account)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-60 transition-all duration-200 ${
                selectedAccount?.id === account.id
                  ? "bg-primary/15 border border-primary/40 shadow-lg shadow-primary/10"
                  : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                selectedAccount?.id === account.id
                  ? "bg-primary/20 text-primary"
                  : "bg-white/10 text-foreground/70"
              }`}>
                {account.isAdmin ? (
                  <Shield className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {account.displayName}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">{account.role}</div>
              </div>
              
              <ChevronRight className={`w-4 h-4 transition-colors flex-shrink-0 ${
                selectedAccount?.id === account.id ? "text-primary" : "text-muted-foreground/50"
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* CENTER - Either message or password form */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {!selectedAccount ? (
          // No account selected - show message
          <div className="text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-xl text-muted-foreground/60">
              Select an account to log in to
            </p>
          </div>
        ) : (
          // Account selected - show password form
          <div className="w-full max-w-sm mx-4">
            <div 
              className="rounded-2xl border border-border/50 p-6 backdrop-blur-xl"
              style={{
                background: 'linear-gradient(180deg, hsl(var(--glass)) 0%, hsl(var(--glass-strong)) 100%)'
              }}
            >
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              {/* User info */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/30">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {selectedAccount.isAdmin ? (
                    <Shield className="w-7 h-7 text-primary" />
                  ) : (
                    <User className="w-7 h-7 text-primary" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">{selectedAccount.displayName}</div>
                  <div className="text-sm text-muted-foreground">{selectedAccount.role}</div>
                  <div className="text-xs text-primary/80 font-mono mt-1">Level {selectedAccount.clearance}</div>
                </div>
              </div>
              
              {/* Password form or direct login */}
              {selectedAccount.hasPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoFocus
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:bg-white/10 focus:outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive text-center py-2.5 px-3 rounded-xl bg-destructive/10 border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No password required
                  </p>
                  
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Time - bottom right */}
      <div className="absolute bottom-6 right-6 text-right z-10">
        <div className="text-4xl font-light text-foreground/80">
          {formatTime(time)}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(time)}
        </div>
      </div>

      {/* System info - bottom left */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="text-sm font-medium text-foreground/70">UrbanShade OS</div>
        <div className="text-xs text-muted-foreground">{VERSION.displayVersion}</div>
      </div>
    </div>
  );
};
