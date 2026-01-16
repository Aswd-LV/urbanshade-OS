import { useState, useEffect } from "react";
import { Mail, Star, Trash2, AlertTriangle, Send, X, Users, RefreshCw, Cloud, LogIn, Loader2, Clock, Crown, Shield, Sparkles, Bot, UserPlus, UserCheck, Heart, Inbox, Reply, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useMessages, Message } from "@/hooks/useMessages";
import { useFriends } from "@/hooks/useFriends";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { ProfilePopover } from "@/components/shared/ProfilePopover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Badge component for Admin/Creator/VIP/Bot
const UserBadge = ({ username, role, isVip, isBot }: { username: string; role?: string; isVip?: boolean; isBot?: boolean }) => {
  const isCreator = username.toLowerCase() === 'aswd';
  const isAdmin = role === 'admin';
  const isNaviBot = username.toLowerCase() === 'navi' || username.toLowerCase() === 'system' || isBot;
  
  if (isCreator) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 ml-1">
        <Crown className="w-3 h-3" />
        Creator
      </span>
    );
  }
  
  if (isNaviBot) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 ml-1">
        <Bot className="w-3 h-3" />
        Bot
      </span>
    );
  }
  
  if (isAdmin) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 ml-1">
        <Shield className="w-3 h-3" />
        Admin
      </span>
    );
  }
  
  if (isVip) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 ml-1">
        <Sparkles className="w-3 h-3" />
        VIP
      </span>
    );
  }
  
  return null;
};

// Quick reactions for messages
const REACTIONS = ["👍", "❤️", "😊", "🎉", "👀"];

