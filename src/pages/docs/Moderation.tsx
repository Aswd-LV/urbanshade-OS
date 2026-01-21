import { Shield, BookOpen, Eye, Zap, BarChart3 } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const Moderation = () => {
  return (
    <DocLayout
      title="Moderation Guide"
      description="Admin guide for the moderation panel - user management, NAVI monitoring, and moderation actions."
      keywords={["moderation", "admin", "guide", "navi", "actions"]}
      accentColor="red"
      prevPage={{ title: "Back to Docs", path: "/docs" }}
    >
      <DocHero
        icon={Shield}
        title="Moderation Panel Guide"
        subtitle="A comprehensive guide for admins on how to use the moderation panel effectively. 
        This is an internal document - handle with care."
        accentColor="red"
        badge="🔒 Admin Access Required"
      />

      <DocAlert variant="warning">
        This documentation is for authorized administrators only. The moderation panel 
        contains sensitive tools that can affect user accounts.
      </DocAlert>

      <DocSection title="Documentation Sections" icon={BookOpen} accentColor="red">
        <div className="grid gap-6 md:grid-cols-2">
          <DocCard
            title="Overview"
            description="Getting started with the moderation panel, user management, and quick actions."
            icon={BookOpen}
            link="/docs/moderation/overview"
            accentColor="red"
          />
          <DocCard
            title="NAVI Monitor"
            description="Real-time insights into NAVI bot activity, message filtering, and lockout events."
            icon={Eye}
            link="/docs/moderation/navi"
            accentColor="cyan"
          />
          <DocCard
            title="Actions"
            description="Detailed guide on warnings, bans, VIP grants, and other moderation actions."
            icon={Zap}
            link="/docs/moderation/actions"
            accentColor="amber"
          />
          <DocCard
            title="Statistics"
            description="Analytics dashboard with user growth, moderation metrics, and activity heatmaps."
            icon={BarChart3}
            link="/docs/moderation/stats"
            accentColor="blue"
          />
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Moderation;