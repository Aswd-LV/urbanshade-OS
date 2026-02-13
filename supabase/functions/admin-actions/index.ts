import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fixed NAVI system user ID for system messages
const NAVI_USER_ID = '00000000-0000-0000-0000-000000000000';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin or creator
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'creator'])
      .order('role', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!roleData) {
      console.log(`Access denied for user ${user.id} - not an admin or creator`);
      return new Response(JSON.stringify({ error: 'Access denied - admin or creator only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const isCreator = roleData.role === 'creator';

    console.log(`Admin ${user.id} accessing admin actions`);

    // Handle different actions based on method
    if (req.method === 'GET') {
      // Parse action from URL search params for GET requests
      const url = new URL(req.url);
      const action = url.searchParams.get('action') || 'users';
      
      if (action === 'users') {
        // Get all users with their profiles and moderation status
        const { data: profiles, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get moderation actions for each user
        const { data: moderationActions } = await supabaseAdmin
          .from('moderation_actions')
          .select('*')
          .eq('is_active', true);

        // Get user roles
        const { data: roles } = await supabaseAdmin
          .from('user_roles')
          .select('*');

        // Get VIPs
        const { data: vips } = await supabaseAdmin
          .from('vips')
          .select('*');

        const usersWithStatus = profiles?.map(p => {
          const userActions = moderationActions?.filter(a => a.target_user_id === p.user_id) || [];
          const userRole = roles?.find(r => r.user_id === p.user_id);
          const isVip = vips?.some(v => v.user_id === p.user_id);
          const activeBan = userActions.find(a => 
            (a.action_type === 'temp_ban' || a.action_type === 'perm_ban' || a.action_type === 'ban') && 
            (!a.expires_at || new Date(a.expires_at) > new Date())
          );
          const warnings = userActions.filter(a => a.action_type === 'warn');

          return {
            ...p,
            role: userRole?.role || 'user',
            isVip,
            isBanned: !!activeBan,
            banInfo: activeBan,
            warningsCount: warnings.length,
            warnings
          };
        });

        return new Response(JSON.stringify({ users: usersWithStatus, isCreator }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'logs') {
        // Get moderation logs
        const { data: logs, error } = await supabaseAdmin
          .from('moderation_actions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify({ logs }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'vips') {
        // Get all VIPs
        const { data: vips, error } = await supabaseAdmin
          .from('vips')
          .select('*')
          .order('granted_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ vips }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'site_lock_status') {
        // Get site lock status
        const { data: lock, error } = await supabaseAdmin
          .from('site_locks')
          .select('*')
          .eq('id', 'global')
          .maybeSingle();

        return new Response(JSON.stringify({ lock }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'navi_messages') {
        // Get NAVI messages
        const { data: messages, error } = await supabaseAdmin
          .from('navi_messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return new Response(JSON.stringify({ messages }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'navi_settings') {
        // Get NAVI authority settings
        const { data: settings, error } = await supabaseAdmin
          .from('navi_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        // Return defaults if no settings exist
        const defaultSettings = {
          disable_signups: false,
          read_only_mode: false,
          maintenance_mode: false,
          disable_messages: false,
          vip_only_mode: false,
          lockdown_mode: false,
          maintenance_message: null
        };

        return new Response(JSON.stringify({ 
          settings: settings || defaultSettings,
          maintenanceMessage: settings?.maintenance_message || null
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'monitoring_events') {
        // Get recent monitoring events
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data: events, error } = await supabaseAdmin
          .from('monitoring_events')
          .select('*')
          .gte('created_at', fiveMinAgo)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify({ events }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Invalid GET action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const action = body.action;
      
      if (!action) {
        return new Response(JSON.stringify({ error: 'Missing action in request body' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`Processing action: ${action}`);
      
      if (action === 'warn') {
        const { targetUserId, reason } = body;
        
        const { data, error } = await supabaseAdmin
          .from('moderation_actions')
          .insert({
            target_user_id: targetUserId,
            action_type: 'warn',
            reason,
            created_by: user.id,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;
        console.log(`Admin ${user.id} warned user ${targetUserId}: ${reason}`);

        return new Response(JSON.stringify({ success: true, action: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'remove_warning') {
        const { warningId, reason } = body;
        
        // Mark warning as inactive
        const { error: updateError } = await supabaseAdmin
          .from('moderation_actions')
          .update({ is_active: false })
          .eq('id', warningId);

        if (updateError) throw updateError;

        // Log the removal as a new action
        const { data, error } = await supabaseAdmin
          .from('moderation_actions')
          .insert({
            action_type: 'warning_removed',
            reason,
            created_by: user.id,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;
        console.log(`Admin ${user.id} removed warning ${warningId}: ${reason}`);

        return new Response(JSON.stringify({ success: true, action: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'ban') {
        const { targetUserId, reason, duration, isPermanent, isFake } = body;
        
        let expiresAt = null;
        if (!isPermanent && duration) {
          const now = new Date();
          if (duration === '1h') expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
          else if (duration === '24h') expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          else if (duration === '7d') expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          else if (duration === '30d') expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }

        const { data, error } = await supabaseAdmin
          .from('moderation_actions')
          .insert({
            target_user_id: targetUserId,
            action_type: isPermanent ? 'perm_ban' : 'temp_ban',
            reason,
            expires_at: expiresAt?.toISOString() || null,
            created_by: user.id,
            is_active: true,
            is_fake: isFake || false
          })
          .select()
          .single();

        if (error) throw error;
        console.log(`Admin ${user.id} ${isFake ? 'fake ' : ''}banned user ${targetUserId}: ${reason} (${isPermanent ? 'permanent' : duration})`);

        return new Response(JSON.stringify({ success: true, action: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'unban') {
        const { targetUserId, reason } = body;
        
        const { error } = await supabaseAdmin
          .from('moderation_actions')
          .update({ is_active: false })
          .eq('target_user_id', targetUserId)
          .in('action_type', ['temp_ban', 'perm_ban', 'ban']);

        if (error) throw error;

        // Log the unban with reason
        if (reason) {
          await supabaseAdmin
            .from('moderation_actions')
            .insert({
              target_user_id: targetUserId,
              action_type: 'unban',
              reason,
              created_by: user.id,
              is_active: true
            });
        }

        console.log(`Admin ${user.id} unbanned user ${targetUserId}: ${reason || 'No reason'}`);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'ip_ban') {
        const { targetIp, reason } = body;
        
        const { data, error } = await supabaseAdmin
          .from('moderation_actions')
          .insert({
            target_ip: targetIp,
            action_type: 'ip_ban',
            reason,
            created_by: user.id,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;
        console.log(`Admin ${user.id} IP banned ${targetIp}: ${reason}`);

        return new Response(JSON.stringify({ success: true, action: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // VIP SYSTEM ACTIONS
      // =============================================
      
      if (action === 'grant_vip') {
        const { targetUserId, reason } = body;
        
        const { data, error } = await supabaseAdmin
          .from('vips')
          .insert({
            user_id: targetUserId,
            granted_by: user.id,
            reason
          })
          .select()
          .single();

        if (error) {
          if (error.code === '23505') {
            return new Response(JSON.stringify({ error: 'User is already VIP' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
          throw error;
        }
        console.log(`Admin ${user.id} granted VIP to user ${targetUserId}: ${reason}`);

        return new Response(JSON.stringify({ success: true, vip: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'revoke_vip') {
        const { targetUserId } = body;
        
        const { error } = await supabaseAdmin
          .from('vips')
          .delete()
          .eq('user_id', targetUserId);

        if (error) throw error;
        console.log(`Admin ${user.id} revoked VIP from user ${targetUserId}`);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // SITE LOCK ACTIONS
      // =============================================
      
      if (action === 'lock_site') {
        const { reason } = body;
        
        // First try to update, if no rows affected, insert
        const { data: existing } = await supabaseAdmin
          .from('site_locks')
          .select('id')
          .eq('id', 'global')
          .maybeSingle();

        if (existing) {
          const { data, error } = await supabaseAdmin
            .from('site_locks')
            .update({
              is_locked: true,
              lock_reason: reason,
              locked_at: new Date().toISOString(),
              locked_by: user.id
            })
            .eq('id', 'global')
            .select()
            .single();

          if (error) throw error;
          console.log(`Admin ${user.id} locked site: ${reason}`);

          return new Response(JSON.stringify({ success: true, lock: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          const { data, error } = await supabaseAdmin
            .from('site_locks')
            .insert({
              id: 'global',
              is_locked: true,
              lock_reason: reason,
              locked_at: new Date().toISOString(),
              locked_by: user.id
            })
            .select()
            .single();

          if (error) throw error;
          console.log(`Admin ${user.id} locked site: ${reason}`);

          return new Response(JSON.stringify({ success: true, lock: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (action === 'unlock_site') {
        const { data, error } = await supabaseAdmin
          .from('site_locks')
          .update({
            is_locked: false,
            lock_reason: null,
            locked_at: null,
            locked_by: null
          })
          .eq('id', 'global')
          .select()
          .single();

        if (error) throw error;
        console.log(`Admin ${user.id} unlocked site`);

        return new Response(JSON.stringify({ success: true, lock: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // NAVI MESSAGE ACTIONS - NOW DELIVERS TO INBOX
      // =============================================
      
      if (action === 'navi_message') {
        const { message, priority, target } = body;
        
        // Store in navi_messages table
        const { data: naviMsg, error: naviError } = await supabaseAdmin
          .from('navi_messages')
          .insert({
            message,
            priority: priority || 'info',
            target_audience: target || 'all',
            sent_by: user.id
          })
          .select()
          .single();

        if (naviError) throw naviError;

        // Now deliver to users' inboxes based on target audience
        let targetUserIds: string[] = [];
        
        if (target === 'all' || !target) {
          // Get all user IDs
          const { data: allProfiles } = await supabaseAdmin
            .from('profiles')
            .select('user_id');
          targetUserIds = allProfiles?.map(p => p.user_id) || [];
        } else if (target === 'vips') {
          // Get VIP user IDs
          const { data: vips } = await supabaseAdmin
            .from('vips')
            .select('user_id');
          targetUserIds = vips?.map(v => v.user_id) || [];
        } else if (target === 'admins') {
          // Get admin user IDs
          const { data: admins } = await supabaseAdmin
            .from('user_roles')
            .select('user_id')
            .eq('role', 'admin');
          targetUserIds = admins?.map(a => a.user_id) || [];
        }

        // Create inbox messages for all target users
        if (targetUserIds.length > 0) {
          const inboxMessages = targetUserIds.map(recipientId => ({
            sender_id: user.id, // Admin who sent it
            recipient_id: recipientId,
            subject: `[NAVI ${priority?.toUpperCase() || 'INFO'}] System Announcement`,
            body: message,
            priority: priority === 'critical' ? 'urgent' : priority === 'warning' ? 'high' : 'normal',
            message_type: 'navi_broadcast',
            metadata: { navi_message_id: naviMsg.id, broadcast_target: target }
          }));

          const { error: inboxError } = await supabaseAdmin
            .from('messages')
            .insert(inboxMessages);

          if (inboxError) {
            console.error('Error delivering NAVI messages to inboxes:', inboxError);
          } else {
            console.log(`NAVI message delivered to ${targetUserIds.length} users`);
          }
        }

        console.log(`Admin ${user.id} sent NAVI message (${priority}/${target}): ${message.substring(0, 50)}...`);

        return new Response(JSON.stringify({ success: true, naviMessage: naviMsg, deliveredTo: targetUserIds.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // OP/DEOP ACTIONS (Grant/Revoke Admin)
      // =============================================
      
      if (action === 'op') {
        const { targetUserId } = body;
        
        // Check if already has admin role
        const { data: existing } = await supabaseAdmin
          .from('user_roles')
          .select('id')
          .eq('user_id', targetUserId)
          .eq('role', 'admin')
          .maybeSingle();

        if (existing) {
          return new Response(JSON.stringify({ error: 'User is already an admin' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data, error } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: targetUserId,
            role: 'admin',
            granted_by: user.id
          })
          .select()
          .single();

        if (error) throw error;
        console.log(`Admin ${user.id} granted admin to user ${targetUserId}`);

        return new Response(JSON.stringify({ success: true, role: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'deop') {
        const { targetUserId } = body;
        
        // Only creators can demote admins
        if (!isCreator) {
          return new Response(JSON.stringify({ error: 'Only creators can demote admins' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        // Check if target is a creator (cannot demote creators)
        const { data: targetRole } = await supabaseAdmin
          .from('user_roles')
          .select('role')
          .eq('user_id', targetUserId)
          .maybeSingle();
          
        if (targetRole?.role === 'creator') {
          return new Response(JSON.stringify({ error: 'Cannot demote a creator' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        const { error } = await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', targetUserId)
          .eq('role', 'admin');

        if (error) throw error;
        console.log(`Creator ${user.id} revoked admin from user ${targetUserId}`);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // BROADCAST ACTION
      // =============================================
      
      if (action === 'broadcast') {
        const { message } = body;
        
        // Store broadcast as a NAVI message with critical priority
        const { data, error } = await supabaseAdmin
          .from('navi_messages')
          .insert({
            message,
            priority: 'critical',
            target_audience: 'all',
            sent_by: user.id
          })
          .select()
          .single();

        if (error) throw error;
        
        // Now deliver to ALL users' inboxes so they actually see it
        const { data: allProfiles } = await supabaseAdmin
          .from('profiles')
          .select('user_id');
        
        const targetUserIds = allProfiles?.map(p => p.user_id) || [];
        
        if (targetUserIds.length > 0) {
          const inboxMessages = targetUserIds.map(recipientId => ({
            sender_id: user.id,
            recipient_id: recipientId,
            subject: `[BROADCAST] Global Announcement`,
            body: message,
            priority: 'urgent',
            message_type: 'navi_broadcast',
            metadata: { navi_message_id: data.id, broadcast_target: 'all' }
          }));

          const { error: inboxError } = await supabaseAdmin
            .from('messages')
            .insert(inboxMessages);
          
          if (inboxError) {
            console.error('Failed to deliver broadcast to inboxes:', inboxError);
          } else {
            console.log(`Broadcast delivered to ${targetUserIds.length} users`);
          }
        }
        
        console.log(`Admin ${user.id} sent broadcast: ${message.substring(0, 50)}...`);

        return new Response(JSON.stringify({ success: true, broadcast: data, deliveredTo: targetUserIds.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // NAVI SETTINGS ACTIONS
      // =============================================
      
      if (action === 'set_navi_setting') {
        const { setting, value, message } = body;
        
        // Valid settings
        const validSettings = ['disable_signups', 'read_only_mode', 'maintenance_mode', 'disable_messages', 'vip_only_mode', 'lockdown_mode'];
        if (!validSettings.includes(setting)) {
          return new Response(JSON.stringify({ error: 'Invalid setting' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Check if settings row exists
        const { data: existing } = await supabaseAdmin
          .from('navi_settings')
          .select('id')
          .single();

        const updateData: Record<string, any> = {
          [setting]: value,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        };

        // Add maintenance message if setting maintenance mode
        if (setting === 'maintenance_mode' && message) {
          updateData.maintenance_message = message;
        }

        if (existing) {
          const { data, error } = await supabaseAdmin
            .from('navi_settings')
            .update(updateData)
            .eq('id', existing.id)
            .select()
            .single();

          if (error) throw error;
          console.log(`Admin ${user.id} set ${setting} to ${value}`);

          return new Response(JSON.stringify({ success: true, settings: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } else {
          // Create initial settings row
          const initialSettings = {
            disable_signups: false,
            read_only_mode: false,
            maintenance_mode: false,
            disable_messages: false,
            vip_only_mode: false,
            lockdown_mode: false,
            ...updateData
          };

          const { data, error } = await supabaseAdmin
            .from('navi_settings')
            .insert(initialSettings)
            .select()
            .single();

          if (error) throw error;
          console.log(`Admin ${user.id} created settings and set ${setting} to ${value}`);

          return new Response(JSON.stringify({ success: true, settings: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // =============================================
      // BULK ACTIONS
      // =============================================
      
      if (action === 'bulk_warn') {
        const { targetUserIds, reason } = body;
        
        const inserts = targetUserIds.map((targetUserId: string) => ({
          target_user_id: targetUserId,
          action_type: 'warn',
          reason,
          created_by: user.id,
          is_active: true
        }));

        const { data, error } = await supabaseAdmin
          .from('moderation_actions')
          .insert(inserts)
          .select();

        if (error) throw error;
        console.log(`Admin ${user.id} bulk warned ${targetUserIds.length} users: ${reason}`);

        return new Response(JSON.stringify({ success: true, count: data.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'bulk_ban') {
        const { targetUserIds, reason, duration, isPermanent } = body;
        
        let expiresAt = null;
        if (!isPermanent && duration) {
          const now = new Date();
          if (duration === '1h') expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
          else if (duration === '24h') expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          else if (duration === '7d') expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          else if (duration === '30d') expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }

        const inserts = targetUserIds.map((targetUserId: string) => ({
          target_user_id: targetUserId,
          action_type: isPermanent ? 'perm_ban' : 'temp_ban',
          reason,
          expires_at: expiresAt?.toISOString() || null,
          created_by: user.id,
          is_active: true,
          is_fake: false
        }));

        const { data, error } = await supabaseAdmin
          .from('moderation_actions')
          .insert(inserts)
          .select();

        if (error) throw error;
        console.log(`Admin ${user.id} bulk banned ${targetUserIds.length} users: ${reason}`);

        return new Response(JSON.stringify({ success: true, count: data.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'bulk_vip') {
        const { targetUserIds, reason } = body;
        
        const inserts = targetUserIds.map((targetUserId: string) => ({
          user_id: targetUserId,
          granted_by: user.id,
          reason
        }));

        const { data, error } = await supabaseAdmin
          .from('vips')
          .insert(inserts)
          .select();

        if (error) throw error;
        console.log(`Admin ${user.id} bulk granted VIP to ${targetUserIds.length} users`);

        return new Response(JSON.stringify({ success: true, count: data.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // =============================================
      // TEST EMERGENCY ACTIONS
      // =============================================
      
      if (action === 'start_test_emergency') {
        // Check if user has started a test emergency in the last 12 hours
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
        
        const { data: recentEmergency } = await supabaseAdmin
          .from('test_emergencies')
          .select('*')
          .eq('initiated_by', user.id)
          .gte('started_at', twelveHoursAgo)
          .single();
        
        if (recentEmergency) {
          const nextAvailable = new Date(new Date(recentEmergency.started_at).getTime() + 12 * 60 * 60 * 1000);
          return new Response(JSON.stringify({ 
            error: 'Rate limited', 
            message: `You can only start one test emergency every 12 hours. Next available: ${nextAvailable.toISOString()}`,
            nextAvailable: nextAvailable.toISOString()
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Generate fake emergency data
        const fakeData = {
          signups_spike: Math.floor(Math.random() * 500) + 100,
          failed_logins: Math.floor(Math.random() * 300) + 50,
          messages_spam: Math.floor(Math.random() * 1000) + 200,
          threat_level: ['elevated', 'high', 'critical'][Math.floor(Math.random() * 3)],
          affected_systems: ['auth', 'messaging', 'storage'].slice(0, Math.floor(Math.random() * 3) + 1),
          simulated_users: Array.from({ length: 5 }, (_, i) => ({
            username: `TestUser${i + 1}`,
            threat_score: Math.floor(Math.random() * 100),
            activity: ['suspicious_login', 'spam', 'brute_force'][Math.floor(Math.random() * 3)]
          }))
        };

        // Create test emergency
        const { data: emergency, error: emergencyError } = await supabaseAdmin
          .from('test_emergencies')
          .insert({
            initiated_by: user.id,
            is_active: true,
            fake_data: fakeData,
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (emergencyError) throw emergencyError;

        // Notify all admins/mods via NAVI message
        const { data: admins } = await supabaseAdmin
          .from('user_roles')
          .select('user_id')
          .in('role', ['admin', 'moderator', 'creator']);

        const adminIds = admins?.map(a => a.user_id) || [];

        if (adminIds.length > 0) {
          // Store NAVI message
          const { data: naviMsg } = await supabaseAdmin
            .from('navi_messages')
            .insert({
              message: `🚨 TEST EMERGENCY initiated by an admin. This is a drill to test moderation response. Fake data is being used. Emergency ID: ${emergency.id}`,
              priority: 'warning',
              target_audience: 'admins',
              sent_by: user.id
            })
            .select()
            .single();

          // Deliver to admin inboxes
          const inboxMessages = adminIds.map(recipientId => ({
            sender_id: user.id,
            recipient_id: recipientId,
            subject: `[TEST EMERGENCY] Moderation Drill Started`,
            body: `A test emergency has been initiated. This is a drill to test the moderation team's response.\n\nFake data is being generated for testing purposes.\n\nEmergency ID: ${emergency.id}\nThreat Level: ${fakeData.threat_level}\nAffected Systems: ${fakeData.affected_systems.join(', ')}`,
            priority: 'urgent',
            message_type: 'navi_broadcast',
            metadata: { emergency_id: emergency.id, is_test: true }
          }));

          await supabaseAdmin.from('messages').insert(inboxMessages);
        }

        console.log(`Admin ${user.id} started test emergency: ${emergency.id}`);

        return new Response(JSON.stringify({ 
          success: true, 
          emergency,
          notifiedAdmins: adminIds.length
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'end_test_emergency') {
        const { emergencyId } = body;
        
        const { data, error } = await supabaseAdmin
          .from('test_emergencies')
          .update({
            is_active: false,
            ended_at: new Date().toISOString()
          })
          .eq('id', emergencyId)
          .select()
          .single();

        if (error) throw error;

        // Notify admins that the test is over
        const { data: admins } = await supabaseAdmin
          .from('user_roles')
          .select('user_id')
          .in('role', ['admin', 'moderator', 'creator']);

        const adminIds = admins?.map(a => a.user_id) || [];

        if (adminIds.length > 0) {
          const inboxMessages = adminIds.map(recipientId => ({
            sender_id: user.id,
            recipient_id: recipientId,
            subject: `[TEST EMERGENCY ENDED] Drill Complete`,
            body: `The test emergency has been concluded. All fake data from this drill can be disregarded.\n\nEmergency ID: ${emergencyId}`,
            priority: 'normal',
            message_type: 'navi_broadcast',
            metadata: { emergency_id: emergencyId, is_test: true }
          }));

          await supabaseAdmin.from('messages').insert(inboxMessages);
        }

        console.log(`Admin ${user.id} ended test emergency: ${emergencyId}`);

        return new Response(JSON.stringify({ success: true, emergency: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'get_active_test_emergency') {
        const { data, error } = await supabaseAdmin
          .from('test_emergencies')
          .select('*')
          .eq('is_active', true)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        // Not finding an active emergency is not an error
        if (error && error.code !== 'PGRST116') throw error;

        return new Response(JSON.stringify({ success: true, emergency: data || null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'get_test_emergency_cooldown') {
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
        
        const { data: recentEmergency } = await supabaseAdmin
          .from('test_emergencies')
          .select('started_at')
          .eq('initiated_by', user.id)
          .gte('started_at', twelveHoursAgo)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        if (recentEmergency) {
          const nextAvailable = new Date(new Date(recentEmergency.started_at).getTime() + 12 * 60 * 60 * 1000);
          return new Response(JSON.stringify({ 
            success: true, 
            onCooldown: true,
            nextAvailable: nextAvailable.toISOString()
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify({ success: true, onCooldown: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Admin action error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
