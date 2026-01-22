import { Shield, Crown, Eye, Gavel, BarChart3, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const ModerationOverview = () => {
  const sections = [
    { icon: Eye, title: "NAVI Monitor", description: "Real-time monitoring of NAVI bot activity and lockout events.", link: "/docs/moderation/navi", accent: "cyan" },
    { icon: Gavel, title: "Moderation Actions", description: "Warnings, bans, VIP grants, and enforcement tools.", link: "/docs/moderation/actions", accent: "red" },
    { icon: BarChart3, title: "Statistics Dashboard", description: "User growth, moderation metrics, and analytics.", link: "/docs/moderation/stats", accent: "blue" }
  ];

  return (
    <DocLayout
      title="Moderation Overview"
      description="Admin tools, user management, and NAVI AI monitoring for UrbanShade OS moderators."
      accentColor="red"
      keywords={["moderation", "admin", "navi", "bans", "management"]}
      breadcrumbs={[{ label: "Moderation", path: "/docs/moderation" }]}
      prevPage={{ title: "Moderation Guide", path: "/docs/moderation" }}
      nextPage={{ title: "NAVI Monitor", path: "/docs/moderation/navi" }}
    >
      <DocHero
        icon={Shield}
        title="Moderation Panel"
        subtitle="Where admins manage users, handle reports, and keep UrbanShade OS running smoothly."
        accentColor="red"
      />

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm mb-8">
        <Lock className="w-4 h-4" />
        Admin Access Required
      </div>

      <DocAlert variant="info" title="Demo Mode Available">
        Non-admins can view the moderation panel at <code className="px-2 py-0.5 rounded bg-slate-800">/moderation</code> in 
        demo mode. All actions are simulated and don't affect real users - great for learning the interface!
      </DocAlert>

      <DocSection title="Role Hierarchy" icon={Crown} accentColor="red">
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-amber-400">Creator (Aswd)</h4>
            </div>
            <p className="text-sm text-slate-400">
              Full control over everything. Can grant/revoke admin status, VIP status, and access all 
              owner-only features like lockdowns. The only one who can make someone an admin.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-500" />
              <h4 className="font-bold text-red-400">Administrator</h4>
            </div>
            <p className="text-sm text-slate-400">
              Full access to the moderation panel, user management, bans, warnings, and most system controls. 
              Cannot grant admin status to others or access owner-only features.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Panel Sections" icon={Gavel} accentColor="red">
        <div className="grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <Link to={section.link} key={section.title}>
              <DocCard
                title={section.title}
                description={section.description}
                icon={section.icon}
                accentColor={section.accent as any}
              />
            </Link>
          ))}
        </div>
      </DocSection>

      <DocSection title="Accessing the Panel" icon={Lock} accentColor="red">
        <p className="text-slate-400 mb-4">
          The moderation panel is available at <code className="px-2 py-1 rounded bg-slate-800 text-red-400">/moderation</code>.
        </p>
        <ol className="space-y-2 text-sm text-slate-400">
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-400">1.</span>
            Make sure you're logged into an admin account
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-400">2.</span>
            Navigate to /moderation or use the admin link in your profile
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-400">3.</span>
            If you see a "Demo Mode" banner, you don't have admin access
          </li>
        </ol>
      </DocSection>
    </DocLayout>
  );
};

export default ModerationOverview;