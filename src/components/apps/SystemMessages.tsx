import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Ban, MessageSquare, Shield, ChevronRight, RefreshCw, Trash2, Eye, Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";

interface NaviMessage {
  id: string;
  message: string;
  priority: string;
  created_at: string;
  sent_by: string;
  target_audience: string;
}

interface ModerationAction {
  id: string;
  action_type: string;
  reason: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  is_fake: boolean;
}

type TabType = "all" | "warnings" | "bans" | "navi";

export const SystemMessages = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [naviMessages, setNaviMessages] = useState<NaviMessage[]>([]);
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<NaviMessage | ModerationAction | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      
      // Fetch NAVI messages
      const { data: naviData } = await supabase
        .from('navi_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (naviData) {
        setNaviMessages(naviData);
      }
      
      // Fetch moderation actions for current user
      if (user?.id) {
        const { data: modData } = await supabase
          .from('moderation_actions')
          .select('*')
          .eq('target_user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (modData) {
          setModerationActions(modData);
        }
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const warnings = moderationActions.filter(a => a.action_type === 'warn');
  const bans = moderationActions.filter(a => a.action_type === 'temp_ban' || a.action_type === 'ban');

  const getFilteredItems = () => {
    switch (activeTab) {
      case "warnings":
        return warnings.map(w => ({ ...w, _type: 'warning' as const }));
      case "bans":
        return bans.map(b => ({ ...b, _type: 'ban' as const }));
      case "navi":
        return naviMessages.map(n => ({ ...n, _type: 'navi' as const }));
      default:
        return [
          ...naviMessages.map(n => ({ ...n, _type: 'navi' as const })),
          ...moderationActions.map(m => ({ ...m, _type: m.action_type === 'warn' ? 'warning' as const : 'ban' as const }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'ban': return <Ban className="w-4 h-4 text-destructive" />;
      case 'navi': return <Shield className="w-4 h-4 text-primary" />;
      default: return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const tabs = [
    { id: "all" as const, label: "All", count: naviMessages.length + moderationActions.length },
    { id: "warnings" as const, label: "Warnings", count: warnings.length, color: "text-amber-400" },
    { id: "bans" as const, label: "Bans", count: bans.length, color: "text-destructive" },
    { id: "navi" as const, label: "NAVI", count: naviMessages.length, color: "text-primary" },
  ];

  const filteredItems = getFilteredItems();

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-56 border-r border-border bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-sm">System Messages</div>
              <div className="text-xs text-muted-foreground">Alerts & Notices</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <Badge variant="secondary" className={`text-xs ${tab.color || ''}`}>
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-xs text-muted-foreground">{filteredItems.length} messages</p>
          </div>
        </div>

        {/* Messages list */}
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="font-medium text-muted-foreground">No messages</h3>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {currentUserId ? "You're all clear!" : "Sign in to see your messages"}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMessage(item as any)}
                  className={`w-full text-left p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                    selectedMessage?.id === item.id
                      ? 'bg-primary/10 border-primary/30'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item._type === 'warning' ? 'bg-amber-500/10' :
                      item._type === 'ban' ? 'bg-destructive/10' :
                      'bg-primary/10'
                    }`}>
                      {getTypeIcon(item._type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {item._type === 'warning' ? 'Warning Issued' :
                           item._type === 'ban' ? ((item as ModerationAction).is_fake ? 'Fake Ban' : 'Account Suspended') :
                           'NAVI Announcement'}
                        </span>
                        {item._type === 'navi' && (
                          <Badge className={`text-[10px] ${getPriorityColor((item as NaviMessage).priority)}`}>
                            {(item as NaviMessage).priority}
                          </Badge>
                        )}
                        {item._type === 'ban' && (item as ModerationAction).is_fake && (
                          <Badge className="text-[10px] bg-purple-500/20 text-purple-400 border-purple-500/30">
                            PRANK
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item._type === 'navi' 
                          ? (item as NaviMessage).message 
                          : (item as ModerationAction).reason}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground/70">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Detail panel */}
      {selectedMessage && (
        <div className="w-80 border-l border-border bg-card/30 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Details</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSelectedMessage(null)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Type badge */}
              <div className="flex items-center gap-2">
                {getTypeIcon((selectedMessage as any)._type)}
                <span className="font-medium">
                  {(selectedMessage as any)._type === 'warning' ? 'Warning' :
                   (selectedMessage as any)._type === 'ban' ? 'Ban' : 'NAVI Message'}
                </span>
              </div>

              {/* Message content */}
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm">
                  {(selectedMessage as any)._type === 'navi'
                    ? (selectedMessage as NaviMessage).message
                    : (selectedMessage as ModerationAction).reason}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Received:</span>
                  <span>{format(new Date(selectedMessage.created_at), 'MMM d, yyyy HH:mm')}</span>
                </div>

                {(selectedMessage as any)._type === 'navi' && (
                  <div className="flex items-center gap-2 text-xs">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge className={`text-[10px] ${getPriorityColor((selectedMessage as NaviMessage).priority)}`}>
                      {(selectedMessage as NaviMessage).priority}
                    </Badge>
                  </div>
                )}

                {(selectedMessage as any)._type === 'ban' && (selectedMessage as ModerationAction).expires_at && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Expires:</span>
                    <span>{format(new Date((selectedMessage as ModerationAction).expires_at!), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                )}

                {(selectedMessage as any)._type === 'ban' && (selectedMessage as ModerationAction).is_fake && (
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-xs text-purple-400">
                      This was a prank ban and did not affect your account.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
