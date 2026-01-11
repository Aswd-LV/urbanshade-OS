import { ArrowLeft, Github, Code, Cloud, TestTube, Lightbulb, Crown, Users, Heart, GitCommit, MapPin, Coffee, Target, Handshake, Search, Palette, Bot, Calendar, Bug, Eye, Rocket, Zap, Shield, Database, Terminal, Gamepad2, MessageSquare, Settings, Lock, ChevronRight, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

import aswdAvatar from '@/assets/team-aswd.png';
import plplllAvatar from '@/assets/team-plplll.png';
import kombainisAvatar from '@/assets/team-kombainis.png';

interface TeamMember {
  name: string;
  avatar?: string;
  avatarIcon?: React.ReactNode;
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

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const projectTimeline: TimelineEvent[] = [
  {
    date: "Jan 27 2025",
    title: "Small beginnings",
    description: "The first version of Urbanshade OS starts as a small experiment.",
    icon: <Rocket className="w-5 h-5" />,
    color: "text-primary",
  },
  {
    date: "February 2025",
    title: "First API",
    description: "The first real API-powered feature lands, pushing the project beyond a local-only toy.",
    icon: <Database className="w-5 h-5" />,
    color: "text-cyan-400",
  },
  {
    date: "April 2025",
    title: "First DEF-DEV iteration",
    description: "Early DEF-DEV tools appear: diagnostics, internal panels, and developer utilities.",
    icon: <Code className="w-5 h-5" />,
    color: "text-purple-400",
  },
  {
    date: "May 2025",
    title: "Improved work",
    description: "Stability and UX improve as systems get refined and expanded.",
    icon: <Settings className="w-5 h-5" />,
    color: "text-blue-400",
  },
  {
    date: "August 2025",
    title: "Rewrite in Vite + React",
    description: "Major rewrite: the project moves to a modern Vite + React stack for speed and maintainability.",
    icon: <GitCommit className="w-5 h-5" />,
    color: "text-amber-400",
  },
  {
    date: "September 2025",
    title: "DEF-DEV console opened up",
    description: "DEF-DEV console is no longer admin-only.",
    icon: <Terminal className="w-5 h-5" />,
    color: "text-green-400",
  },
  {
    date: "October 2025",
    title: "NOW PUBLIC!",
    description: "Urbanshade OS becomes public for anyone to try.",
    icon: <Users className="w-5 h-5" />,
    color: "text-yellow-400",
  },
  {
    date: "November 2025",
    title: "Online features",
    description: "Online functionality expands: sync, messaging, and more connected systems.",
    icon: <Cloud className="w-5 h-5" />,
    color: "text-cyan-400",
  },
  {
    date: "December 2025",
    title: "A ton of bug fixes",
    description: "Hardening month: lots of fixes and cleanup across the OS.",
    icon: <Bug className="w-5 h-5" />,
    color: "text-red-400",
  },
  {
    date: "January 2026",
    title: "Working on v3.0 — THE YEAR UPDATE",
    description: "Current focus: shipping v3.0 and polishing the biggest update yet.",
    icon: <Star className="w-5 h-5" />,
    color: "text-primary",
  },
];

const teamMembers: TeamMember[] = [
  {
    name: "Aswd_LV",
    avatar: aswdAvatar,
    role: "Founder and Lead Developer",
    title: "The Architect",
    startDate: "January 27, 2025",
    contributions: [
      { icon: <Code className="w-4 h-4" />, label: "Core codebase" },
      { icon: <Crown className="w-4 h-4" />, label: "Project founder" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Vision and direction" },
      { icon: <Cloud className="w-4 h-4" />, label: "Cloud infrastructure" },
      { icon: <Shield className="w-4 h-4" />, label: "Admin systems" },
      { icon: <Database className="w-4 h-4" />, label: "Database design" },
    ],
    bio: [
      "I started Urbanshade on January 27, 2025. It began as a random thought about whether someone could build a fully functional fake operating system, and instead of just wondering, I started building. That night turned into months of development, and the project kept growing far beyond what I originally imagined.",
      "I have written the vast majority of the code, from the window management system to the authentication flow, from the admin panel to the cloud sync features. The containment game, the messaging system, the developer console - most of it came from late nights of coding and figuring things out as I went.",
      "About AI tools: yes, they have been part of the development process. I use them to help move faster, but the ideas, the direction, and the decisions are all mine. When something unusual gets added to Urbanshade, it is because I thought it would be interesting, not because a tool suggested it. The personality of this project comes from the people building it.",
      "I am genuinely proud of what this has become. It started as something that maybe no one would ever use, and now there are people actually exploring it and finding features I forgot I built. That is a good feeling."
    ],
    color: "from-yellow-500/30 to-amber-600/30",
    borderColor: "border-yellow-500/50",
    textColor: "text-yellow-400",
    isCreator: true,
  },
  {
    name: "plplll",
    avatar: plplllAvatar,
    role: "Developer and Tester",
    title: "The Collaborator",
    startDate: "Early 2025",
    contributions: [
      { icon: <Cloud className="w-4 h-4" />, label: "Cloud features" },
      { icon: <Code className="w-4 h-4" />, label: "Code contributions" },
      { icon: <TestTube className="w-4 h-4" />, label: "Feature testing" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Ideas and feedback" },
    ],
    bio: [
      "I joined early in 2025 when my friend showed me what he was working on. The project was already taking shape, and I could not resist being part of it. Getting to help build something this ambitious with someone I know is exactly the kind of project I wanted to be involved in.",
      "My contributions are spread across different areas. I have worked on cloud features, helped with testing, and provided ideas and feedback throughout development. Sometimes the most valuable thing I do is point out when something could work better or when a feature feels off. Fresh perspective matters.",
      "I also get to break things on purpose and call it quality assurance. Testing edge cases, trying weird input combinations, and seeing what happens when you use features in ways they were not designed for - it is surprisingly fun work.",
      "On the topic of AI in development: it is a tool we use, but the creativity is ours. The unusual decisions, the features that make you wonder why they exist - those come from actual people having fun with the project."
    ],
    color: "from-slate-500/20 to-zinc-500/20",
    borderColor: "border-slate-500/30",
    textColor: "text-slate-400",
  },
  {
    name: "robo-karlix",
    avatarIcon: <Bot className="w-16 h-16 text-purple-400" />,
    role: "Lead Tester and Ideas",
    title: "The Strategist",
    startDate: "2025",
    contributions: [
      { icon: <TestTube className="w-4 h-4" />, label: "Extensive testing" },
      { icon: <Eye className="w-4 h-4" />, label: "Technical perspective" },
      { icon: <Lightbulb className="w-4 h-4" />, label: "Feature ideas" },
      { icon: <Bug className="w-4 h-4" />, label: "Edge case hunting" },
    ],
    bio: [
      "I handle the more detailed side of testing. While casual testing catches obvious problems, I approach things from a more technical angle. What happens if you do things in an unexpected order? What if you push a feature beyond its intended use? How do systems interact when multiple things happen at once?",
      "Beyond finding issues, I contribute a lot of ideas for new features and improvements. Having used a wide variety of software, I bring perspective on what works well elsewhere and what could make Urbanshade better. Sometimes the best features come from simple observations about what is missing.",
      "My testing focuses on the experience of users who understand technology well. There are edge cases and advanced use patterns that casual testing does not cover, and that is where I spend most of my time. Finding those issues before users do makes the project better for everyone."
    ],
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-400",
  },
  {
    name: "Kombainis_yehaw",
    avatar: kombainisAvatar,
    role: "QA Tester",
    title: "The Farmer",
    startDate: "2025",
    contributions: [
      { icon: <TestTube className="w-4 h-4" />, label: "Quality assurance" },
      { icon: <Bug className="w-4 h-4" />, label: "Bug hunting" },
      { icon: <Users className="w-4 h-4" />, label: "User perspective" },
    ],
    bio: [
      "My job is straightforward: use Urbanshade the way a regular person would and find what breaks. I click buttons in weird orders, skip instructions, and try things that probably should not work. That is what actual users end up doing, so someone needs to test for it.",
      "I represent the perspective of users who are not particularly technical. If something feels confusing or does not work the way someone would expect, I notice it. The goal is to make sure you do not run into the same problems I find.",
      "Quality assurance might sound formal, but really I am just here to stumble upon issues before you do. If I get confused by something, chances are other people will too, and that feedback helps make the experience better.",
      "Also, I like The Simpsons. No real connection to the project, just thought I would mention it."
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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-primary">URBANSHADE Team</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/team/git"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors text-sm"
            >
              <GitCommit className="w-4 h-4" />
              Contributors
            </Link>
            <a 
              href="https://github.com/aswdBatch/urbanshade-OS" 
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
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center border border-primary/30">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Meet the <span className="text-primary">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a small group of developers and testers who decided to build a fake operating system 
              that somehow became way more detailed than it needed to be. We are minors, we are friends, 
              and we are having a great time with this project.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Made in Latvia
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-muted-foreground">
              <Coffee className="w-4 h-4 text-amber-400" />
              Fueled by Coffee
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-muted-foreground">
              <Target className="w-4 h-4 text-green-400" />
              Passion Project
            </span>
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-muted-foreground">
              <Handshake className="w-4 h-4 text-blue-400" />
              Open to Contributors
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Core Team</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-yellow-400">2025</div>
              <div className="text-sm text-muted-foreground">Founded</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-green-400">100+</div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-3xl font-bold text-purple-400">Open</div>
              <div className="text-sm text-muted-foreground">Source</div>
            </div>
          </div>
        </section>

        {/* Project Story */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">The Story</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How a random idea turned into a surprisingly complex project.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                It started on <strong className="text-primary">January 27, 2025</strong>. The idea was simple: 
                what would it take to build a fully functional fake operating system? Not just a mockup with 
                static images, but something with working windows, real applications, and actual functionality.
              </p>
              <p>
                What began as a weekend experiment turned into months of development. Features kept getting added - 
                an authentication system, cloud sync, an admin panel, a developer console, even a full game 
                built inside the operating system. Each new addition made the project more interesting, and 
                there was no reason to stop.
              </p>
              <p>
                Friends joined in to help with testing and ideas. The codebase grew. The scope expanded. 
                Somewhere along the way, what started as a joke project became something we are genuinely 
                proud of. It may not have a practical purpose, but it is ours, and we built it together.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm">
                  <strong className="text-primary">A note on AI tools:</strong> Yes, we use them as part of 
                  development. They help us move faster and figure things out. But the ideas, the weird features, 
                  the decision to make this way more complex than necessary - that comes from us. AI is a tool. 
                  The creativity is human.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Project Timeline */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">Project Timeline</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key milestones in the development of Urbanshade OS.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-purple-500/50 to-transparent hidden md:block" />

            <div className="space-y-6">
              {projectTimeline.map((event, index) => (
                <div key={index} className="flex gap-6 group">
                  {/* Timeline dot */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center ${event.color} group-hover:border-current/30 transition-colors`}>
                      {event.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <span className={`text-sm font-medium ${event.color}`}>{event.date}</span>
                        <h4 className="text-lg font-bold mt-1">{event.title}</h4>
                      </div>
                      <div className={`md:hidden w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center ${event.color}`}>
                        {event.icon}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avatar Disclaimer */}
        <section className="text-center p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-400 text-lg font-medium">
            We use Roblox avatars instead of real photos
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Privacy is important to us. Our avatars represent us online, and honestly, they look better anyway.
          </p>
        </section>

        {/* Team Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">The Team</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The people who build, test, and improve Urbanshade OS.
            </p>
          </div>
          
          <div className="space-y-8">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className={`p-8 rounded-2xl bg-gradient-to-br ${member.color} border-2 ${member.borderColor} transition-all group relative ${member.isCreator ? 'ring-2 ring-yellow-500/30 shadow-lg shadow-yellow-500/10' : ''}`}
              >
                {/* Creator badge */}
                {member.isCreator && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-500 text-black text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Crown className="w-4 h-4" />
                    PROJECT CREATOR
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left side - Avatar and info */}
                  <div className="flex flex-col items-center lg:items-start lg:w-56 shrink-0">
                    <div className={`w-32 h-32 mb-4 rounded-xl overflow-hidden border-2 shadow-lg bg-black/40 flex items-center justify-center ${member.isCreator ? 'border-yellow-500 ring-2 ring-yellow-500/30' : 'border-white/20'}`}>
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.avatarIcon
                      )}
                    </div>
                    
                    <h4 className={`text-xl font-bold ${member.textColor} text-center lg:text-left flex items-center gap-2`}>
                      {member.name}
                      {member.isCreator && <Crown className="w-5 h-5 text-yellow-400" />}
                    </h4>
                    
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs mt-2 ${member.isCreator ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-black/40 border-white/10 text-muted-foreground'}`}>
                      {member.role}
                    </span>
                    
                    <p className="text-sm text-muted-foreground italic mt-2">"{member.title}"</p>
                    
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Since {member.startDate}
                    </p>
                    
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

                  {/* Right side - Bio */}
                  <div className="flex-1 space-y-4">
                    {member.isCreator && (
                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                        <p className="text-sm text-yellow-400 font-medium flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          The person who started this whole thing and is still running it. Asked "what if" and then actually went and built it.
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
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">What We Care About</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide how we build Urbanshade.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Search className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Transparency</h4>
              <p className="text-muted-foreground">
                We are open about how things work, including the parts that might be controversial. 
                The code is open source, and we are honest about our development process.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Palette className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Creativity</h4>
              <p className="text-muted-foreground">
                Why make something ordinary when you can go overboard? The decision to add features 
                that probably do not need to exist is part of what makes this project fun.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-bold text-lg mb-2">Community</h4>
              <p className="text-muted-foreground">
                Built by contributors, shaped by feedback. What users say matters and directly 
                influences what gets built. We want people to be part of this.
              </p>
            </div>
          </div>
        </section>

        {/* All Contributors Link */}
        <section className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <GitCommit className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">All Contributors</h3>
              <p className="text-muted-foreground">
                Everyone who has contributed to Urbanshade, including GitHub contributors. See commit 
                counts, contribution history, and more.
              </p>
            </div>
            <Link 
              to="/team/git"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-colors font-medium"
            >
              <Users className="w-5 h-5" />
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Join Section */}
        <section className="p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 text-center">
          <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Want to Contribute?</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We are always open to new contributors. Whether you want to help with code, testing, 
            ideas, documentation, or just want to be part of the project - we would be glad to have you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="https://github.com/aswdBatch/urbanshade-OS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </a>
            <Link 
              to="/docs"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-colors font-medium"
            >
              <Code className="w-5 h-5" />
              Documentation
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span className="font-medium text-primary">URBANSHADE Team</span>
            <span className="text-muted-foreground/30">|</span>
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>in Latvia</span>
            <span className="text-muted-foreground/30">|</span>
            <span>2025</span>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="/docs" className="text-muted-foreground hover:text-primary transition-colors">Docs</Link>
            <Link to="/status" className="text-muted-foreground hover:text-primary transition-colors">Status</Link>
            <a href="https://github.com/aswdBatch/urbanshade-OS" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Team;
