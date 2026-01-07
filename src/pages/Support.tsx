import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle, Search, Book, ChevronRight, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type SupportView = 'home' | 'faq' | 'contact';

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

const FAQ_LIBRARY: FAQItem[] = [
  { question: "Can I change my username?", answer: "Yes! Go to Settings → Account → Change Username. You can change it once every 30 days.", keywords: ["username", "change", "name", "rename"] },
  { question: "Can I collaborate with others on UrbanShade?", answer: "Currently, UrbanShade is a single-user experience. However, you can message other users through the Messages app if you have a cloud account.", keywords: ["collaborate", "multiplayer", "together", "share"] },
  { question: "Can I customize the desktop?", answer: "Absolutely! Right-click on the desktop to access customization options, or go to Settings → Appearance to change themes, wallpapers, and more.", keywords: ["customize", "desktop", "theme", "wallpaper", "appearance"] },
  { question: "Can I export my data?", answer: "Yes! Go to Account Manager → Data to export your settings, messages, and other data in JSON format.", keywords: ["export", "data", "download", "backup"] },
  { question: "Can I install custom apps?", answer: "Yes! Use the UUR Manager to browse and install community-made packages. You can also submit your own packages.", keywords: ["install", "apps", "uur", "packages", "custom"] },
  { question: "Can I use UrbanShade offline?", answer: "Yes, but with limited functionality. Local mode works offline, but cloud features (messaging, sync) require an internet connection.", keywords: ["offline", "internet", "connection", "local"] },
  { question: "Do I need to create an account?", answer: "No! You can use UrbanShade in local mode without any account. Creating an account enables cloud sync and messaging features.", keywords: ["account", "register", "signup", "required"] },
  { question: "Does UrbanShade collect my personal data?", answer: "We only collect data necessary for cloud features (email, username, settings). We never sell your data. See our Privacy Policy for details.", keywords: ["data", "privacy", "collect", "personal", "information"] },
  { question: "Does UrbanShade cost anything?", answer: "No! UrbanShade is completely free. There are no premium tiers, hidden fees, or in-app purchases.", keywords: ["cost", "price", "free", "pay", "money", "premium"] },
  { question: "Does UrbanShade work on mobile?", answer: "UrbanShade is designed for desktop browsers. While it may partially work on tablets, we recommend using a computer for the best experience.", keywords: ["mobile", "phone", "tablet", "touch", "responsive"] },
  { question: "How do I become a moderator?", answer: "Moderators are selected by the admin team based on community contributions and trust. There's no application process - we'll reach out if we think you'd be a good fit.", keywords: ["moderator", "mod", "staff", "apply", "join team"] },
  { question: "How do I change my password?", answer: "Go to Account Manager → Security → Change Password. You'll need to enter your current password to set a new one.", keywords: ["password", "change", "security", "credentials"] },
  { question: "How do I contact support?", answer: "You can use the Contact Support option on this page, message an admin through the Messages app, or email emailbot00noreply@gmail.com for urgent issues.", keywords: ["support", "contact", "help", "admin", "email"] },
  { question: "How do I delete my account?", answer: "Go to Account Manager → Danger Zone → Delete Account. This action is irreversible and will delete all your data.", keywords: ["delete", "account", "remove", "close", "terminate"] },
  { question: "How do I enable dark mode?", answer: "UrbanShade uses a dark theme by default! You can adjust colors in Settings → Appearance.", keywords: ["dark mode", "theme", "light", "colors"] },
  { question: "How do I get unbanned?", answer: "If you believe your ban was a mistake, contact an admin through email at emailbot00noreply@gmail.com. Include your username and explain the situation.", keywords: ["unban", "banned", "appeal", "suspended"] },
  { question: "How do I report a bug?", answer: "Use the Messages app to contact an admin, or submit an issue on our GitHub repository. Include steps to reproduce the bug.", keywords: ["bug", "report", "issue", "problem", "glitch"] },
  { question: "How do I report a user?", answer: "In the Messages app, open the conversation with the user you want to report and click the Report button. Admins will review your report.", keywords: ["report", "user", "abuse", "harassment", "block"] },
  { question: "How do I reset my settings?", answer: "Go to Settings → Advanced → Reset Settings. You can choose to reset specific categories or all settings.", keywords: ["reset", "settings", "default", "restore"] },
  { question: "How do I sign out?", answer: "Click on your profile in the Start Menu and select 'Sign out', or go to Settings → Account → Sign Out.", keywords: ["signout", "logout", "sign out", "log out"] },
  { question: "How do I sync my data across devices?", answer: "Create a cloud account and enable sync in Settings → Online Account. Your settings will automatically sync every 2 minutes.", keywords: ["sync", "devices", "cloud", "backup", "cross-device"] },
  { question: "How do I use keyboard shortcuts?", answer: "Press Ctrl+? to see all available keyboard shortcuts, or check the documentation at /docs/shortcuts.", keywords: ["keyboard", "shortcuts", "hotkeys", "keys"] },
  { question: "How does the ban system work?", answer: "Minor violations result in warnings. Repeated issues lead to temporary bans (1h to 30 days). Serious violations result in permanent bans.", keywords: ["ban", "system", "rules", "moderation", "punishment"] },
  { question: "How does the messaging rate limit work?", answer: "You can send 15 messages per 5 minutes. After hitting the limit, you'll need to wait before sending more. This prevents spam.", keywords: ["rate limit", "messages", "limit", "spam", "cooldown"] },
  { question: "I forgot my password, how do I recover it?", answer: "Click 'Forgot Password' on the login screen and enter your email. We'll send you a reset link.", keywords: ["forgot", "password", "recover", "reset", "lost"] },
  { question: "Is my data secure?", answer: "Yes! We use Supabase with Row Level Security (RLS) policies. Your data is encrypted and stored securely.", keywords: ["secure", "security", "safe", "encryption", "data"] },
  { question: "Is the team trustworthy?", answer: "We're a small, passionate team based in the EU (Latvia). We follow GDPR and EU laws. Check our Team page to learn more about us.", keywords: ["team", "trustworthy", "trust", "safe", "legitimate", "who"] },
  { question: "Is UrbanShade open source?", answer: "The project is hosted on GitHub and you can view the codebase. We welcome contributions and feedback!", keywords: ["open source", "github", "code", "contribute", "repository"] },
  { question: "What are badges and how do I get them?", answer: "Badges are visual indicators of your role (Admin, Mod, VIP, Creator). They're assigned by the admin team based on contributions or special status.", keywords: ["badges", "roles", "vip", "admin", "special"] },
  { question: "What browsers are supported?", answer: "We recommend Chrome, Firefox, or Edge (latest versions). Safari works but may have minor issues. Internet Explorer is not supported.", keywords: ["browser", "chrome", "firefox", "safari", "edge", "support"] },
  { question: "What happens if I get banned?", answer: "You'll see a ban screen explaining why you were banned. Temporary bans show a countdown. Permanent bans cannot be appealed for serious violations.", keywords: ["banned", "ban", "suspended", "blocked"] },
  { question: "What is DEF-DEV mode?", answer: "DEF-DEV is a developer/debugging mode with advanced tools for inspecting the system state, viewing logs, and testing features. Access it via /def-dev or the Terminal.", keywords: ["defdev", "def-dev", "developer", "debug", "tools"] },
  { question: "What is local mode vs cloud mode?", answer: "Local mode stores everything in your browser (no account needed). Cloud mode syncs your data to our servers, enabling cross-device access and messaging.", keywords: ["local", "cloud", "mode", "difference", "storage"] },
  { question: "What is NAVI?", answer: "NAVI is our AI security system that monitors for suspicious behavior and helps with automated moderation. It's named after a helpful AI companion.", keywords: ["navi", "ai", "security", "system", "bot"] },
  { question: "What is the UUR Manager?", answer: "UUR (UrbanShade User Repository) is our package manager for installing community-made apps and tools.", keywords: ["uur", "manager", "packages", "repository", "apps"] },
  { question: "What is UrbanShade OS?", answer: "UrbanShade OS is a browser-based operating system simulator. It's a fun project that recreates the desktop experience in your web browser.", keywords: ["what", "urbanshade", "about", "os", "simulator"] },
  { question: "Where is my data stored?", answer: "Local mode stores data in your browser's localStorage. Cloud mode uses Supabase servers (secure, GDPR-compliant infrastructure).", keywords: ["data", "stored", "location", "server", "where"] },
  { question: "Why am I seeing a maintenance screen?", answer: "We occasionally take the system offline for updates or maintenance. This usually lasts only a few minutes. Check our status page for updates.", keywords: ["maintenance", "down", "offline", "unavailable"] },
  { question: "Why can't I send messages?", answer: "You might have hit the rate limit (15 messages per 5 minutes), or your account may be restricted. Check if you have any pending warnings.", keywords: ["messages", "send", "blocked", "cant", "unable"] },
  { question: "Why did my session expire?", answer: "For security, sessions expire after extended inactivity. Simply sign in again to continue.", keywords: ["session", "expired", "logged out", "automatic"] },
].sort((a, b) => a.question.localeCompare(b.question));

