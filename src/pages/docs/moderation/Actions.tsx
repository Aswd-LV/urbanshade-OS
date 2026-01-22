import { Gavel, Eye, AlertTriangle, Clock, Ban, Sparkles, UserX, Lock, Radio, Settings, Shield } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const ModerationActions = () => {
  const userActions = [
    { icon: Eye, title: "View User Details", description: "See full profile, account creation date, warnings, and moderation history.", severity: "Info", accent: "cyan" },
    { icon: AlertTriangle, title: "Issue Warning", description: "Formal notice about rule violations. Warnings are tracked and can lead to bans.", severity: "Low", accent: "amber" },
    { icon: Clock, title: "Temporary Ban", description: "Suspend a user for a specified duration with a visible reason.", severity: "High", accent: "amber" },
    { icon: Ban, title: "Permanent Ban", description: "Remove a user permanently. Reserved for severe or repeated violations.", severity: "Critical", accent: "red" },
    { icon: Sparkles, title: "Grant VIP Status", description: "Owner-only. Gives VIP perks like cloud priority and message bypass.", severity: "Owner", accent: "purple" },
    { icon: UserX, title: "Demote Admin", description: "Owner-only. Removes admin privileges from a user.", severity: "Owner", accent: "red" },
  ];

  const quickActions = [
    { icon: Lock, title: "Lock Site", description: "Emergency lockdown. Prevents all non-admin users from accessing.", accent: "red" },
    { icon: Radio, title: "Global Broadcast", description: "Send a message to all online users for announcements.", accent: "amber" },
    { icon: Settings, title: "Maintenance Mode", description: "Show maintenance screen while admins can still access.", accent: "cyan" },
    { icon: Clock, title: "Scheduled Actions", description: "Plan bans, unbans, or other actions at a specific time.", accent: "purple" },
  ];

  return (
    <DocLayout
      title="Moderation Actions"
      description="Complete guide to enforcement tools available to UrbanShade OS administrators including warnings, bans, and system controls."
      keywords={["moderation", "actions", "ban", "warning", "admin", "enforcement"]}
      accentColor="red"
      breadcrumbs={[{ label: "Moderation", path: "/docs/moderation" }]}
      prevPage={{ title: "NAVI Monitor", path: "/docs/moderation/navi" }}
      nextPage={{ title: "Statistics", path: "/docs/moderation/stats" }}
    >
      <DocHero
        icon={Gavel}
        title="Moderation Actions"
        subtitle="The enforcement tools available to admins in UrbanShade OS. Use responsibly."
        accentColor="red"
      />

      <DocAlert variant="warning" title="All Actions Are Logged">
        Every moderation action is recorded with timestamp, who did it, and why. 
        Abuse of moderation powers may result in role revocation.
      </DocAlert>

      <DocSection title="User Actions" icon={Gavel} accentColor="red">
        <div className="space-y-3">
          {userActions.map((action) => (
            <div key={action.title} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <action.icon className={`w-5 h-5 text-${action.accent}-400`} />
                  <span className={`font-semibold text-${action.accent}-400`}>{action.title}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded bg-${action.accent}-500/20 text-${action.accent}-400`}>
                  {action.severity}
                </span>
              </div>
              <p className="text-sm text-slate-400">{action.description}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Quick Actions" icon={Settings} accentColor="red">
        <p className="text-slate-400 mb-4">System-wide controls for emergencies and maintenance:</p>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <DocCard
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              accentColor={action.accent as any}
            />
          ))}
        </div>
      </DocSection>

      <DocSection title="Guidelines" icon={Shield} accentColor="red">
        <div className="space-y-4">
          {[
            { title: "Progressive Discipline", desc: "Start with warnings. Then temporary bans. Permanent bans are a last resort." },
            { title: "Always Include a Reason", desc: "Every action requires a reason. Be specific about what rule was violated." },
            { title: "Be Consistent", desc: "Apply rules equally to all users. Personal relationships should not affect decisions." },
            { title: "Appeals Happen", desc: "Users can appeal bans. Be prepared to justify your decision or reconsider." }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="font-bold text-red-400 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="How to Take Action" icon={Gavel} accentColor="red">
        <div className="space-y-3">
          {[
            "Find the user in the Users tab or click on them from a report",
            "Click the action button (warn, ban, etc.)",
            "Fill in the reason and any required fields (duration for temp bans)",
            "Review the preview showing what the user will see",
            "Confirm the action"
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{i + 1}</span>
              <span className="text-slate-400">{step}</span>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default ModerationActions;
