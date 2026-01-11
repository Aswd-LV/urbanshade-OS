import { useState, useRef, useEffect } from "react";
import { 
  Bell, Check, Trash2, X, AlertTriangle, Info, CheckCircle, XCircle,
  ChevronDown, ChevronRight, BellOff, Moon, Sparkles
} from "lucide-react";
import { useNotifications, SystemNotification, NotificationType, GroupedNotifications } from "@/hooks/useNotifications";
import { useDoNotDisturb } from "@/hooks/useDoNotDisturb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLButtonElement>;
}

export const NotificationCenter = ({ open, onClose, anchorRef }: NotificationCenterProps) => {
  const { 
    filteredNotifications,
    groupedByTime, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    dismissNotification,
    clearAll,
    executeAction
  } = useNotifications();
  
  const { 
    isDndEnabled, 
    isManualDnd, 
    isScheduledDnd, 
    toggleDnd, 
    getTimeUntilEnd 
  } = useDoNotDisturb();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Just now", "Earlier today"]));
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success": return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "error": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getTypeGlow = (type: NotificationType) => {
    switch (type) {
      case "success": return "border-l-emerald-500/50 bg-emerald-500/5";
      case "warning": return "border-l-amber-500/50 bg-amber-500/5";
      case "error": return "border-l-red-500/50 bg-red-500/5";
      default: return "border-l-primary/50 bg-primary/5";
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = (notification: SystemNotification) => (
    <div
      key={notification.id}
      onClick={() => markAsRead(notification.id)}
      className={`relative p-3 rounded-lg transition-all cursor-pointer group border-l-2 ${
        getTypeGlow(notification.type)
      } ${notification.read ? "opacity-60" : ""} hover:bg-white/5`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium text-foreground truncate">
              {notification.title}
            </h4>
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                notification.persistent ? dismissNotification(notification.id) : deleteNotification(notification.id); 
              }}
              className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/70">
                {formatTime(notification.time)}
              </span>
              {notification.app && (
                <span className="text-[9px] text-muted-foreground/60 bg-white/5 px-1.5 py-0.5 rounded">
                  {notification.app}
                </span>
              )}
            </div>
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-1">
                {notification.actions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.primary ? "default" : "ghost"}
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      executeAction(notification.id, action.action);
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {!notification.read && (
        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </div>
  );

  const renderGroupedNotifications = (groups: GroupedNotifications) => {
    const nonEmptyGroups = Object.entries(groups).filter(([_, notifs]) => notifs.length > 0);
    
    if (nonEmptyGroups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary/30" />
          </div>
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs text-muted-foreground/60 mt-1">No new notifications</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {nonEmptyGroups.map(([group, notifs]) => (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-[10px] font-semibold text-muted-foreground/70 hover:text-muted-foreground transition-colors rounded"
            >
              {expandedGroups.has(group) ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span className="uppercase tracking-wider">{group}</span>
              <span className="ml-auto text-[9px] bg-white/5 px-1.5 py-0.5 rounded-full">
                {notifs.length}
              </span>
            </button>
            {expandedGroups.has(group) && (
              <div className="space-y-1 mt-1 mb-2">
                {notifs.map(renderNotification)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="fixed right-2 top-[52px] w-[360px] max-h-[calc(100vh-70px)] rounded-xl bg-background/95 backdrop-blur-2xl border border-border/40 z-[9998] shadow-2xl overflow-hidden animate-scale-in flex flex-col"
    >
      {/* Header */}
      <div className="border-b border-border/30 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-white/5 to-transparent flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-[10px] text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
        </div>
        <div className="flex gap-0.5">
          {filteredNotifications.length > 0 && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={markAllAsRead} 
                title="Mark all read"
              >
                <Check className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={clearAll} 
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* DND Banner */}
      {isDndEnabled && (
        <div className="border-b border-border/30 px-3 py-2 bg-primary/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Do Not Disturb</span>
            {isScheduledDnd && !isManualDnd && (
              <span className="text-[9px] text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded">Scheduled</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{getTimeUntilEnd()}</span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={toggleDnd}>
              {isManualDnd ? "Off" : "Override"}
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1 px-2 py-2">
        {renderGroupedNotifications(groupedByTime)}
      </ScrollArea>

      {/* Footer - DND toggle */}
      {!isDndEnabled && (
        <div className="border-t border-border/30 p-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground h-8 text-xs"
            onClick={toggleDnd}
          >
            <BellOff className="w-3.5 h-3.5" />
            Enable Do Not Disturb
          </Button>
        </div>
      )}
    </div>
  );
};
