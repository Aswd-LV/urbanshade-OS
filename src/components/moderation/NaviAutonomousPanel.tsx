import { useState } from "react";
import { 
  Bot, Shield, Zap, Activity, Bell, Settings, Power, 
  AlertTriangle, CheckCircle, Clock, Cpu, Eye, BellRing,
  MessageSquare, Users, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNaviAutonomous, requestNotificationPermission, sendPushNotification } from "@/hooks/useNaviAutonomous";
import { toast } from "sonner";

export const NaviAutonomousPanel = () => {
  const { 
    stats, 
    thresholds, 
    recentActions, 
    isMonitoring,
    updateThresholds,
    toggleMonitoring,
    refresh
  } = useNaviAutonomous();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

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

  const getHealthStatus = () => {
    const signupRatio = stats.signupsLast5Min / thresholds.signupsPerFiveMin;
    const messageRatio = stats.messagesLast5Min / thresholds.messagesPerFiveMin;
    const loginRatio = stats.failedLogins / thresholds.failedLoginsPerFiveMin;
    
    const maxRatio = Math.max(signupRatio, messageRatio, loginRatio);
    
    if (maxRatio >= 2) return { status: 'critical', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (maxRatio >= 1) return { status: 'warning', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    if (maxRatio >= 0.5) return { status: 'elevated', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { status: 'normal', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const health = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${health.bg} border border-current/30 flex items-center justify-center ${health.color}`}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              NAVI Autonomous Mode
              {isMonitoring && (
                <span className="flex items-center gap-1 text-xs text-green-400 font-mono">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  ACTIVE
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              AI-powered threat detection & automatic response
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={refresh} variant="outline" size="sm">
            <Activity className="w-4 h-4" />
          </Button>
          <Button 
            onClick={toggleMonitoring} 
            variant={isMonitoring ? "default" : "outline"} 
            size="sm"
            className="gap-2"
          >
            <Power className="w-4 h-4" />
            {isMonitoring ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </div>

      {/* System Health */}
      <div className={`p-4 rounded-xl ${health.bg} border border-current/30 ${health.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <div className="font-bold uppercase tracking-wider text-sm">
                System Status: {health.status.toUpperCase()}
              </div>
              <div className="text-xs opacity-70">
                {health.status === 'normal' && 'All systems operating within normal parameters'}
                {health.status === 'elevated' && 'Activity levels slightly elevated - monitoring closely'}
                {health.status === 'warning' && 'Threshold approaching - NAVI is prepared to respond'}
                {health.status === 'critical' && 'Critical threshold exceeded - automatic response may trigger'}
              </div>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${health.color.replace('text-', 'bg-')} animate-pulse`} />
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          icon={Users}
          label="Signups"
          value={stats.signupsLast5Min}
          threshold={thresholds.signupsPerFiveMin}
          color="green"
        />
        <MetricCard
          icon={MessageSquare}
          label="Messages"
          value={stats.messagesLast5Min}
          threshold={thresholds.messagesPerFiveMin}
          color="cyan"
        />
        <MetricCard
          icon={Lock}
          label="Failed Logins"
          value={stats.failedLogins}
          threshold={thresholds.failedLoginsPerFiveMin}
          color="red"
        />
      </div>

      {/* Auto-Response Settings */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 font-bold">
          <Zap className="w-4 h-4 text-amber-400" />
          Auto-Response Configuration
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="font-medium text-sm">Autonomous Response</div>
              <div className="text-xs text-muted-foreground">
                Allow NAVI to automatically trigger protective measures
              </div>
            </div>
          </div>
          <Switch
            checked={thresholds.autoResponseEnabled}
            onCheckedChange={(checked) => updateThresholds({ autoResponseEnabled: checked })}
          />
        </div>

        {/* Threshold Sliders */}
        <div className="space-y-4 pt-2">
          <ThresholdSlider
            label="Signup Threshold (5 min)"
            value={thresholds.signupsPerFiveMin}
            min={5}
            max={50}
            onChange={(value) => updateThresholds({ signupsPerFiveMin: value })}
            description="Auto-disable signups at 2x this value"
          />
          <ThresholdSlider
            label="Message Threshold (5 min)"
            value={thresholds.messagesPerFiveMin}
            min={10}
            max={200}
            onChange={(value) => updateThresholds({ messagesPerFiveMin: value })}
            description="Auto-enable read-only at 2x this value"
          />
          <ThresholdSlider
            label="Failed Login Threshold (5 min)"
            value={thresholds.failedLoginsPerFiveMin}
            min={5}
            max={50}
            onChange={(value) => updateThresholds({ failedLoginsPerFiveMin: value })}
            description="Security alert at 2x this value"
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 font-bold">
          <BellRing className="w-4 h-4 text-purple-400" />
          Push Notifications
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {notificationsEnabled 
              ? 'You will receive browser notifications for NAVI alerts' 
              : 'Enable to receive instant alerts when NAVI detects threats'}
          </div>
          {notificationsEnabled ? (
            <Button variant="outline" size="sm" onClick={handleTestNotification}>
              <Bell className="w-4 h-4 mr-2" />
              Test
            </Button>
          ) : (
            <Button size="sm" onClick={handleEnableNotifications}>
              <Bell className="w-4 h-4 mr-2" />
              Enable
            </Button>
          )}
        </div>
      </div>

      {/* Recent NAVI Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-bold">
          <Eye className="w-4 h-4 text-cyan-400" />
          Recent NAVI Actions
        </div>

        <ScrollArea className="h-[200px] rounded-lg border border-slate-800 bg-slate-900/50">
          {recentActions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <Bot className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No autonomous actions taken yet</p>
              <p className="text-xs">NAVI will log actions here when triggered</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {recentActions.map(action => (
                <div 
                  key={action.id}
                  className={`p-3 rounded-lg border ${
                    action.severity === 'critical' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {action.autoTriggered ? (
                      <Zap className="w-4 h-4 text-amber-400 mt-0.5" />
                    ) : (
                      <Shield className="w-4 h-4 text-cyan-400 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{action.action}</span>
                        {action.autoTriggered && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/30 text-amber-400 font-mono">
                            AUTO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{action.reason}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {action.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-cyan-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-cyan-400 mb-1">How NAVI Autonomous Works</p>
            <p className="text-xs text-slate-400">
              NAVI continuously monitors activity metrics. When values exceed 2x the configured 
              thresholds, protective measures are automatically enabled. Actions are rate-limited 
              to prevent repeated triggers. Push notifications alert admins immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  threshold, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: number; 
  threshold: number; 
  color: string;
}) => {
  const ratio = value / threshold;
  const isWarning = ratio >= 1;
  const isCritical = ratio >= 2;

  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400'
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-mono uppercase">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : `bg-${color}-500`
            }`}
            style={{ width: `${Math.min(ratio * 50, 100)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono opacity-70">/{threshold}</span>
      </div>
      {isCritical && (
        <div className="flex items-center gap-1 text-xs text-red-400 mt-2">
          <AlertTriangle className="w-3 h-3" />
          Critical
        </div>
      )}
      {isWarning && !isCritical && (
        <div className="flex items-center gap-1 text-xs text-amber-400 mt-2">
          <AlertTriangle className="w-3 h-3" />
          Warning
        </div>
      )}
    </div>
  );
};

// Threshold Slider Component
const ThresholdSlider = ({
  label,
  value,
  min,
  max,
  onChange,
  description
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  description: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className="font-mono text-sm text-cyan-400">{value}</span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={1}
      onValueChange={([v]) => onChange(v)}
      className="py-2"
    />
    <p className="text-[10px] text-muted-foreground">{description}</p>
  </div>
);
