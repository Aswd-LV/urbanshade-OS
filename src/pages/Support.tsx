import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle, Search, Book, ChevronRight, Send, Bot, User, Ticket, ThumbsUp, ThumbsDown, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SupportView = 'home' | 'faq' | 'contact';
type TicketStatus = 'open' | 'pending_human' | 'in_progress' | 'resolved' | 'closed';

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

interface SupportTicket {
  id: string;
  user_id: string;
  assigned_admin_id: string | null;
  status: TicketStatus;
  subject: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  sender_type: 'user' | 'navi' | 'admin';
  content: string;
  is_faq_response: boolean;
  faq_question: string | null;
  created_at: string;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'navi' | 'admin';
  content: string;
  timestamp: Date;
  isFaqResponse?: boolean;
  faqQuestion?: string;
  showFeedback?: boolean;
  adminName?: string;
}

const FAQ_LIBRARY: FAQItem[] = [
  { 
    question: "Can I change my username?", 
    answer: "Yes, you can change your username! Navigate to Settings → Account → Change Username. Note that username changes are limited to once every 30 days to prevent abuse. Your new username must be unique and follow our naming guidelines (3-20 characters, alphanumeric with underscores allowed).", 
    keywords: ["username", "change", "name", "rename", "modify", "update"] 
  },
  { 
    question: "Can I collaborate with others on UrbanShade?", 
    answer: "UrbanShade is primarily a single-user desktop experience. However, with a cloud account you can:\n• Message other users through the Messages app\n• Share files via the file sharing system\n• View other users' public profiles\n\nTrue real-time collaboration (like shared documents) is on our roadmap for future updates!", 
    keywords: ["collaborate", "multiplayer", "together", "share", "teamwork", "coop"] 
  },
  { 
    question: "Can I customize the desktop?", 
    answer: "Absolutely! UrbanShade offers extensive customization options:\n\n**Quick Access:** Right-click on the desktop for quick customization options\n\n**Full Customization:** Go to Settings → Appearance where you can:\n• Change themes (dark, light, custom)\n• Set custom wallpapers (local or URL)\n• Adjust icon sizes and grid spacing\n• Customize taskbar appearance\n• Modify window animations and effects\n• Create and save theme presets", 
    keywords: ["customize", "desktop", "theme", "wallpaper", "appearance", "personalize", "style"] 
  },
  { 
    question: "Can I export my data?", 
    answer: "Yes, you have full control over your data! Go to Account Manager → Data to export your:\n• Settings and preferences\n• Messages and conversations\n• Files and documents\n• Custom themes\n\nData is exported in JSON format for easy portability. This is useful for backups or if you want to transfer your setup to another device.", 
    keywords: ["export", "data", "download", "backup", "save", "transfer"] 
  },
  { 
    question: "Can I install custom apps?", 
    answer: "Yes! The UUR Manager (UrbanShade User Repository) allows you to:\n• Browse community-made packages and apps\n• Install with one click\n• Rate and review packages\n• Submit your own creations\n\nAccess it from the Start Menu → UUR Manager. All packages are community-moderated for safety.", 
    keywords: ["install", "apps", "uur", "packages", "custom", "download", "add"] 
  },
  { 
    question: "Can I use UrbanShade offline?", 
    answer: "Yes, UrbanShade has full offline support with some limitations:\n\n**Works Offline:**\n• All local applications\n• File management\n• Settings and customization\n• Games and utilities\n\n**Requires Internet:**\n• Cloud sync\n• Messaging\n• UUR package downloads\n• Weather and external data\n\nYour data is saved locally and will sync when you reconnect.", 
    keywords: ["offline", "internet", "connection", "local", "network"] 
  },
  { 
    question: "Do I need to create an account?", 
    answer: "No account is required! UrbanShade works in two modes:\n\n**Local Mode (No Account):**\n• Everything stored in your browser\n• Full access to local features\n• No data syncing\n\n**Cloud Mode (With Account):**\n• Cross-device synchronization\n• Messaging with other users\n• Cloud file storage\n• Profile and badges\n\nYou can start in local mode and create an account anytime!", 
    keywords: ["account", "register", "signup", "required", "mandatory", "login"] 
  },
  { 
    question: "Does UrbanShade collect my personal data?", 
    answer: "We collect only what's necessary for cloud features:\n\n**What We Collect:**\n• Email (for authentication)\n• Username (for identification)\n• Settings (for cloud sync)\n• Messages (for chat functionality)\n\n**What We DON'T Collect:**\n• Browsing history\n• Personal files (unless you upload them)\n• Location data\n• Analytics tracking\n\nWe never sell your data. See our Privacy Policy at /privacy for full details.", 
    keywords: ["data", "privacy", "collect", "personal", "information", "tracking"] 
  },
  { 
    question: "Does UrbanShade cost anything?", 
    answer: "UrbanShade is 100% FREE! There are:\n• No premium tiers\n• No hidden fees\n• No in-app purchases\n• No ads\n• No paywalled features\n\nThe project is maintained by passionate developers and supported by the community. Consider contributing to our GitHub if you want to help!", 
    keywords: ["cost", "price", "free", "pay", "money", "premium", "subscription"] 
  },
  { 
    question: "Does UrbanShade work on mobile?", 
    answer: "UrbanShade is designed for desktop browsers and works best on:\n• Chrome (recommended)\n• Firefox\n• Edge\n\n**Mobile/Tablet:** While the site will load, the desktop simulation experience is optimized for keyboard and mouse. Some features may be difficult to use on touch devices. We recommend using a computer for the best experience.", 
    keywords: ["mobile", "phone", "tablet", "touch", "responsive", "android", "ios"] 
  },
  { 
    question: "How do I become a moderator?", 
    answer: "Moderators are selected by the admin team based on:\n• Active community participation\n• Helpfulness to other users\n• Trustworthiness and maturity\n• Understanding of community guidelines\n\nThere's no formal application process - we'll reach out if we think you'd be a great fit! Focus on being a positive member of the community.", 
    keywords: ["moderator", "mod", "staff", "apply", "join team", "volunteer"] 
  },
  { 
    question: "How do I change my password?", 
    answer: "To change your password:\n\n1. Go to Account Manager → Security\n2. Click \"Change Password\"\n3. Enter your current password\n4. Enter and confirm your new password\n5. Click Save\n\n**Password Requirements:**\n• Minimum 8 characters\n• Mix of letters and numbers recommended\n• Avoid using the same password as other sites", 
    keywords: ["password", "change", "security", "credentials", "update"] 
  },
  { 
    question: "How do I contact support?", 
    answer: "You have several options to reach us:\n\n**1. NAVI Support (This chat!):**\nAsk questions here - I'll check our FAQ first, then connect you with a human if needed.\n\n**2. Direct Messaging:**\nMessage an admin through the Messages app in UrbanShade.\n\n**3. Email:**\nemailbot00noreply@gmail.com for urgent issues.\n\n**4. GitHub:**\nSubmit issues on our repository for bugs or feature requests.", 
    keywords: ["support", "contact", "help", "admin", "email", "reach"] 
  },
  { 
    question: "How do I delete my account?", 
    answer: "⚠️ **Warning: This action is irreversible!**\n\nTo delete your account:\n1. Go to Account Manager → Danger Zone\n2. Click \"Delete Account\"\n3. Confirm by typing your username\n4. Click the final confirmation button\n\n**What Gets Deleted:**\n• All your cloud data\n• Messages and conversations\n• Profile and settings\n• All associated information\n\nConsider exporting your data first!", 
    keywords: ["delete", "account", "remove", "close", "terminate", "erase"] 
  },
  { 
    question: "How do I enable dark mode?", 
    answer: "UrbanShade uses a dark theme by default - no need to enable it!\n\nIf you want to adjust colors:\n1. Go to Settings → Appearance\n2. Choose from preset themes or create custom ones\n3. Adjust individual colors to your preference\n\nYou can also use the Theme Editor for advanced customization.", 
    keywords: ["dark mode", "theme", "light", "colors", "night"] 
  },
  { 
    question: "How do I get unbanned?", 
    answer: "If you believe your ban was a mistake or want to appeal:\n\n**1. Email Us:**\nContact emailbot00noreply@gmail.com with:\n• Your username\n• Approximate ban date\n• Explanation of the situation\n\n**2. Wait for Review:**\nAppeals are reviewed within 48-72 hours.\n\n**Note:** Permanent bans for serious violations (harassment, illegal content) typically cannot be appealed.", 
    keywords: ["unban", "banned", "appeal", "suspended", "blocked"] 
  },
  { 
    question: "How do I report a bug?", 
    answer: "Found a bug? Here's how to report it:\n\n**Option 1 - Messages App:**\nSend details to an admin through in-app messaging.\n\n**Option 2 - GitHub:**\nSubmit an issue on our repository with:\n• Bug description\n• Steps to reproduce\n• Expected vs actual behavior\n• Browser and device info\n• Screenshots if applicable\n\n**Option 3 - Support Chat:**\nDescribe the issue here and we'll escalate it!", 
    keywords: ["bug", "report", "issue", "problem", "glitch", "error", "broken"] 
  },
  { 
    question: "How do I report a user?", 
    answer: "To report inappropriate behavior:\n\n1. Open the Messages app\n2. Go to the conversation with the user\n3. Click the ⚙️ menu\n4. Select \"Report User\"\n5. Choose a reason and add details\n6. Submit\n\n**What Happens Next:**\n• Admins review all reports within 24 hours\n• Appropriate action is taken based on severity\n• You may be contacted for more information\n• Reporters remain anonymous", 
    keywords: ["report", "user", "abuse", "harassment", "block", "inappropriate"] 
  },
  { 
    question: "How do I reset my settings?", 
    answer: "To reset your settings:\n\n1. Go to Settings → Advanced\n2. Click \"Reset Settings\"\n3. Choose what to reset:\n   • Appearance only\n   • Application settings\n   • All settings\n4. Confirm your choice\n\n**Note:** This affects local settings. Cloud-synced settings can be reset separately in Account Manager.", 
    keywords: ["reset", "settings", "default", "restore", "original"] 
  },
  { 
    question: "How do I sign out?", 
    answer: "Several ways to sign out:\n\n**Method 1:** Click your profile picture in the Start Menu → \"Sign Out\"\n\n**Method 2:** Go to Settings → Account → Sign Out\n\n**Method 3:** Use the keyboard shortcut Ctrl+Shift+L\n\n**Note:** Signing out will end your session but your data remains saved locally and in the cloud.", 
    keywords: ["signout", "logout", "sign out", "log out", "exit"] 
  },
  { 
    question: "How do I sync my data across devices?", 
    answer: "To enable cross-device sync:\n\n1. Create or sign into your cloud account\n2. Go to Settings → Online Account\n3. Enable \"Auto-sync\"\n4. Your data syncs automatically every 2 minutes\n\n**What Syncs:**\n• Settings and preferences\n• Desktop layout\n• Theme configurations\n• Custom shortcuts\n• Messages (always synced)\n\nYou can also manually sync by clicking \"Sync Now\" in settings.", 
    keywords: ["sync", "devices", "cloud", "backup", "cross-device", "synchronize"] 
  },
  { 
    question: "How do I use keyboard shortcuts?", 
    answer: "UrbanShade has extensive keyboard shortcuts!\n\n**Quick Reference:**\n• Ctrl+? - Show all shortcuts\n• Win/Cmd - Open Start Menu\n• Alt+Tab - Switch windows\n• Ctrl+W - Close window\n• Ctrl+N - New file\n\n**Full List:** Check /docs/shortcuts for the complete documentation.\n\n**Custom Shortcuts:** You can create your own in Settings → Keyboard.", 
    keywords: ["keyboard", "shortcuts", "hotkeys", "keys", "commands"] 
  },
  { 
    question: "How does the ban system work?", 
    answer: "Our ban system uses progressive discipline:\n\n**Warnings (0-2):** Verbal warnings for minor issues\n**Temporary Bans:**\n• 1st offense: 1 hour\n• 2nd offense: 24 hours\n• 3rd offense: 7 days\n• 4th offense: 30 days\n\n**Permanent Bans:** For serious violations including:\n• Harassment or threats\n• Illegal content\n• Repeated serious offenses\n• Attempting to exploit the system\n\nAll actions are logged and reviewed.", 
    keywords: ["ban", "system", "rules", "moderation", "punishment", "discipline"] 
  },
  { 
    question: "How does the messaging rate limit work?", 
    answer: "To prevent spam, messaging has rate limits:\n\n**Limits:**\n• 15 messages per 5 minutes\n• 100 messages per hour\n• No limit on conversation count\n\n**When Limited:**\n• You'll see a cooldown timer\n• Wait for the timer to reset\n• Your messages queue and send after\n\n**Exceptions:** VIP users have higher limits. Rate limits don't apply to admin messages.", 
    keywords: ["rate limit", "messages", "limit", "spam", "cooldown", "throttle"] 
  },
  { 
    question: "I forgot my password, how do I recover it?", 
    answer: "To recover your password:\n\n1. Go to the login screen\n2. Click \"Forgot Password\"\n3. Enter your email address\n4. Check your inbox (and spam folder!)\n5. Click the reset link (valid for 1 hour)\n6. Create a new password\n\n**Didn't get the email?** Wait 5 minutes and try again. Contact support if issues persist.", 
    keywords: ["forgot", "password", "recover", "reset", "lost", "remember"] 
  },
  { 
    question: "Is my data secure?", 
    answer: "Yes! We take security seriously:\n\n**Technical Measures:**\n• Supabase with Row Level Security (RLS)\n• Encrypted data transmission (HTTPS)\n• Secure authentication tokens\n• Regular security audits\n\n**Access Control:**\n• Users can only access their own data\n• Admins have limited, logged access\n• No third-party data sharing\n\n**Compliance:**\n• GDPR compliant\n• EU data protection standards", 
    keywords: ["secure", "security", "safe", "encryption", "data", "protected"] 
  },
  { 
    question: "Is the team trustworthy?", 
    answer: "We're a small, passionate team based in the EU (Latvia):\n\n**Transparency:**\n• Open-source codebase on GitHub\n• Public team page at /team\n• Clear privacy policy\n• GDPR and EU law compliant\n\n**Community Focus:**\n• No monetization or data selling\n• Community-driven development\n• Regular communication with users\n\nFeel free to reach out with any concerns!", 
    keywords: ["team", "trustworthy", "trust", "safe", "legitimate", "who", "developers"] 
  },
  { 
    question: "Is UrbanShade open source?", 
    answer: "Yes! UrbanShade is open source:\n\n**What's Available:**\n• Full source code on GitHub\n• Documentation and guides\n• Contribution guidelines\n• Issue tracking\n\n**How to Contribute:**\n• Report bugs or suggest features\n• Submit pull requests\n• Help with documentation\n• Create UUR packages\n\nWe welcome all contributions from the community!", 
    keywords: ["open source", "github", "code", "contribute", "repository", "free"] 
  },
  { 
    question: "What are badges and how do I get them?", 
    answer: "Badges are visual indicators showing your status:\n\n**Badge Types:**\n• 👑 Admin - System administrator\n• 🛡️ Moderator - Community moderator\n• ⭐ VIP - Special community member\n• 🎨 Creator - UUR package creator\n• 🐛 Bug Hunter - Found significant bugs\n• 💖 Supporter - Community contributor\n\n**How to Earn:**\nBadges are assigned by admins based on contributions, not purchased. Focus on being helpful and active!", 
    keywords: ["badges", "roles", "vip", "admin", "special", "status"] 
  },
  { 
    question: "What browsers are supported?", 
    answer: "**Fully Supported:**\n• Chrome (v90+) - Recommended\n• Firefox (v88+)\n• Edge (v90+)\n\n**Partial Support:**\n• Safari - Works but may have minor visual issues\n• Opera - Generally works well\n\n**Not Supported:**\n• Internet Explorer - Will not work\n• Very old browser versions\n\n**Tips:** Keep your browser updated for the best experience!", 
    keywords: ["browser", "chrome", "firefox", "safari", "edge", "support", "compatible"] 
  },
  { 
    question: "What happens if I get banned?", 
    answer: "If you're banned:\n\n**What You'll See:**\n• A ban screen explaining the reason\n• Ban duration (if temporary)\n• Appeal information\n\n**What's Affected:**\n• Cannot access UrbanShade\n• Existing sessions terminated\n• Messages preserved but inaccessible\n\n**Temporary Bans:** Wait for the countdown to expire\n**Permanent Bans:** Contact support if you believe it's a mistake\n\nAll bans are logged and can be reviewed.", 
    keywords: ["banned", "ban", "suspended", "blocked", "account"] 
  },
  { 
    question: "What is DEF-DEV mode?", 
    answer: "DEF-DEV (Developer/Debug Mode) is an advanced tool for power users:\n\n**Features:**\n• System state inspection\n• Console and network logs\n• Performance monitoring\n• Component debugging\n• Storage management\n• Crash analysis\n\n**How to Access:**\n• Navigate to /def-dev\n• Or use Terminal command: `defdev`\n• Or press Ctrl+Shift+D\n\n**Note:** This is for advanced users. Normal use doesn't require DEF-DEV.", 
    keywords: ["defdev", "def-dev", "developer", "debug", "tools", "advanced"] 
  },
  { 
    question: "What is local mode vs cloud mode?", 
    answer: "**Local Mode:**\n• Data stored in browser (localStorage)\n• No account required\n• Works offline\n• Data tied to single browser\n• No messaging features\n\n**Cloud Mode:**\n• Data synced to secure servers\n• Account required\n• Access from any device\n• Full messaging features\n• Automatic backups\n\n**Recommendation:** Create a free account for the best experience!", 
    keywords: ["local", "cloud", "mode", "difference", "storage", "account"] 
  },
  { 
    question: "What is NAVI?", 
    answer: "NAVI is our multi-purpose AI system:\n\n**NAVI Autonomous:** Security monitoring system that:\n• Detects suspicious behavior\n• Assists with automated moderation\n• Protects user accounts\n\n**NAVI Support (Me!):** FAQ and support assistant that:\n• Answers common questions\n• Connects you with human support\n• Helps troubleshoot issues\n\nThe name is inspired by helpful AI companions in games. Think of me as your friendly digital assistant! 🤖", 
    keywords: ["navi", "ai", "security", "system", "bot", "assistant"] 
  },
  { 
    question: "What is the UUR Manager?", 
    answer: "UUR (UrbanShade User Repository) is our package manager:\n\n**What It Does:**\n• Browse community-made apps and tools\n• One-click installation\n• Automatic updates\n• Rating and review system\n\n**Finding Packages:**\n• Start Menu → UUR Manager\n• Browse categories or search\n• Check ratings and reviews\n\n**Creating Packages:**\nAnyone can submit packages! Check /docs/uur for the guide.", 
    keywords: ["uur", "manager", "packages", "repository", "apps", "store"] 
  },
  { 
    question: "What is UrbanShade OS?", 
    answer: "UrbanShade OS is a browser-based operating system simulator!\n\n**What It Is:**\n• A full desktop experience in your browser\n• Windows-like interface with modern features\n• Collection of useful web apps\n• Community-driven platform\n\n**What You Can Do:**\n• Customize your desktop\n• Use productivity apps\n• Message other users\n• Play games\n• Install community packages\n\nIt's a fun project that recreates the desktop experience entirely in the web!", 
    keywords: ["what", "urbanshade", "about", "os", "simulator", "explain"] 
  },
  { 
    question: "Where is my data stored?", 
    answer: "**Local Mode:**\n• Browser's localStorage\n• Your device only\n• Cleared if you clear browser data\n\n**Cloud Mode:**\n• Supabase servers (EU region)\n• Encrypted at rest\n• GDPR compliant infrastructure\n• Automatic backups\n\n**Security:**\n• All transmission encrypted (HTTPS)\n• Row-level security policies\n• Access only to your own data\n\nSee /privacy for complete details.", 
    keywords: ["data", "stored", "location", "server", "where", "storage"] 
  },
  { 
    question: "Why am I seeing a maintenance screen?", 
    answer: "Maintenance screens appear when:\n\n**Planned Maintenance:**\n• System updates and improvements\n• Usually scheduled for low-traffic times\n• Typically lasts 5-30 minutes\n\n**Unplanned Issues:**\n• Rare emergency fixes\n• Usually resolved quickly\n\n**What to Do:**\n• Check /status for updates\n• Wait and try again\n• Local mode may still work\n\nWe always try to minimize downtime!", 
    keywords: ["maintenance", "down", "offline", "unavailable", "error"] 
  },
  { 
    question: "Why can't I send messages?", 
    answer: "Common reasons you can't send messages:\n\n**1. Rate Limited:**\n• Sending too fast\n• Wait for cooldown timer\n\n**2. Account Restricted:**\n• Check for warnings in notifications\n• Contact support if unclear\n\n**3. Technical Issues:**\n• Check internet connection\n• Try refreshing the page\n• Clear browser cache\n\n**4. Not Logged In:**\n• Messaging requires cloud account\n• Sign in to enable messaging", 
    keywords: ["messages", "send", "blocked", "cant", "unable", "messaging"] 
  },
  { 
    question: "Why did my session expire?", 
    answer: "Sessions expire for security reasons:\n\n**When Sessions Expire:**\n• After 7 days of inactivity\n• If you sign out elsewhere\n• After password change\n• Security-triggered expiration\n\n**What to Do:**\n• Simply sign in again\n• Your data is safe\n• Enable \"Remember Me\" for longer sessions\n\n**Tip:** If sessions expire frequently, check for browser extensions that might clear data.", 
    keywords: ["session", "expired", "logged out", "automatic", "timeout"] 
  },
  { 
    question: "Can VIP users request specific admins for support?", 
    answer: "Yes! VIP users have enhanced support options:\n\n**How to Request a Specific Admin:**\n• In your support message, mention the admin with @username\n• Example: \"@aswd I need help with...\"\n• The ticket will be assigned to that admin if available\n\n**Note:** If the requested admin is unavailable, your ticket will be assigned to another available admin to ensure quick response.\n\nThis is a VIP-exclusive feature to provide personalized support!", 
    keywords: ["vip", "specific", "admin", "request", "choose", "pick", "assign"] 
  }
].sort((a, b) => a.question.localeCompare(b.question));

