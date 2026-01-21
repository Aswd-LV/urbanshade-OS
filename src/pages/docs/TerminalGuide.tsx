import { ArrowLeft, Terminal, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

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
    <>
    <SEO 
      title="Terminal Guide" 
      description="Complete command-line reference for Urbanshade OS terminal - basic commands, file operations, and secret commands."
      path="/docs/terminal"
    />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">Terminal Guide</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <Terminal className="w-16 h-16 mx-auto text-cyan-400" />
          <h2 className="text-4xl font-bold text-white">Command Line Mastery</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The Terminal is where the magic happens. Or at least where you can pretend 
            to be a hacker from a 90s movie. Green text on black background included!
          </p>
        </section>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 font-mono text-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <span className="text-cyan-400">user@urbanshade</span>
            <span>:</span>
            <span className="text-blue-400">~</span>
            <span>$</span>
            <span className="text-white animate-pulse">_</span>
          </div>
          <p className="text-slate-500 text-xs">
            This is what your terminal prompt looks like. Type commands after the $ symbol.
          </p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Basic Commands</h3>
          <p className="text-slate-400">Start here if you're new to command lines. No judgment!</p>
          <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-900/50">
                  <th className="text-left p-4 font-mono text-cyan-400">Command</th>
                  <th className="text-left p-4 text-slate-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {basicCommands.map((item, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-cyan-400">{item.cmd}</td>
                    <td className="p-4 text-slate-400 text-sm">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">File System Commands</h3>
          <p className="text-slate-400">Navigate the simulated file system like a pro.</p>
          <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-900/50">
                  <th className="text-left p-4 font-mono text-cyan-400">Command</th>
                  <th className="text-left p-4 text-slate-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {fileCommands.map((item, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-cyan-400">{item.cmd}</td>
                    <td className="p-4 text-slate-400 text-sm">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">System Commands</h3>
          <p className="text-slate-400">For the power users among us.</p>
          <div className="rounded-xl bg-slate-800/50 border border-cyan-500/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-slate-900/50">
                  <th className="text-left p-4 font-mono text-cyan-400">Command</th>
                  <th className="text-left p-4 text-slate-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {systemCommands.map((item, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-cyan-400">{item.cmd}</td>
                    <td className="p-4 text-slate-400 text-sm">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl font-bold text-white">Secret Commands</h3>
          </div>
          <p className="text-slate-400">
            Shh! These are the hidden gems. Don't tell anyone we told you about them.
          </p>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/30 bg-amber-500/5">
                  <th className="text-left p-4 font-mono text-amber-500">Command</th>
                  <th className="text-left p-4 text-slate-300">What it does</th>
                  <th className="text-left p-4 text-slate-300">Hint</th>
                </tr>
              </thead>
              <tbody>
                {secretCommands.map((item, i) => (
                  <tr key={i} className="border-b border-amber-500/10 hover:bg-amber-500/5">
                    <td className="p-4 font-mono text-amber-500">{item.cmd}</td>
                    <td className="p-4 text-slate-400 text-sm">{item.desc}</td>
                    <td className="p-4 text-xs text-amber-500/70 italic">{item.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h3 className="font-bold text-cyan-400 mb-2">🎮 Easter Egg Hunt</h3>
          <p className="text-sm text-slate-400">
            There might be more secret commands than what's listed here. 
            Try different things! The worst that can happen is an error message. 
            Or a simulated facility meltdown. One of those.
          </p>
        </div>

        <div className="flex justify-between pt-8 border-t border-cyan-500/20">
          <Link to="/docs/facility" className="text-cyan-400 hover:underline">← Facility Apps</Link>
          <Link to="/docs/advanced" className="text-cyan-400 hover:underline">Advanced Features →</Link>
        </div>
      </main>
    </div>
    </>
  );
};

export default TerminalGuide;
