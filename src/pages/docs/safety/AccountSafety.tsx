import { Shield, Lock, Key, AlertTriangle, Fingerprint, EyeOff, Eye, Smartphone } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const AccountSafety = () => {
  const securityFeatures = [
    { icon: Key, title: "Strong Password", description: "Use a unique password with at least 12 characters. Mix letters, numbers, and symbols.", accent: "cyan" },
    { icon: Fingerprint, title: "Two-Factor Authentication", description: "Enable 2FA in account settings. Adds extra security even if your password is compromised.", accent: "green" },
    { icon: EyeOff, title: "Privacy Settings", description: "Review who can see your profile and activity. Control your visibility.", accent: "purple" },
    { icon: Lock, title: "Session Management", description: "Log out on shared devices. Check active sessions and revoke unknown ones.", accent: "amber" }
  ];

  return (
    <DocLayout
      title="Account Safety"
      description="Keep your UrbanShade account secure with best practices for passwords, 2FA, and session management."
      accentColor="green"
      keywords={["account", "safety", "security", "password", "2fa"]}
      breadcrumbs={[{ label: "Safety", path: "/docs/safety" }]}
      prevPage={{ title: "Safety Center", path: "/docs/safety" }}
      nextPage={{ title: "Badges", path: "/docs/safety/badges" }}
    >
      <DocHero
        icon={Shield}
        title="Account Safety"
        subtitle="Your UrbanShade account is your gateway to the facility. Here's how to keep it safe."
        accentColor="green"
      />

      <DocAlert variant="danger" title="Critical Warning">
        No one from UrbanShade - including Aswd and admins - will EVER ask for your password. 
        If someone asks, they're trying to steal your account. Report them immediately.
      </DocAlert>

      <DocSection title="Security Features" icon={Lock} accentColor="green">
        <div className="grid gap-4 md:grid-cols-2">
          {securityFeatures.map((feature) => (
            <DocCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              accentColor={feature.accent as any}
            />
          ))}
        </div>
      </DocSection>

      <DocSection title="Recognizing Threats" icon={AlertTriangle} accentColor="green">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Phishing Attempts
            </h4>
            <p className="text-sm text-slate-400">
              Be wary of links promising "free VIP status" or "admin access." Real staff never send external links to verify anything.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Impersonation
            </h4>
            <p className="text-sm text-slate-400">
              Anyone pretending to be Aswd or an admin without the proper badge is fake. Real staff ALWAYS have visible badges.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Suspicious Activity
            </h4>
            <p className="text-sm text-slate-400">
              Notice unfamiliar logins, settings changes, or messages you didn't send? Change your password immediately and contact an admin.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="If Your Account is Compromised" icon={Shield} accentColor="red">
        <div className="space-y-3">
          {[
            { title: "Change your password immediately", desc: "Use a completely new password you haven't used anywhere else." },
            { title: "Enable 2FA if not already enabled", desc: "This prevents future unauthorized access even if your password leaks again." },
            { title: "Revoke all active sessions", desc: "This kicks out anyone currently logged in, including the attacker." },
            { title: "Message an admin", desc: "Let them know what happened. They can help secure your account and investigate." }
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{i + 1}</span>
              <div>
                <span className="font-bold text-slate-200">{step.title}</span>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default AccountSafety;