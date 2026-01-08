import { useState, useRef, useEffect } from "react";
import { Bot, Send, AlertTriangle, Eye, Loader2, RefreshCw, Trash2, User, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: 'user' | 'navi';
  content: string;
  timestamp: Date;
  username?: string;
  userRole?: string;
  isError?: boolean;
}

interface NaviAIChatTabProps {
  isDemoMode: boolean;
}

export const NaviAIChatTab = ({ isDemoMode }: NaviAIChatTabProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'navi',
      content: `NAVI AI INITIALIZED\n\nWelcome to the NAVI AI chat channel. I'm your intelligent moderation assistant.\n\n**Usage:** Mention @NAVI followed by your query.\n**Example:** "@NAVI what's the current situation?"\n\nI can analyze:\n• Recent moderation actions\n• NAVI Autonomous activity\n• System status and alerts\n• User behavior patterns\n\n[STATUS: READY]`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      if (isDemoMode) {
        setCurrentUser({ id: 'demo', username: 'DemoUser', role: 'user' });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        // Get role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        setCurrentUser({
          id: session.user.id,
          username: profile?.username || 'Unknown',
          role: roleData?.role || 'user'
        });
      }
    };

    fetchUser();
  }, [isDemoMode]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const fetchContext = async () => {
    if (isDemoMode) return null;

    try {
      // Fetch recent NAVI autonomous actions
      const { data: naviActions } = await supabase
        .from('navi_auto_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch NAVI settings for status
      const { data: naviSettings } = await supabase
        .from('navi_settings')
        .select('*')
        .maybeSingle();

      // Get user counts
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: adminCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // Get banned count
      const { count: bannedCount } = await supabase
        .from('moderation_actions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .in('action_type', ['ban', 'temp_ban']);

      return {
        naviActions: naviActions || [],
        currentStatus: {
          lockdown: naviSettings?.lockdown_mode || false,
          maintenance: naviSettings?.maintenance_mode || false,
          vipOnly: naviSettings?.vip_only_mode || false,
        },
        userCount: userCount || 0,
        adminCount: adminCount || 0,
        bannedCount: bannedCount || 0,
      };
    } catch (error) {
      console.error("Error fetching context:", error);
      return null;
    }
  };

  const handleSend = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Check if message mentions @NAVI
    const mentionsNavi = /@navi/i.test(trimmedInput);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
      username: currentUser?.username || 'Unknown',
      userRole: currentUser?.role || 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // If doesn't mention @NAVI, just show the message (chat between admins)
    if (!mentionsNavi) {
      return;
    }

    // Process @NAVI mention
    setIsLoading(true);

    try {
      // Get context for NAVI
      const context = await fetchContext();

      // Call NAVI AI edge function
      const { data, error } = await supabase.functions.invoke('navi-ai', {
        body: {
          message: trimmedInput.replace(/@navi/gi, '').trim(),
          context,
          isDemo: isDemoMode,
        }
      });

      if (error) throw error;

      const naviResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'navi',
        content: data.response || data.error || "No response received.",
        timestamp: new Date(),
        isError: !!data.error,
      };

      setMessages(prev => [...prev, naviResponse]);

    } catch (error: any) {
      console.error("NAVI AI error:", error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'navi',
        content: `var <NETWORK> > Connection = failed. Response not sent.\n\n${error.message || 'Failed to reach NAVI AI. Please try again.'}`,
        timestamp: new Date(),
        isError: true,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Failed to contact NAVI AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'navi',
      content: `NAVI AI CHAT CLEARED\n\nChat history cleared. Ready for new queries.\n\n[STATUS: READY]`,
      timestamp: new Date(),
    }]);
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'creator': return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'admin': return <Shield className="w-3 h-3 text-red-400" />;
      default: return <User className="w-3 h-3 text-slate-400" />;
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'creator': 
        return <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30">CREATOR</span>;
      case 'admin': 
        return <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/30">ADMIN</span>;
      default: 
        return <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-slate-500/20 text-slate-400 border border-slate-500/30">USER</span>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-bold text-cyan-400 font-mono">#chat</h2>
            <p className="text-xs text-slate-500 font-mono">Moderation Team • NAVI AI Enabled</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          className="border-slate-700 gap-2"
        >
          <Trash2 className="w-3 h-3" /> Clear
        </Button>
      </div>

      {/* Demo Mode Warning */}
      {isDemoMode && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <Eye className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-400 font-mono">
            DEMO MODE: NAVI AI is disabled. Messages won't receive AI responses.
          </p>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? '' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === 'navi' 
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                  : msg.userRole === 'creator'
                  ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30'
                  : msg.userRole === 'admin'
                  ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30'
                  : 'bg-slate-800 border border-slate-700'
              }`}>
                {msg.role === 'navi' ? (
                  <Bot className="w-4 h-4 text-cyan-400" />
                ) : (
                  getRoleIcon(msg.userRole)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'navi' ? (
                    <>
                      <span className="font-bold text-cyan-400 font-mono">NAVI</span>
                      <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-slate-200 font-mono">{msg.username}</span>
                      {getRoleBadge(msg.userRole)}
                    </>
                  )}
                  <span className="text-xs text-slate-600 font-mono">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {/* Message body */}
                <div className={`rounded-lg p-3 ${
                  msg.role === 'navi'
                    ? msg.isError
                      ? 'bg-red-950/30 border border-red-500/30'
                      : 'bg-slate-900/50 border border-slate-800'
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}>
                  <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
                    {msg.content}
                  </pre>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-cyan-400 font-mono">NAVI</span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
                </div>
                <div className="rounded-lg p-3 bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-mono">Processing query...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message... (use @NAVI to query AI)"
              className="bg-slate-900/50 border-slate-700 font-mono pr-20"
              disabled={isLoading}
            />
            {inputValue.toLowerCase().includes('@navi') && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  AI Query
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </Button>
        </div>
        <p className="text-xs text-slate-600 font-mono mt-2">
          💡 Tip: Use <span className="text-cyan-400">@NAVI</span> followed by your question to get AI-powered insights
        </p>
      </div>
    </div>
  );
};
