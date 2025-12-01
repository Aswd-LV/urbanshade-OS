import { ArrowLeft, Keyboard } from "lucide-react";
import { Link } from "react-router-dom";

const Shortcuts = () => {
  const bootShortcuts = [
    { keys: ["DEL"], action: "Access BIOS", context: "During boot" },
    { keys: ["F2"], action: "Recovery Mode", context: "During boot" },
    { keys: ["F8"], action: "Safe Mode", context: "During boot" },
    { keys: ["ESC"], action: "Skip boot animation", context: "During boot" },
  ];

  const desktopShortcuts = [
    { keys: ["Win"], action: "Open Start Menu", context: "Desktop" },
    { keys: ["Alt", "F4"], action: "Close active window", context: "Desktop" },
    { keys: ["Alt", "Tab"], action: "Switch windows", context: "Desktop" },
    { keys: ["Ctrl", "Shift", "Esc"], action: "Open Task Manager", context: "Desktop" },
  ];

  const terminalShortcuts = [
    { keys: ["↑"], action: "Previous command", context: "Terminal" },
    { keys: ["↓"], action: "Next command", context: "Terminal" },
    { keys: ["Tab"], action: "Auto-complete", context: "Terminal" },
    { keys: ["Ctrl", "C"], action: "Cancel command", context: "Terminal" },
    { keys: ["Ctrl", "L"], action: "Clear screen", context: "Terminal" },
  ];

  const renderKeys = (keys: string[]) => (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-black/60 rounded border border-white/20 font-mono text-sm">
            {key}
          </kbd>
          {i < keys.length - 1 && <span className="text-muted-foreground">+</span>}
        </span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Keyboard Shortcuts</h1>
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
          <Keyboard className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Become a Keyboard Ninja</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Why click when you can clack? Master these shortcuts and navigate 
            URBANSHADE OS like you've been doing it for years.
          </p>
        </section>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-sm text-center">
            <span className="font-bold text-primary">Note:</span> Some shortcuts only work in specific contexts. 
            Don't try to Ctrl+C your way out of a containment breach.
          </p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Boot Sequence</h3>
          <p className="text-muted-foreground">
            These need to be pressed at the right moment during system startup. 
            Timing is everything!
          </p>
          <div className="rounded-lg bg-black/40 border border-white/10 overflow-hidden">
            {bootShortcuts.map((shortcut, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5"
              >
                {renderKeys(shortcut.keys)}
                <span className="text-foreground">{shortcut.action}</span>
                <span className="text-xs text-muted-foreground">{shortcut.context}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Desktop Navigation</h3>
          <p className="text-muted-foreground">
            Navigate around the desktop like a pro. Impress absolutely no one!
          </p>
          <div className="rounded-lg bg-black/40 border border-white/10 overflow-hidden">
            {desktopShortcuts.map((shortcut, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5"
              >
                {renderKeys(shortcut.keys)}
                <span className="text-foreground">{shortcut.action}</span>
                <span className="text-xs text-muted-foreground">{shortcut.context}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Terminal</h3>
          <p className="text-muted-foreground">
            Command line efficiency. Because real hackers don't use mice.
          </p>
          <div className="rounded-lg bg-black/40 border border-white/10 overflow-hidden">
            {terminalShortcuts.map((shortcut, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5"
              >
                {renderKeys(shortcut.keys)}
                <span className="text-foreground">{shortcut.action}</span>
                <span className="text-xs text-muted-foreground">{shortcut.context}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">The Secret Combo</h3>
          <div className="p-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30 space-y-4">
            <p className="text-muted-foreground">
              There's a secret key combination that does something special. 
              We're not going to tell you what it is. That's the point of a secret.
            </p>
            <p className="text-sm text-yellow-500 italic">
              Hint: It involves the Konami Code. Or does it? 🤔
            </p>
          </div>
        </section>

        <div className="p-6 rounded-lg bg-black/40 border border-white/10">
          <h3 className="font-bold text-primary mb-4">Quick Reference Card</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground">🚀 <strong>DEL</strong> = BIOS</p>
              <p className="text-muted-foreground">🔄 <strong>F2</strong> = Recovery</p>
              <p className="text-muted-foreground">🏠 <strong>Win</strong> = Start Menu</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">❌ <strong>Alt+F4</strong> = Close Window</p>
              <p className="text-muted-foreground">🔀 <strong>Alt+Tab</strong> = Switch Apps</p>
              <p className="text-muted-foreground">📊 <strong>Ctrl+Shift+Esc</strong> = Task Manager</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs/advanced" className="text-primary hover:underline">← Advanced Features</Link>
          <Link to="/docs/troubleshooting" className="text-primary hover:underline">Troubleshooting →</Link>
        </div>
      </main>
    </div>
  );
};

export default Shortcuts;
