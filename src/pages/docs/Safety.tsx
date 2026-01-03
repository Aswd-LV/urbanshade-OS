import { ArrowLeft, Shield, AlertTriangle, Crown, Eye, Ban, Users, MessageSquare, CheckCircle, XCircle, Flag, Star, Sparkles, Lock, Fingerprint, Globe, Wifi, WifiOff, Key, EyeOff, Bot } from "lucide-react";
import { Link } from "react-router-dom";

const Safety = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Safety & Badges</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <Shield className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Stay Safe on UrbanShade</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your safety matters to us. Here's everything you need to know about staying secure 
            and understanding trust indicators in UrbanShade OS.
          </p>
        </section>

        {/* User Badges Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">1</span>
            Understanding User Badges
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-6">
            <p className="text-muted-foreground">
              Badges help you identify who you're talking to. Here are the badges you might see:
            </p>
            
            <div className="space-y-4">
              {/* Creator Badge */}
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    <Crown className="w-4 h-4" />
                    Creator
                  </span>
                  <span className="font-bold text-yellow-400">The Big Boss</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This badge is exclusive to <strong>Aswd</strong>, the creator of UrbanShade OS. 
                  If you see this badge, you're chatting with the person who made all of this! 
                  Trust them completely... or don't, they'd probably find that funny.
                </p>
              </div>

              {/* Admin Badge */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    <Shield className="w-4 h-4" />
                    Admin
                  </span>
                  <span className="font-bold text-red-400">Trusted Staff</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Admins are trusted members who help maintain UrbanShade. They can moderate content, 
                  help users, and keep things running smoothly. When chatting with an admin, 
                  you'll also see a verification popup confirming they're legit.
                </p>
              </div>

              {/* VIP Badge */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Sparkles className="w-4 h-4" />
                    VIP
                  </span>
                  <span className="font-bold text-purple-400">Trusted by Aswd</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  VIPs are users who have been personally recognized by Aswd. They're trustworthy people 
                  who've earned special status. VIPs get perks like cloud priority, skipping message checks 
                  when contacting Aswd, and an awesome purple badge. If someone has this badge, 
                  you can trust they're cool!
                </p>
              </div>

              {/* Bot Badge */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Bot className="w-4 h-4" />
                    Bot
                  </span>
                  <span className="font-bold text-cyan-400">Automated System</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The Bot badge indicates automated messages from <strong>NAVI</strong> or other system processes. 
                  These messages are sent by UrbanShade itself, not by a human. They're used for 
                  live announcements, update notifications, and system alerts. You can trust these messages 
                  as official communications from UrbanShade. Bots cannot initiate private conversations - 
                  they only send broadcast announcements.
                </p>
              </div>

              {/* Regular User */}
              <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                    <Users className="w-4 h-4" />
                    User
                  </span>
                  <span className="font-bold text-slate-400">Regular Member</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Most people you meet are regular users - just like you! They're here to explore, 
                  have fun, and experience the underwater chaos. No special badge, but that doesn't 
                  make them any less cool.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Basic Safety Tips */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">2</span>
            Basic Safety Tips
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-green-400">Check the badges</span>
                  <p className="text-sm text-muted-foreground">
                    If someone claims to be an admin or the creator, check for their badge. 
                    Real staff members always have badges visible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-green-400">Don't share personal info</span>
                  <p className="text-sm text-muted-foreground">
                    Never share your real name, address, phone number, or other personal details. 
                    This is the internet - be smart about what you share.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-green-400">Keep passwords safe</span>
                  <p className="text-sm text-muted-foreground">
                    No one from UrbanShade will ever ask for your password. If someone does, 
                    they're trying to scam you. Report them immediately.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-green-400">Trust your gut</span>
                  <p className="text-sm text-muted-foreground">
                    If something feels off, it probably is. Don't feel pressured to do anything 
                    that makes you uncomfortable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Security */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">3</span>
            Account Security
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-cyan-400">Strong Password</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use a unique password with at least 12 characters. Mix letters, numbers, and symbols.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Fingerprint className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-green-400">Two-Factor Auth</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable 2FA when available for an extra layer of security on your account.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-purple-400">Privacy Settings</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Review your privacy settings regularly. Control who can see your profile and activity.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-amber-400">Session Management</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Log out when using shared devices. Check active sessions in your account settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What NOT to do */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-white font-bold">!</span>
            Things to Avoid
          </h3>
          <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30 space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-red-400">Don't click suspicious links</span>
                  <p className="text-sm text-muted-foreground">
                    Random links promising "free stuff" or "admin access" are almost always scams. 
                    If it sounds too good to be true, it probably is.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-red-400">Don't trust impersonators</span>
                  <p className="text-sm text-muted-foreground">
                    Anyone pretending to be Aswd or an admin without the proper badge is a fake. 
                    Real staff always have verified badges.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-red-400">Don't share account access</span>
                  <p className="text-sm text-muted-foreground">
                    Your account is yours. Sharing it with others puts your data at risk and violates 
                    our terms of service.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-red-400">Don't ignore warnings</span>
                  <p className="text-sm text-muted-foreground">
                    If someone seems suspicious or makes you uncomfortable, trust your instincts. 
                    Block them and report if necessary.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-red-400">Don't download random files</span>
                  <p className="text-sm text-muted-foreground">
                    Files sent by strangers could contain malware. Only download from trusted sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Safety */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">4</span>
            Network Safety
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-green-400">Use secure connections</span>
                  <p className="text-sm text-muted-foreground">
                    When possible, use a secure, private network. Avoid logging in on public WiFi 
                    without a VPN.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-cyan-400">Check for HTTPS</span>
                  <p className="text-sm text-muted-foreground">
                    Always verify the URL starts with https:// to ensure your connection is encrypted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-amber-400">Beware of public networks</span>
                  <p className="text-sm text-muted-foreground">
                    Public WiFi can be risky. Someone could intercept your data. Use mobile data 
                    or a VPN for sensitive activities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">5</span>
            Reporting Rule Breakers
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <p className="text-muted-foreground">
              Found someone breaking the rules or trying to scam others? Here's what to do:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-5 h-5 text-cyan-400" />
                  <span className="font-bold text-cyan-400">Report via Discord</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join our Discord community and report issues directly to the moderation team. 
                  This is the fastest way to get help. Look for the #reports channel.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-purple-400">Message an Admin</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  If you spot an admin (look for the red Admin badge), you can message them directly 
                  about the issue. They can take action right away.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-amber-400">Document Evidence</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Take screenshots of the conversation or behavior. Include timestamps if possible. 
                  This helps the moderation team understand what happened and take appropriate action.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-green-400">What to Include</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  When reporting, include: the username of the offender, what happened, 
                  when it happened, and any screenshots or evidence you have.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 mt-4">
              <p className="text-sm text-slate-400">
                <strong>Note:</strong> We don't currently have an email support system, 
                but our Discord community is active and moderated regularly by the team.
              </p>
            </div>
          </div>
        </section>

        {/* Admin Verification */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">6</span>
            Admin Verification in Messages
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <p className="text-muted-foreground">
              When chatting with an admin, VIP, or the creator, you'll see a special verification banner 
              above their messages. This confirms they're the real deal!
            </p>

            {/* Mock examples */}
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-4">
              <p className="text-xs text-slate-500 mb-2">Examples:</p>
              
              <div className="space-y-2">
                <div className="px-3 py-1.5 rounded bg-yellow-500/20 border border-yellow-500/30 text-xs text-yellow-400 inline-flex items-center gap-1.5">
                  <Crown className="w-3 h-3" />
                  Verified Creator • This is Aswd, the creator of UrbanShade
                </div>
                <div className="p-3 rounded-lg bg-slate-800 text-sm">
                  Yo! Thanks for using UrbanShade 🎉
                </div>
              </div>

              <div className="space-y-2">
                <div className="px-3 py-1.5 rounded bg-green-500/20 border border-green-500/30 text-xs text-green-400 inline-flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  Verified Admin • Messages from this user are legitimate
                </div>
                <div className="p-3 rounded-lg bg-slate-800 text-sm">
                  Hey! Just checking in to see if you need any help. 👋
                </div>
              </div>

              <div className="space-y-2">
                <div className="px-3 py-1.5 rounded bg-purple-500/20 border border-purple-500/30 text-xs text-purple-400 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Verified VIP • This user is recognized and trusted by Aswd
                </div>
                <div className="p-3 rounded-lg bg-slate-800 text-sm">
                  Welcome to the community! 💜
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              If someone claims to be staff but you don't see this verification, 
              they might be impersonating. Stay cautious and report if suspicious!
            </p>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Quick Reference</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <h4 className="font-bold text-green-400 mb-2">✅ DO</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check badges before trusting claims</li>
                <li>• Use strong, unique passwords</li>
                <li>• Report suspicious behavior</li>
                <li>• Log out on shared devices</li>
                <li>• Trust the verification banners</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <h4 className="font-bold text-red-400 mb-2">❌ DON'T</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Share personal information</li>
                <li>• Click suspicious links</li>
                <li>• Give out your password</li>
                <li>• Trust users without badges</li>
                <li>• Ignore your instincts</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs" className="text-primary hover:underline">← Back to Documentation</Link>
          <Link to="/docs/features" className="text-primary hover:underline">Features Guide →</Link>
        </div>
      </main>
    </div>
  );
};

export default Safety;