interface ChatMessage {
  role: 'user' | 'navi';
  content: string;
  timestamp: Date;
}

const Support = () => {
  const [view, setView] = useState<SupportView>('home');
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const filteredFAQs = FAQ_LIBRARY.filter(faq => {
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.keywords.some(k => k.toLowerCase().includes(query))
    );
  });

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setMessageInput("");

    // NAVI auto-response
    setTimeout(() => {
      const naviResponse: ChatMessage = {
        role: 'navi',
        content: "The support system is currently being implemented, sorry! If it's extremely urgent, contact Aswd directly through messages or through emailbot00noreply@gmail.com",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, naviResponse]);
    }, 1000);
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
                  onClick={() => setView('home')}
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
                onClick={() => setView('contact')}
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
                <Link to="/status">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-600">
                    System Status
                  </Button>
                </Link>
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
                    <p className="text-sm mt-2">Try different keywords or <button onClick={() => setView('contact')} className="text-cyan-400 hover:underline">contact support</button></p>
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
                <p className="text-slate-400">Chat with our team</p>
              </div>
            </div>

            {/* Chat Interface */}
            <Card className="bg-slate-800/50 border-slate-700 h-[calc(100vh-320px)] flex flex-col">
              <CardHeader className="border-b border-slate-700 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">NAVI Support</p>
                    <p className="text-xs text-slate-400">UrbanShade Support Team</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-xs text-slate-400">Implementation in progress</span>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Start a conversation</p>
                      <p className="text-sm mt-2">Describe your issue and we'll help you out</p>
                    </div>
                  )}

                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'navi' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-slate-700 text-slate-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-foreground/60' : 'text-slate-400'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
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
                    placeholder="Type your message..."
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none min-h-[44px] max-h-32"
                    rows={1}
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
                    disabled={!messageInput.trim()}
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
