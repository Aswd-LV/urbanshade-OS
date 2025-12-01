import { ArrowLeft, Terminal, Rocket, Folder, Map, Keyboard, HelpCircle, Zap, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const Docs = () => {
  const sections = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "New to the facility? Start here! We promise the onboarding won't take as long as actual deep-sea training.",
      link: "/docs/getting-started",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    {
      icon: Folder,
      title: "Core Applications",
      description: "Your digital toolbox. File Explorer, Notepad, Calculator, and other apps you'll pretend to use productively.",
      link: "/docs/applications",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Map,
      title: "Facility Applications",
      description: "The fun stuff! Security cameras, containment monitors, and other apps for managing your totally-not-haunted underwater base.",
      link: "/docs/facility",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30"
    },
    {
      icon: Terminal,
      title: "Terminal Guide",
      description: "Feel like a hacker with our command line interface. Green text on black background included, no extra charge.",
      link: "/docs/terminal",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30"
    },
    {
      icon: Zap,
      title: "Advanced Features",
      description: "BIOS, Recovery Mode, Admin Panel, and other ways to break things. Power users only! (Just kidding, anyone can break things.)",
      link: "/docs/advanced",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    {
      icon: Keyboard,
      title: "Keyboard Shortcuts",
      description: "Because real pros don't use mice. Learn all the key combos and impress absolutely no one.",
      link: "/docs/shortcuts",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    {
      icon: HelpCircle,
      title: "Troubleshooting",
      description: "Something broke? Forgot your password? Accidentally triggered a containment breach? We've got you covered.",
      link: "/docs/troubleshooting",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">URBANSHADE Documentation</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <Waves className="w-20 h-20 mx-auto text-primary animate-pulse" />
            <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full -z-10" />
          </div>
          
          <h2 className="text-5xl font-bold">
            Welcome to <span className="text-primary">URBANSHADE OS</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The only operating system designed for managing fictional underwater research facilities 
            that definitely don't contain any eldritch horrors.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🌊 8,247m Below Sea Level
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🔬 100% Fictional
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🎮 0% Actual OS
            </span>
          </div>
        </section>

        {/* What is this */}
        <section className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30">
          <h3 className="text-2xl font-bold mb-4">So, what exactly is this?</h3>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">URBANSHADE OS</strong> is a web-based simulation of a 
              retro-futuristic operating system, inspired by the game Pressure. It's like playing pretend, 
              but with more terminal commands and fewer actual responsibilities.
            </p>
            <p>
              Everything here runs in your browser. Your "files" aren't real files. Your "passwords" 
              are stored in localStorage (please don't use real passwords). The containment units 
              contain nothing but your imagination. And the crushing pressure of the deep ocean? 
              That's just Monday.
            </p>
            <p className="text-primary font-semibold">
              TL;DR: It's a fun, interactive experience. Click things, explore, and try not to 
              trigger too many simulated emergencies. 🐙
            </p>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-center">Choose Your Adventure</h3>
          <p className="text-center text-muted-foreground">
            Pick a topic and dive in. Get it? Dive? Because we're underwater? ...I'll see myself out.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section, index) => (
              <Link
                key={index}
                to={section.link}
                className={`p-6 rounded-xl ${section.bgColor} border ${section.borderColor} hover:scale-[1.02] transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center flex-shrink-0`}>
                    <section.icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-bold text-lg ${section.color} group-hover:underline`}>
                      {section.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Quick Tips for New Recruits</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-3xl mb-2">🔑</div>
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-2 py-0.5 bg-black/60 rounded border border-white/20 text-xs">DEL</kbd> during 
                boot to access BIOS
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <p className="text-sm text-muted-foreground">
                Press <kbd className="px-2 py-0.5 bg-black/60 rounded border border-white/20 text-xs">F2</kbd> during 
                boot for Recovery Mode
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 text-center">
              <div className="text-3xl mb-2">🤫</div>
              <p className="text-sm text-muted-foreground">
                Type <code className="px-2 py-0.5 bg-black/60 rounded border border-white/20 text-xs">secret</code> in 
                Terminal for... secrets
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10 space-y-4">
          <p className="text-sm text-muted-foreground">
            URBANSHADE OS Documentation • v3.2.1 • © 2024 Urbanshade Corporation
          </p>
          <p className="text-xs text-muted-foreground">
            This is a fictional simulation for entertainment purposes. No actual deep-sea facilities 
            were harmed in the making of this software. Any resemblance to real underwater research 
            stations containing anomalous entities is purely coincidental. 🐙
          </p>
          <Link to="/" className="inline-block text-primary hover:underline text-sm">
            ← Return to Simulation
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Docs;
