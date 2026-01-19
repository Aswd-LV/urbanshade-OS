import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Threat levels for graduated response
export type ThreatLevel = 'normal' | 'elevated' | 'warning' | 'critical' | 'emergency';

interface NaviStats {
  signupsLast5Min: number;
  messagesLast5Min: number;
  failedLogins: number;
  activeUsers: number;
  velocityRatio: number; // Current / Previous 5 min ratio
}

interface NaviSettings {
  // Authority toggles
  disable_signups: boolean;
  read_only_mode: boolean;
  maintenance_mode: boolean;
  disable_messages: boolean;
  vip_only_mode: boolean;
  lockdown_mode: boolean;
  maintenance_message: string | null;
  
  // Auto-moderation toggles
  auto_warn_enabled: boolean;
  auto_temp_ban_enabled: boolean;
  auto_lockdown_enabled: boolean;
  
  // Auto-messaging toggles
  welcome_messages_enabled: boolean;
  degraded_service_messages_enabled: boolean;
  warning_messages_enabled: boolean;
  
  // Push notification toggles
  push_critical_enabled: boolean;
  push_warning_enabled: boolean;
  push_recovery_enabled: boolean;
  
  // Auto authority action toggles
  auto_disable_signups: boolean;
  auto_read_only_mode: boolean;
  auto_vip_only_mode: boolean;
  
  // Threshold settings
  signup_threshold: number;
  message_threshold: number;
  failed_login_threshold: number;
  lockdown_multiplier: number;
  
  // Adaptive thresholds
  adaptive_thresholds_enabled: boolean;
  signup_rolling_avg: number;
  message_rolling_avg: number;
  failed_login_rolling_avg: number;
}

interface NaviAction {
  id: string;
  action_type: string;
  reason: string;
  created_at: string;
  threat_level: ThreatLevel | null;
  target_user_id: string | null;
  reversed: boolean;
}

interface UserActivity {
  userId: string;
  count: number;
  type: string;
}

const DEFAULT_SETTINGS: NaviSettings = {
  disable_signups: false,
  read_only_mode: false,
  maintenance_mode: false,
  disable_messages: false,
  vip_only_mode: false,
  lockdown_mode: false,
  maintenance_message: null,
  auto_warn_enabled: true,
  auto_temp_ban_enabled: true,
  auto_lockdown_enabled: true,
  welcome_messages_enabled: true,
  degraded_service_messages_enabled: true,
  warning_messages_enabled: true,
  push_critical_enabled: true,
  push_warning_enabled: true,
  push_recovery_enabled: true,
  auto_disable_signups: true,
  auto_read_only_mode: true,
  auto_vip_only_mode: false,
  signup_threshold: 10,
  message_threshold: 50,
  failed_login_threshold: 15,
  lockdown_multiplier: 10,
  adaptive_thresholds_enabled: true,
  signup_rolling_avg: 10,
  message_rolling_avg: 50,
  failed_login_rolling_avg: 15
};
// NAVI operations now require authenticated admin user - no client-side token

