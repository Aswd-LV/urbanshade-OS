import { ArrowLeft, Terminal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const TerminalGuide = () => {
  const basicCommands = [
    { cmd: "help", desc: "Shows all available commands. The first command you should run!" },
    { cmd: "clear", desc: "Clears the terminal screen. For when things get messy." },
    { cmd: "status", desc: "Display current system status. Is everything on fire? Check here." },
    { cmd: "whoami", desc: "Shows your current user. In case you forgot who you are." },
    { cmd: "date", desc: "Current date and time. Time moves differently 8km underwater." },
  ];

  const fileCommands = [
    { cmd: "ls", desc: "List files in current directory. What's in the box?!" },
    { cmd: "cd <dir>", desc: "Change directory. Navigate the labyrinth." },
    { cmd: "pwd", desc: "Print working directory. Where am I?" },
    { cmd: "cat <file>", desc: "Display file contents. Read the forbidden texts." },
    { cmd: "mkdir <name>", desc: "Create a new directory. Expand your domain." },
  ];

  const systemCommands = [
    { cmd: "neofetch", desc: "Show system information in style. Very aesthetic." },
    { cmd: "uptime", desc: "How long has the system been running? Too long, probably." },
    { cmd: "ps", desc: "List running processes. See what's happening behind the scenes." },
    { cmd: "kill <pid>", desc: "Terminate a process. With extreme prejudice." },
    { cmd: "reboot", desc: "Restart the system. Have you tried turning it off and on again?" },
    { cmd: "shutdown", desc: "Power off. Goodbye, cruel simulated world." },
  ];

  const secretCommands = [
    { cmd: "secret", desc: "???", hint: "Opens something special..." },
    { cmd: "matrix", desc: "???", hint: "Feel like Neo" },
    { cmd: "panic", desc: "???", hint: "Don't actually panic" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Terminal Guide</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <Terminal className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Command Line Mastery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Terminal is where the magic happens. Or at least where you can pretend 
            to be a hacker from a 90s movie. Green text on black background included!
          </p>
        </section>

        <div className="p-4 rounded-lg bg-black/60 border border-primary/30 font-mono text-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-primary">user@urbanshade</span>
            <span>:</span>
            <span className="text-blue-400">~</span>
            <span>$</span>
            <span className="text-foreground animate-pulse">_</span>
          </div>
          <p className="text-muted-foreground text-xs">
            This is what your terminal prompt looks like. Type commands after the $ symbol.
          </p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Basic Commands</h3>
          <p className="text-muted-foreground">Start here if you're new to command lines. No judgment!</p>
          <div className="rounded-lg bg-black/60 border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 font-mono text-primary">Command</th>
                  <th className="text-left p-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {basicCommands.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-mono text-primary">{item.cmd}</td>
                    <td className="p-4 text-muted-foreground text-sm">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">File System Commands</h3>
          <p className="text-muted-foreground">Navigate the simulated file system like a pro.</p>
          <div className="rounded-lg bg-black/60 border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 font-mono text-primary">Command</th>
                  <th className="text-left p-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {fileCommands.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-mono text-primary">{item.cmd}</td>
                    <td className="p-4 text-muted-foreground text-sm">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">System Commands</h3>
          <p className="text-muted-foreground">For the power users among us.</p>
          <div className="rounded-lg bg-black/60 border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 font-mono text-primary">Command</th>
                  <th className="text-left p-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {systemCommands.map((item, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 font-mono text-primary">{item.cmd}</td>
                    <td className="p-4 text-muted-foreground text-sm">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h3 className="text-2xl font-bold">Secret Commands</h3>
          </div>
          <p className="text-muted-foreground">
            Shh! These are the hidden gems. Don't tell anyone we told you about them.
          </p>
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yellow-500/30 bg-yellow-500/5">
                  <th className="text-left p-4 font-mono text-yellow-500">Command</th>
                  <th className="text-left p-4">What it does</th>
                  <th className="text-left p-4">Hint</th>
                </tr>
              </thead>
              <tbody>
                {secretCommands.map((item, i) => (
                  <tr key={i} className="border-b border-yellow-500/10 hover:bg-yellow-500/5">
                    <td className="p-4 font-mono text-yellow-500">{item.cmd}</td>
                    <td className="p-4 text-muted-foreground text-sm">{item.desc}</td>
                    <td className="p-4 text-xs text-yellow-500/70 italic">{item.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="p-6 rounded-lg bg-primary/10 border border-primary/30">
          <h3 className="font-bold text-primary mb-2">🎮 Easter Egg Hunt</h3>
          <p className="text-sm text-muted-foreground">
            There might be more secret commands than what's listed here. 
            Try different things! The worst that can happen is an error message. 
            Or a simulated facility meltdown. One of those.
          </p>
        </div>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs/facility" className="text-primary hover:underline">← Facility Apps</Link>
          <Link to="/docs/advanced" className="text-primary hover:underline">Advanced Features →</Link>
        </div>
      </main>
    </div>
  );
};

export default TerminalGuide;
