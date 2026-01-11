import { useState, useEffect } from "react";
import { Lock, User, Users, ChevronRight, Loader2 } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  hasPassword: boolean;
  isAdmin: boolean;
  avatarColor: string;
}

const avatarColors = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-violet-500",
];

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
    
    // Load admin account
    const adminData = localStorage.getItem("urbanshade_admin");
    if (adminData) {
      const admin = JSON.parse(adminData);
      loadedAccounts.push({
        id: "admin",
        username: admin.username,
        displayName: admin.displayName || admin.username,
        hasPassword: !!admin.password,
        isAdmin: true,
        avatarColor: avatarColors[0],
      });
    }
    
    // Load additional accounts
    const additionalAccounts = localStorage.getItem("urbanshade_accounts");
    if (additionalAccounts) {
      const parsed = JSON.parse(additionalAccounts);
      parsed.forEach((acc: any, index: number) => {
        loadedAccounts.push({
          id: acc.id || `user-${index}`,
          username: acc.username,
          displayName: acc.displayName || acc.username,
          hasPassword: !!acc.password,
          isAdmin: false,
          avatarColor: avatarColors[(index + 1) % avatarColors.length],
        });
      });
    }
    
    setAccounts(loadedAccounts);
  }, []);

  // Update time every second
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

    // Check if password is required
    if (selectedAccount.hasPassword && !password) {
      setError("Password required");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Verify password
      if (selectedAccount.isAdmin) {
        const adminData = localStorage.getItem("urbanshade_admin");
        if (adminData) {
          const admin = JSON.parse(adminData);
          if (!selectedAccount.hasPassword || password === admin.password) {
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
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Account tiles - top left when no selection, center when selected */}
      <div className={`absolute transition-all duration-500 ease-out ${
        selectedAccount 
          ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
          : "top-6 left-6"
      }`}>
        {!selectedAccount ? (
          // Account selection tiles
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3 px-1">
              <Users className="w-4 h-4" />
              <span>Select account</span>
            </div>
            
            {accounts.length === 0 ? (
              <div className="text-muted-foreground text-sm px-1">
                No accounts configured
              </div>
            ) : (
              <div className="space-y-1.5">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAccount(account)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group w-64"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${account.avatarColor} flex items-center justify-center text-white font-semibold shadow-lg`}>
                      {account.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-foreground">{account.displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {account.isAdmin ? "Administrator" : "User"}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Selected account - password entry
          <div className="w-80 animate-fade-in">
            <div className="flex flex-col items-center mb-6">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedAccount.avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-2xl mb-4 ring-4 ring-white/10`}>
                {selectedAccount.displayName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold text-foreground">{selectedAccount.displayName}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedAccount.isAdmin ? "Administrator" : "User"}
              </p>
            </div>

            {selectedAccount.hasPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoFocus
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-400 text-center animate-shake">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to accounts
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to accounts
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center message when no account selected */}
      {!selectedAccount && accounts.length > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <User className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
          <p className="text-xl text-muted-foreground/50 font-light">
            Select an account to sign in
          </p>
        </div>
      )}

      {/* Time display - bottom right */}
      <div className="absolute bottom-8 right-8 text-right">
        <div className="text-6xl font-light text-foreground/90 tracking-tight">
          {formatTime(time)}
        </div>
        <div className="text-lg text-muted-foreground mt-1">
          {formatDate(time)}
        </div>
      </div>

      {/* System info - bottom left */}
      <div className="absolute bottom-8 left-8 text-left">
        <div className="text-sm font-medium text-foreground/80">UrbanShade OS</div>
        <div className="text-xs text-muted-foreground">v3.1 Deep Ocean</div>
      </div>
    </div>
  );
};