export const Messages = () => {
  const { user, isOnlineMode } = useOnlineAccount();
  const { 
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
  } = useMessages();
  
  const {
    friends,
    pendingRequests,
    isLoading: friendsLoading,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    isFriend
  } = useFriends();

  const [selected, setSelected] = useState<Message | null>(null);
  const [composing, setComposing] = useState(false);
  const [leftTab, setLeftTab] = useState<"inbox" | "friends" | "users">("inbox");
  const [compose, setCompose] = useState({ 
    to: "", 
    toUserId: "",
    subject: "", 
    body: "", 
    priority: "normal" as Message["priority"] 
  });
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showAswdPopup, setShowAswdPopup] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [starredLocal, setStarredLocal] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Load starred messages and reactions from localStorage
  useEffect(() => {
    const savedStarred = localStorage.getItem('urbanshade_starred_messages');
    if (savedStarred) {
      setStarredLocal(new Set(JSON.parse(savedStarred)));
    }
    const savedReactions = localStorage.getItem('urbanshade_message_reactions');
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions));
    }
  }, []);

  // Show rate limit dialog when blocked
  useEffect(() => {
    if (isRateLimited) {
      setShowRateLimitDialog(true);
    }
  }, [isRateLimited]);

  const isLoggedIn = isOnlineMode && user && supabase;

  const handleRefresh = () => {
    fetchMessages();
    fetchUsers();
    toast.success("Messages refreshed");
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchMessages();
      fetchUsers();
    }
  }, [isLoggedIn, fetchMessages, fetchUsers]);

  const toggleStar = (id: string) => {
    const newStarred = new Set(starredLocal);
    if (newStarred.has(id)) {
      newStarred.delete(id);
    } else {
      newStarred.add(id);
    }
    setStarredLocal(newStarred);
    localStorage.setItem('urbanshade_starred_messages', JSON.stringify([...newStarred]));
  };

  const addReaction = (messageId: string, emoji: string) => {
    const newReactions = { ...reactions };
    if (!newReactions[messageId]) {
      newReactions[messageId] = [];
    }
    if (newReactions[messageId].includes(emoji)) {
      newReactions[messageId] = newReactions[messageId].filter(e => e !== emoji);
    } else {
      newReactions[messageId] = [...newReactions[messageId], emoji];
    }
    setReactions(newReactions);
    localStorage.setItem('urbanshade_message_reactions', JSON.stringify(newReactions));
  };

  const handleSelectMessage = async (msg: Message) => {
    setSelected(msg);
    setComposing(false);
    setReplyingTo(null);
    if (!msg.read_at) {
      await markAsRead(msg.id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
    if (selected?.id === id) setSelected(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-destructive";
      case "high": return "text-yellow-500";
      default: return "text-primary";
    }
  };

  const selectRecipient = (userId: string, username: string) => {
    setCompose(prev => ({ ...prev, to: username, toUserId: userId }));
    setComposing(true);
    setSelected(null);
    setReplyingTo(null);
    
    if (username.toLowerCase() === 'aswd') {
      setShowAswdPopup(true);
    }
  };

  const handleReply = (msg: Message) => {
    const senderName = msg.sender_profile?.display_name || msg.sender_profile?.username || "Unknown";
    const senderId = msg.sender_id;
    setReplyingTo(msg);
    setCompose({
      to: senderName,
      toUserId: senderId,
      subject: `Re: ${msg.subject}`,
      body: "",
      priority: "normal"
    });
    setComposing(true);
    setSelected(null);
  };

  const handleSendMessage = async () => {
    if (!compose.toUserId || !compose.subject || !compose.body) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (compose.body.length > 750) {
      toast.error("Message too long! Max 750 characters.");
      return;
    }

    setIsSending(true);
    
    // Include reply quote if replying
    let finalBody = compose.body;
    if (replyingTo) {
      const quotedText = replyingTo.body.slice(0, 100) + (replyingTo.body.length > 100 ? '...' : '');
      finalBody = `> ${quotedText}\n\n${compose.body}`;
    }
    
    const result = await sendMessage(compose.toUserId, compose.subject, finalBody, compose.priority);
    setIsSending(false);

    if (result.success) {
      toast.success("Message sent!");
      setCompose({ to: "", toUserId: "", subject: "", body: "", priority: "normal" });
      setComposing(false);
      setReplyingTo(null);
    } else if (result.error === 'rate_limited') {
      setShowRateLimitDialog(true);
    } else {
      toast.error(result.error || "Failed to send message");
    }
  };

  const handleFriendRequest = async (userId: string) => {
    const result = await sendFriendRequest(userId);
    if (result.success) {
      toast.success("Friend request sent!");
    } else {
      toast.error(result.error || "Failed to send friend request");
    }
  };

  const handleAcceptFriend = async (friendshipId: string) => {
    const result = await acceptFriendRequest(friendshipId);
    if (result.success) {
      toast.success("Friend request accepted!");
    } else {
      toast.error(result.error || "Failed to accept friend request");
    }
  };

  const handleDeclineFriend = async (friendshipId: string) => {
    const result = await declineFriendRequest(friendshipId);
    if (result.success) {
      toast.info("Friend request declined");
    } else {
      toast.error(result.error || "Failed to decline friend request");
    }
  };

  const unreadCount = messages.filter(m => !m.read_at).length;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRemainingBlockTime = () => {
    if (!blockedUntil) return "1 hour";
    const now = new Date();
    const diff = blockedUntil.getTime() - now.getTime();
    const mins = Math.ceil(diff / 60000);
    if (mins <= 0) return "shortly";
    if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''}`;
    return `${Math.ceil(mins / 60)} hour${Math.ceil(mins / 60) > 1 ? 's' : ''}`;
  };

  const isNaviBroadcast = (msg: Message) => {
    return (msg as any).message_type === 'navi_broadcast';
  };

  const getFriendUser = (friend: any) => {
    const currentUserId = user?.id;
    if (friend.user_id === currentUserId) {
      return friend.friend_profile;
    }
    return friend.user_profile;
  };

  // Not logged in view
  if (!isLoggedIn) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Cloud className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Cloud Messages</h2>
          <p className="text-muted-foreground mb-6">
            Connect to a cloud account to send and receive messages from other UrbanShade users.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/acc-manage/general'}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Connect to Cloud
            </Button>
            <p className="text-xs text-muted-foreground">
              Go to Account Settings to sign in or create an account
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Rate Limit Dialog */}
      <Dialog open={showRateLimitDialog} onOpenChange={setShowRateLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Rate Limited
            </DialogTitle>
            <DialogDescription>
              You've been sending messages too quickly. To prevent spam, messaging has been temporarily disabled.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>You can send messages again in <strong>{getRemainingBlockTime()}</strong></span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowRateLimitDialog(false)}>Understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aswd (Creator) Popup */}
      <Dialog open={showAswdPopup} onOpenChange={setShowAswdPopup}>
        <DialogContent className="bg-gradient-to-br from-background to-yellow-950/20 border-yellow-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <Crown className="w-5 h-5" />
              You're messaging the Creator!
            </DialogTitle>
            <DialogDescription>
              You've selected Aswd, the creator and developer of UrbanShade OS.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-sm space-y-2">
              <p className="text-foreground">
                <strong className="text-yellow-400">Hey there! 👋</strong> Thanks for reaching out to the creator.
              </p>
              <p className="text-muted-foreground text-xs">
                Aswd personally reads every message (when he can). Be nice, be clear, and he'll get back to you when possible!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAswdPopup(false)} className="bg-yellow-600 hover:bg-yellow-500">
              Got it, let's compose!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Left Panel - Inbox/Friends/Users */}
      <div className="w-80 border-r border-border flex flex-col bg-card/30">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Messages</h2>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <div className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {unreadCount}
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={() => { setComposing(true); setSelected(null); setReplyingTo(null); }} 
            className="w-full" 
            size="sm"
            disabled={isRateLimited}
          >
            <Send className="w-4 h-4 mr-2" />
            Compose
          </Button>
          
          {pendingCount > 0 && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pendingCount}/3 pending messages
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={leftTab} onValueChange={(v) => setLeftTab(v as any)} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mx-2 mt-2">
            <TabsTrigger value="inbox" className="text-xs gap-1">
              <Inbox className="w-3 h-3" />
              Inbox
            </TabsTrigger>
            <TabsTrigger value="friends" className="text-xs gap-1">
              <Heart className="w-3 h-3" />
              Friends
              {pendingRequests.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs gap-1">
              <Users className="w-3 h-3" />
              All
            </TabsTrigger>
          </TabsList>

          {/* Inbox Tab */}
          <TabsContent value="inbox" className="flex-1 overflow-y-auto m-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No messages yet
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={cn(
                    "p-3 border-b border-border cursor-pointer transition-colors",
                    selected?.id === msg.id ? "bg-primary/20" : "hover:bg-muted/50",
                    !msg.read_at ? "bg-primary/5" : "",
                    isNaviBroadcast(msg) ? "bg-cyan-500/5 border-l-2 border-l-cyan-500" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button 
                          className="flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <UserAvatar 
                            username={msg.sender_profile?.username || 'U'}
                            size="sm"
                            showOnlineStatus={false}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto" align="start">
                        <ProfilePopover 
                          userId={msg.sender_id}
                          username={msg.sender_profile?.username || 'Unknown'}
                          displayName={msg.sender_profile?.display_name || undefined}
                          role={msg.sender_profile?.role}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          {isNaviBroadcast(msg) && <Bot className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                          {msg.priority !== "normal" && !isNaviBroadcast(msg) && (
                            <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${getPriorityColor(msg.priority)}`} />
                          )}
                          <span className={`font-medium text-sm truncate ${!msg.read_at ? "text-primary font-bold" : ""}`}>
                            {isNaviBroadcast(msg) ? "NAVI System" : (msg.sender_profile?.display_name || msg.sender_profile?.username || "Unknown")}
                          </span>
                          {!isNaviBroadcast(msg) && (
                            <UserBadge 
                              username={msg.sender_profile?.username || ''} 
                              role={msg.sender_profile?.role} 
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(msg.id);
                            }}
                            className="hover:scale-110 transition-transform p-1"
                          >
                            <Star
                              className={`w-3 h-3 ${
                                starredLocal.has(msg.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          </button>
                          <span className="text-xs text-muted-foreground">{formatTime(msg.created_at)}</span>
                        </div>
                      </div>
                      <div className={`text-sm mb-1 truncate ${!msg.read_at ? "font-semibold" : ""}`}>
                        {msg.subject}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {msg.body.slice(0, 60)}...
                      </div>
                      {/* Reactions display */}
                      {reactions[msg.id] && reactions[msg.id].length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {reactions[msg.id].map((emoji, i) => (
                            <span key={i} className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">{emoji}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends" className="flex-1 overflow-y-auto m-0">
            {friendsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div>
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <div className="p-2 border-b border-border">
                    <div className="text-xs text-muted-foreground mb-2 font-medium">Friend Requests</div>
                    {pendingRequests.map((request) => {
                      const friendUser = getFriendUser(request);
                      return (
                        <div key={request.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 mb-1">
                          <div className="flex items-center gap-2">
                          <UserAvatar 
                              username={friendUser?.username || 'U'}
                              size="sm"
                            />
                            <span className="text-sm font-medium">{friendUser?.display_name || friendUser?.username}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => handleAcceptFriend(request.id)}>
                              <UserCheck className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-destructive" onClick={() => handleDeclineFriend(request.id)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Friends List */}
                {friends.length === 0 && pendingRequests.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No friends yet
                  </div>
                ) : (
                  friends.map((friend) => {
                    const friendUser = getFriendUser(friend);
                    return (
                      <div
                        key={friend.id}
                        className="p-3 border-b border-border hover:bg-muted/50 cursor-pointer"
                        onClick={() => selectRecipient(friendUser?.user_id || '', friendUser?.username || '')}
                      >
                        <div className="flex items-center gap-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()}>
                                <UserAvatar 
                                  username={friendUser?.username || 'U'}
                                  size="sm"
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-auto" align="start">
                              <ProfilePopover 
                                userId={friendUser?.user_id}
                                username={friendUser?.username || 'Unknown'}
                                displayName={friendUser?.display_name || undefined}
                                role={friendUser?.role || undefined}
                              />
                            </PopoverContent>
                          </Popover>
                          <div>
                            <div className="font-medium text-sm">{friendUser?.display_name || friendUser?.username}</div>
                            <div className="text-xs text-muted-foreground">@{friendUser?.username}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="flex-1 overflow-y-auto m-0">
            {users.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No users found
              </div>
            ) : (
              users.map((u) => (
                <div
                  key={u.user_id}
                  className="p-3 border-b border-border hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button>
                            <UserAvatar 
                              username={u.username || 'U'}
                              size="sm"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                          <ProfilePopover 
                            userId={u.user_id}
                            username={u.username || 'Unknown'}
                            displayName={u.display_name || undefined}
                          />
                        </PopoverContent>
                      </Popover>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{u.display_name || u.username}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">@{u.username}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7"
                        onClick={() => selectRecipient(u.user_id, u.username || '')}
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                      {!isFriend(u.user_id) && u.user_id !== user?.id && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7"
                          onClick={() => handleFriendRequest(u.user_id)}
                        >
                          <UserPlus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Message View / Compose */}
      <div className="flex-1 flex flex-col">
        {composing ? (
          // Compose View
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">
                {replyingTo ? "Reply to Message" : "New Message"}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => { setComposing(false); setReplyingTo(null); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Reply quote */}
            {replyingTo && (
              <div className="mb-3 p-3 bg-muted/30 rounded-lg border-l-2 border-primary">
                <div className="flex items-center gap-2 mb-1">
                  <Reply className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Replying to {replyingTo.sender_profile?.display_name || replyingTo.sender_profile?.username}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{replyingTo.body}</p>
              </div>
            )}
            
            <div className="space-y-3 flex-1">
              <div>
                <label className="text-xs text-muted-foreground">To</label>
                <Input 
                  value={compose.to} 
                  readOnly 
                  placeholder="Select a recipient from the left panel"
                  className="bg-muted/30"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Subject</label>
                <Input 
                  value={compose.subject}
                  onChange={(e) => setCompose(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Enter subject..."
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-xs text-muted-foreground mb-1">Message</label>
                <Textarea 
                  value={compose.body}
                  onChange={(e) => setCompose(p => ({ ...p, body: e.target.value }))}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[200px] resize-none"
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">
                  {compose.body.length}/750
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => { setComposing(false); setReplyingTo(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={isSending || isRateLimited}>
                {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Send
              </Button>
            </div>
          </div>
        ) : selected ? (
          // Message View
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button>
                        <UserAvatar 
                          username={selected.sender_profile?.username || 'U'}
                          size="md"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                      <ProfilePopover 
                        userId={selected.sender_id}
                        username={selected.sender_profile?.username || 'Unknown'}
                        displayName={selected.sender_profile?.display_name || undefined}
                        role={selected.sender_profile?.role}
                      />
                    </PopoverContent>
                  </Popover>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{selected.subject}</h3>
                      {selected.priority !== "normal" && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          selected.priority === "urgent" ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-500"
                        }`}>
                          {selected.priority}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">
                        {isNaviBroadcast(selected) ? "NAVI System" : (selected.sender_profile?.display_name || selected.sender_profile?.username)}
                      </span>
                      {!isNaviBroadcast(selected) && (
                        <UserBadge 
                          username={selected.sender_profile?.username || ''} 
                          role={selected.sender_profile?.role} 
                        />
                      )}
                      <span>•</span>
                      <span>{new Date(selected.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleReply(selected)}>
                    <Reply className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleStar(selected.id)}>
                    <Star className={`w-4 h-4 ${starredLocal.has(selected.id) ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(selected.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{selected.body}</p>
              </div>
            </div>
            
            {/* Reactions bar */}
            <div className="p-3 border-t border-border flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">React:</span>
              {REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => addReaction(selected.id, emoji)}
                  className={cn(
                    "text-lg hover:scale-125 transition-transform p-1 rounded",
                    reactions[selected.id]?.includes(emoji) && "bg-primary/20"
                  )}
                >
                  {emoji}
                </button>
              ))}
              {reactions[selected.id] && reactions[selected.id].length > 0 && (
                <div className="ml-4 flex gap-1">
                  {reactions[selected.id].map((emoji, i) => (
                    <span key={i} className="text-sm bg-muted px-2 py-1 rounded-full">{emoji}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // No message selected
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a message to read</p>
              <p className="text-sm mt-1">or compose a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
