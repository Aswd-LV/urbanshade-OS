import { Terminal, Zap, Code } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCode, DocAlert } from "@/components/docs";

const TerminalDocs = () => {
  const commands = [
    { name: "help", description: "Display available commands", usage: "help [command]", example: "help cd" },
    { name: "ls / dir", description: "List directory contents", usage: "ls [path]", example: "ls /home/user/documents" },
    { name: "cd", description: "Change current directory", usage: "cd <path>", example: "cd /system/config" },
    { name: "cat", description: "Display file contents", usage: "cat <filename>", example: "cat readme.txt" },
    { name: "mkdir", description: "Create a new directory", usage: "mkdir <dirname>", example: "mkdir projects" },
    { name: "rm", description: "Remove files or directories", usage: "rm [-r] <path>", example: "rm -r old_folder" },
    { name: "echo", description: "Print text to terminal", usage: "echo <text>", example: "echo Hello World" },
    { name: "clear", description: "Clear terminal screen", usage: "clear", example: "clear" },
    { name: "whoami", description: "Display current user", usage: "whoami", example: "whoami" },
    { name: "sudo", description: "Execute command as admin", usage: "sudo <command>", example: "sudo reboot" }
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
    <DocLayout
      title="Terminal Commands"
      description="Built-in terminal commands and how to register custom commands in UrbanShade OS."
      keywords={["terminal", "commands", "cli", "shell", "api"]}
      accentColor="teal"
      breadcrumbs={[{ label: "Developer", path: "/docs/dev" }]}
      prevPage={{ title: "Building Apps", path: "/docs/dev/apps" }}
      nextPage={{ title: "System Bus", path: "/docs/dev/system-bus" }}
    >
      <DocHero
        icon={Terminal}
        title="Terminal Command API"
        subtitle="The UrbanShade terminal supports built-in commands and allows developers to register custom commands."
        accentColor="teal"
      />

      <DocSection title="Built-in Commands" icon={Zap} accentColor="teal">
        <div className="space-y-3">
          {commands.map((cmd, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="px-2 py-1 rounded-lg bg-teal-500/20 text-teal-400 font-mono text-sm">
                      {cmd.name}
                    </code>
                    <span className="text-slate-400 text-sm">{cmd.description}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Usage: <span className="text-cyan-400">{cmd.usage}</span>
                  </div>
                </div>
                <code className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">
                  {cmd.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Creating Custom Commands" icon={Code} accentColor="teal">
        <p className="text-slate-400 mb-4">
          Register custom commands by adding them to the terminal scripts file:
        </p>
        <DocCode title="Custom Command Example" code={customCommandExample} />
        
        <DocAlert variant="tip" title="Pro Tip">
          Commands can return strings for simple output or JSX elements for rich formatting.
          Access the virtual file system through the provided context object.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default TerminalDocs;
