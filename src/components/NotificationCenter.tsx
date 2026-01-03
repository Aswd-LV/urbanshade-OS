import { useState } from "react";
import { 
  Bell, Check, Trash2, X, AlertTriangle, Info, CheckCircle, XCircle,
  Filter, Clock, AppWindow, ChevronDown, ChevronRight, BellOff, Moon,
  Volume2, VolumeX, Pin, Zap
} from "lucide-react";
import { useNotifications, SystemNotification, NotificationType, GroupedNotifications } from "@/hooks/useNotifications";
import { useDoNotDisturb } from "@/hooks/useDoNotDisturb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ open, onClose }: NotificationCenterProps) => {
  const { 
    filteredNotifications,
    groupedByTime, 
    groupedByApp,
    availableApps,
    unreadCount, 
    persistentCount,
    filters,
    setFilters,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    dismissNotification,
    clearAll,
    clearByApp,
    executeAction
  } = useNotifications();
  
  const { 
    isDndEnabled, 
    isManualDnd, 
    isScheduledDnd, 
    toggleDnd, 
    getTimeUntilEnd,
    settings 
  } = useDoNotDisturb();

  const [groupBy, setGroupBy] = useState<"time" | "app">("time");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Just now", "Earlier today"]));

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
      case "success": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority || priority === "normal" || priority === "low") return null;
    if (priority === "high") return <Badge variant="outline" className="text-[10px] px-1 py-0 text-yellow-400 border-yellow-400/50">High</Badge>;
    if (priority === "urgent") return <Badge variant="destructive" className="text-[10px] px-1 py-0">Urgent</Badge>;
    return null;
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
      className={`p-3 rounded-lg border transition-all cursor-pointer group ${
        notification.read 
          ? "bg-muted/20 border-border/30" 
          : "bg-primary/5 border-primary/30"
      } ${notification.persistent ? "border-l-2 border-l-yellow-500" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className={`text-sm font-semibold truncate ${!notification.read && "text-primary"}`}>
                {notification.title}
              </h3>
              {notification.persistent && <Pin className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
              {getPriorityBadge(notification.priority)}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {notification.persistent ? (
                <button
                  onClick={(e) => { e.stopPropagation(); dismissNotification(notification.id); }}
                  className="p-1 hover:bg-muted rounded"
                  title="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  className="p-1 hover:bg-destructive/20 rounded"
                  title="Delete"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">
                {formatTime(notification.time)}
              </span>
              {notification.app && (
                <span className="text-[10px] text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded">
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
                    className="h-6 text-xs px-2"
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
    </div>
  );

  const renderGroupedNotifications = (groups: GroupedNotifications) => {
    const nonEmptyGroups = Object.entries(groups).filter(([_, notifs]) => notifs.length > 0);
    
    if (nonEmptyGroups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
          <Bell className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">No notifications</p>
          {filters.unreadOnly && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setFilters({ ...filters, unreadOnly: false })}
              className="mt-2"
            >
              Show all notifications
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="p-2 space-y-3">
        {nonEmptyGroups.map(([group, notifs]) => (
          <div key={group}>
            <div className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
              <button
                onClick={() => toggleGroup(group)}
                className="flex items-center gap-2 flex-1"
              >
                {expandedGroups.has(group) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <span>{group}</span>
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  {notifs.length}
                </Badge>
              </button>
              {groupBy === "app" && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearByApp(group); }}
                  className="p-1 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100"
                  title={`Clear all from ${group}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
            {expandedGroups.has(group) && (
              <div className="space-y-2 mt-1">
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
    <div className="fixed right-3 bottom-[52px] w-[400px] h-[560px] rounded-xl backdrop-blur-2xl bg-background/95 border border-border/50 z-[900] shadow-2xl overflow-hidden animate-slide-in-right flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 p-4 flex items-center justify-between bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="h-5">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {/* Filter Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Filter className="w-4 h-4" />
                {(filters.type || filters.app || filters.unreadOnly) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.unreadOnly}
                onCheckedChange={(checked) => setFilters({ ...filters, unreadOnly: checked })}
              >
                Unread only
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Time</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filters.timeRange === "today"}
                onCheckedChange={(checked) => setFilters({ ...filters, timeRange: checked ? "today" : "all" })}
              >
                Today
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.timeRange === "week"}
                onCheckedChange={(checked) => setFilters({ ...filters, timeRange: checked ? "week" : "all" })}
              >
                This week
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Type</DropdownMenuLabel>
              {(["info", "success", "warning", "error"] as NotificationType[]).map(type => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filters.type === type}
                  onCheckedChange={(checked) => setFilters({ ...filters, type: checked ? type : undefined })}
                >
                  <span className="capitalize">{type}</span>
                </DropdownMenuCheckboxItem>
              ))}
              {filters.app && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilters({ ...filters, app: undefined })}>
                    Clear app filter
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ timeRange: "all", unreadOnly: false })}>
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {filteredNotifications.length > 0 && (
            <>
              <Button variant="ghost" size="icon" onClick={markAllAsRead} title="Mark all read">
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={clearAll} title="Clear all">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* DND Status Banner */}
      {isDndEnabled && (
        <div className="border-b border-border/50 px-4 py-2 bg-muted/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Moon className="w-4 h-4 text-primary" />
            <span className="font-medium">Do Not Disturb</span>
            {isScheduledDnd && !isManualDnd && (
              <Badge variant="outline" className="text-[10px]">Scheduled</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{getTimeUntilEnd()}</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={toggleDnd}>
              {isManualDnd ? "Turn off" : "Override"}
            </Button>
          </div>
        </div>
      )}

      {/* Tabs for grouping */}
      <Tabs defaultValue="time" className="flex-1 flex flex-col min-h-0" onValueChange={(v) => setGroupBy(v as "time" | "app")}>
        <TabsList className="mx-4 mt-2 flex-shrink-0">
          <TabsTrigger value="time" className="flex-1 gap-1">
            <Clock className="w-3 h-3" />
            By Time
          </TabsTrigger>
          <TabsTrigger value="app" className="flex-1 gap-1">
            <AppWindow className="w-3 h-3" />
            By App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="time" className="flex-1 mt-0 min-h-0">
          <ScrollArea className="h-full">
            {renderGroupedNotifications(groupedByTime)}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="app" className="flex-1 mt-0 min-h-0">
          <ScrollArea className="h-full">
            {renderGroupedNotifications(groupedByApp)}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Quick DND Toggle */}
      {!isDndEnabled && (
        <div className="border-t border-border/50 p-2 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={toggleDnd}
          >
            <BellOff className="w-4 h-4" />
            Enable Do Not Disturb
          </Button>
        </div>
      )}
    </div>
  );
};
