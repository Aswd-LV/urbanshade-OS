import { useState, useEffect } from "react";
import { Users, Trophy, Award, Calendar, Search, Star, MessageSquare, Clock, Medal, Lock, Check, Bell, PartyPopper, Wrench, Megaphone, Shield, Crown, Heart, UserPlus, ChevronRight, Loader2, WifiOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useLeaderboards, LeaderboardEntry } from "@/hooks/useLeaderboards";
import { useAchievements } from "@/hooks/useAchievements";
import { useUserProfiles, UserProfile } from "@/hooks/useUserProfiles";
import { useFriends } from "@/hooks/useFriends";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { supabase } from "@/integrations/supabase/client";
import { Achievement, getRarityColor, getRarityBgColor } from "@/lib/achievements";
import { toast } from "sonner";

type MainTab = "directory" | "leaderboards" | "achievements" | "events";

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

export const PersonnelCenter = () => {
  const [mainTab, setMainTab] = useState<MainTab>("directory");
  const [userId, setUserId] = useState<string | undefined>();
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-3 bg-muted/20">
        <div className="flex items-center gap-3 mb-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Personnel Center</h1>
        </div>
        
        <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)}>
          <TabsList className="w-full grid grid-cols-4 h-9">
            <TabsTrigger value="directory" className="text-xs gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="leaderboards" className="text-xs gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Leaderboards
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Events
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {mainTab === "directory" && <DirectoryTab />}
        {mainTab === "leaderboards" && <LeaderboardsTab />}
        {mainTab === "achievements" && <AchievementsTab userId={userId} />}
        {mainTab === "events" && <EventsTab />}
      </div>
    </div>
  );
};

