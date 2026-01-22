import { useEffect, useState } from 'react';
import { Flag, Shield, UserX, Bug, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface Admin {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
}

const Reporting = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data: adminRoles, error: rolesError } = await (supabase as any)
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (rolesError) throw rolesError;

        if (adminRoles && adminRoles.length > 0) {
          const adminIds = adminRoles.map((r: any) => r.user_id);
          
          const { data: profiles, error: profilesError } = await (supabase as any)
            .from('profiles')
            .select('id, username, display_name, avatar_url')
            .in('id', adminIds);

          if (profilesError) throw profilesError;
          
          setAdmins(profiles || []);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const reportTypes = [
    { icon: UserX, title: 'User Misconduct', description: 'Harassment, spam, inappropriate content, impersonation, or scam attempts.', color: 'red' },
    { icon: Shield, title: 'Security Issues', description: 'Suspicious activity, potential exploits, vulnerabilities, or account compromise.', color: 'amber' },
    { icon: Bug, title: 'Bugs & Glitches', description: 'Broken features, unexpected behavior, crashes, or visual issues.', color: 'purple' },
    { icon: Flag, title: 'Content Concerns', description: 'Inappropriate messages, concerning content, or policy violations.', color: 'cyan' },
  ];

  return (
    <DocLayout
      title="Reporting Issues"
      description="How to report problems, rule-breakers, and bugs in UrbanShade OS."
      keywords={["reporting", "admin", "bugs", "issues", "safety"]}
      accentColor="red"
      breadcrumbs={[{ label: "Safety", path: "/docs/safety" }]}
      prevPage={{ title: "Account Safety", path: "/docs/safety/account" }}
    >
      <DocHero
        icon={Flag}
        title="Report Problems"
        subtitle="Found something wrong? Here's how to report issues, rule-breakers, and bugs."
        accentColor="red"
      />

      <DocAlert variant="info" title="How to Report">
        The simplest way to report anything is to message an admin directly using the <strong>Messages</strong> app. 
        They'll review your report and take action as needed.
      </DocAlert>

      <DocSection title="What Can Be Reported?" icon={Flag} accentColor="red" id="types">
        <div className="grid gap-4 md:grid-cols-2">
          {reportTypes.map((type) => (
            <DocCard 
              key={type.title} 
              title={type.title} 
              icon={type.icon} 
              accentColor={type.color as any}
            >
              <p className="mt-2 text-sm text-slate-400">{type.description}</p>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="Current Administrators" icon={Users} accentColor="blue" id="admins">
        <p className="text-slate-400 mb-4">
          These are the admins you can contact for help:
        </p>
        
        {loading ? (
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-slate-400 animate-pulse">Loading administrators...</div>
          </div>
        ) : admins.length === 0 ? (
          <DocAlert variant="warning">
            Unable to load the administrator list right now. Try again later.
          </DocAlert>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {admins.map((admin) => (
              <div key={admin.id} className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/15 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-red-500/30">
                    <AvatarImage src={admin.avatar_url || undefined} />
                    <AvatarFallback className="bg-red-500/20 text-red-400">
                      {(admin.display_name || admin.username || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {admin.display_name || admin.username}
                      <span className="px-1.5 py-0.5 text-xs rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">@{admin.username}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DocSection>

      <DocSection title="Writing a Good Report" icon={CheckCircle} accentColor="green" id="writing">
        <p className="text-slate-400 mb-4">Help admins help you by including the right information:</p>
        <div className="space-y-3">
          {[
            { title: "Be specific", desc: "Describe exactly what happened, where, and when." },
            { title: "Include usernames", desc: "If reporting a user, include their exact username." },
            { title: "Add screenshots", desc: "Visual evidence helps admins understand and verify the issue." },
            { title: "Be patient", desc: "Admins will respond as soon as they can. Don't spam multiple admins." }
          ].map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-green-400">{tip.title}</span>
                <p className="text-sm text-slate-400">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Warning" icon={AlertTriangle} accentColor="amber" id="warning">
        <DocAlert variant="warning" title="False Reports">
          Filing false reports wastes everyone's time and may result in action being taken against your account. 
          Only report genuine issues and concerns.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default Reporting;