import { useState } from "react";
import { Shield, Key, User, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [usernameForm, setUsernameForm] = useState({
    current: "",
    new: ""
  });

  const currentUser = JSON.parse(localStorage.getItem("urbanshade_current_user") || "{}");
  const users = JSON.parse(localStorage.getItem("urbanshade_users") || "[]");

  const handleChangePassword = () => {
    if (!passwordForm.new) {
      toast.error("Please enter a new password");
      return;
    }
    
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.new.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    // Verify current password if one is set
    if (currentUser.password && currentUser.password !== passwordForm.current) {
      toast.error("Current password is incorrect");
      return;
    }

    // Update password
    const updatedUsers = users.map((u: any) => 
      u.name === currentUser.name || u.username === currentUser.username
        ? { ...u, password: passwordForm.new }
        : u
    );
    localStorage.setItem("urbanshade_users", JSON.stringify(updatedUsers));
    
    // Update current user
    const updatedUser = { ...currentUser, password: passwordForm.new };
    localStorage.setItem("urbanshade_current_user", JSON.stringify(updatedUser));

    toast.success("Password updated successfully");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleRemovePassword = () => {
    // Verify current password if one is set
    if (currentUser.password && currentUser.password !== passwordForm.current) {
      toast.error("Current password is incorrect");
      return;
    }

    // Remove password
    const updatedUsers = users.map((u: any) => 
      u.name === currentUser.name || u.username === currentUser.username
        ? { ...u, password: null }
        : u
    );
    localStorage.setItem("urbanshade_users", JSON.stringify(updatedUsers));
    
    // Update current user
    const updatedUser = { ...currentUser, password: null };
    localStorage.setItem("urbanshade_current_user", JSON.stringify(updatedUser));

    toast.success("Password removed - account is now passwordless");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleChangeUsername = () => {
    if (!usernameForm.new) {
      toast.error("Please enter a new username");
      return;
    }

    if (usernameForm.new.length < 2) {
      toast.error("Username must be at least 2 characters");
      return;
    }

    // Check if username is taken
    const usernameTaken = users.some((u: any) => 
      (u.name === usernameForm.new || u.username === usernameForm.new) && 
      u.name !== currentUser.name && u.username !== currentUser.username
    );
    
    if (usernameTaken) {
      toast.error("Username is already taken");
      return;
    }

    // Update username
    const updatedUsers = users.map((u: any) => 
      u.name === currentUser.name || u.username === currentUser.username
        ? { ...u, name: usernameForm.new, username: usernameForm.new }
        : u
    );
    localStorage.setItem("urbanshade_users", JSON.stringify(updatedUsers));
    
    // Update current user
    const updatedUser = { ...currentUser, name: usernameForm.new, username: usernameForm.new };
    localStorage.setItem("urbanshade_current_user", JSON.stringify(updatedUser));

    toast.success("Username updated successfully");
    setUsernameForm({ current: "", new: "" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">Security</h1>
        <p className="text-slate-400 text-sm">Manage your password and credentials</p>
      </div>

      {/* Change Password */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Change Password</h2>
        </div>

        <div className="space-y-4 max-w-md">
          {currentUser.password && (
            <div>
              <label className="text-xs text-slate-500 block mb-2">Current Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm(f => ({ ...f, current: e.target.value }))}
                  placeholder="Enter current password"
                  className="bg-slate-800 border-slate-700 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-500 block mb-2">New Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={passwordForm.new}
              onChange={(e) => setPasswordForm(f => ({ ...f, new: e.target.value }))}
              placeholder="Enter new password"
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-2">Confirm New Password</label>
            <Input
              type={showPassword ? "text" : "password"}
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Confirm new password"
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleChangePassword} className="flex-1">
              <Check className="w-4 h-4 mr-2" /> Update Password
            </Button>
            {currentUser.password && (
              <Button 
                variant="outline" 
                onClick={handleRemovePassword}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                Remove Password
              </Button>
            )}
          </div>

          {!currentUser.password && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-200">
                Your account currently has no password. Anyone can log in without credentials.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Change Username */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Change Username</h2>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Current Username</div>
            <div className="text-sm font-medium">{currentUser.username || currentUser.name || "User"}</div>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-2">New Username</label>
            <Input
              value={usernameForm.new}
              onChange={(e) => setUsernameForm(f => ({ ...f, new: e.target.value }))}
              placeholder="Enter new username"
              className="bg-slate-800 border-slate-700"
            />
          </div>

          <Button onClick={handleChangeUsername}>
            <Check className="w-4 h-4 mr-2" /> Update Username
          </Button>
        </div>
      </section>
    </div>
  );
}
