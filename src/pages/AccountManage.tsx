import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, User, Shield, Trash2, Database, LogOut, Cloud, CloudOff, 
  RefreshCw, AlertTriangle, Check, X, Palette, Settings, Key, 
  Smartphone, Clock, Download, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { toast } from "sonner";
import { IconSelector } from "@/components/IconSelector";
import * as icons from "lucide-react";

// List of popular icon names for the selector
const POPULAR_ICONS = [
  "User", "UserCircle", "UserSquare", "Smile", "Ghost", "Bot", "Cat", "Dog",
  "Bird", "Fish", "Rabbit", "Skull", "Heart", "Star", "Moon", "Sun",
  "Zap", "Flame", "Snowflake", "Cloud", "Mountain", "Tree", "Flower2", "Leaf",
  "Music", "Gamepad2", "Code", "Terminal", "Rocket", "Plane", "Car", "Bike"
];

export default function AccountManage() {
  const navigate = useNavigate();
  const { user, profile, isOnlineMode, signOut, updateProfile, deleteAccount } = useOnlineAccount();
  
  const [selectedIcon, setSelectedIcon] = useState("User");
  const [selectedColor, setSelectedColor] = useState("#00d4ff");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<"data" | "account" | null>(null);
  
  // Data deletion checkboxes
  const [dataToDelete, setDataToDelete] = useState({
    desktopIcons: false,
    installedApps: false,
    systemSettings: false,
    syncHistory: false,
    uurPackages: false
  });

  // Load saved profile icon from localStorage
  useEffect(() => {
    const savedIcon = localStorage.getItem("urbanshade_profile_icon");
    const savedColor = localStorage.getItem("urbanshade_profile_color");
    if (savedIcon) setSelectedIcon(savedIcon);
    if (savedColor) setSelectedColor(savedColor);
  }, []);

  const handleSaveIcon = () => {
    localStorage.setItem("urbanshade_profile_icon", selectedIcon);
    localStorage.setItem("urbanshade_profile_color", selectedColor);
    toast.success("Profile icon updated!");
  };

  const handleDeleteData = () => {
    const toDelete = Object.entries(dataToDelete).filter(([, v]) => v);
    if (toDelete.length === 0) {
      toast.error("Select at least one data type to delete");
      return;
    }

    if (dataToDelete.desktopIcons) localStorage.removeItem("urbanshade_desktop_icons");
    if (dataToDelete.installedApps) localStorage.removeItem("urbanshade_installed_apps");
    if (dataToDelete.systemSettings) {
      const settingsKeys = Object.keys(localStorage).filter(k => k.startsWith("settings_"));
      settingsKeys.forEach(k => localStorage.removeItem(k));
    }
    if (dataToDelete.syncHistory) localStorage.removeItem("urbanshade_sync_history");
    if (dataToDelete.uurPackages) localStorage.removeItem("urbanshade_uur_installed_apps");

    toast.success(`Deleted ${toDelete.length} data categories`);
    setShowDeleteConfirm(false);
    setDataToDelete({ desktopIcons: false, installedApps: false, systemSettings: false, syncHistory: false, uurPackages: false });
  };

  const handleDeleteAccount = async () => {
    const { error } = await deleteAccount();
    if (error) {
      toast.error("Failed to delete account");
    } else {
      toast.success("Account deleted. Switching to local mode...");
      navigate("/");
    }
    setShowDeleteConfirm(false);
  };

  const handleDisconnectCloud = async () => {
    await signOut();
    toast.success("Disconnected from cloud. Now using local mode.");
  };

  const handleFactoryReset = () => {
    // Clear all urbanshade data
    const keys = Object.keys(localStorage).filter(k => 
      k.startsWith("urbanshade_") || k.startsWith("settings_")
    );
    keys.forEach(k => localStorage.removeItem(k));
    toast.success("Factory reset complete. Reloading...");
    setTimeout(() => window.location.href = "/", 1500);
  };

  const currentUserData = JSON.parse(localStorage.getItem("urbanshade_current_user") || "{}");
  const IconComponent = (icons as any)[selectedIcon] || icons.User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-cyan-400">Account Management</h1>
            <p className="text-xs text-slate-500">Manage your URBANSHADE account and data</p>
          </div>
        </div>
      </header>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {/* Profile Section */}
          <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold">Profile</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Icon Selector */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400">Profile Icon</h3>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-cyan-500/30"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    <IconComponent className="w-10 h-10" style={{ color: selectedColor }} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {/* Color Picker */}
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Color</label>
                      <div className="flex gap-2">
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

          {/* Data Management */}
          <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold">Data Management</h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-400 mb-4">Select data categories to delete:</p>
              
              {[
                { key: "desktopIcons", label: "Desktop Icons", desc: "Icon positions and custom desktop items" },
                { key: "installedApps", label: "Installed Apps", desc: "List of installed applications" },
                { key: "systemSettings", label: "System Settings", desc: "Theme, colors, fonts, and preferences" },
                { key: "syncHistory", label: "Sync History", desc: "Cloud sync logs and history" },
                { key: "uurPackages", label: "UUR Packages", desc: "Installed UUR packages and lists" },
              ].map(item => (
                <label 
                  key={item.key}
                  className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={dataToDelete[item.key as keyof typeof dataToDelete]}
                    onChange={(e) => setDataToDelete(d => ({ ...d, [item.key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </label>
              ))}

              <Button 
                variant="destructive" 
                className="w-full mt-4"
                onClick={() => { setDeleteType("data"); setShowDeleteConfirm(true); }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Selected Data
              </Button>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              {isOnlineMode && (
                <>
                  <div className="p-4 bg-red-950/50 rounded-lg border border-red-500/20">
                    <h3 className="font-semibold mb-1">Disconnect Cloud Account</h3>
                    <p className="text-sm text-slate-400 mb-3">Sign out and switch to local mode. Your cloud data will be preserved.</p>
                    <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={handleDisconnectCloud}>
                      <CloudOff className="w-4 h-4 mr-2" /> Disconnect
                    </Button>
                  </div>

                  <div className="p-4 bg-red-950/50 rounded-lg border border-red-500/20">
                    <h3 className="font-semibold mb-1">Request Account Deletion</h3>
                    <p className="text-sm text-slate-400 mb-3">Permanently delete your online account and all synced data.</p>
                    <Button 
                      variant="destructive" 
                      onClick={() => { setDeleteType("account"); setShowDeleteConfirm(true); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                    </Button>
                  </div>
                </>
              )}

              <div className="p-4 bg-red-950/50 rounded-lg border border-red-500/20">
                <h3 className="font-semibold mb-1">Factory Reset</h3>
                <p className="text-sm text-slate-400 mb-3">Reset URBANSHADE OS to default state. Clears all local data.</p>
                <Button variant="destructive" onClick={handleFactoryReset}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Factory Reset
                </Button>
              </div>
            </div>
          </section>
        </main>
      </ScrollArea>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">Confirm Deletion</h3>
            </div>
            <p className="text-slate-300 mb-6">
              {deleteType === "account" 
                ? "Are you sure you want to delete your account? This action cannot be undone."
                : "Are you sure you want to delete the selected data? This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={deleteType === "account" ? handleDeleteAccount : handleDeleteData}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
