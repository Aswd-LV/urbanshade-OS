import { ArrowLeft, Package, Star, Search, Terminal, Monitor, Layers, Shield, Volume2, Bug, FileText, Zap, LogIn, Settings, Layout } from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">New Features Guide</h1>
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
            <Zap className="w-10 h-10 text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-slate-100">Latest Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            UrbanShade OS has received a major update with tons of new features to enhance 
            your facility management experience.
          </p>
        </section>

        {/* Boot & Login System */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Streamlined Boot & Login</h3>
          </div>
          <div className="p-6 rounded-xl bg-violet-500/10 border border-violet-500/30 space-y-4">
            <p className="text-slate-400">
              The boot experience has been completely redesigned for a cleaner, faster startup.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-violet-400 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Redesigned Installer
                </h4>
                <p className="text-sm text-slate-400">
                  Modern horizontal stepper with Express Setup option for quick deployment.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-violet-400 mb-2 flex items-center gap-2">
                  <Layout className="w-4 h-4" /> OOBE Wizard
                </h4>
                <p className="text-sm text-slate-400">
                  Guided Out of Box Experience for personalization and initial setup.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-violet-400 mb-2 flex items-center gap-2">
                  <LogIn className="w-4 h-4" /> Login Screen
                </h4>
                <p className="text-sm text-slate-400">
                  User selection with avatars, password entry, and smooth transitions.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-violet-400 mb-2 flex items-center gap-2">
                  <Monitor className="w-4 h-4" /> Clean Boot Screen
                </h4>
                <p className="text-sm text-slate-400">
                  Simple progress bar with current action — no more cluttered terminal output.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UUR Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">UUR Package Manager</h3>
          </div>
          <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-4">
            <p className="text-slate-400">
              The UrbanShade User Repository has been enhanced with powerful new features.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Ratings & Reviews
                </h4>
                <p className="text-sm text-slate-400">
                  Rate packages 1-5 stars and leave reviews to help others find quality packages.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Package Categories
                </h4>
                <p className="text-sm text-slate-400">
                  Browse packages by category: Apps, Utilities, Themes, Extensions, Games, and more.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Featured Packages
                </h4>
                <p className="text-sm text-slate-400">
                  Discover curated packages in the Featured section, hand-picked by the UUR team.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Dependencies
                </h4>
                <p className="text-sm text-slate-400">
                  Packages can now declare dependencies. The system auto-installs required packages.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEF-DEV Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Bug className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">DEF-DEV Console Enhancements</h3>
          </div>
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <p className="text-slate-400">
              Developer tools have been significantly upgraded with new debugging capabilities.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Search className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">Command Search</strong>
                  <p className="text-sm text-slate-400">
                    Search through all available DEF-DEV commands with fuzzy matching and descriptions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">Export/Import Config</strong>
                  <p className="text-sm text-slate-400">
                    Save and restore your DEF-DEV preferences including filters, theme, and custom settings.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Terminal className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">Terminal Scripts</strong>
                  <p className="text-sm text-slate-400">
                    Save multiple terminal commands as a script and execute them with a single command.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Desktop Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Desktop Improvements</h3>
          </div>
          <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Multiple Desktops
                </h4>
                <p className="text-sm text-slate-400">
                  Create up to 8 virtual desktops to organize your windows. Switch with 
                  <kbd className="mx-1 px-1.5 py-0.5 bg-slate-800 rounded text-xs font-mono">Ctrl+Win+←/→</kbd>
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Window Groups
                </h4>
                <p className="text-sm text-slate-400">
                  Group related windows together. Minimize, restore, or close entire groups at once.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> File Associations
                </h4>
                <p className="text-sm text-slate-400">
                  Double-click files to open them with the right app. .txt → Notepad, .img → Image Editor.
                </p>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Doc Search
                </h4>
                <p className="text-sm text-slate-400">
                  Search across all documentation from the docs page header. Find anything instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bugcheck Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Crash & Recovery System</h3>
          </div>
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 space-y-4">
            <p className="text-slate-400">
              Enhanced error handling and recovery options to keep your system safe.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">Bugcheck Severity Levels</strong>
                  <p className="text-sm text-slate-400">
                    Errors now have severity levels: WARNING (recoverable), CRITICAL (action needed), 
                    and FATAL (system halt). Each level has different behaviors.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">Crash Dump Files</strong>
                  <p className="text-sm text-slate-400">
                    Download detailed .dmp files with full crash information for debugging and reporting.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">Crash Recovery</strong>
                  <p className="text-sm text-slate-400">
                    After a crash, choose to restore from a recovery point or continue with current state.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Sound Effects */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Sound Effects</h3>
          </div>
          <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 space-y-4">
            <p className="text-slate-400">
              Immersive audio feedback for system events (when enabled in Settings).
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-400">
              {["🔊 Boot sounds", "🔔 Notifications", "📧 Messages", "✓ Success", "⚠ Warnings", "❌ Errors", "🔐 Login/Logout", "📦 App open/close"].map((item) => (
                <li key={item} className="p-2 bg-slate-900/50 rounded-lg border border-slate-700/50 text-center">{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flex justify-between pt-8 border-t border-slate-700/50">
          <Link to="/docs/advanced" className="text-cyan-400 hover:text-cyan-300 transition-colors">← Advanced Features</Link>
          <Link to="/docs/def-dev" className="text-cyan-400 hover:text-cyan-300 transition-colors">DEF-DEV Guide →</Link>
        </div>
      </main>
    </div>
  );
};

export default Features;