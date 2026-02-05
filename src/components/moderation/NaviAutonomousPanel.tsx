import { useState } from "react";
import { 
  Bot, Shield, Zap, Bell, Power, 
  AlertTriangle, Cpu, Eye, BellRing,
  MessageSquare, Users, Lock, Settings, Undo2,
  TrendingUp, RefreshCw, ChevronDown, ChevronUp, Info,
  ToggleLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNaviAutonomous, requestNotificationPermission, sendPushNotification, ThreatLevel } from "@/hooks/useNaviAutonomous";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const NaviAutonomousPanel = () => {
  const { 
    stats, 
    settings,
    recentActions, 
    isMonitoring,
    threatLevel,
    updateSettings,
    toggleMonitoring,
    reverseAction,
    refresh
  } = useNaviAutonomous();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );
  const [detectionOpen, setDetectionOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      toast.success('Push notifications enabled');
      sendPushNotification('NAVI Notifications Enabled', 'You will now receive alerts from NAVI');
    } else {
      toast.error('Notification permission denied');
    }
  };

  const handleTestNotification = () => {
    sendPushNotification('🤖 NAVI Test', 'This is a test notification from NAVI');
    toast.success('Test notification sent');
  };

  const getThreatLevelDisplay = (level: ThreatLevel) => {
    const displays = {
      normal: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: 'NORMAL' },
      elevated: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', label: 'ELEVATED' },
      warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'WARNING' },
      critical: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'CRITICAL' },
      emergency: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'EMERGENCY' }
    };
    return displays[level] || displays.normal;
  };

  const display = getThreatLevelDisplay(threatLevel);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${display.bg} border ${display.border} flex items-center justify-center`}>
            <Cpu className={`w-5 h-5 ${display.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">NAVI Autonomous</h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Rule-based threat detection system that monitors activity and can automatically respond to threats like spam, floods, and suspicious patterns.</p>
                </TooltipContent>
              </Tooltip>
              {isMonitoring && (
                <span className="flex items-center gap-1 text-[10px] text-green-400 font-mono bg-green-500/10 px-1.5 py-0.5 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Auto-moderation & threat response</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Button onClick={refresh} variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button 
            onClick={toggleMonitoring} 
            variant={isMonitoring ? "default" : "outline"} 
            size="sm"
            className="gap-1.5 h-8"
          >
            <Power className="w-3.5 h-3.5" />
            {isMonitoring ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Threat Level */}
      <div className={`p-3 rounded-xl ${display.bg} border ${display.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className={`w-5 h-5 ${display.color}`} />
            <div>
              <div className={`font-bold text-sm uppercase tracking-wider ${display.color}`}>
                {display.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {threatLevel === 'normal' && 'All systems within normal parameters'}
                {threatLevel === 'elevated' && 'Slightly elevated activity'}
                {threatLevel === 'warning' && '2x threshold - may activate protections'}
                {threatLevel === 'critical' && '5x threshold - warning top offenders'}
                {threatLevel === 'emergency' && 'LOCKDOWN MODE ACTIVE'}
              </div>
            </div>
          </div>
          {stats.velocityRatio > 1.5 && (
            <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3" />
              {stats.velocityRatio.toFixed(1)}x
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2">
        <MetricCard icon={Users} label="Signups" value={stats.signupsLast5Min} threshold={settings.signup_threshold} />
        <MetricCard icon={MessageSquare} label="Messages" value={stats.messagesLast5Min} threshold={settings.message_threshold} />
        <MetricCard icon={Lock} label="Failed Logins" value={stats.failedLogins} threshold={settings.failed_login_threshold} />
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-1.5">
        {/* Detection & Response */}
        <Collapsible open={detectionOpen} onOpenChange={setDetectionOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-sm">Detection & Response</span>
              </div>
              {detectionOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 py-2 space-y-2 bg-muted/30 rounded-lg mt-1">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Auto-Moderation</div>
            <ToggleRow label="Auto-Warn Users" description="Warn at 5x threshold" checked={settings.auto_warn_enabled} onToggle={(v) => updateSettings({ auto_warn_enabled: v })} />
            <ToggleRow label="Auto Temp-Ban" description="Ban top offenders in emergencies" checked={settings.auto_temp_ban_enabled} onToggle={(v) => updateSettings({ auto_temp_ban_enabled: v })} />
            <ToggleRow label="Auto Lockdown" description={`Lock at ${settings.lockdown_multiplier}x threshold`} checked={settings.auto_lockdown_enabled} onToggle={(v) => updateSettings({ auto_lockdown_enabled: v })} />
            
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-3 mb-2">Authority Actions</div>
            <ToggleRow label="Auto-Disable Signups" description="At 2x signup threshold" checked={settings.auto_disable_signups} onToggle={(v) => updateSettings({ auto_disable_signups: v })} />
            <ToggleRow label="Auto Read-Only Mode" description="At 2x message threshold" checked={settings.auto_read_only_mode} onToggle={(v) => updateSettings({ auto_read_only_mode: v })} />
            <ToggleRow label="Auto VIP-Only Mode" description="Restrict during emergencies" checked={settings.auto_vip_only_mode} onToggle={(v) => updateSettings({ auto_vip_only_mode: v })} />
          </CollapsibleContent>
        </Collapsible>

        {/* Notifications */}
        <Collapsible open={notifOpen} onOpenChange={setNotifOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-sm">Notifications</span>
              </div>
              {notifOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 py-2 space-y-2 bg-muted/30 rounded-lg mt-1">
            {!notificationsEnabled ? (
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground">Enable browser notifications</span>
                <Button size="sm" onClick={handleEnableNotifications} className="h-7 text-xs">
                  <Bell className="w-3 h-3 mr-1.5" />
                  Enable
                </Button>
              </div>
            ) : (
              <>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Push Alerts</div>
                <ToggleRow label="Critical Alerts" description="Lockdown & emergencies" checked={settings.push_critical_enabled} onToggle={(v) => updateSettings({ push_critical_enabled: v })} />
                <ToggleRow label="Warning Alerts" description="Threshold approaching" checked={settings.push_warning_enabled} onToggle={(v) => updateSettings({ push_warning_enabled: v })} />
                <ToggleRow label="Recovery Alerts" description="When normalized" checked={settings.push_recovery_enabled} onToggle={(v) => updateSettings({ push_recovery_enabled: v })} />
                
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-3 mb-2">Auto-Messaging</div>
                <ToggleRow label="Welcome Messages" description="Greet new users" checked={settings.welcome_messages_enabled} onToggle={(v) => updateSettings({ welcome_messages_enabled: v })} />
                <ToggleRow label="Degraded Service" description="Notify during emergencies" checked={settings.degraded_service_messages_enabled} onToggle={(v) => updateSettings({ degraded_service_messages_enabled: v })} />
                <ToggleRow label="Warning Messages" description="Warn flagged users" checked={settings.warning_messages_enabled} onToggle={(v) => updateSettings({ warning_messages_enabled: v })} />
                
                <Button variant="outline" size="sm" onClick={handleTestNotification} className="w-full h-7 text-xs mt-2">
                  <Bell className="w-3 h-3 mr-1.5" />
                  Test Notification
                </Button>
              </>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Advanced */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-3 py-2 h-auto hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-sm">Advanced</span>
                {settings.adaptive_thresholds_enabled && (
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">ADAPTIVE</span>
                )}
              </div>
              {advancedOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 py-2 space-y-2 bg-muted/30 rounded-lg mt-1">
            <ToggleRow label="Adaptive Thresholds" description="Auto-adjust based on 24h avg" checked={settings.adaptive_thresholds_enabled} onToggle={(v) => updateSettings({ adaptive_thresholds_enabled: v })} />
            
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-3 mb-2">Threshold Values</div>
            <ThresholdInput label="Signups (5 min)" value={settings.signup_threshold} min={5} max={100} onChange={(v) => updateSettings({ signup_threshold: v })} />
            <ThresholdInput label="Messages (5 min)" value={settings.message_threshold} min={20} max={500} onChange={(v) => updateSettings({ message_threshold: v })} />
            <ThresholdInput label="Failed Logins" value={settings.failed_login_threshold} min={5} max={100} onChange={(v) => updateSettings({ failed_login_threshold: v })} />
            <ThresholdInput label="Lockdown Multiplier" value={settings.lockdown_multiplier} min={5} max={20} onChange={(v) => updateSettings({ lockdown_multiplier: v })} suffix="x" />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Recent Actions */}
      <div className="space-y-2 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Eye className="w-4 h-4 text-cyan-400" />
            Recent Actions
          </div>
          <span className="text-xs text-muted-foreground">{recentActions.length} total</span>
        </div>

        <ScrollArea className="h-[140px] rounded-lg border border-border/50 bg-muted/20">
          {recentActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <Bot className="w-6 h-6 mb-2 opacity-50" />
              <p className="text-xs">No autonomous actions yet</p>
              <p className="text-[10px] opacity-70">NAVI will log actions here</p>
            </div>
          ) : (
            <div className="p-2 space-y-1.5">
              {recentActions.map(action => (
                <ActionRow key={action.id} action={action} onReverse={reverseAction} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

// Subcomponents
const MetricCard = ({ icon: Icon, label, value, threshold }: { icon: any; label: string; value: number; threshold: number }) => {
  const ratio = value / threshold;
  const color = ratio >= 2 ? 'text-red-400' : ratio >= 1 ? 'text-amber-400' : 'text-green-400';
  const bg = ratio >= 2 ? 'bg-red-500/10 border-red-500/30' : ratio >= 1 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-muted/30 border-border/50';
  
  return (
    <div className={`p-2.5 rounded-lg border ${bg}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-bold ${color}`}>{value}</span>
        <span className="text-[10px] text-muted-foreground">/ {threshold}</span>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-1">
    <div className="min-w-0 pr-2">
      <span className="text-sm font-medium block">{label}</span>
      <span className="text-[10px] text-muted-foreground block truncate">{description}</span>
    </div>
    <Switch checked={checked} onCheckedChange={onToggle} className="shrink-0" />
  </div>
);

const ThresholdInput = ({ label, value, min, max, onChange, suffix }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm">{label}</span>
    <div className="flex items-center gap-1">
      <Input 
        type="number" 
        value={value} 
        min={min} 
        max={max} 
        onChange={(e) => onChange(parseInt(e.target.value) || min)} 
        className="w-16 h-7 text-xs text-center" 
      />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  </div>
);

const ActionRow = ({ action, onReverse }: { action: any; onReverse: (id: string, reason: string) => void }) => {
  const getActionIcon = (type: string) => {
    if (type.includes('warn')) return AlertTriangle;
    if (type.includes('ban')) return Lock;
    if (type.includes('lockdown')) return Shield;
    if (type.includes('toggle')) return ToggleLeft;
    return Zap;
  };
  
  const Icon = getActionIcon(action.action_type);
  const levelColor = action.threat_level === 'emergency' ? 'border-red-500/30 bg-red-500/5' :
    action.threat_level === 'critical' ? 'border-orange-500/30 bg-orange-500/5' :
    'border-amber-500/30 bg-amber-500/5';
  
  return (
    <div className={`p-2 rounded-lg border ${action.reversed ? 'border-muted bg-muted/20 opacity-60' : levelColor}`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${action.reversed ? 'text-muted-foreground' : 'text-amber-400'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium">{action.action_type.replace(/_/g, ' ')}</span>
            {action.reversed && <span className="text-[9px] bg-muted px-1 py-0.5 rounded">REVERSED</span>}
          </div>
          <p className="text-[10px] text-muted-foreground truncate">{action.reason}</p>
          <span className="text-[9px] text-muted-foreground">
            {formatDistanceToNow(new Date(action.created_at), { addSuffix: true })}
          </span>
        </div>
        {!action.reversed && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 shrink-0"
            onClick={() => onReverse(action.id, 'Manually reversed by admin')}
          >
            <Undo2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NaviAutonomousPanel;
