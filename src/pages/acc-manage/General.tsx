import { useState, useEffect } from "react";
import { User, Check, Cloud, CloudOff, LogIn, LogOut, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { toast } from "sonner";
import * as icons from "lucide-react";

const POPULAR_ICONS = [
  "User", "UserCircle", "UserSquare", "Smile", "Ghost", "Bot", "Cat", "Dog",
  "Bird", "Fish", "Rabbit", "Skull", "Heart", "Star", "Moon", "Sun",
  "Zap", "Flame", "Snowflake", "Cloud", "Mountain", "Tree", "Flower2", "Leaf",
  "Music", "Gamepad2", "Code", "Terminal", "Rocket", "Plane", "Car", "Bike"
];

export default function GeneralPage() {
  const { user, profile, isOnlineMode, updateProfile, signIn, signUp, signOut, loading } = useOnlineAccount();
  
  const [selectedIcon, setSelectedIcon] = useState("User");
  const [selectedColor, setSelectedColor] = useState("#00d4ff");
  const [displayName, setDisplayName] = useState("");
  
  // Auth form state
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const savedIcon = localStorage.getItem("urbanshade_profile_icon");
    const savedColor = localStorage.getItem("urbanshade_profile_color");
    if (savedIcon) setSelectedIcon(savedIcon);
    if (savedColor) setSelectedColor(savedColor);
    
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  const handleSaveIcon = () => {
    localStorage.setItem("urbanshade_profile_icon", selectedIcon);
    localStorage.setItem("urbanshade_profile_color", selectedColor);
    toast.success("Profile icon updated!");
  };

  const handleSaveDisplayName = async () => {
    if (isOnlineMode && user) {
      const { error } = await updateProfile({ display_name: displayName });
      if (error) {
        toast.error("Failed to update display name");
        return;
      }
    }
    
    // Also save locally
    const currentUser = JSON.parse(localStorage.getItem("urbanshade_current_user") || "{}");
    currentUser.displayName = displayName;
    localStorage.setItem("urbanshade_current_user", JSON.stringify(currentUser));
    
    toast.success("Display name updated!");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (authMode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Signed in to cloud!");
          setEmail("");
          setPassword("");
        }
      } else {
        if (!username.trim()) {
          toast.error("Username is required");
          setAuthLoading(false);
          return;
        }
        const { error } = await signUp(email, password, username);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Check your email to confirm.");
          setEmail("");
          setPassword("");
          setUsername("");
        }
      }
    } catch (err) {
      toast.error("Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out from cloud");
    }
  };

  const currentUserData = JSON.parse(localStorage.getItem("urbanshade_current_user") || "{}");
  const IconComponent = (icons as any)[selectedIcon] || icons.User;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">General Settings</h1>
        <p className="text-slate-400 text-sm">Manage your profile and account information</p>
      </div>

      {/* Cloud Account Section */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border border-blue-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Cloud className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-400">Cloud Account</h2>
            <p className="text-xs text-slate-400">Sync your settings across devices</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : isOnlineMode && user ? (
          // Signed in state
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-green-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Connected to Cloud
                </div>
                <div className="text-sm text-slate-400">{user.email}</div>
                {profile?.username && (
                  <div className="text-xs text-slate-500">@{profile.username}</div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Your settings, desktop icons, and installed apps sync automatically.
            </p>
          </div>
        ) : (
          // Sign in/up form
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={authMode === "login" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuthMode("login")}
                className={authMode === "login" ? "" : "border-slate-600"}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button
                variant={authMode === "signup" ? "default" : "outline"}
                size="sm"
                onClick={() => setAuthMode("signup")}
                className={authMode === "signup" ? "" : "border-slate-600"}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === "signup" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : authMode === "login" ? (
                  <LogIn className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {authMode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="text-xs text-slate-500 text-center">
              {authMode === "login" 
                ? "Sign in to sync your settings across devices"
                : "Create an account to enable cloud sync"}
            </p>
          </div>
        )}
      </section>

      {/* Profile Icon Section */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Profile Icon</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-cyan-500/30"
                style={{ backgroundColor: `${selectedColor}20` }}
              >
                <IconComponent className="w-10 h-10" style={{ color: selectedColor }} />
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {["#00d4ff", "#00ff88", "#ff6b6b", "#ffd93d", "#9b59b6", "#e67e22", "#1abc9c", "#fff"].map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          selectedColor === color ? "border-white scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Icon Grid */}
            <div>
              <label className="text-xs text-slate-500 block mb-2">Select Icon</label>
              <div className="grid grid-cols-8 gap-1.5 p-3 bg-slate-800/50 rounded-xl max-h-32 overflow-y-auto">
                {POPULAR_ICONS.map(iconName => {
                  const Icon = (icons as any)[iconName];
                  if (!Icon) return null;
                  return (
                    <button
                      key={iconName}
                      onClick={() => setSelectedIcon(iconName)}
                      className={`p-2 rounded-lg transition-all ${
                        selectedIcon === iconName 
                          ? "bg-cyan-500/30 text-cyan-400" 
                          : "hover:bg-slate-700 text-slate-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={handleSaveIcon} className="w-full">
              <Check className="w-4 h-4 mr-2" /> Save Icon
            </Button>
          </div>

          {/* Account Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400">Account Info</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Username</div>
                <div className="text-sm font-medium">{currentUserData.username || currentUserData.name || "User"}</div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Role</div>
                <div className="text-sm font-medium">{currentUserData.role || "User"}</div>
              </div>
              {isOnlineMode && user && (
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Email</div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Cloud className="w-3 h-3 text-blue-400" />
                    {user.email}
                  </div>
                </div>
              )}
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Mode</div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {isOnlineMode ? (
                    <><Cloud className="w-3 h-3 text-green-400" /> Online</>
                  ) : (
                    <><CloudOff className="w-3 h-3 text-slate-400" /> Local</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Display Name Section */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <h3 className="text-sm font-semibold text-slate-400 mb-4">Display Name</h3>
        <div className="flex gap-3">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name..."
            className="flex-1 bg-slate-800 border-slate-700"
          />
          <Button onClick={handleSaveDisplayName}>
            Save
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">This name will be shown in the Start Menu and other places</p>
      </section>
    </div>
  );
}