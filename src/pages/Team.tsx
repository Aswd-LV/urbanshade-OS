import { ArrowLeft, Github, Code, Cloud, TestTube, Lightbulb, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import aswdAvatar from '@/assets/team-aswd.png';
import plplllAvatar from '@/assets/team-plplll.png';

interface TeamMember {
  name: string;
  avatar: string;
  role: string;
  title: string;
  contributions: { icon: React.ReactNode; label: string }[];
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Aswd_LV",
    avatar: aswdAvatar,
    role: "Founder & CEO",
    title: "The Architect",
    contributions: [
      { icon: <Code className="w-4 h-4" />, label: "95% of codebase" },
      { icon: <Crown className="w-4 h-4" />, label: "Founder" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Vision & Direction" },
    ],
    color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/50",
  },
  {
    name: "plplll",
    avatar: plplllAvatar,
    role: "Developer & Tester",
    title: "The Collaborator",
    contributions: [
      { icon: <Cloud className="w-4 h-4" />, label: "Cloud features" },
      { icon: <Code className="w-4 h-4" />, label: "Code contributions" },
      { icon: <TestTube className="w-4 h-4" />, label: "Testing" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Ideas & Feedback" },
    ],
    color: "from-slate-500/20 to-zinc-500/20 border-slate-500/50",
  },
  {
    name: "Kombainis_yehaw",
    avatar: "", // Placeholder - needs image
    role: "QA Tester",
    title: "The Farmer",
    contributions: [
      { icon: <TestTube className="w-4 h-4" />, label: "Quality Assurance" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Bug hunting" },
    ],
    color: "from-green-500/20 to-emerald-500/20 border-green-500/50",
  },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">The Team</h1>
              <p className="text-sm text-muted-foreground">The people behind Urbanshade OS</p>
            </div>
          </div>
          <a 
            href="https://github.com/Urbanshade-Team" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Meet the Urbanshade Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A small but passionate team dedicated to building the most fun fake OS experience on the web. 
            We believe in transparency, creativity, and having a good time while coding.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <Card 
              key={member.name}
              className={`relative overflow-hidden bg-gradient-to-br ${member.color} border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-background/50 shadow-lg">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-3xl">
                      🌾
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-2">{member.role}</Badge>
                <p className="text-sm text-muted-foreground italic mb-4">"{member.title}"</p>

                {/* Contributions */}
                <div className="space-y-2">
                  {member.contributions.map((contrib, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-2 text-sm bg-background/50 rounded-lg px-3 py-2"
                    >
                      {contrib.icon}
                      <span>{contrib.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Section */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-muted/30 border border-border/50 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">Want to Join?</h3>
          <p className="text-muted-foreground mb-4">
            We're always open to contributors! Whether you want to help with code, testing, 
            ideas, or just hang out - feel free to reach out.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="https://github.com/Urbanshade-Team" target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <Github className="w-4 h-4" />
                Check out our GitHub
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Urbanshade Team. Made with ❤️ in Latvia.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Team;
