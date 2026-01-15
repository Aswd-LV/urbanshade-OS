import { ArrowLeft, Terminal, Code, Zap, ChevronRight, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const TerminalDocs = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const commands = [
    {
      name: "help",
      description: "Display available commands",
      usage: "help [command]",
      example: "help cd"
    },
    {
      name: "ls / dir",
      description: "List directory contents",
      usage: "ls [path]",
      example: "ls /home/user/documents"
    },
    {
      name: "cd",
      description: "Change current directory",
      usage: "cd <path>",
      example: "cd /system/config"
    },
    {
      name: "cat",
      description: "Display file contents",
      usage: "cat <filename>",
      example: "cat readme.txt"
    },
    {
      name: "mkdir",
      description: "Create a new directory",
      usage: "mkdir <dirname>",
      example: "mkdir projects"
    },
    {
      name: "rm",
      description: "Remove files or directories",
      usage: "rm [-r] <path>",
      example: "rm -r old_folder"
    },
    {
      name: "echo",
      description: "Print text to terminal",
      usage: "echo <text>",
      example: "echo Hello World"
    },
    {
      name: "clear",
      description: "Clear terminal screen",
      usage: "clear",
      example: "clear"
    },
    {
      name: "whoami",
      description: "Display current user",
      usage: "whoami",
      example: "whoami"
    },
    {
      name: "sudo",
      description: "Execute command as admin",
      usage: "sudo <command>",
      example: "sudo reboot"
    }
  ];

  const customCommandExample = `// In src/lib/terminalScripts.ts
export const customCommands = {
  greet: {
    description: "Greet the user",
    usage: "greet [name]",
    execute: (args: string[]) => {
      const name = args[0] || "User";
      return \`Hello, \${name}! Welcome to UrbanShade OS.\`;
    }
  }
};`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-teal-100">Terminal Commands</h1>
              <p className="text-xs text-teal-500/70">Developer Documentation</p>
            </div>
          </div>
          <Link 
            to="/docs/dev" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Terminal Command API</h2>
          <p className="text-slate-400 leading-relaxed">
            The UrbanShade terminal supports built-in commands and allows developers to register custom commands.
            Commands are executed in a sandboxed environment with access to the virtual file system.
          </p>
        </section>

        {/* Built-in Commands */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Built-in Commands
          </h3>
          
          <div className="space-y-3">
            {commands.map((cmd, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="px-2 py-1 rounded-lg bg-teal-500/20 text-teal-400 font-mono text-sm">
                        {cmd.name}
                      </code>
                      <span className="text-slate-400 text-sm">{cmd.description}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Usage: <span className="text-cyan-400">{cmd.usage}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                      {cmd.example}
                    </code>
                    <button
                      onClick={() => copyCode(cmd.example, cmd.name)}
                      className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      {copied === cmd.name ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Commands */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-400" />
            Creating Custom Commands
          </h3>
          
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 space-y-4">
            <p className="text-slate-400 text-sm">
              Register custom commands by adding them to the terminal scripts file:
            </p>
            
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono overflow-x-auto">
                <code className="text-slate-300">{customCommandExample}</code>
              </pre>
              <button
                onClick={() => copyCode(customCommandExample, 'custom')}
                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copied === 'custom' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <p className="text-teal-300 text-sm">
                <strong>Tip:</strong> Commands can return strings for simple output or JSX elements for rich formatting.
                Access the virtual file system through the provided context object.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <Link to="/docs/dev" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Developer Docs
            </Link>
            <Link to="/docs/dev/system-bus" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              System Bus API
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TerminalDocs;
