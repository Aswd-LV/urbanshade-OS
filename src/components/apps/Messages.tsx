import { useState, useEffect } from "react";
import { Mail, Star, Trash2, AlertTriangle, Send, X, Users, RefreshCw, Cloud, LogIn, Loader2, Clock, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMessages, Message } from "@/hooks/useMessages";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { supabase } from "@/integrations/supabase/client";

// Badge component for Admin/Creator
const UserBadge = ({ username, role }: { username: string; role?: string }) => {
  const isCreator = username.toLowerCase() === 'aswd';
  const isAdmin = role === 'admin';
  
  if (isCreator) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 ml-1">
        <Crown className="w-3 h-3" />
        Creator
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
  
  return null;
};

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

  const [selected, setSelected] = useState<Message | null>(null);
  const [composing, setComposing] = useState(false);
  const [compose, setCompose] = useState({ 
    to: "", 
    toUserId: "",
    subject: "", 
    body: "", 
    priority: "normal" as Message["priority"] 
  });
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showRateLimitDialog, setShowRateLimitDialog] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [starredLocal, setStarredLocal] = useState<Set<string>>(new Set());

  // Load starred messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('urbanshade_starred_messages');
    if (saved) {
      setStarredLocal(new Set(JSON.parse(saved)));
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
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
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

  const handleSelectMessage = async (msg: Message) => {
    setSelected(msg);
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
    setShowUserPicker(false);
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
    const result = await sendMessage(compose.toUserId, compose.subject, compose.body, compose.priority);
    setIsSending(false);

    if (result.success) {
      toast.success("Message sent!");
      setCompose({ to: "", toUserId: "", subject: "", body: "", priority: "normal" });
      setComposing(false);
    } else if (result.error === 'rate_limited') {
      setShowRateLimitDialog(true);
    } else {
      toast.error(result.error || "Failed to send message");
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

      {/* Message List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border bg-card/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Inbox</h2>
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
                className="h-8 w-8"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => { setComposing(true); setSelected(null); }} 
              className="flex-1" 
              size="sm"
              disabled={isRateLimited}
            >
              <Send className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </div>
          
          {pendingCount > 0 && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pendingCount}/3 pending messages
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
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
                className={`p-3 border-b border-border cursor-pointer transition-colors ${
                  selected?.id === msg.id ? "bg-primary/20" : "hover:bg-muted/50"
                } ${!msg.read_at ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {msg.priority !== "normal" && (
                      <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${getPriorityColor(msg.priority)}`} />
                    )}
                    <span className={`font-medium text-sm truncate ${!msg.read_at ? "text-primary font-bold" : ""}`}>
                      {msg.sender_profile?.display_name || msg.sender_profile?.username || "Unknown"}
                    </span>
                    <UserBadge 
                      username={msg.sender_profile?.username || ''} 
                      role={msg.sender_profile?.role} 
                    />
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
                <div className="text-xs text-muted-foreground line-clamp-1">
                  {msg.body.substring(0, 60)}...
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Content / Compose */}
      <div className="flex-1 flex flex-col bg-background/50">
        {composing ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">New Message</h3>
                <Button variant="ghost" size="icon" onClick={() => setComposing(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <div className="flex gap-2">
                    <Input
                      value={compose.to}
                      readOnly
                      placeholder="Select a recipient..."
                      className="flex-1 bg-muted/50"
                    />
                    <Button onClick={() => setShowUserPicker(!showUserPicker)} variant="outline">
                      <Users className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {showUserPicker && (
                    <div className="mt-2 p-2 rounded-lg border border-border bg-card max-h-48 overflow-y-auto">
                      {isLoading ? (
                        <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading users...
                        </div>
                      ) : users.length === 0 ? (
                        <div className="p-3 text-center">
                          <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">No other users found yet</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Be the first to invite friends!
                          </p>
                        </div>
                      ) : (
                        users.map(u => (
                          <div
                            key={u.user_id}
                            onClick={() => selectRecipient(u.user_id, u.display_name || u.username)}
                            className="p-2 hover:bg-muted rounded cursor-pointer text-sm"
                          >
                            <div className="font-medium">{u.display_name || u.username}</div>
                            <div className="text-xs text-muted-foreground">@{u.username}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select
                    value={compose.priority}
                    onChange={(e) => setCompose(prev => ({ ...prev, priority: e.target.value as Message["priority"] }))}
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    value={compose.subject}
                    onChange={(e) => setCompose(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Subject"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={compose.body}
                    onChange={(e) => setCompose(prev => ({ ...prev, body: e.target.value.slice(0, 750) }))}
                    placeholder="Type your message..."
                    rows={10}
                    className="resize-none"
                    maxLength={750}
                  />
                  <div className={`text-xs mt-1 text-right ${compose.body.length > 700 ? 'text-yellow-500' : 'text-muted-foreground'} ${compose.body.length >= 750 ? 'text-destructive' : ''}`}>
                    {compose.body.length}/750
                  </div>
                </div>

                <Button 
                  onClick={handleSendMessage} 
                  className="w-full" 
                  disabled={isSending || isRateLimited || !compose.toUserId}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : selected ? (
          <>
            <div className="p-4 border-b border-border bg-card/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {selected.priority !== "normal" && (
                      <AlertTriangle className={`w-4 h-4 ${getPriorityColor(selected.priority)}`} />
                    )}
                    <h3 className="font-bold text-lg">{selected.subject}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-1">
                    <span>From:</span>
                    <span className="text-foreground font-medium">
                      {selected.sender_profile?.display_name || selected.sender_profile?.username || "Unknown"}
                    </span>
                    <UserBadge 
                      username={selected.sender_profile?.username || ''} 
                      role={selected.sender_profile?.role} 
                    />
                    <span>• {formatTime(selected.created_at)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(selected.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {selected.priority === "urgent" && (
                <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold">
                  ⚠ URGENT MESSAGE
                </div>
              )}
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                {selected.body}
              </pre>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a message or compose a new one</p>
              <p className="text-xs mt-1">Click refresh to check for new messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
