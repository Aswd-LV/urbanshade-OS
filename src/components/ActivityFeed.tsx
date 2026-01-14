// UrbanShade OS v3.1 - Activity Feed Component
import { useState, useEffect } from "react";
import { Activity, Coins, Trophy, UserPlus, ShoppingBag, ArrowUp, Gift, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  is_public: boolean;
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  kroner_earned: <Coins className="w-4 h-4 text-yellow-400" />,
  achievement_unlocked: <Trophy className="w-4 h-4 text-purple-400" />,
  friend_added: <UserPlus className="w-4 h-4 text-blue-400" />,
  item_purchased: <ShoppingBag className="w-4 h-4 text-green-400" />,
  level_up: <ArrowUp className="w-4 h-4 text-cyan-400" />,
  gift_received: <Gift className="w-4 h-4 text-pink-400" />,
  login_bonus: <Star className="w-4 h-4 text-amber-400" />,
};

const formatActivityMessage = (activity: ActivityItem): string => {
  const data = activity.activity_data || {};
  
  switch (activity.activity_type) {
    case 'kroner_earned':
      return `Earned ${data.amount || 0} Kroner${data.reason ? ` - ${data.reason}` : ''}`;
    case 'achievement_unlocked':
      return `Unlocked achievement: ${data.name || 'Unknown'}`;
    case 'friend_added':
      return `Added a new friend`;
    case 'item_purchased':
      return `Purchased ${data.item_name || 'an item'} from the shop`;
    case 'level_up':
      return `Reached Battle Pass level ${data.level || '?'}`;
    case 'gift_received':
      return `Received a gift${data.from ? ` from ${data.from}` : ''}`;
    case 'login_bonus':
      return `Claimed daily bonus: +${data.kroner || 0} Kroner (${data.streak || 1} day streak)`;
    default:
      return activity.activity_type.replace(/_/g, ' ');
  }
};

interface ActivityFeedProps {
  userId?: string;
  limit?: number;
  showPublicOnly?: boolean;
  compact?: boolean;
}

export const ActivityFeed = ({ userId, limit = 20, showPublicOnly = false, compact = false }: ActivityFeedProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        let query = supabase
          .from('activity_feed')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (userId) {
          query = query.eq('user_id', userId);
        }

        if (showPublicOnly) {
          query = query.eq('is_public', true);
        }

        const { data, error } = await query;

        if (error) throw error;
        setActivities(data || []);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    // Subscribe to new activities
    const channel = supabase
      .channel('activity-feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_feed',
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        (payload) => {
          const newActivity = payload.new as ActivityItem;
          if (!showPublicOnly || newActivity.is_public) {
            setActivities(prev => [newActivity, ...prev].slice(0, limit));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, limit, showPublicOnly]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${compact ? 'h-20' : 'h-32'} text-muted-foreground text-sm`}>
        Loading activities...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center ${compact ? 'h-20' : 'h-32'} text-muted-foreground`}>
        <Activity className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className={compact ? "h-[200px]" : "h-full"}>
      <div className="space-y-2 p-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors ${
              compact ? 'p-2' : 'p-3'
            }`}
          >
            <div className="p-1.5 rounded-lg bg-background/50 border border-border/50">
              {ACTIVITY_ICONS[activity.activity_type] || <Activity className="w-4 h-4 text-muted-foreground" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-foreground ${compact ? 'text-xs' : 'text-sm'} line-clamp-2`}>
                {formatActivityMessage(activity)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