// FAQ matching algorithm
function findBestFAQMatch(userMessage: string): FAQItem | null {
  const userWords = userMessage.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  if (userWords.length === 0) return null;
  
  let bestMatch: FAQItem | null = null;
  let bestScore = 0;
  const THRESHOLD = 3;
  
  for (const faq of FAQ_LIBRARY) {
    let score = 0;
    
    // Check keyword matches (high weight)
    for (const keyword of faq.keywords) {
      if (userWords.some(word => 
        word.includes(keyword) || keyword.includes(word)
      )) {
        score += 2;
      }
    }
    
    // Check question word overlap (medium weight)
    const questionWords = faq.question.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    for (const word of userWords) {
      if (questionWords.includes(word)) {
        score += 1;
      }
    }
    
    // Check answer word overlap (low weight)
    const answerWords = faq.answer.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    for (const word of userWords) {
      if (answerWords.includes(word)) {
        score += 0.5;
      }
    }
    
    if (score > bestScore && score >= THRESHOLD) {
      bestMatch = faq;
      bestScore = score;
    }
  }
  
  return bestMatch;
}

const Support = () => {
  const [view, setView] = useState<SupportView>('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; username?: string } | null>(null);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
  const [openTickets, setOpenTickets] = useState<SupportTicket[]>([]);
  const [assignedAdminName, setAssignedAdminName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check auth and load tickets
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        setCurrentUser({ id: user.id, username: profile?.username });
        loadOpenTickets(user.id);
      }
    };
    checkAuth();
  }, []);

  // Real-time subscription for ticket messages
  useEffect(() => {
    if (!currentTicket) return;
    
    const channel = supabase
      .channel('ticket-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${currentTicket.id}`
        },
        async (payload) => {
          const newMsg = payload.new as TicketMessage;
          // Don't duplicate messages we just sent
          if (newMsg.sender_type === 'user' && newMsg.sender_id === currentUser?.id) return;
          
          let adminName: string | undefined;
          if (newMsg.sender_type === 'admin' && newMsg.sender_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('user_id', newMsg.sender_id)
              .single();
            adminName = profile?.username;
          }
          
          setChatMessages(prev => [...prev, {
            id: newMsg.id,
            role: newMsg.sender_type,
            content: newMsg.content,
            timestamp: new Date(newMsg.created_at),
            isFaqResponse: newMsg.is_faq_response,
            faqQuestion: newMsg.faq_question || undefined,
            adminName
          }]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTicket, currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadOpenTickets = async (userId: string) => {
    const { data, error } = await (supabase
      .from('support_tickets' as any)
      .select('*')
      .eq('user_id', userId)
      .in('status', ['open', 'pending_human', 'in_progress'])
      .order('created_at', { ascending: false }) as any);
    
    if (!error && data) {
      setOpenTickets(data as SupportTicket[]);
    }
  };

  const loadTicketMessages = async (ticketId: string) => {
    setIsLoading(true);
    const { data, error } = await (supabase
      .from('ticket_messages' as any)
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true }) as any);
    
    if (!error && data) {
      const messages: ChatMessage[] = [];
      for (const msg of data as TicketMessage[]) {
        let adminName: string | undefined;
        if (msg.sender_type === 'admin' && msg.sender_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('user_id', msg.sender_id)
            .single();
          adminName = profile?.username ?? undefined;
        }
        
        messages.push({
          id: msg.id,
          role: msg.sender_type,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          isFaqResponse: msg.is_faq_response,
          faqQuestion: msg.faq_question || undefined,
          adminName
        });
      }
      setChatMessages(messages);
    }
    setIsLoading(false);
  };

  const openTicket = async (ticket: SupportTicket) => {
    setCurrentTicket(ticket);
    await loadTicketMessages(ticket.id);
    
    if (ticket.assigned_admin_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', ticket.assigned_admin_id)
        .single();
      setAssignedAdminName(profile?.username || null);
    }
    
    setView('contact');
  };

  const createNewTicket = async (): Promise<string | null> => {
    if (!currentUser) return null;
    
    const { data, error } = await (supabase
      .from('support_tickets' as any)
      .insert({
        user_id: currentUser.id,
        status: 'open'
      })
      .select()
      .single() as any);
    
    if (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
      return null;
    }
    
    const ticket = data as unknown as SupportTicket;
    setCurrentTicket(ticket);
    setOpenTickets(prev => [ticket, ...prev]);
    return ticket.id;
  };

  const escalateToHuman = async (ticketId: string, userMessage: string, requestedAdmin?: string) => {
    let adminData: { admin_id: string; username: string }[] | null = null;
    
    // Check if VIP user requested a specific admin (e.g., @aswd)
    if (requestedAdmin) {
      const { data: specificAdmin } = await supabase
        .from('profiles')
        .select('user_id, username')
        .ilike('username', requestedAdmin)
        .single();
      
      if (specificAdmin) {
        // Check if they're an admin
        const { data: isAdmin } = await supabase.rpc('has_role', { 
          _user_id: specificAdmin.user_id, 
          _role: 'admin' 
        });
        
        if (isAdmin) {
          adminData = [{ admin_id: specificAdmin.user_id, username: specificAdmin.username }];
        }
      }
    }
    
    // Fall back to random admin if no specific admin found
    if (!adminData || adminData.length === 0) {
      const { data, error: adminError } = await (supabase
        .rpc('get_available_admin' as any) as any);
      adminData = data as { admin_id: string; username: string }[] | null;
      
      if (adminError || !adminData || adminData.length === 0) {
        const naviMessage: ChatMessage = {
          role: 'navi',
          content: "I apologize, but there are no support staff available at the moment. Please try again later or email us directly at emailbot00noreply@gmail.com for urgent issues.",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, naviMessage]);
        
        await (supabase.from('ticket_messages' as any).insert({
          ticket_id: ticketId,
          sender_type: 'navi',
          content: naviMessage.content
        }) as any);
        return;
      }
    }
    
    const admin = adminData[0];
    setAssignedAdminName(admin.username);
    
    // Update ticket with assigned admin
    await (supabase
      .from('support_tickets' as any)
      .update({
        assigned_admin_id: admin.admin_id,
        status: 'pending_human',
        subject: userMessage.slice(0, 100)
      })
      .eq('id', ticketId) as any);
    
    setCurrentTicket(prev => prev ? { ...prev, status: 'pending_human', assigned_admin_id: admin.admin_id } : null);
    
    // Send escalation message from NAVI
    const escalationContent = `Hello, and thank you for reaching out! 🎯\n\nYour issue has been pushed to @${admin.username}. Please wait until we respond! It may take some time.\n\nIn the meantime, feel free to add more details about your issue - they'll see everything you write here.`;
    
    const naviMessage: ChatMessage = {
      role: 'navi',
      content: escalationContent,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, naviMessage]);
    
    await (supabase.from('ticket_messages' as any).insert({
      ticket_id: ticketId,
      sender_type: 'navi',
      content: escalationContent
    }) as any);
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to use the support chat.",
        variant: "destructive"
      });
      return;
    }

    const userMessageContent = messageInput.trim();
    setMessageInput("");
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: userMessageContent,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    // Create or get ticket
    let ticketId = currentTicket?.id;
    if (!ticketId) {
      ticketId = await createNewTicket();
      if (!ticketId) return;
    }
    
    // Save user message to DB
    await (supabase.from('ticket_messages' as any).insert({
      ticket_id: ticketId,
      sender_id: currentUser.id,
      sender_type: 'user',
      content: userMessageContent
    }) as any);

    // If already escalated to human, just save message and wait
    if (currentTicket?.status === 'pending_human' || currentTicket?.status === 'in_progress') {
      return;
    }

    setIsTyping(true);
    
    // Simulate NAVI thinking
    await new Promise(resolve => setTimeout(resolve, 800));

    // Try to find FAQ match
    const faqMatch = findBestFAQMatch(userMessageContent);
    
    if (faqMatch) {
      // Found a matching FAQ
      const faqResponseContent = `I found something that might help! 🎯\n\n**Q: ${faqMatch.question}**\n\n${faqMatch.answer}\n\nDoes this answer your question?`;
      
      const naviResponse: ChatMessage = {
        role: 'navi',
        content: faqResponseContent,
        timestamp: new Date(),
        isFaqResponse: true,
        faqQuestion: faqMatch.question,
        showFeedback: true
      };
      
      setChatMessages(prev => [...prev, naviResponse]);
      
      await (supabase.from('ticket_messages' as any).insert({
        ticket_id: ticketId,
        sender_type: 'navi',
        content: faqResponseContent,
        is_faq_response: true,
        faq_question: faqMatch.question
      }) as any);
    } else {
      // No FAQ match - escalate to human immediately
      await escalateToHuman(ticketId, userMessageContent);
    }
    
    setIsTyping(false);
  };

  const handleFeedback = async (helpful: boolean) => {
    if (!currentTicket) return;
    
    // Remove feedback buttons from the last message
    setChatMessages(prev => prev.map((msg, idx) => 
      idx === prev.length - 1 ? { ...msg, showFeedback: false } : msg
    ));
    
    if (helpful) {
      const thankYouMessage: ChatMessage = {
        role: 'navi',
        content: "Glad I could help! 😊 Is there anything else you'd like to know?",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, thankYouMessage]);
      
      await (supabase.from('ticket_messages' as any).insert({
        ticket_id: currentTicket.id,
        sender_type: 'navi',
        content: thankYouMessage.content
      }) as any);
    } else {
      // Escalate to human
      await escalateToHuman(currentTicket.id, "User indicated FAQ was not helpful");
    }
  };

  const startNewConversation = () => {
    setCurrentTicket(null);
    setChatMessages([]);
    setAssignedAdminName(null);
    setView('contact');
  };

  const filteredFAQs = FAQ_LIBRARY.filter(faq => {
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.keywords.some(k => k.toLowerCase().includes(query))
    );
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="border-cyan-500 text-cyan-400">Open</Badge>;
      case 'pending_human':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400">Waiting for Staff</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="border-purple-500 text-purple-400">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="border-green-500 text-green-400">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="border-slate-500 text-slate-400">Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {view !== 'home' ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-slate-300 hover:text-white"
                  onClick={() => {
                    setView('home');
                    setCurrentTicket(null);
                    setChatMessages([]);
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              ) : (
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white">
                    <ArrowLeft className="w-4 h-4" />
                    Back to OS
                  </Button>
                </Link>
              )}
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h1 className="text-xl font-bold text-white">Support Center</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {view === 'home' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">How can we help you?</h2>
              <p className="text-slate-400">Choose an option below to get started</p>
            </div>

            {/* Open Tickets Banner */}
            {openTickets.length > 0 && currentUser && (
              <Card className="bg-purple-900/30 border-purple-500/50 mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2 text-base">
                    <Ticket className="w-5 h-5 text-purple-400" />
                    You have {openTickets.length} open ticket{openTickets.length > 1 ? 's' : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {openTickets.slice(0, 3).map(ticket => (
                    <div 
                      key={ticket.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors"
                      onClick={() => openTicket(ticket)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300 text-sm">
                          {ticket.subject || 'New conversation'}
                        </span>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
                onClick={() => setView('faq')}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                      <Book className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <span className="block">FAQ Resources</span>
                      <span className="text-sm font-normal text-slate-400">Browse our knowledge base</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 ml-auto group-hover:text-cyan-400 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>Search through our comprehensive library of frequently asked questions. Find answers about accounts, features, troubleshooting, and more.</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer group"
                onClick={startNewConversation}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <MessageCircle className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <span className="block">Contact Support</span>
                      <span className="text-sm font-normal text-slate-400">Chat with our team</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 ml-auto group-hover:text-purple-400 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-300">
                  <p>Need personalized help? Start a conversation with our support team. We'll get back to you as soon as possible.</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <div className="flex flex-wrap gap-3">
                <Link to="/docs">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-600">
                    Documentation
                  </Button>
                </Link>
                <Link to="/docs/troubleshooting">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-600">
                    Troubleshooting Guide
                  </Button>
                </Link>
                <a href="https://urbanshade.statuspage.io" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-600">
                    System Status
                  </Button>
                </a>
                <Link to="/team">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-600">
                    Meet the Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {view === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <Book className="w-8 h-8 text-cyan-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">FAQ Resources</h2>
                <p className="text-slate-400">Search our knowledge base ({FAQ_LIBRARY.length} questions)</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword or question..."
                className="pl-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 text-lg"
                autoFocus
              />
            </div>

            {/* Results */}
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-3 pr-4">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No questions found matching "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try different keywords or <button onClick={startNewConversation} className="text-cyan-400 hover:underline">contact support</button></p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <Card key={index} className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-base font-medium">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-slate-300 text-sm">
                        {faq.answer}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {view === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <MessageCircle className="w-8 h-8 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Contact Support</h2>
                <p className="text-slate-400">Chat with NAVI or our team</p>
              </div>
            </div>

            {/* Not logged in warning */}
            {!currentUser && (
              <Card className="bg-yellow-900/30 border-yellow-500/50 mb-4">
                <CardContent className="flex items-center gap-3 py-4">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-200 text-sm">
                    You need to be logged in to use the support chat. <Link to="/" className="underline">Go to UrbanShade OS</Link> to log in.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Chat Interface */}
            <Card className="bg-slate-800/50 border-slate-700 h-[calc(100vh-320px)] flex flex-col">
              <CardHeader className="border-b border-slate-700 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">NAVI Support</p>
                    <p className="text-xs text-slate-400">
                      {assignedAdminName ? `Assigned to @${assignedAdminName}` : 'Smart FAQ + Human Escalation'}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {currentTicket && getStatusBadge(currentTicket.status)}
                    {!currentTicket && (
                      <>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-slate-400">Online</span>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Start a conversation</p>
                      <p className="text-sm mt-2">I'll check our FAQ first - if I can't help, I'll connect you with a human!</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div key={msg.id || index}>
                        <div
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.role !== 'user' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              msg.role === 'admin' 
                                ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                                : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                            }`}>
                              {msg.role === 'admin' ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : msg.role === 'admin'
                                ? 'bg-purple-900/50 border border-purple-500/30 text-slate-100 rounded-bl-md'
                                : 'bg-slate-700 text-slate-100 rounded-bl-md'
                            }`}
                          >
                            {msg.role === 'admin' && msg.adminName && (
                              <p className="text-xs text-purple-300 mb-1 font-medium">@{msg.adminName}</p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${
                              msg.role === 'user' ? 'text-primary-foreground/60' : 'text-slate-400'
                            }`}>
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* Feedback buttons */}
                        {msg.showFeedback && (
                          <div className="flex gap-2 ml-11 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/50 text-green-400 hover:bg-green-500/20 gap-1"
                              onClick={() => handleFeedback(true)}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              Yes, thanks!
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 gap-1"
                              onClick={() => handleFeedback(false)}
                            >
                              <ThumbsDown className="w-3 h-3" />
                              No, need human help
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-slate-700 shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  className="flex gap-3"
                >
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={currentUser ? "Type your message..." : "Please log in to send messages"}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none min-h-[44px] max-h-32"
                    rows={1}
                    disabled={!currentUser}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="shrink-0 h-11 w-11"
                    disabled={!messageInput.trim() || !currentUser}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">Back to UrbanShade OS</Link>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            For urgent issues, contact emailbot00noreply@gmail.com directly.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Support;
