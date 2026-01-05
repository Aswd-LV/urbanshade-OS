import { useState, useEffect } from "react";
import { 
  Shield, UserX, Lock, Eye, Settings, Zap, 
  AlertTriangle, RefreshCw, CheckCircle, XCircle,
  Users, MessageSquare, Sparkles, Globe, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Authority {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  dangerLevel: "low" | "medium" | "high" | "critical";
}

const AUTHORITIES: Authority[] = [
  {
    id: "disable_signups",
    label: "Disable New Signups",
    description: "Temporarily prevent new user registrations",
    icon: UserX,
    color: "amber",
    dangerLevel: "medium"
  },
  {
    id: "read_only_mode",
    label: "Read-Only Mode",
    description: "Users can view but not post or interact",
    icon: Eye,
    color: "blue",
    dangerLevel: "medium"
  },
  {
    id: "maintenance_mode",
    label: "Maintenance Mode",
    description: "Show maintenance page to non-admins",
    icon: Settings,
    color: "amber",
    dangerLevel: "high"
  },
  {
    id: "disable_messages",
    label: "Disable Messaging",
    description: "Temporarily disable the messaging system",
    icon: MessageSquare,
    color: "purple",
    dangerLevel: "low"
  },
  {
    id: "vip_only_mode",
    label: "VIP-Only Access",
    description: "Only VIPs and admins can access the site",
    icon: Sparkles,
    color: "purple",
    dangerLevel: "high"
  },
  {
    id: "lockdown_mode",
    label: "Full Lockdown",
    description: "Complete site lockdown - admins only",
    icon: Lock,
    color: "red",
    dangerLevel: "critical"
  }
];

interface NaviSettings {
  [key: string]: boolean;
}

export const NaviAuthoritiesTab = ({ isDemo }: { isDemo?: boolean }) => {
  const [settings, setSettings] = useState<NaviSettings>({
    disable_signups: false,
    read_only_mode: false,
    maintenance_mode: false,
    disable_messages: false,
    vip_only_mode: false,
    lockdown_mode: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState<string | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState("Site is undergoing scheduled maintenance. Please check back later.");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (isDemo) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await supabase.functions.invoke('admin-actions', {
        method: 'GET',
        body: null
      });

      // Try to get settings from URL param approach
      const { data: session } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions?action=navi_settings`,
        {
          headers: {
            'Authorization': `Bearer ${session.session?.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          if (data.maintenanceMessage) {
            setMaintenanceMessage(data.maintenanceMessage);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch NAVI settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthority = async (authorityId: string) => {
    const newValue = !settings[authorityId];
    
    if (isDemo) {
      setSettings(prev => ({ ...prev, [authorityId]: newValue }));
      toast.success(`[DEMO] ${authorityId} ${newValue ? 'enabled' : 'disabled'}`);
      return;
    }

    setSaving(authorityId);
    
    try {
      const response = await supabase.functions.invoke('admin-actions', {
        method: 'POST',
        body: { 
          action: 'set_navi_setting',
          setting: authorityId,
          value: newValue,
          ...(authorityId === 'maintenance_mode' && newValue ? { message: maintenanceMessage } : {})
        }
      });

      if (response.error) throw response.error;
      
      setSettings(prev => ({ ...prev, [authorityId]: newValue }));
      toast.success(`${AUTHORITIES.find(a => a.id === authorityId)?.label} ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error("Failed to update authority");
    } finally {
      setSaving(null);
    }
  };

  const getDangerColor = (level: Authority["dangerLevel"]) => {
    switch (level) {
      case "low": return "border-slate-600 bg-slate-900/50";
      case "medium": return "border-amber-500/30 bg-amber-950/20";
      case "high": return "border-orange-500/30 bg-orange-950/20";
      case "critical": return "border-red-500/30 bg-red-950/30";
    }
  };

  const getIconColor = (color: string, enabled: boolean) => {
    if (!enabled) return "text-slate-500";
    switch (color) {
      case "red": return "text-red-400";
      case "amber": return "text-amber-400";
      case "blue": return "text-blue-400";
      case "purple": return "text-purple-400";
      case "green": return "text-green-400";
      default: return "text-slate-400";
    }
  };

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              NAVI Authorities
              {isDemo && <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded font-mono">DEMO</span>}
            </h3>
            <p className="text-xs text-muted-foreground">Toggle site-wide restrictions and emergency controls</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSettings} className="gap-2 border-slate-700">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${activeCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="font-mono text-sm">
              {activeCount === 0 ? (
                <span className="text-green-400">All systems nominal</span>
              ) : (
                <span className="text-amber-400">{activeCount} restriction{activeCount > 1 ? 's' : ''} active</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Server className="w-3 h-3" />
            NAVI CONTROL MATRIX
          </div>
        </div>
      </div>

      {/* Authority Toggles */}
      <div className="grid gap-4">
        {AUTHORITIES.map((authority) => {
          const Icon = authority.icon;
          const isEnabled = settings[authority.id];
          const isSavingThis = isSaving === authority.id;
          
          return (
            <div 
              key={authority.id}
              className={`p-4 rounded-lg border-2 transition-all ${getDangerColor(authority.dangerLevel)} ${
                isEnabled ? 'ring-2 ring-offset-2 ring-offset-slate-950' : ''
              } ${
                isEnabled && authority.dangerLevel === 'critical' ? 'ring-red-500/50' : 
                isEnabled && authority.dangerLevel === 'high' ? 'ring-orange-500/50' :
                isEnabled && authority.dangerLevel === 'medium' ? 'ring-amber-500/50' :
                isEnabled ? 'ring-slate-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isEnabled ? `bg-${authority.color}-500/20 border border-${authority.color}-500/30` : 'bg-slate-800 border border-slate-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${getIconColor(authority.color, isEnabled)}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold font-mono">{authority.label}</h4>
                      {authority.dangerLevel === 'critical' && (
                        <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded font-mono">CRITICAL</span>
                      )}
                      {authority.dangerLevel === 'high' && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-mono">HIGH</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{authority.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {isEnabled && (
                    <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleAuthority(authority.id)}
                    disabled={isLoading || isSavingThis}
                    className={isEnabled ? `data-[state=checked]:bg-${authority.color}-500` : ''}
                  />
                </div>
              </div>

              {/* Maintenance mode message input */}
              {authority.id === 'maintenance_mode' && isEnabled && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <label className="text-xs font-mono text-slate-400 mb-2 block">MAINTENANCE MESSAGE</label>
                  <Input
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="Message shown to users..."
                    className="bg-slate-900 border-slate-700 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-400 font-mono text-sm">Authority Controls</h4>
            <p className="text-xs text-slate-400 mt-1">
              These controls affect all users site-wide. Critical and high-risk authorities should only be used during emergencies or planned maintenance. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-300 font-mono">{AUTHORITIES.length}</div>
          <div className="text-xs text-slate-500 font-mono">TOTAL AUTHORITIES</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
          <div className={`text-2xl font-bold font-mono ${activeCount > 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {activeCount}
          </div>
          <div className="text-xs text-slate-500 font-mono">ACTIVE</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-center">
          <div className="text-2xl font-bold text-slate-300 font-mono">{AUTHORITIES.length - activeCount}</div>
          <div className="text-xs text-slate-500 font-mono">INACTIVE</div>
        </div>
      </div>
    </div>
  );
};
