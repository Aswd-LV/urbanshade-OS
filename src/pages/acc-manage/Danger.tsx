import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CloudOff, Trash2, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { toast } from "sonner";

export default function DangerPage() {
  const navigate = useNavigate();
  const { isOnlineMode, signOut, deleteAccount } = useOnlineAccount();
  
  const [showConfirm, setShowConfirm] = useState<'disconnect' | 'delete' | 'reset' | null>(null);

  const handleDisconnectCloud = async () => {
    await signOut();
    toast.success("Disconnected from cloud. Now using local mode.");
    setShowConfirm(null);
  };

  const handleDeleteAccount = async () => {
    const { error } = await deleteAccount();
    if (error) {
      toast.error("Failed to delete account");
    } else {
      toast.success("Account deleted. Switching to local mode...");
      navigate("/");
    }
    setShowConfirm(null);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-red-400 mb-2">Danger Zone</h1>
        <p className="text-slate-400 text-sm">Destructive actions that cannot be undone</p>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-red-200 font-medium">Warning</p>
          <p className="text-xs text-red-200/70">
            Actions on this page are permanent and cannot be reversed. Please proceed with caution.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {/* Disconnect Cloud */}
        {isOnlineMode && (
          <section className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-red-500/10">
                <CloudOff className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-300 mb-1">Disconnect Cloud Account</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Sign out and switch to local mode. Your cloud data will be preserved but this device will no longer sync.
                </p>
                <Button 
                  variant="outline" 
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  onClick={() => setShowConfirm('disconnect')}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Disconnect
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Delete Account */}
        {isOnlineMode && (
          <section className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-300 mb-1">Delete Online Account</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Permanently delete your online account and all synced data from the cloud. This cannot be undone.
                </p>
                <Button 
                  variant="destructive"
                  onClick={() => setShowConfirm('delete')}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Factory Reset */}
        <section className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-red-500/10">
              <RefreshCw className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-300 mb-1">Factory Reset</h3>
              <p className="text-sm text-slate-400 mb-4">
                Reset URBANSHADE OS to its default state. This will delete all local data including desktop icons, installed apps, settings, and user accounts.
              </p>
              <Button 
                variant="destructive"
                onClick={() => setShowConfirm('reset')}
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Factory Reset
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">
                {showConfirm === 'disconnect' && 'Disconnect Cloud?'}
                {showConfirm === 'delete' && 'Delete Account?'}
                {showConfirm === 'reset' && 'Factory Reset?'}
              </h3>
            </div>
            <p className="text-slate-300 mb-6">
              {showConfirm === 'disconnect' && 'You will be signed out and switched to local mode. Your cloud data will remain intact.'}
              {showConfirm === 'delete' && 'Your online account and all synced data will be permanently deleted. This cannot be undone.'}
              {showConfirm === 'reset' && 'All local data will be erased and URBANSHADE will be reset to factory defaults. This cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => {
                  if (showConfirm === 'disconnect') handleDisconnectCloud();
                  else if (showConfirm === 'delete') handleDeleteAccount();
                  else if (showConfirm === 'reset') handleFactoryReset();
                }}
              >
                {showConfirm === 'disconnect' && 'Disconnect'}
                {showConfirm === 'delete' && 'Delete'}
                {showConfirm === 'reset' && 'Reset'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
