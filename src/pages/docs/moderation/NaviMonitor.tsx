import { Eye, MessageSquare, Filter, Clock, Lock, Activity, AlertTriangle, Shield, Radio, Users } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const NaviMonitor = () => {
  const features = [
    { icon: MessageSquare, title: "Message Queue", description: "View messages being processed, including priority levels and delivery status.", accent: "cyan" },
    { icon: Filter, title: "Filter Statistics", description: "See how many messages NAVI has filtered, flagged, or allowed through.", accent: "green" },
    { icon: Clock, title: "Response Times", description: "Monitor NAVI's response latency and overall performance metrics.", accent: "amber" },
    { icon: Lock, title: "Lockout Events", description: "Track when NAVI triggered lockouts for suspicious activity.", accent: "red" },
    { icon: Activity, title: "Processing Status", description: "Real-time view of NAVI's processing pipeline and bottlenecks.", accent: "purple" },
  ];

  return (
    <DocLayout
      title="NAVI Monitor"
      description="Real-time monitoring of NAVI bot activity, message filtering, and lockout events for UrbanShade OS administrators."
      keywords={["navi", "monitor", "bot", "filtering", "lockout", "moderation"]}
      accentColor="cyan"
      breadcrumbs={[{ label: "Moderation", path: "/docs/moderation" }]}
      prevPage={{ title: "Overview", path: "/docs/moderation/overview" }}
      nextPage={{ title: "Actions", path: "/docs/moderation/actions" }}
    >
      <DocHero
        icon={Eye}
        title="NAVI Monitor"
        subtitle="Real-time visibility into UrbanShade's automated messaging system and content filtering."
        accentColor="cyan"
      />

      <DocAlert variant="info" title="What is NAVI?">
        NAVI is UrbanShade's automated bot system. It handles broadcasts, filters messages to the creator, 
        manages announcements, and can trigger lockouts when it detects suspicious activity. Think of it as the facility's AI assistant.
      </DocAlert>

      <DocSection title="Monitor Features" icon={Activity} accentColor="cyan">
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
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

      <DocSection title="Understanding Lockouts" icon={Lock} accentColor="red">
        <p className="text-slate-400 mb-4">
          NAVI can automatically lock out users who trigger certain security thresholds:
        </p>
        <div className="space-y-3">
          {[
            { title: "Spam Detection", desc: "Sending too many messages too quickly" },
            { title: "Suspicious Patterns", desc: "Behavior that matches known attack patterns" },
            { title: "Keyword Triggers", desc: "Messages containing flagged content" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-red-400">{item.title}:</span>
                <span className="text-slate-400 ml-1">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Lockouts are temporary and can be reviewed/lifted by admins in the monitor.
        </p>
      </DocSection>

      <DocSection title="Message Filtering" icon={Filter} accentColor="purple">
        <p className="text-slate-400 mb-4">
          When users message the creator (Aswd), NAVI reviews the message first:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="font-bold text-green-400">VIPs</span>
            </div>
            <p className="text-sm text-slate-400">Messages bypass NAVI filtering and go directly to Aswd</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-400">Regular Users</span>
            </div>
            <p className="text-sm text-slate-400">Messages are reviewed by NAVI before being delivered</p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Using the Monitor" icon={Radio} accentColor="cyan">
        <div className="space-y-3">
          {[
            "Navigate to the Moderation Panel at /moderation",
            "Click the 'NAVI Monitor' tab",
            "View the live dashboard with message queue, filter stats, and lockout logs",
            "Click on any lockout event to see details and optionally lift it"
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{i + 1}</span>
              <span className="text-slate-400">{step}</span>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default NaviMonitor;
