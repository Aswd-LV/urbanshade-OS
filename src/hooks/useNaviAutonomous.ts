import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NaviStats {
  signupsLast5Min: number;
  messagesLast5Min: number;
  failedLogins: number;
  activeUsers: number;
}

interface NaviThresholds {
  signupsPerFiveMin: number;
  messagesPerFiveMin: number;
  failedLoginsPerFiveMin: number;
  autoResponseEnabled: boolean;
}

interface NaviAction {
  id: string;
  action: string;
  reason: string;
  timestamp: Date;
  severity: 'warning' | 'critical';
  autoTriggered: boolean;
}

const DEFAULT_THRESHOLDS: NaviThresholds = {
  signupsPerFiveMin: 10,
  messagesPerFiveMin: 50,
  failedLoginsPerFiveMin: 15,
  autoResponseEnabled: true
};

export const useNaviAutonomous = () => {
  const [stats, setStats] = useState<NaviStats>({
    signupsLast5Min: 0,
    messagesLast5Min: 0,
    failedLogins: 0,
    activeUsers: 0
  });
  const [thresholds, setThresholds] = useState<NaviThresholds>(DEFAULT_THRESHOLDS);
  const [recentActions, setRecentActions] = useState<NaviAction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const lastActionRef = useRef<Record<string, number>>({});

  // Prevent spam - only allow same action once per 5 minutes
  const canTriggerAction = (actionType: string): boolean => {
    const now = Date.now();
    const lastTime = lastActionRef.current[actionType] || 0;
    if (now - lastTime < 5 * 60 * 1000) return false;
    lastActionRef.current[actionType] = now;
    return true;
  };

  // Trigger authority action
  const triggerAuthority = async (setting: string, value: boolean, reason: string) => {
    try {
      const { error } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'set_navi_setting', setting, value, reason }
      });

      if (error) throw error;

      const action: NaviAction = {
        id: `${setting}-${Date.now()}`,
        action: `${value ? 'Enabled' : 'Disabled'} ${setting.replace(/_/g, ' ')}`,
        reason,
        timestamp: new Date(),
        severity: 'critical',
        autoTriggered: true
      };

      setRecentActions(prev => [action, ...prev].slice(0, 20));
      
      // Send push notification
      sendPushNotification(
        `🤖 NAVI Auto-Response`,
        `${action.action}: ${reason}`
      );

      return true;
    } catch (error) {
      console.error('Failed to trigger authority:', error);
      return false;
    }
  };

  // Check stats and respond if needed
  const analyzeAndRespond = useCallback(async (currentStats: NaviStats) => {
    if (!thresholds.autoResponseEnabled || !isMonitoring) return;

    // Check signup spike - disable signups if 2x threshold
    if (currentStats.signupsLast5Min >= thresholds.signupsPerFiveMin * 2) {
      if (canTriggerAction('disable_signups')) {
        await triggerAuthority(
          'disable_signups',
          true,
          `Signup spike detected: ${currentStats.signupsLast5Min} signups in 5 minutes (threshold: ${thresholds.signupsPerFiveMin})`
        );
        toast.error(`🤖 NAVI: Signups temporarily disabled due to unusual activity`);
      }
    }

    // Check message flood - enable read-only if 2x threshold
    if (currentStats.messagesLast5Min >= thresholds.messagesPerFiveMin * 2) {
      if (canTriggerAction('read_only_mode')) {
        await triggerAuthority(
          'read_only_mode',
          true,
          `Message flood detected: ${currentStats.messagesLast5Min} messages in 5 minutes (threshold: ${thresholds.messagesPerFiveMin})`
        );
        toast.error(`🤖 NAVI: Read-only mode enabled due to message flood`);
      }
    }

    // Check failed logins - could indicate attack
    if (currentStats.failedLogins >= thresholds.failedLoginsPerFiveMin * 2) {
      if (canTriggerAction('failed_login_alert')) {
        // Don't disable anything, just alert loudly
        sendPushNotification(
          '🚨 NAVI Security Alert',
          `${currentStats.failedLogins} failed login attempts in 5 minutes - possible attack`
        );
        toast.error(`🤖 NAVI: Unusual login activity detected - monitoring closely`);
        
        const loginAlert: NaviAction = {
          id: `login-alert-${Date.now()}`,
          action: 'Security Alert',
          reason: `${currentStats.failedLogins} failed login attempts detected`,
          timestamp: new Date(),
          severity: 'critical' as const,
          autoTriggered: true
        };
        setRecentActions(prev => [loginAlert, ...prev].slice(0, 20));
      }
    }
  }, [thresholds, isMonitoring]);

  // Fetch current stats
  const fetchStats = useCallback(async () => {
    try {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data: events, error } = await supabase
        .from('monitoring_events')
        .select('*')
        .gte('created_at', fiveMinAgo);

      if (error) throw error;

      const newStats: NaviStats = {
        signupsLast5Min: events?.filter(e => e.event_type === 'signup').length || 0,
        messagesLast5Min: events?.filter(e => e.event_type === 'message').length || 0,
        failedLogins: events?.filter(e => e.event_type === 'failed_login').length || 0,
        activeUsers: new Set(events?.map(e => e.user_id).filter(Boolean)).size
      };

      setStats(newStats);
      await analyzeAndRespond(newStats);
    } catch (error) {
      console.error('Error fetching NAVI stats:', error);
    }
  }, [analyzeAndRespond]);

  // Update thresholds
  const updateThresholds = (newThresholds: Partial<NaviThresholds>) => {
    setThresholds(prev => ({ ...prev, ...newThresholds }));
  };

  // Toggle monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
  };

  // Manual trigger for testing
  const manualTrigger = async (setting: string, value: boolean, reason: string) => {
    return triggerAuthority(setting, value, reason);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    thresholds,
    recentActions,
    isMonitoring,
    updateThresholds,
    toggleMonitoring,
    manualTrigger,
    refresh: fetchStats
  };
};

// Push notification helper
export const sendPushNotification = async (title: string, body: string) => {
  // Check if notifications are supported and permitted
  if (!('Notification' in window)) {
    console.log('Push notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'navi-notification',
      requireInteraction: true
    });
    return true;
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'navi-notification',
        requireInteraction: true
      });
      return true;
    }
  }
  
  return false;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};
