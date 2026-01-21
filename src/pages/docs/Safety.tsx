import { Shield, Award, Lock, Flag } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard } from "@/components/docs";

const Safety = () => {
  return (
    <DocLayout
      title="Safety"
      description="Stay safe on Urbanshade OS - user badges, account security tips, and how to report rule violations."
      keywords={["safety", "security", "badges", "reporting", "account"]}
      accentColor="cyan"
      prevPage={{ title: "Back to Docs", path: "/docs" }}
    >
      <DocHero
        icon={Shield}
        title="Stay Safe on UrbanShade"
        subtitle="Your safety matters to us. Learn about trust indicators, account security, 
        and how to report issues."
        accentColor="cyan"
      />

      <DocSection title="Safety Topics" icon={Shield} accentColor="cyan">
        <div className="grid gap-6 md:grid-cols-3">
          <DocCard
            title="Badges"
            description="Learn about user badges and what they mean - from Creator to VIP status."
            icon={Award}
            link="/docs/safety/badges"
            accentColor="purple"
          />
          <DocCard
            title="Account Safety"
            description="Tips for keeping your account secure with strong passwords and privacy settings."
            icon={Lock}
            link="/docs/safety/account"
            accentColor="cyan"
          />
          <DocCard
            title="Reporting"
            description="How to report rule breakers and who to contact for help."
            icon={Flag}
            link="/docs/safety/reporting"
            accentColor="red"
          />
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Safety;