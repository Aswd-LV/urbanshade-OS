import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fixed NAVI system user ID for system messages
const NAVI_USER_ID = '00000000-0000-0000-0000-000000000000';

interface NaviSettings {
  auto_warn_enabled: boolean;
  auto_temp_ban_enabled: boolean;
  auto_lockdown_enabled: boolean;
  welcome_messages_enabled: boolean;
  degraded_service_messages_enabled: boolean;
  warning_messages_enabled: boolean;
  push_critical_enabled: boolean;
  push_warning_enabled: boolean;
  push_recovery_enabled: boolean;
  auto_disable_signups: boolean;
  auto_read_only_mode: boolean;
  auto_vip_only_mode: boolean;
  signup_threshold: number;
  message_threshold: number;
  failed_login_threshold: number;
  lockdown_multiplier: number;
  adaptive_thresholds_enabled: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client for autonomous operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await req.json();
    const { action } = body;

    // SECURITY: Only allow authenticated admin users - no shared token authentication
    // All NAVI autonomous operations require verified admin role
    let isAuthorized = false;
    let actorId = NAVI_USER_ID;

    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        const { data: roleData } = await supabaseAdmin
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        if (roleData) {
          isAuthorized = true;
          actorId = user.id;
          console.log(`NAVI action authorized for admin user: ${user.id}`);
        }
      }
    }

    if (!isAuthorized) {
      console.log('NAVI autonomous action rejected: user is not authenticated admin');
      return new Response(JSON.stringify({ error: 'Unauthorized - Admin access required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing NAVI action: ${action}`);

    // Get current NAVI settings
    const { data: settings } = await supabaseAdmin
      .from('navi_settings')
      .select('*')
      .eq('id', 'global')
      .single();

    const naviSettings = settings as NaviSettings | null;

    // =============================================
    // AUTO-WARN USER
    // =============================================
    if (action === 'auto_warn') {
      if (!naviSettings?.auto_warn_enabled) {
        return new Response(JSON.stringify({ error: 'Auto-warn is disabled' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { targetUserId, reason, triggerStats, threatLevel } = body;

      // Check if user was already warned in last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentWarnings } = await supabaseAdmin
        .from('navi_auto_actions')
        .select('id')
        .eq('target_user_id', targetUserId)
        .eq('action_type', 'warn')
        .gte('created_at', oneHourAgo);

      if (recentWarnings && recentWarnings.length > 0) {
        return new Response(JSON.stringify({ 
          error: 'User already warned in last hour',
          skipped: true 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Create moderation action
      await supabaseAdmin
        .from('moderation_actions')
        .insert({
          target_user_id: targetUserId,
          action_type: 'warn',
          reason: `[NAVI AUTO] ${reason}`,
          created_by: null,
          is_active: true
        });

      // Log NAVI action
      await supabaseAdmin
        .from('navi_auto_actions')
        .insert({
          action_type: 'warn',
          target_user_id: targetUserId,
          reason,
          trigger_stats: triggerStats || {},
          threat_level: threatLevel || 'warning'
        });

      // Send warning message to user if enabled
      if (naviSettings?.warning_messages_enabled) {
        await supabaseAdmin
          .from('messages')
          .insert({
            sender_id: actorId,
            recipient_id: targetUserId,
            subject: '[NAVI WARNING] Activity Notice',
            body: `Hello,\n\nNAVI has detected unusual activity from your account:\n- ${reason}\n\nThis is an automated warning. Continued unusual activity may result in temporary restrictions on your account.\n\nIf you believe this is in error, please contact an administrator.\n\n- NAVI`,
            priority: 'high',
            message_type: 'navi_warning'
          });
      }

      console.log(`NAVI auto-warned user ${targetUserId}: ${reason}`);

      return new Response(JSON.stringify({ success: true, action: 'warn' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // AUTO-TEMP-BAN USER
    // =============================================
    if (action === 'auto_temp_ban') {
      if (!naviSettings?.auto_temp_ban_enabled) {
        return new Response(JSON.stringify({ error: 'Auto temp-ban is disabled' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { targetUserId, reason, duration = '1h', triggerStats, threatLevel } = body;

      // Calculate expiry
      let expiresAt: Date;
      const now = new Date();
      if (duration === '1h') expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
      else if (duration === '6h') expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      else if (duration === '24h') expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      else expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // Default 1h

      // Create moderation action
      await supabaseAdmin
        .from('moderation_actions')
        .insert({
          target_user_id: targetUserId,
          action_type: 'temp_ban',
          reason: `[NAVI AUTO] ${reason}`,
          expires_at: expiresAt.toISOString(),
          created_by: null,
          is_active: true
        });

      // Log NAVI action
      await supabaseAdmin
        .from('navi_auto_actions')
        .insert({
          action_type: 'temp_ban',
          target_user_id: targetUserId,
          reason,
          trigger_stats: triggerStats || {},
          threat_level: threatLevel || 'critical'
        });

      console.log(`NAVI auto temp-banned user ${targetUserId} for ${duration}: ${reason}`);

      return new Response(JSON.stringify({ success: true, action: 'temp_ban', expiresAt }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // AUTO-LOCKDOWN SITE (10x threshold)
    // =============================================
    if (action === 'auto_lockdown') {
      if (!naviSettings?.auto_lockdown_enabled) {
        return new Response(JSON.stringify({ error: 'Auto-lockdown is disabled' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { reason, triggerStats, topOffenders } = body;

      // Check if lockdown was triggered in last hour (rate limit)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: recentLockdowns } = await supabaseAdmin
        .from('navi_auto_actions')
        .select('id')
        .eq('action_type', 'lockdown')
        .gte('created_at', oneHourAgo);

      if (recentLockdowns && recentLockdowns.length > 0) {
        return new Response(JSON.stringify({ 
          error: 'Lockdown already triggered in last hour',
          skipped: true 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Enable lockdown mode
      await supabaseAdmin
        .from('navi_settings')
        .update({
          lockdown_mode: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'global');

      // Log NAVI action
      await supabaseAdmin
        .from('navi_auto_actions')
        .insert({
          action_type: 'lockdown',
          reason,
          trigger_stats: triggerStats || {},
          threat_level: 'emergency'
        });

      // Auto temp-ban top offenders if provided
      if (topOffenders && Array.isArray(topOffenders) && naviSettings?.auto_temp_ban_enabled) {
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        
        for (const offender of topOffenders.slice(0, 5)) {
          await supabaseAdmin
            .from('moderation_actions')
            .insert({
              target_user_id: offender.userId,
              action_type: 'temp_ban',
              reason: `[NAVI LOCKDOWN] Auto-banned during emergency: ${offender.reason}`,
              expires_at: expiresAt.toISOString(),
              created_by: null,
              is_active: true
            });

          await supabaseAdmin
            .from('navi_auto_actions')
            .insert({
              action_type: 'temp_ban',
              target_user_id: offender.userId,
              reason: `Lockdown auto-ban: ${offender.reason}`,
              trigger_stats: triggerStats || {},
              threat_level: 'emergency'
            });
        }
      }

      // Send degraded service message to all users if enabled
      if (naviSettings?.degraded_service_messages_enabled) {
        const { data: allProfiles } = await supabaseAdmin
          .from('profiles')
          .select('user_id');

        if (allProfiles) {
          const messages = allProfiles.map(p => ({
            sender_id: actorId,
            recipient_id: p.user_id,
            subject: '[NAVI] Service Notice - Emergency Mode',
            body: `Hello,\n\nNAVI has detected a critical security event and has enabled emergency lockdown mode.\n\nReason: ${reason}\n\nSome features may be temporarily restricted. This usually resolves within 30-60 minutes.\n\nNo action is required on your part. Thank you for your patience.\n\n- NAVI`,
            priority: 'urgent',
            message_type: 'navi_degraded'
          }));

          // Insert in batches of 100
          for (let i = 0; i < messages.length; i += 100) {
            await supabaseAdmin
              .from('messages')
              .insert(messages.slice(i, i + 100));
          }
        }
      }

      console.log(`NAVI triggered auto-lockdown: ${reason}`);

      return new Response(JSON.stringify({ 
        success: true, 
        action: 'lockdown',
        topOffendersBanned: topOffenders?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // AUTO-UNLOCK (Recovery)
    // =============================================
    if (action === 'auto_unlock') {
      const { reason } = body;

      // Disable lockdown mode
      await supabaseAdmin
        .from('navi_settings')
        .update({
          lockdown_mode: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'global');

      // Log NAVI action
      await supabaseAdmin
        .from('navi_auto_actions')
        .insert({
          action_type: 'unlock',
          reason: reason || 'Threat level returned to normal',
          threat_level: 'normal'
        });

      console.log(`NAVI auto-unlocked site: ${reason}`);

      return new Response(JSON.stringify({ success: true, action: 'unlock' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // TOGGLE AUTHORITY SETTING
    // =============================================
    if (action === 'toggle_authority') {
      const { setting, value, reason, triggerStats, threatLevel } = body;

      // Validate setting
      const toggleableSettings = [
        'disable_signups', 'read_only_mode', 'maintenance_mode', 
        'disable_messages', 'vip_only_mode', 'lockdown_mode'
      ];
      
      if (!toggleableSettings.includes(setting)) {
        return new Response(JSON.stringify({ error: 'Invalid setting' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check if auto-toggle is enabled for this setting
      const autoSettingMap: Record<string, string> = {
        'disable_signups': 'auto_disable_signups',
        'read_only_mode': 'auto_read_only_mode',
        'vip_only_mode': 'auto_vip_only_mode'
      };

      if (autoSettingMap[setting] && naviSettings) {
        const autoKey = autoSettingMap[setting] as keyof NaviSettings;
        if (!naviSettings[autoKey]) {
          return new Response(JSON.stringify({ 
            error: `Auto-toggle for ${setting} is disabled` 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // Update setting
      await supabaseAdmin
        .from('navi_settings')
        .update({
          [setting]: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'global');

      // Log NAVI action
      await supabaseAdmin
        .from('navi_auto_actions')
        .insert({
          action_type: `toggle_${setting}`,
          reason: reason || `Auto-${value ? 'enabled' : 'disabled'} ${setting}`,
          trigger_stats: triggerStats || {},
          threat_level: threatLevel || 'warning'
        });

      console.log(`NAVI toggled ${setting} to ${value}: ${reason}`);

      return new Response(JSON.stringify({ success: true, setting, value }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // SEND WELCOME MESSAGE
    // =============================================
    if (action === 'send_welcome') {
      if (!naviSettings?.welcome_messages_enabled) {
        return new Response(JSON.stringify({ error: 'Welcome messages are disabled' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { targetUserId, username } = body;

      // Check if already welcomed
      const { data: existing } = await supabaseAdmin
        .from('user_first_login')
        .select('welcomed')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (existing?.welcomed) {
        return new Response(JSON.stringify({ skipped: true, reason: 'Already welcomed' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Send welcome message
      await supabaseAdmin
        .from('messages')
        .insert({
          sender_id: actorId,
          recipient_id: targetUserId,
          subject: 'Welcome to UrbanShade OS!',
          body: `Hello ${username || 'there'},\n\nI'm NAVI, your system assistant. Welcome to UrbanShade OS!\n\nHere are some quick tips to get started:\n- Check out the Start Menu for available apps\n- Press F1 anytime for help\n- Visit Settings to customize your experience\n\nIf you have any questions, feel free to explore the Documentation.\n\nHave a great time!\n- NAVI`,
          priority: 'normal',
          message_type: 'navi_welcome'
        });

      // Mark as welcomed
      await supabaseAdmin
        .from('user_first_login')
        .upsert({
          user_id: targetUserId,
          welcomed: true,
          welcomed_at: new Date().toISOString()
        });

      console.log(`NAVI sent welcome message to ${targetUserId}`);

      return new Response(JSON.stringify({ success: true, action: 'welcome' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // SEND NAVI MESSAGE TO USER
    // =============================================
    if (action === 'send_message') {
      const { targetUserId, subject, body: messageBody, messageType = 'navi_info', priority = 'normal' } = body;

      await supabaseAdmin
        .from('messages')
        .insert({
          sender_id: actorId,
          recipient_id: targetUserId,
          subject,
          body: messageBody,
          priority,
          message_type: messageType
        });

      console.log(`NAVI sent message to ${targetUserId}: ${subject}`);

      return new Response(JSON.stringify({ success: true, action: 'message' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // RECORD METRICS (for adaptive thresholds)
    // =============================================
    if (action === 'record_metrics') {
      const { signups, messages, failedLogins } = body;

      await supabaseAdmin.from('navi_threshold_history').insert([
        { metric_type: 'signups', value: signups || 0 },
        { metric_type: 'messages', value: messages || 0 },
        { metric_type: 'failed_logins', value: failedLogins || 0 }
      ]);

      // Run threshold adjustment if enabled
      if (naviSettings?.adaptive_thresholds_enabled) {
        await supabaseAdmin.rpc('adjust_navi_thresholds');
      }

      return new Response(JSON.stringify({ success: true, action: 'record_metrics' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // GET NAVI ACTIONS LOG
    // =============================================
    if (action === 'get_actions') {
      const { data: actions } = await supabaseAdmin
        .from('navi_auto_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      return new Response(JSON.stringify({ success: true, actions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // UPDATE NAVI SETTINGS (toggles)
    // =============================================
    if (action === 'update_settings') {
      const { updates } = body;

      // Validate that only allowed fields are being updated
      const allowedFields = [
        'auto_warn_enabled', 'auto_temp_ban_enabled', 'auto_lockdown_enabled',
        'welcome_messages_enabled', 'degraded_service_messages_enabled', 'warning_messages_enabled',
        'push_critical_enabled', 'push_warning_enabled', 'push_recovery_enabled',
        'auto_disable_signups', 'auto_read_only_mode', 'auto_vip_only_mode',
        'signup_threshold', 'message_threshold', 'failed_login_threshold',
        'lockdown_multiplier', 'adaptive_thresholds_enabled'
      ];

      const filteredUpdates: Record<string, any> = {};
      for (const key of Object.keys(updates)) {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      }

      if (Object.keys(filteredUpdates).length === 0) {
        return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: updated, error } = await supabaseAdmin
        .from('navi_settings')
        .update({
          ...filteredUpdates,
          updated_at: new Date().toISOString(),
          updated_by: actorId !== NAVI_USER_ID ? actorId : null
        })
        .eq('id', 'global')
        .select()
        .single();

      if (error) throw error;

      console.log(`NAVI settings updated:`, filteredUpdates);

      return new Response(JSON.stringify({ success: true, settings: updated }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =============================================
    // REVERSE NAVI ACTION
    // =============================================
    if (action === 'reverse_action') {
      const { actionId, reason } = body;

      const { data: naviAction } = await supabaseAdmin
        .from('navi_auto_actions')
        .select('*')
        .eq('id', actionId)
        .single();

      if (!naviAction) {
        return new Response(JSON.stringify({ error: 'Action not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Mark as reversed
      await supabaseAdmin
        .from('navi_auto_actions')
        .update({
          reversed: true,
          reversed_at: new Date().toISOString(),
          reversed_by: actorId !== NAVI_USER_ID ? actorId : null
        })
        .eq('id', actionId);

      // If it was a temp_ban or warn, deactivate the moderation action
      if (naviAction.target_user_id && ['warn', 'temp_ban'].includes(naviAction.action_type)) {
        await supabaseAdmin
          .from('moderation_actions')
          .update({ is_active: false })
          .eq('target_user_id', naviAction.target_user_id)
          .eq('action_type', naviAction.action_type)
          .eq('is_active', true)
          .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Only recent ones
      }

      // If it was a lockdown, disable it
      if (naviAction.action_type === 'lockdown') {
        await supabaseAdmin
          .from('navi_settings')
          .update({ lockdown_mode: false, updated_at: new Date().toISOString() })
          .eq('id', 'global');
      }

      console.log(`NAVI action ${actionId} reversed: ${reason}`);

      return new Response(JSON.stringify({ success: true, reversed: naviAction }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('NAVI autonomous error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
