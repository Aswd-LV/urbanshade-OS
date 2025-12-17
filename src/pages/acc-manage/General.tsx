import { useState, useEffect } from "react";
import { User, Check, Cloud, CloudOff } from "lucide-react";
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
  const { user, profile, isOnlineMode, updateProfile } = useOnlineAccount();
  
  const [selectedIcon, setSelectedIcon] = useState("User");
  const [selectedColor, setSelectedColor] = useState("#00d4ff");
  const [displayName, setDisplayName] = useState("");

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

  const currentUserData = JSON.parse(localStorage.getItem("urbanshade_current_user") || "{}");
  const IconComponent = (icons as any)[selectedIcon] || icons.User;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">General Settings</h1>
        <p className="text-slate-400 text-sm">Manage your profile and account information</p>
      </div>

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
