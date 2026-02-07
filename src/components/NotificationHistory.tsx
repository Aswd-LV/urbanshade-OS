import { useState } from "react";
import { 
  History, Search, Trash2, X, AlertTriangle, Info, CheckCircle, XCircle,
  Clock
} from "lucide-react";
import { useNotifications, NotificationType } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NotificationHistory = () => {
  const { 
    notifications,
    deleteNotification,
    clearAll
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Get all notifications including dismissed ones for history view
  const allNotifications = notifications;

  // Filter notifications
  const filteredNotifications = allNotifications.filter(n => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!n.title.toLowerCase().includes(query) && !n.message.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Type filter
    if (typeFilter !== "all" && n.type !== typeFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const notifDate = new Date(n.time);
      const now = new Date();
      
      if (dateFilter === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (notifDate < startOfDay) return false;
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (notifDate < weekAgo) return false;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (notifDate < monthAgo) return false;
      }
    }

    return true;
  });

  const getIcon = (type: NotificationType) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case "success": return <CheckCircle className={`${iconClass} text-emerald-400`} />;
      case "warning": return <AlertTriangle className={`${iconClass} text-amber-400`} />;
      case "error": return <XCircle className={`${iconClass} text-red-400`} />;
      default: return <Info className={`${iconClass} text-primary`} />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    const baseClasses = "px-1.5 py-0.5 rounded text-[10px] font-medium uppercase";
    switch (type) {
      case "success": return `${baseClasses} bg-emerald-500/20 text-emerald-400`;
      case "warning": return `${baseClasses} bg-amber-500/20 text-amber-400`;
      case "error": return `${baseClasses} bg-red-500/20 text-red-400`;
      default: return `${baseClasses} bg-primary/20 text-primary`;
    }
  };

  const formatDate = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Notification History</h2>
            <p className="text-xs text-muted-foreground">{allNotifications.length} total notifications</p>
          </div>
          {allNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={clearAll}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as any)}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notification List */}
      <ScrollArea className="flex-1">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
              <History className="w-6 h-6 text-primary/30" />
            </div>
            <p className="text-sm font-medium text-foreground/80">No notifications found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {searchQuery ? "Try a different search term" : "Your notification history is empty"}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  relative p-3 rounded-lg transition-all group 
                  bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-border
                  ${notification.dismissed ? "opacity-50" : ""}
                `}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-foreground leading-tight">
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={getTypeBadge(notification.type)}>{notification.type}</span>
                      {notification.app && (
                        <span className="text-[10px] text-muted-foreground/60 bg-white/5 px-1.5 py-0.5 rounded">
                          {notification.app}
                        </span>
                      )}
                      {notification.dismissed && (
                        <span className="text-[10px] text-muted-foreground/60 bg-white/5 px-1.5 py-0.5 rounded">
                          Dismissed
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 ml-auto">
                        <Clock className="w-3 h-3" />
                        {formatDate(notification.time)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
