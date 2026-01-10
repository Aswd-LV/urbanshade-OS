import { useState, useEffect } from "react";
import { Search, Users, Wifi, WifiOff, Shield, Crown, Star, Award, MessageSquare, UserPlus, UserMinus, Flag, ChevronRight, Edit3, Check, X, Heart, Bell, UserCheck, Clock, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserProfiles, UserProfile } from "@/hooks/useUserProfiles";
import { useFriends } from "@/hooks/useFriends";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const UserDirectory = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<"all" | "online" | "staff">("all");
  const [mainTab, setMainTab] = useState<"browse" | "friends" | "profile">("browse");
  
  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  
  const { profiles, loading, refetch } = useUserProfiles();
  const { friends, pendingRequests, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, isFriend, hasPendingRequest, isLoading: friendsLoading } = useFriends();
  const { user, profile: myProfile, isOnlineMode, updateProfile } = useOnlineAccount();

  // Set profile edit values when switching to profile tab
  useEffect(() => {
    if (myProfile && mainTab === "profile") {
      setEditBio(myProfile.bio || "");
      setEditDisplayName(myProfile.display_name || "");
    }
  }, [myProfile, mainTab]);

  const filteredProfiles = profiles.filter(profile => {
    // Don't show current user in browse list
    if (user && profile.user_id === user.id) return false;
    
    const matchesSearch = 
      profile.username.toLowerCase().includes(search.toLowerCase()) ||
      (profile.display_name?.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (filter === "online") return profile.is_online;
    if (filter === "staff") return profile.user_role === "admin" || profile.user_role === "moderator" || profile.user_role === "creator";
    
    return true;
  });

  // Get friend profiles
  const friendProfiles = profiles.filter(profile => {
    return friends.some(f => 
      (f.user_id === profile.user_id && f.friend_id === user?.id) ||
      (f.friend_id === profile.user_id && f.user_id === user?.id)
    );
  });

  // Get pending request profiles (requests sent TO me)
  const pendingProfiles = profiles.filter(profile => {
    return pendingRequests.some(f => f.user_id === profile.user_id);
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

  const formatLastSeen = (lastSeen?: string | null, isOnline?: boolean) => {
    if (isOnline) return "Online now";
    if (!lastSeen) return "Unknown";
    
    const diff = Date.now() - new Date(lastSeen).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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

  const handleAcceptFriend = async (friendshipId: string) => {
    const result = await acceptFriendRequest(friendshipId);
    if (result.success) {
      toast.success("Friend request accepted!");
    } else {
      toast.error(result.error || "Failed to accept request");
    }
  };

  const handleDeclineFriend = async (friendshipId: string) => {
    const result = await declineFriendRequest(friendshipId);
    if (result.success) {
      toast("Friend request declined");
    } else {
      toast.error(result.error || "Failed to decline request");
    }
  };

  const handleRemoveFriend = async (profile: UserProfile) => {
    const friendship = friends.find(f => 
      (f.user_id === profile.user_id && f.friend_id === user?.id) ||
      (f.friend_id === profile.user_id && f.user_id === user?.id)
    );
    
    if (friendship) {
      const result = await removeFriend(friendship.id);
      if (result.success) {
        toast.success("Friend removed");
      } else {
        toast.error(result.error || "Failed to remove friend");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!isOnlineMode || !user) {
      toast.error("Sign in to edit your profile");
      return;
    }
    
    setSavingProfile(true);
    try {
      const { error } = await updateProfile({
        display_name: editDisplayName || null,
        bio: editBio || ""
      });
      
      if (error) throw error;
      
      toast.success("Profile updated!");
      setIsEditingProfile(false);
      refetch();
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const getFriendshipId = (profile: UserProfile) => {
    const friendship = friends.find(f => 
      (f.user_id === profile.user_id && f.friend_id === user?.id) ||
      (f.friend_id === profile.user_id && f.user_id === user?.id)
    );
    return friendship?.id;
  };

  const getPendingRequestId = (profile: UserProfile) => {
    const request = pendingRequests.find(f => f.user_id === profile.user_id);
    return request?.id;
  };

  const renderUserCard = (profile: UserProfile, showFriendActions = false) => (
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
        <div className="text-xs text-muted-foreground">
          @{profile.username}
        </div>
      </div>
      
      {showFriendActions && isFriend(profile.user_id) && (
        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
      )}
      
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );

  const myProfileData = profiles.find(p => p.user_id === user?.id);

  return (
    <div className="h-full flex bg-background">
      {/* Left Panel - User List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border space-y-3">
          {/* Main Tabs */}
          <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as any)}>
            <TabsList className="w-full grid grid-cols-3 h-8">
              <TabsTrigger value="browse" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Browse
              </TabsTrigger>
              <TabsTrigger value="friends" className="text-xs relative">
                <Heart className="w-3 h-3 mr-1" />
                Friends
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-xs">
                <Edit3 className="w-3 h-3 mr-1" />
                My Profile
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {mainTab === "browse" && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-muted/50"
                />
              </div>
              
              <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                <TabsList className="w-full grid grid-cols-3 h-8">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="online" className="text-xs">Online</TabsTrigger>
                  <TabsTrigger value="staff" className="text-xs">Staff</TabsTrigger>
                </TabsList>
              </Tabs>
            </>
          )}
        </div>
        
        <ScrollArea className="flex-1">
          {mainTab === "browse" && (
            <>
              {loading ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
                  Loading users...
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No users found
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredProfiles.map((profile) => renderUserCard(profile))}
                </div>
              )}
            </>
          )}
          
          {mainTab === "friends" && (
            <div className="p-2 space-y-4">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div className="space-y-2">
                  <div className="px-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Bell className="w-3 h-3" />
                    Pending Requests ({pendingRequests.length})
                  </div>
                  {pendingProfiles.map((profile) => (
                    <div key={profile.user_id} className="flex items-center gap-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                        {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{profile.display_name || profile.username}</div>
                        <div className="text-xs text-muted-foreground">@{profile.username}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        onClick={() => {
                          const reqId = getPendingRequestId(profile);
                          if (reqId) handleAcceptFriend(reqId);
                        }}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          const reqId = getPendingRequestId(profile);
                          if (reqId) handleDeclineFriend(reqId);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Friends List */}
              <div className="space-y-2">
                <div className="px-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Heart className="w-3 h-3" />
                  Friends ({friendProfiles.length})
                </div>
                {friendsLoading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
                  </div>
                ) : friendProfiles.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No friends yet</p>
                    <p className="text-xs mt-1">Browse users to add friends!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {friendProfiles.map((profile) => renderUserCard(profile, true))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {mainTab === "profile" && (
            <div className="p-4 space-y-4">
              {!isOnlineMode ? (
                <div className="text-center text-muted-foreground p-8">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Sign in to view your profile</p>
                  <p className="text-xs mt-1">Go to Settings → Account to sign in</p>
                </div>
              ) : myProfileData ? (
                <>
                  {/* Profile Preview */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                      {(editDisplayName || myProfileData.username).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold">{editDisplayName || myProfileData.username}</span>
                        {getRoleBadge(myProfileData.user_role, myProfileData.is_vip)}
                      </div>
                      <div className="text-sm text-muted-foreground">@{myProfileData.username}</div>
                    </div>
                  </div>
                  
                  {/* Edit Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Display Name</label>
                      <Input
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        placeholder="Enter display name..."
                        className="bg-muted/50"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Bio</label>
                      <Textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Tell others about yourself..."
                        className="bg-muted/50 min-h-[100px] resize-none"
                        maxLength={250}
                      />
                      <div className="text-xs text-muted-foreground text-right mt-1">
                        {editBio.length}/250
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-full">
                      {savingProfile ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <div className="text-lg font-bold text-primary">{myProfileData.total_chat_messages || 0}</div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <div className="text-lg font-bold text-primary">{myProfileData.friend_count || 0}</div>
                      <div className="text-xs text-muted-foreground">Friends</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <div className="text-lg font-bold text-primary">{myProfileData.achievement_count || 0}</div>
                      <div className="text-xs text-muted-foreground">Achievements</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 text-center">
                      <div className="text-lg font-bold text-primary">
                        {new Date(myProfileData.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                      </div>
                      <div className="text-xs text-muted-foreground">Joined</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" />
                  <p className="text-sm">Loading profile...</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{profiles.length} registered users</span>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Profile View */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {(selected.display_name || selected.username).charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                    selected.is_online ? "bg-green-500" : "bg-muted-foreground/50"
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-foreground">
                      {selected.display_name || selected.username}
                    </h2>
                    {getRoleBadge(selected.user_role, selected.is_vip)}
                  </div>
                  <p className="text-muted-foreground">@{selected.username}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    {selected.is_online ? (
                      <span className="flex items-center gap-1 text-green-400">
                        <Wifi className="w-3 h-3" />
                        Online
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <WifiOff className="w-3 h-3" />
                        {formatLastSeen(selected.last_seen, false)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              {selected.bio && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-foreground">{selected.bio}</p>
                </div>
              )}
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.total_chat_messages || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Chat Messages</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.total_messages || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">DMs Sent</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.achievement_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Achievements</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-2xl font-bold text-primary">
                    {selected.friend_count || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Friends</div>
                </div>
              </div>
              
              {/* Member Since */}
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Member since {new Date(selected.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </div>
              
              {/* Actions */}
              {user && selected.user_id !== user.id && (
                <div className="flex gap-2">
                  {isFriend(selected.user_id) ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleRemoveFriend(selected)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Remove Friend
                    </Button>
                  ) : hasPendingRequest(selected.user_id) ? (
                    <Button size="sm" variant="outline" className="flex-1" disabled>
                      <Clock className="w-4 h-4 mr-2" />
                      Request Pending
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleAddFriend(selected.user_id)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Friend
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Show if this is your own profile */}
              {user && selected.user_id === user.id && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <p className="text-sm text-primary">This is you!</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setMainTab("profile")}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Select a user to view their profile</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
