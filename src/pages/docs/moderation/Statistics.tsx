import { BarChart3, Users, Activity, PieChart, Calendar, TrendingUp, Clock, Shield, Download } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const Statistics = () => {
  const metrics = [
    { icon: Users, title: "User Growth", description: "Track new signups, active users, and retention over time.", accent: "blue" },
    { icon: Activity, title: "Moderation Metrics", description: "Warnings issued, bans enacted, and appeals processed.", accent: "red" },
    { icon: PieChart, title: "Role Distribution", description: "Breakdown of users by role: regular, VIPs, staff, admins.", accent: "purple" },
    { icon: Calendar, title: "Activity Heatmap", description: "See when users are most active for planning.", accent: "green" },
    { icon: TrendingUp, title: "Engagement Trends", description: "Message volumes, feature usage, and overall engagement.", accent: "amber" },
    { icon: Clock, title: "Session Analytics", description: "Average session duration, bounce rates, engagement time.", accent: "cyan" },
  ];

  return (
    <DocLayout
      title="Statistics Dashboard"
      description="Analytics and insights about UrbanShade OS usage, moderation actions, and user activity for administrators."
      keywords={["statistics", "analytics", "dashboard", "metrics", "moderation"]}
      accentColor="blue"
      breadcrumbs={[{ label: "Moderation", path: "/docs/moderation" }]}
      prevPage={{ title: "Actions", path: "/docs/moderation/actions" }}
      nextPage={{ title: "Overview", path: "/docs/moderation/overview" }}
    >
      <DocHero
        icon={BarChart3}
        title="Statistics Dashboard"
        subtitle="Analytics and insights about UrbanShade OS usage, moderation actions, and user activity."
        accentColor="blue"
      />

      <DocAlert variant="warning" title="Admin Access Required">
        The Statistics Dashboard is only accessible to users with administrator privileges. 
        All data is refreshed in real-time.
      </DocAlert>

      <DocSection title="Available Metrics" icon={TrendingUp} accentColor="blue">
        <div className="grid gap-4 md:grid-cols-2">
          {metrics.map((metric) => (
            <DocCard
              key={metric.title}
              title={metric.title}
              description={metric.description}
              icon={metric.icon}
              accentColor={metric.accent as any}
            />
          ))}
        </div>
      </DocSection>

      <DocSection title="Using Statistics Effectively" icon={Shield} accentColor="blue">
        <div className="space-y-4">
          {[
            { title: "Identify Peak Times", desc: "Use the activity heatmap to see when users are most active. Schedule maintenance during low-activity periods." },
            { title: "Track Moderation Load", desc: "Monitor warning and ban trends. A sudden spike might indicate a raid or coordinated attack." },
            { title: "Measure Health", desc: "User retention and engagement metrics tell you if the community is healthy." },
            { title: "Export Data", desc: "Need deeper analysis? Export data for external tools and long-term trend analysis." }
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="font-bold text-blue-400 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Accessing the Dashboard" icon={BarChart3} accentColor="blue">
        <div className="space-y-3">
          {[
            "Navigate to the Moderation Panel at /moderation",
            "Click the 'Stats' tab",
            "Use the date range picker to filter data by time period",
            "Click on any chart for more detailed breakdowns",
            "Use the export button for external analysis"
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{i + 1}</span>
              <span className="text-slate-400 flex items-center gap-2">
                {step}
                {i === 4 && <Download className="w-4 h-4 text-blue-400" />}
              </span>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Statistics;
