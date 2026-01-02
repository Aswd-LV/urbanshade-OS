import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  priority: 'normal' | 'high' | 'urgent';
  created_at: string;
  read_at: string | null;
  sender_profile?: {
    username: string;
    display_name: string | null;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessages([]);
        return;
      }

      // Fetch received messages
      const { data: receivedMessages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch sender profiles for each message
      const senderIds = [...new Set(receivedMessages?.map(m => m.sender_id) || [])];
      let profiles: Record<string, { username: string; display_name: string | null; role?: string }> = {};
      
      if (senderIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, username, display_name, role')
          .in('user_id', senderIds);
        
        profilesData?.forEach(p => {
          profiles[p.user_id] = { username: p.username, display_name: p.display_name, role: p.role };
        });
      }

      const messagesWithProfiles = (receivedMessages || []).map(m => ({
        ...m,
        priority: m.priority as 'normal' | 'high' | 'urgent',
        sender_profile: profiles[m.sender_id]
      }));

      setMessages(messagesWithProfiles);

      // Count pending (sent but unread) messages
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', user.id)
        .is('read_at', null);

      setPendingCount(count || 0);

      // Check if rate limited
      const { data: rateLimit } = await supabase
        .from('message_rate_limits')
        .select('blocked_until')
        .eq('user_id', user.id)
        .maybeSingle();

      if (rateLimit?.blocked_until && new Date(rateLimit.blocked_until) > new Date()) {
        setIsRateLimited(true);
        setBlockedUntil(new Date(rateLimit.blocked_until));
      } else {
        setIsRateLimited(false);
        setBlockedUntil(null);
      }

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, username, display_name')
        .neq('user_id', user.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const sendMessage = useCallback(async (
    recipientId: string,
    subject: string,
    body: string,
    priority: 'normal' | 'high' | 'urgent' = 'normal'
  ) => {
    try {
      const { data, error } = await supabase.rpc('check_and_send_message', {
        p_recipient_id: recipientId,
        p_subject: subject,
        p_body: body,
        p_priority: priority
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; blocked_until?: string };

      if (!result.success) {
        if (result.error === 'rate_limited') {
          setIsRateLimited(true);
          setBlockedUntil(result.blocked_until ? new Date(result.blocked_until) : null);
          return { success: false, error: 'rate_limited', blockedUntil: result.blocked_until };
        }
        return { success: false, error: result.error };
      }

      // Refresh pending count
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', user.id)
          .is('read_at', null);
        setPendingCount(count || 0);
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }, []);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, read_at: new Date().toISOString() } : m
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(m => m.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  }, []);

  return {
    messages,
    users,
    isLoading,
    pendingCount,
    isRateLimited,
    blockedUntil,
    fetchMessages,
    fetchUsers,
    sendMessage,
    markAsRead,
    deleteMessage
  };
};