// ============ DIRECTORY TAB ============
const DirectoryTab = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "staff">("all");
  const [selected, setSelected] = useState<UserProfile | null>(null);
  
  const { profiles, loading } = useUserProfiles();
  const { friends, sendFriendRequest, isFriend, hasPendingRequest, isLoading: friendsLoading } = useFriends();
  const { user, isOnlineMode } = useOnlineAccount();

  const filteredProfiles = profiles.filter(profile => {
    if (user && profile.user_id === user.id) return false;
    
    const matchesSearch = 
      profile.username.toLowerCase().includes(search.toLowerCase()) ||
      (profile.display_name?.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (filter === "online") return profile.is_online;
    if (filter === "staff") return profile.user_role === "admin" || profile.user_role === "moderator" || profile.user_role === "creator";
    
    return true;
  });

  const getRoleBadge = (userRole?: string, isVip?: boolean) => {
    const badges = [];
    
    if (userRole === "creator") {
      badges.push(
        <Badge key="creator" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5">
          <Crown className="w-3 h-3 mr-0.5" />
          Creator
        </Badge>
      );
    } else if (userRole === "admin") {
      badges.push(
        <Badge key="admin" className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5">
          <Shield className="w-3 h-3 mr-0.5" />
          Admin
        </Badge>
      );
    } else if (userRole === "moderator") {
      badges.push(
        <Badge key="mod" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5">
          <Shield className="w-3 h-3 mr-0.5" />
          Mod
        </Badge>
      );
    }
    
    if (isVip) {
      badges.push(
        <Badge key="vip" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px] px-1.5">
          <Star className="w-3 h-3 mr-0.5" />
          VIP
        </Badge>
      );
    }
    
    return badges;
  };

  const handleAddFriend = async (userId: string) => {
    if (!isOnlineMode) {
      toast.error("Sign in to add friends");
      return;
    }
    
    const result = await sendFriendRequest(userId);
    if (result.success) {
      toast.success("Friend request sent!");
    } else {
      toast.error(result.error || "Failed to send request");
    }
  };

  if (!isOnlineMode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <WifiOff className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-medium text-lg">Sign in Required</p>
        <p className="text-sm mt-1">Go to Settings → Account to sign in</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* User List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
          
          <div className="flex gap-1">
            {["all", "online", "staff"].map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "ghost"}
                className="text-xs h-7 flex-1"
                onClick={() => setFilter(f as any)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
              Loading users...
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No users found
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredProfiles.map((profile) => (
                <button
                  key={profile.user_id}
                  onClick={() => setSelected(profile)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                    selected?.user_id === profile.user_id 
                      ? "bg-primary/10 border border-primary/30" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                      {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                      profile.is_online ? "bg-green-500" : "bg-muted-foreground/50"
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {profile.display_name || profile.username}
                      </span>
                      {getRoleBadge(profile.user_role, profile.is_vip)}
                    </div>
                    <div className="text-xs text-muted-foreground">@{profile.username}</div>
                  </div>
                  
                  {isFriend(profile.user_id) && (
                    <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                  )}
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* User Details */}
      <div className="flex-1 p-4">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {(selected.display_name || selected.username).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold">{selected.display_name || selected.username}</span>
                  {getRoleBadge(selected.user_role, selected.is_vip)}
                </div>
                <div className="text-sm text-muted-foreground">@{selected.username}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                selected.is_online ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
              }`}>
                {selected.is_online ? "Online" : "Offline"}
              </div>
            </div>

            {selected.bio && (
              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <p className="text-sm text-muted-foreground">{selected.bio}</p>
              </div>
            )}

            <div className="flex gap-2">
              {isFriend(selected.user_id) ? (
                <Button variant="outline" className="flex-1" disabled>
                  <Heart className="w-4 h-4 mr-2 fill-red-400 text-red-400" />
                  Friends
                </Button>
              ) : hasPendingRequest(selected.user_id) ? (
                <Button variant="outline" className="flex-1" disabled>
                  <Clock className="w-4 h-4 mr-2" />
                  Request Pending
                </Button>
              ) : (
                <Button 
                  className="flex-1"
                  onClick={() => handleAddFriend(selected.user_id)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Users className="w-12 h-12 mb-3 opacity-50" />
            <p>Select a user to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ LEADERBOARDS TAB ============
const LeaderboardsTab = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "achievements" | "social" | "veteran">("chat");
  
  const { entries: chatEntries, loading: chatLoading } = useLeaderboards("chat");
  const { entries: achievementEntries, loading: achievementLoading } = useLeaderboards("achievements");
  const { entries: socialEntries, loading: socialLoading } = useLeaderboards("social");
  const { entries: veteranEntries, loading: veteranLoading } = useLeaderboards("veteran");

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30";
    return "bg-muted/30 border-border";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">#{rank}</span>;
  };

  const LeaderboardList = ({ 
    data, 
    loading,
    valueKey, 
    valueLabel 
  }: { 
    data: LeaderboardEntry[]; 
    loading: boolean;
    valueKey: keyof LeaderboardEntry; 
    valueLabel: string;
  }) => (
    <ScrollArea className="h-[350px]">
      {loading ? (
        <div className="p-4 text-center text-muted-foreground">Loading...</div>
      ) : data.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No data yet</div>
      ) : (
        <div className="p-3 space-y-2">
          {data.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${getRankStyle(index + 1)}`}
            >
              <div className="flex-shrink-0">{getRankBadge(index + 1)}</div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                {(entry.display_name || entry.username || "?").charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {entry.display_name || entry.username}
                </div>
                <div className="text-xs text-muted-foreground">@{entry.username}</div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {typeof entry[valueKey] === 'number' ? entry[valueKey].toLocaleString() : entry[valueKey] || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase">{valueLabel}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );

  const veteranWithDays = veteranEntries.map(entry => ({
    ...entry,
    days_member: Math.floor((Date.now() - new Date(entry.member_since).getTime()) / (1000 * 60 * 60 * 24))
  }));

  return (
    <div className="p-4 h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="chat" className="text-xs gap-1">
            <MessageSquare className="w-3 h-3" />
            Chatters
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs gap-1">
            <Award className="w-3 h-3" />
            Achievers
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs gap-1">
            <Users className="w-3 h-3" />
            Social
          </TabsTrigger>
          <TabsTrigger value="veteran" className="text-xs gap-1">
            <Clock className="w-3 h-3" />
            Veterans
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 border border-border rounded-lg overflow-hidden">
          <TabsContent value="chat" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Top Chatters</h2>
              <p className="text-xs text-muted-foreground">Most active in global chat</p>
            </div>
            <LeaderboardList data={chatEntries} loading={chatLoading} valueKey="total_chat_messages" valueLabel="messages" />
          </TabsContent>
          
          <TabsContent value="achievements" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Achievement Hunters</h2>
              <p className="text-xs text-muted-foreground">Most achievements unlocked</p>
            </div>
            <LeaderboardList data={achievementEntries} loading={achievementLoading} valueKey="achievement_count" valueLabel="achievements" />
          </TabsContent>
          
          <TabsContent value="social" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Most Social</h2>
              <p className="text-xs text-muted-foreground">Most friends added</p>
            </div>
            <LeaderboardList data={socialEntries} loading={socialLoading} valueKey="friend_count" valueLabel="friends" />
          </TabsContent>
          
          <TabsContent value="veteran" className="m-0 h-full">
            <div className="p-3 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Veterans</h2>
              <p className="text-xs text-muted-foreground">Longest-standing members</p>
            </div>
            <ScrollArea className="h-[350px]">
              {veteranLoading ? (
                <div className="p-4 text-center text-muted-foreground">Loading...</div>
              ) : veteranWithDays.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No data yet</div>
              ) : (
                <div className="p-3 space-y-2">
                  {veteranWithDays.map((entry, index) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${getRankStyle(index + 1)}`}
                    >
                      <div className="flex-shrink-0">{getRankBadge(index + 1)}</div>
                      
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                        {(entry.display_name || entry.username || "?").charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{entry.display_name || entry.username}</div>
                        <div className="text-xs text-muted-foreground">@{entry.username}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{entry.days_member}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">days</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// ============ ACHIEVEMENTS TAB ============
type AchievementCategory = Achievement['category'];

const AchievementsTab = ({ userId }: { userId?: string }) => {
  const [category, setCategory] = useState<AchievementCategory | "all">("all");
  const { getAllWithStatus, getProgress, totalPoints, loading } = useAchievements(userId);

  const achievements = getAllWithStatus();
  const progress = getProgress();

  const filteredAchievements = category === "all" 
    ? achievements 
    : achievements.filter(a => a.category === category);

  const categories: { value: AchievementCategory | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "onboarding", label: "Start" },
    { value: "social", label: "Social" },
    { value: "contribution", label: "Contrib" },
    { value: "longevity", label: "Time" },
    { value: "special", label: "Special" },
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-foreground">{totalPoints} pts</span>
        </div>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="text-sm font-medium text-foreground">{progress.unlocked} / {progress.total}</span>
        </div>
        <Progress value={progress.percentage} className="h-2" />
      </div>

      <Tabs value={category} onValueChange={(v) => setCategory(v as any)} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-6 mb-4 h-8">
          {categories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-[10px]">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 gap-2 pr-4">
              {filteredAchievements.map((achievement) => {
                const isUnlocked = achievement.unlocked;
                
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                      isUnlocked 
                        ? `${getRarityBgColor(achievement.rarity)} border-primary/30` 
                        : "bg-muted/20 border-border opacity-60"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      isUnlocked ? "bg-primary/20" : "bg-muted"
                    }`}>
                      {isUnlocked ? achievement.icon : <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                          {achievement.name}
                        </span>
                        <Badge variant="outline" className={`text-[9px] px-1 ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </Badge>
                        {isUnlocked && <Check className="w-3.5 h-3.5 text-green-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-bold ${isUnlocked ? "text-primary" : "text-muted-foreground"}`}>
                        +{achievement.points}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
};

// ============ EVENTS TAB ============
const EventsTab = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
    
    const channel = supabase
      .channel('events-changes-pc')
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
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex flex-wrap gap-2 mb-4">
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
  );
};
