import { useState, useEffect } from "react";
import { Smartphone, Clock, RefreshCw, Cloud, CloudOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { toast } from "sonner";

interface SyncEvent {
  timestamp: string;
  type: 'push' | 'pull' | 'conflict';
  status: 'success' | 'error';
  details?: string;
}

export default function DevicesPage() {
  const { isOnlineMode, syncSettings, user } = useOnlineAccount();
  const [syncHistory, setSyncHistory] = useState<SyncEvent[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadSyncHistory();
  }, []);

  const loadSyncHistory = () => {
    try {
      const history = localStorage.getItem("urbanshade_sync_history");
      if (history) {
        setSyncHistory(JSON.parse(history));
      }
    } catch {
      setSyncHistory([]);
    }
  };

  const handleManualSync = async () => {
    if (!isOnlineMode) {
      toast.error("Online mode required for sync");
      return;
    }

    setSyncing(true);
    try {
      await syncSettings();
      
      // Add to history
      const newEvent: SyncEvent = {
        timestamp: new Date().toISOString(),
        type: 'push',
        status: 'success',
        details: 'Manual sync completed'
      };
      const history = [...syncHistory, newEvent].slice(-50); // Keep last 50
      setSyncHistory(history);
      localStorage.setItem("urbanshade_sync_history", JSON.stringify(history));
      
      toast.success("Sync completed");
    } catch (err) {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const clearSyncHistory = () => {
    localStorage.removeItem("urbanshade_sync_history");
    setSyncHistory([]);
    toast.success("Sync history cleared");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const lastSync = syncHistory.length > 0 
    ? syncHistory[syncHistory.length - 1] 
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">Devices & Sync</h1>
        <p className="text-slate-400 text-sm">View sync history and manage connected devices</p>
      </div>

      {/* Sync Status */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Sync Status</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="text-xs text-slate-500 mb-2">Mode</div>
            <div className="flex items-center gap-2 text-lg font-semibold">
              {isOnlineMode ? (
                <>
                  <Cloud className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">Online</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">Local</span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="text-xs text-slate-500 mb-2">Last Sync</div>
            <div className="text-sm font-medium">
              {lastSync ? formatDate(lastSync.timestamp) : "Never"}
            </div>
          </div>

          {isOnlineMode && user && (
            <div className="p-4 bg-slate-800/50 rounded-xl md:col-span-2">
              <div className="text-xs text-slate-500 mb-2">Connected Account</div>
              <div className="text-sm font-medium">{user.email}</div>
            </div>
          )}
        </div>

        <Button 
          onClick={handleManualSync} 
          disabled={!isOnlineMode || syncing}
          className="w-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </section>

      {/* Sync History */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold">Sync History</h2>
          </div>
          {syncHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearSyncHistory}
              className="text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {syncHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No sync history yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...syncHistory].reverse().map((event, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full ${
                  event.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div className="flex-1">
                  <div className="text-sm font-medium capitalize">
                    {event.type === 'push' ? '↑ Upload' : event.type === 'pull' ? '↓ Download' : '⚠ Conflict'}
                  </div>
                  <div className="text-xs text-slate-500">{formatDate(event.timestamp)}</div>
                </div>
                {event.details && (
                  <div className="text-xs text-slate-500">{event.details}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Device Info */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">This Device</h2>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Platform</div>
            <div className="text-sm font-medium">{navigator.platform}</div>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Browser</div>
            <div className="text-sm font-medium">{navigator.userAgent.split(' ').pop()}</div>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Screen</div>
            <div className="text-sm font-medium">{screen.width} × {screen.height}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
