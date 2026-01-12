import { useState, useEffect } from "react";
import { Calendar, Bell, AlertTriangle, PartyPopper, Wrench, Megaphone, Clock, Trophy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BattlePassGrid } from "@/components/BattlePassGrid";

interface SystemEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  priority: string;
  created_at: string;
}

export const EventsCalendar = ({ userId }: { userId?: string }) => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<'events' | 'battlepass'>('events');

  useEffect(() => {
    fetchEvents();
    
    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'system_events'
      }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('system_events')
        .select('*')
        .eq('is_active', true)
        .order('starts_at', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone className="w-4 h-4" />;
      case 'event': return <PartyPopper className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'celebration': return <PartyPopper className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'announcement': return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 'event': return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 'maintenance': return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 'celebration': return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return "bg-red-500/20 text-red-400";
      case 'high': return "bg-orange-500/20 text-orange-400";
      case 'normal': return "bg-primary/20 text-primary";
      case 'low': return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatEventDate = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return "No date set";
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    if (end && end.getTime() !== start.getTime()) {
      return `${start.toLocaleDateString('en-US', formatOptions)} - ${end.toLocaleDateString('en-US', formatOptions)}`;
    }
    
    return start.toLocaleDateString('en-US', formatOptions);
  };

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(e => e.event_type === filter);

  const eventTypes = [
    { value: "all", label: "All" },
    { value: "announcement", label: "Announcements" },
    { value: "event", label: "Events" },
    { value: "maintenance", label: "Maintenance" },
    { value: "celebration", label: "Celebrations" },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tabs Header */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <div className="flex-shrink-0 p-4 pb-0">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="battlepass" className="gap-2">
              <Trophy className="w-4 h-4" />
              Battle Pass
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Events Tab */}
        <TabsContent value="events" className="flex-1 m-0 overflow-hidden px-4 pb-4">
          <div className="h-full flex flex-col pt-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
              {eventTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={filter === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(type.value)}
                  className="text-xs"
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Events List */}
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">Loading events...</div>
              ) : filteredEvents.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No active events</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Check back later for updates</p>
                </div>
              ) : (
                <div className="space-y-3 pr-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border transition-all ${getEventColor(event.event_type)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center">
                          {getEventIcon(event.event_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                            <Badge variant="outline" className={`text-[9px] ${getPriorityColor(event.priority)}`}>
                              {event.priority}
                            </Badge>
                          </div>
                          
                          {event.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatEventDate(event.starts_at, event.ends_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Battle Pass Tab */}
        <TabsContent value="battlepass" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <BattlePassGrid userId={userId} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
