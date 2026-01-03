import { ArrowLeft, Github, Code, Cloud, TestTube, Lightbulb, Crown, Users, Heart, Waves, GitCommit } from 'lucide-react';
import { Link } from 'react-router-dom';

import aswdAvatar from '@/assets/team-aswd.png';
import plplllAvatar from '@/assets/team-plplll.png';
import kombainisAvatar from '@/assets/team-kombainis.png';

interface TeamMember {
  name: string;
  avatar: string;
  role: string;
  title: string;
  contributions: { icon: React.ReactNode; label: string }[];
  bio: string[];
  startDate: string;
  color: string;
  borderColor: string;
  textColor: string;
  isCreator?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    name: "Aswd_LV",
    avatar: aswdAvatar,
    role: "Founder & CEO",
    title: "The Architect",
    startDate: "January 27th, 2025",
    contributions: [
      { icon: <Code className="w-4 h-4" />, label: "95% of the codebase" },
      { icon: <Crown className="w-4 h-4" />, label: "Founder of Urbanshade" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Vision & Direction" },
    ],
    bio: [
      "Yo! I started this whole thing on January 27th, 2025, and honestly? It's been one hell of a ride. I've been the main one behind this, writing like 95% of the code, designing how everything works, and making sure this thing actually runs without... not working. From late night coding sessions to \"why is this not working\" moments - i have had those.",
      "Now look, i'll be honest - yes, there's been some AI involvement here. But honestly? It's more important to us to have fun building this, and a bunch of the code has still been made by us. We use AI as a tool, not a thing that does everything for us. And if it was, it probably wouldnt be AS good. And yeah i really, REALLY like where this is headed"
    ],
    color: "from-yellow-500/30 to-amber-600/30",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
    isCreator: true,
  },
  {
    name: "plplll",
    avatar: plplllAvatar,
    role: "Developer & Tester",
    title: "The Collaborator",
    startDate: "Early 2025",
    contributions: [
      { icon: <Cloud className="w-4 h-4" />, label: "Cloud features" },
      { icon: <Code className="w-4 h-4" />, label: "Code contributions" },
      { icon: <TestTube className="w-4 h-4" />, label: "Testing" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Ideas & Feedback" },
    ],
    bio: [
      "Been helping out since early 2025! I jumped in when things were already getting interesting and honestly couldn't resist being part of my friends project. I've contributed to the cloud features, thrown in some code here and there, and spent way too many hours testing stuff that definitely shouldn't work (but somehow does).",
      "My main thing? Ideas and feedback. You know how sometimes you're stuck on something and need fresh eyes? That's me. Plus, I get to break things on purpose and call it \"testing\" - best deal ever honestly. I'm all about transparency, so yeah, AI helped with some stuff, but we humans are definitely the ones having fun and making the weird decisions. I mean why the hell should a pation project have a cloud system? Ask Aswd not me lol."
    ],
    color: "from-slate-500/20 to-zinc-500/20",
    borderColor: "border-slate-500/30",
    textColor: "text-slate-400",
  },
  {
    name: "Kombainis_yehaw",
    avatar: kombainisAvatar,
    role: "QA Tester",
    title: "The Farmer",
    startDate: "2025",
    contributions: [
      { icon: <TestTube className="w-4 h-4" />, label: "Quality Assurance" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Bug hunting" },
    ],
    bio: [
      "Yehaw! I'm the designated bug finder around here. Joined in 2025 and my job is simple: break stuff, find bugs, and report back. Think of me as the guy who clicks every button in the wrong order just to see what happens. Spoiler alert: sometimes things explode (Not literarly... i hope).",
      "Quality assurance sounds fancy, but really I'm just here to make sure you don't run into the same disasters I create on purpose. Also i like Simpsons for no reason other than yes.."
    ],
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    textColor: "text-green-500",
  },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-primary">URBANSHADE Team</h1>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Urbanshade-Team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <Users className="w-20 h-20 mx-auto text-primary animate-pulse" />
            <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full -z-10" />
          </div>
          
          <h2 className="text-5xl font-bold">
            Meet the <span className="text-primary">URBANSHADE</span> Team
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A small but mighty crew of developers, testers, and dreamers who decided to build 
            the most unnecessarily detailed fake OS on the internet. And we regret nothing.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🇱🇻 Made in Latvia
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              ☕ Fueled by Coffee
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🎯 100% Passion Project
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🤝 Open to Contributors
            </span>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="p-8 rounded-xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20 border-2 border-primary/40 shadow-xl">
          <h3 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
            <Waves className="w-8 h-8" />
            The Story Behind Urbanshade OS
          </h3>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              It all started on <strong className="text-primary">January 27th, 2025</strong>, when one person asked a simple question: 
              "What if I made a fully fake operating system... for no reason?" And then, instead of going to bed like a normal person, 
              they actually started building it.
            </p>
            <p>
              What began as a weird side project quickly turned into something much bigger. Friends joined in, ideas kept flowing, 
              and suddenly we had authentication systems, admin panels, cloud sync, and way more features than any joke project should have.
              We built a messaging system. A moderation panel. A whole developer console. Why? Because it was fun.
            </p>
            <p>
              Now look - we'll be transparent. Yes, AI tools have been involved in some parts of the development.
              But here's the thing: we use AI as a <em>tool</em>, not a replacement for creativity. The weird ideas? The dumb jokes? 
              The decision to add a "fake ban" prank feature? That's all us. We're having fun, and that's what matters.
            </p>
            <p className="text-lg font-medium text-primary">
              Urbanshade OS is proof that passion projects don't need a "point" - sometimes the journey is the destination. 🚀
            </p>
          </div>
        </section>

        {/* Avatar Disclaimer */}
        <section className="text-center p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-400 text-lg font-medium">
            Because we don't wanna leak our faces, we're gonna use our Roblox avatars lol
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Privacy first! Also, our avatars are way cooler than our actual faces. Trust us on this one.
          </p>
        </section>

        {/* Team Grid */}
        <section className="space-y-8">
          <h3 className="text-2xl font-bold text-center">The Crew</h3>
          <p className="text-center text-muted-foreground max-w-xl mx-auto">
            These are the people (represented by our Roblox avatars) 
            who made this fever dream of an operating system possible.
          </p>
          
          <div className="space-y-8">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className={`p-8 rounded-xl bg-gradient-to-br ${member.color} border-2 ${member.borderColor} transition-all group relative ${member.isCreator ? 'ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-500/20' : ''}`}
              >
                {/* Creator highlight badge */}
                {member.isCreator && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-500 text-black text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Crown className="w-4 h-4" />
                    THE CREATOR
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar & Quick Info */}
                  <div className="flex flex-col items-center md:items-start md:w-48 shrink-0">
                    <div className={`w-32 h-32 mb-4 rounded-xl overflow-hidden border-2 shadow-lg bg-black/40 ${member.isCreator ? 'border-yellow-500 ring-2 ring-yellow-500/30' : 'border-white/20'}`}>
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className={`text-xl font-bold ${member.textColor} text-center md:text-left flex items-center gap-2`}>
                      {member.name}
                      {member.isCreator && <Crown className="w-5 h-5 text-yellow-400" />}
                    </h4>
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs mt-2 ${member.isCreator ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-black/40 border-white/10 text-muted-foreground'}`}>
                      {member.role}
                    </span>
                    <p className="text-sm text-muted-foreground italic mt-2">"{member.title}"</p>
                    <p className="text-xs text-muted-foreground mt-2">📅 Since {member.startDate}</p>
                    
                    {/* Contributions */}
                    <div className="space-y-2 mt-4 w-full">
                      {member.contributions.map((contrib, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 text-muted-foreground ${member.isCreator ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-black/30'}`}
                        >
                          <span className={member.textColor}>{contrib.icon}</span>
                          <span>{contrib.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="flex-1 space-y-4">
                {member.isCreator && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                        <p className="text-sm text-yellow-400 font-medium">
                          👑 The guy who said "what if we made a fake OS" and then actually went and did it. Started this mess, still running it.
                        </p>
                      </div>
                    )}
                    {member.bio.map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-center">What We Believe In</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-bold text-primary mb-2">Transparency</h4>
              <p className="text-sm text-muted-foreground">
                We love being transparent with our users. Open source, open communication, open everything!
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-bold text-primary mb-2">Creativity</h4>
              <p className="text-sm text-muted-foreground">
                Why make a normal project when you can make a fully simulated underwater OS? Go big or go home.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-bold text-primary mb-2">Community</h4>
              <p className="text-sm text-muted-foreground">
                Built by the community, for the community. Your feedback shapes what we build next!
              </p>
            </div>
          </div>
        </section>

        {/* All Contributors Link */}
        <section className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 text-center">
          <GitCommit className="w-10 h-10 mx-auto text-purple-400 mb-3" />
          <h3 className="text-xl font-bold mb-2">See All Contributors</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-4">
            Everyone who has ever contributed to Urbanshade, big or small. You helped make this happen!
          </p>
          <Link 
            to="/team/git"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors font-medium"
          >
            <Users className="w-5 h-5" />
            View All Contributors
          </Link>
        </section>

        {/* Join Section */}
        <section className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 text-center">
          <Heart className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Want to Join the Team?</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're always open to new contributors! Whether you want to help with code, testing, 
            ideas, documentation, or just want to hang out - we'd love to have you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="https://github.com/Urbanshade-Team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              Check out our GitHub
            </a>
            <Link 
              to="/docs"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-colors font-medium"
            >
              📚 Read the Docs
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 space-y-4">
          <p className="text-sm text-muted-foreground">
            URBANSHADE Team • Made with ❤️ in Latvia • © 2025
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link>
            <Link to="/status" className="text-muted-foreground hover:text-primary transition-colors">Status</Link>
          </div>
          <Link to="/" className="inline-block text-primary hover:underline text-sm font-semibold">
            ← Return to Simulation
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Team;
