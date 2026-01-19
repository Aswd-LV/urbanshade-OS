import { ArrowLeft, Rocket, User, Monitor, CheckCircle, LogIn, Layout } from "lucide-react";
import { Link } from "react-router-dom";

const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">Getting Started</h1>
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
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Rocket className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-slate-100">Welcome Aboard, New Recruit!</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            So you've been assigned to an underwater research facility 8,247 meters below sea level. 
            Don't worry, the pressure is only... extreme. Let's get you set up!
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
            <span className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm">1</span>
            The Installation Process
          </h3>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-4">
            <p className="text-slate-400">
              When you first launch URBANSHADE OS, you'll be greeted by our streamlined installer. 
              Choose your installation type based on your needs:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-cyan-300">Minimal</span>
                  <span className="text-slate-400"> - Core system only for backup terminals (~2 min)</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-cyan-300">Standard</span>
                  <span className="text-slate-400"> - Essential facility tools, recommended (~5 min)</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-cyan-300">Complete</span>
                  <span className="text-slate-400"> - All applications and research modules (~10 min)</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
            <span className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm">2</span>
            OOBE (Out of Box Experience)
          </h3>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-4">
            <p className="text-slate-400">
              After installation, you'll go through OOBE — the Out of Box Experience. 
              This is where you personalize your facility workstation with your preferences.
            </p>
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <p className="text-sm text-cyan-300">
                <span className="font-bold">Pro tip:</span> The OOBE wizard guides you through setting up 
                your profile, choosing themes, and configuring initial preferences. Take your time here!
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2">OOBE Steps</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Welcome screen</li>
                  <li>• Account creation</li>
                  <li>• Theme selection</li>
                  <li>• Privacy settings</li>
                  <li>• Final setup</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2">What You Can Configure</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Username & password</li>
                  <li>• Display name</li>
                  <li>• Avatar selection</li>
                  <li>• Developer mode</li>
                  <li>• Initial preferences</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
            <span className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm">3</span>
            Login Screen
          </h3>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <LogIn className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400">
                  After OOBE, you'll see the login screen. Select your user account 
                  and enter your password to access the desktop.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-amber-400">
                <span className="font-bold">⚠️ Remember:</span> This is a simulation! 
                Don't use real passwords. Everything is stored in your browser's localStorage.
              </p>
            </div>
            <ul className="space-y-2 ml-4 text-slate-400">
              <li>• Click on your user account to select it</li>
              <li>• Enter your password in the field</li>
              <li>• Press Enter or click the arrow to log in</li>
              <li>• You can also use the lock screen (Win+L) later</li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
            <span className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm">4</span>
            Your Desktop
          </h3>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Layout className="w-7 h-7 text-cyan-400" />
              </div>
              <p className="text-slate-400">
                Welcome to your underwater command center! The desktop features icons, 
                a taskbar at the bottom, and the Start Menu for accessing all applications.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2">Desktop Elements</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Desktop icons for quick access</li>
                  <li>• Taskbar with open windows</li>
                  <li>• Start button (bottom left)</li>
                  <li>• System tray (bottom right)</li>
                  <li>• Quick settings panel</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2">Quick Actions</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Double-click icons to open apps</li>
                  <li>• Right-click for context menus</li>
                  <li>• Drag windows to snap them</li>
                  <li>• Click the clock for calendar</li>
                  <li>• Use Start Menu to find apps</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
            <span className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-slate-900 font-bold text-sm">5</span>
            Keyboard Shortcuts
          </h3>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700/50 space-y-4">
            <p className="text-slate-400">
              Master these shortcuts to navigate like a pro:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                { key: "Ctrl + Shift + T", action: "Open Terminal" },
                { key: "Ctrl + Shift + D", action: "Open DEF-DEV (if enabled)" },
                { key: "Alt + F4", action: "Close active window" },
                { key: "Win + L", action: "Lock screen" },
                { key: "Win + D", action: "Show desktop" },
                { key: "F11", action: "Toggle fullscreen" },
              ].map((shortcut) => (
                <div key={shortcut.key} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <code className="text-cyan-400 font-mono">{shortcut.key}</code>
                  <p className="text-slate-500 text-xs mt-1">{shortcut.action}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-between pt-8 border-t border-slate-700/50">
          <Link to="/docs" className="text-cyan-400 hover:text-cyan-300 transition-colors">← Back to Documentation</Link>
          <Link to="/docs/applications" className="text-cyan-400 hover:text-cyan-300 transition-colors">Applications Guide →</Link>
        </div>
      </main>
    </div>
  );
};

export default GettingStarted;