import { Star, Crown, Shield, Sparkles, Bot, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const Badges = () => {
  const badges = [
    {
      name: 'Creator',
      icon: Crown,
      color: 'amber',
      description: 'Exclusive to Aswd, the creator of UrbanShade OS. The highest trust level.',
      trustLevel: 'Maximum Trust',
    },
    {
      name: 'Admin',
      icon: Shield,
      color: 'red',
      description: 'Trusted staff members who moderate content and manage users.',
      trustLevel: 'High Trust',
    },
    {
      name: 'VIP',
      icon: Sparkles,
      color: 'purple',
      description: 'Users personally recognized by Aswd. VIPs get cloud priority and perks.',
      trustLevel: 'Trusted',
    },
    {
      name: 'Bot',
      icon: Bot,
      color: 'cyan',
      description: 'Automated messages from NAVI or other system processes.',
      trustLevel: 'System',
    },
    {
      name: 'User',
      icon: Users,
      color: 'blue',
      description: 'Regular members exploring the underwater chaos of UrbanShade OS.',
      trustLevel: 'Standard',
    },
  ];

  return (
    <DocLayout
      title="User Badges"
      description="Understanding badges in UrbanShade OS - trust levels and how to identify real staff."
      keywords={["badges", "trust", "admin", "vip", "creator", "verification"]}
      accentColor="purple"
      breadcrumbs={[{ label: "Safety", path: "/docs/safety" }]}
      prevPage={{ title: "Safety Center", path: "/docs/safety" }}
      nextPage={{ title: "Account Safety", path: "/docs/safety/account" }}
    >
      <DocHero
        icon={Star}
        title="Understanding Badges"
        subtitle="Badges help you identify who you're talking to in UrbanShade OS. They're your first line of defense against impersonators."
        accentColor="purple"
      />

      <DocAlert variant="warning" title="Why Badges Matter">
        Always check for badges before trusting someone claiming to be staff. 
        Real admins and the creator ALWAYS have their badges visible. No exceptions.
      </DocAlert>

      <DocSection title="Badge Types" icon={Star} accentColor="purple" id="types">
        <div className="space-y-4">
          {badges.map((badge) => (
            <DocCard 
              key={badge.name} 
              title={badge.name} 
              icon={badge.icon} 
              accentColor={badge.color as any}
            >
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-slate-400">{badge.description}</p>
                <span className={`px-2 py-0.5 rounded text-xs bg-${badge.color}-500/20 text-${badge.color}-400`}>
                  {badge.trustLevel}
                </span>
              </div>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="How Are Badges Earned?" icon={Crown} accentColor="amber" id="earned">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Crown className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-500">Creator</span>
              <p className="text-sm text-slate-400">Only Aswd has this. It's not earnable - it's who made UrbanShade.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <Shield className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-red-500">Admin</span>
              <p className="text-sm text-slate-400">Appointed directly by Aswd. Highly trusted individuals.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-purple-500">VIP</span>
              <p className="text-sm text-slate-400">Granted personally by Aswd for exceptional contributions.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Bot className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-cyan-500">Bot</span>
              <p className="text-sm text-slate-400">System-assigned to automated accounts. For NAVI only.</p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Spotting Fake Badges" icon={AlertTriangle} accentColor="red" id="fake">
        <p className="text-slate-400 mb-4">
          Badges are rendered by the system - users cannot add them to their display names.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-bold text-green-400">Real badges</span>
            </div>
            <p className="text-sm text-slate-400">Appear as styled components next to the username, rendered by the app</p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="font-bold text-red-400">Fake badges</span>
            </div>
            <p className="text-sm text-slate-400">Text or emojis in the username like "[Admin]" or "👑"</p>
          </div>
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Badges;