export const useNaviAutonomous = () => {
  const [stats, setStats] = useState<NaviStats>({
    signupsLast5Min: 0,
    messagesLast5Min: 0,
    failedLogins: 0,
    activeUsers: 0,
    velocityRatio: 1
  });
  const [settings, setSettings] = useState<NaviSettings>(DEFAULT_SETTINGS);
  const [recentActions, setRecentActions] = useState<NaviAction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('normal');
  
  const lastActionRef = useRef<Record<string, number>>({});
  const previousStatsRef = useRef<NaviStats | null>(null);
  const metricsRecordedRef = useRef<number>(0);

  // Calculate threat level based on stats and thresholds
  const calculateThreatLevel = useCallback((currentStats: NaviStats, currentSettings: NaviSettings): ThreatLevel => {
    const signupRatio = currentStats.signupsLast5Min / currentSettings.signup_threshold;
    const messageRatio = currentStats.messagesLast5Min / currentSettings.message_threshold;
    const loginRatio = currentStats.failedLogins / currentSettings.failed_login_threshold;
    
    const maxRatio = Math.max(signupRatio, messageRatio, loginRatio);
    const lockdownThreshold = currentSettings.lockdown_multiplier;
    
    if (maxRatio >= lockdownThreshold) return 'emergency';
    if (maxRatio >= 5) return 'critical';
    if (maxRatio >= 2) return 'warning';
    if (maxRatio >= 1) return 'elevated';
    return 'normal';
  }, []);

  // Prevent spam - only allow same action once per cooldown
  const canTriggerAction = (actionType: string, cooldownMinutes: number = 5): boolean => {
    const now = Date.now();
    const lastTime = lastActionRef.current[actionType] || 0;
    if (now - lastTime < cooldownMinutes * 60 * 1000) return false;
    lastActionRef.current[actionType] = now;
    return true;
  };

  // Get top offenders from monitoring events
  const getTopOffenders = useCallback(async (eventType: string, limit: number = 5): Promise<UserActivity[]> => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: events } = await supabase
      .from('monitoring_events')
      .select('user_id')
      .eq('event_type', eventType)
      .gte('created_at', fiveMinAgo)
      .not('user_id', 'is', null);

    if (!events) return [];

    // Count by user
    const counts: Record<string, number> = {};
    events.forEach(e => {
      if (e.user_id) {
        counts[e.user_id] = (counts[e.user_id] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([userId, count]) => ({ userId, count, type: eventType }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, []);

  // Call NAVI autonomous edge function - requires admin authentication
  const callNaviAutonomous = async (action: string, payload: Record<string, any>) => {
    try {
      // The edge function will validate the user's JWT from the Authorization header
      // and check if they have admin role - no client-side token needed
      const response = await supabase.functions.invoke('navi-autonomous', {
        body: { action, ...payload }
      });
      
      if (response.error) {
        console.error('NAVI autonomous error:', response.error);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to call NAVI autonomous:', error);
      return null;
    }
  };

  // Analyze and respond to threats
  const analyzeAndRespond = useCallback(async (currentStats: NaviStats, currentSettings: NaviSettings) => {
    if (!isMonitoring) return;

    const level = calculateThreatLevel(currentStats, currentSettings);
    setThreatLevel(level);

    const lockdownThreshold = currentSettings.lockdown_multiplier;

    // EMERGENCY (10x threshold) - Auto lockdown
    if (level === 'emergency') {
      if (canTriggerAction('lockdown', 60)) { // 1 hour cooldown
        const topOffenders = await getTopOffenders('message');
        
        await callNaviAutonomous('auto_lockdown', {
          reason: `Emergency: Activity at ${lockdownThreshold}x normal threshold`,
          triggerStats: currentStats,
          topOffenders: topOffenders.map(o => ({ userId: o.userId, reason: `${o.count} ${o.type}s in 5 min` }))
        });

        if (currentSettings.push_critical_enabled) {
          sendPushNotification(
            '🚨 NAVI EMERGENCY LOCKDOWN',
            `Site locked: Activity exceeded ${lockdownThreshold}x threshold`
          );
        }
        
        toast.error(`🤖 NAVI: EMERGENCY LOCKDOWN - ${lockdownThreshold}x threshold exceeded`);
      }
      return;
    }

    // CRITICAL (5x threshold) - Auto-warn top offenders
    if (level === 'critical') {
      if (canTriggerAction('critical_warn', 30)) { // 30 min cooldown
        // Find what's causing the issue
        let problemType = 'activity';
        if (currentStats.signupsLast5Min / currentSettings.signup_threshold >= 5) {
          problemType = 'signup';
        } else if (currentStats.messagesLast5Min / currentSettings.message_threshold >= 5) {
          problemType = 'message';
        }

        const topOffenders = await getTopOffenders(problemType);
        
        // Warn top 3 offenders
        for (const offender of topOffenders.slice(0, 3)) {
          await callNaviAutonomous('auto_warn', {
            targetUserId: offender.userId,
            reason: `Critical ${problemType} rate: ${offender.count} in 5 minutes`,
            triggerStats: currentStats,
            threatLevel: 'critical'
          });
        }

        if (currentSettings.push_critical_enabled) {
          sendPushNotification(
            '⚠️ NAVI CRITICAL',
            `5x threshold - warned ${topOffenders.slice(0, 3).length} top offenders`
          );
        }
        
        toast.warning(`🤖 NAVI: Critical threshold - warned top offenders`);
      }
    }

    // WARNING (2x threshold) - Enable protective settings
    if (level === 'warning' || level === 'critical') {
      // Check signup spike
      if (currentStats.signupsLast5Min >= currentSettings.signup_threshold * 2) {
        if (canTriggerAction('disable_signups') && currentSettings.auto_disable_signups) {
          await callNaviAutonomous('toggle_authority', {
            setting: 'disable_signups',
            value: true,
            reason: `Signup spike: ${currentStats.signupsLast5Min} in 5 min (threshold: ${currentSettings.signup_threshold})`,
            triggerStats: currentStats,
            threatLevel: level
          });
          
          if (currentSettings.push_warning_enabled) {
            sendPushNotification('🤖 NAVI Auto-Response', 'Signups temporarily disabled');
          }
          toast.warning(`🤖 NAVI: Signups disabled due to spike`);
        }
      }

      // Check message flood
      if (currentStats.messagesLast5Min >= currentSettings.message_threshold * 2) {
        if (canTriggerAction('read_only_mode') && currentSettings.auto_read_only_mode) {
          await callNaviAutonomous('toggle_authority', {
            setting: 'read_only_mode',
            value: true,
            reason: `Message flood: ${currentStats.messagesLast5Min} in 5 min (threshold: ${currentSettings.message_threshold})`,
            triggerStats: currentStats,
            threatLevel: level
          });
          
          if (currentSettings.push_warning_enabled) {
            sendPushNotification('🤖 NAVI Auto-Response', 'Read-only mode enabled');
          }
          toast.warning(`🤖 NAVI: Read-only mode enabled due to message flood`);
        }
      }
    }

    // AUTO-RECOVERY: If threat level returns to normal after being elevated
    if (level === 'normal' && previousStatsRef.current) {
      const prevLevel = calculateThreatLevel(previousStatsRef.current, currentSettings);
      
      if (prevLevel !== 'normal' && canTriggerAction('recovery', 5)) {
        // Check if we should auto-recover settings
        if (currentSettings.lockdown_mode) {
          await callNaviAutonomous('auto_unlock', {
            reason: 'Threat level returned to normal'
          });
          
          if (currentSettings.push_recovery_enabled) {
            sendPushNotification('✅ NAVI Recovery', 'Lockdown lifted - threat level normal');
          }
          toast.success(`🤖 NAVI: Lockdown lifted - threat level normal`);
        }
      }
    }

    previousStatsRef.current = currentStats;
  }, [isMonitoring, calculateThreatLevel, getTopOffenders]);

  // Fetch current stats and settings
  const fetchStats = useCallback(async () => {
    try {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      
      // Fetch events for current and previous 5 min periods
      const [currentEvents, previousEvents, settingsData] = await Promise.all([
        supabase
          .from('monitoring_events')
          .select('*')
          .gte('created_at', fiveMinAgo),
        supabase
          .from('monitoring_events')
          .select('*')
          .gte('created_at', tenMinAgo)
          .lt('created_at', fiveMinAgo),
        supabase
          .from('navi_settings')
          .select('*')
          .eq('id', 'global')
          .single()
      ]);

      const events = currentEvents.data || [];
      const prevEvents = previousEvents.data || [];
      
      // Current stats
      const signupsLast5Min = events.filter((e: any) => e.event_type === 'signup').length;
      const messagesLast5Min = events.filter((e: any) => e.event_type === 'message').length;
      const failedLogins = events.filter((e: any) => e.event_type === 'failed_login').length;
      
      // Previous stats for velocity
      const prevSignups = prevEvents.filter((e: any) => e.event_type === 'signup').length;
      const prevMessages = prevEvents.filter((e: any) => e.event_type === 'message').length;
      
      // Calculate velocity (avoid division by zero)
      const totalCurrent = signupsLast5Min + messagesLast5Min + failedLogins;
      const totalPrev = prevSignups + prevMessages + prevEvents.filter((e: any) => e.event_type === 'failed_login').length;
      const velocityRatio = totalPrev > 0 ? totalCurrent / totalPrev : 1;

      const newStats: NaviStats = {
        signupsLast5Min,
        messagesLast5Min,
        failedLogins,
        activeUsers: new Set(events.map((e: any) => e.user_id).filter(Boolean)).size,
        velocityRatio
      };

      setStats(newStats);
      
      // Update settings if available
      if (settingsData.data) {
        setSettings(settingsData.data as NaviSettings);
        await analyzeAndRespond(newStats, settingsData.data as NaviSettings);
      } else {
        await analyzeAndRespond(newStats, settings);
      }

      // Record metrics periodically (every 5 minutes)
      const now = Date.now();
      if (now - metricsRecordedRef.current >= 5 * 60 * 1000) {
        await callNaviAutonomous('record_metrics', {
          signups: signupsLast5Min,
          messages: messagesLast5Min,
          failedLogins
        });
        metricsRecordedRef.current = now;
      }
    } catch (error) {
      console.error('Error fetching NAVI stats:', error);
    }
  }, [analyzeAndRespond, settings]);

  // Fetch recent NAVI actions
  const fetchActions = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('navi_auto_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) {
        setRecentActions(data as NaviAction[]);
      }
    } catch (error) {
      console.error('Error fetching NAVI actions:', error);
    }
  }, []);

  // Update settings
  const updateSettings = async (updates: Partial<NaviSettings>) => {
    const result = await callNaviAutonomous('update_settings', { updates });
    if (result?.success) {
      setSettings(prev => ({ ...prev, ...updates }));
      toast.success('NAVI settings updated');
    }
    return result;
  };

  // Toggle monitoring
  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
  };

  // Manual trigger for testing
  const manualTrigger = async (action: string, payload: Record<string, any>) => {
    return callNaviAutonomous(action, payload);
  };

  // Reverse an action
  const reverseAction = async (actionId: string, reason: string) => {
    const result = await callNaviAutonomous('reverse_action', { actionId, reason });
    if (result?.success) {
      toast.success('NAVI action reversed');
      fetchActions();
    }
    return result;
  };

  useEffect(() => {
    fetchStats();
    fetchActions();
    const statsInterval = setInterval(fetchStats, 30000); // Check every 30 seconds
    const actionsInterval = setInterval(fetchActions, 60000); // Refresh actions every minute

    return () => {
      clearInterval(statsInterval);
      clearInterval(actionsInterval);
    };
  }, [fetchStats, fetchActions]);

  return {
    stats,
    settings,
    recentActions,
    isMonitoring,
    threatLevel,
    updateSettings,
    toggleMonitoring,
    manualTrigger,
    reverseAction,
    refresh: () => { fetchStats(); fetchActions(); }
  };
};

// Push notification helper
export const sendPushNotification = async (title: string, body: string) => {
  if (!('Notification' in window)) {
    console.log('Push notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'navi-notification',
      requireInteraction: true
    });
    return true;
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
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
