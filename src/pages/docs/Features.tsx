import { Zap, LogIn, Package, Bug, Monitor, Shield, Volume2, Settings, Layout, Star, Layers, FileText, Search, Terminal } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";
import SEO from "@/components/SEO";

const Features = () => {
  return (
    <DocLayout
      title="New Features Guide"
      description="Explore the latest features in Urbanshade OS - boot system, UUR package manager, DEF-DEV enhancements, and more."
      keywords={["features", "new", "update", "changelog", "boot", "uur"]}
      accentColor="cyan"
      prevPage={{ title: "Advanced Features", path: "/docs/advanced" }}
      nextPage={{ title: "DEF-DEV Guide", path: "/docs/def-dev" }}
    >
      <DocHero
        icon={Zap}
        title="Latest Features"
        subtitle="UrbanShade OS has received a major update with tons of new features to enhance 
        your facility management experience."
        accentColor="cyan"
        badge="✨ What's New"
      />

      <DocSection title="Streamlined Boot & Login" icon={LogIn} accentColor="purple" id="boot">
        <p className="mb-4">
          The boot experience has been completely redesigned for a cleaner, faster startup.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <DocCard
            title="Redesigned Installer"
            description="Modern horizontal stepper with Express Setup option for quick deployment."
            icon={Settings}
            accentColor="purple"
          />
          <DocCard
            title="OOBE Wizard"
            description="Guided Out of Box Experience for personalization and initial setup."
            icon={Layout}
            accentColor="purple"
          />
          <DocCard
            title="Login Screen"
            description="User selection with avatars, password entry, and smooth transitions."
            icon={LogIn}
            accentColor="purple"
          />
          <DocCard
            title="Clean Boot Screen"
            description="Simple progress bar with current action — no more cluttered terminal output."
            icon={Monitor}
            accentColor="purple"
          />
        </div>
      </DocSection>

      <DocSection title="UUR Package Manager" icon={Package} accentColor="cyan" id="uur">
        <p className="mb-4">
          The UrbanShade User Repository has been enhanced with powerful new features.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <DocCard
            title="Ratings & Reviews"
            description="Rate packages 1-5 stars and leave reviews to help others find quality packages."
            icon={Star}
            accentColor="cyan"
          />
          <DocCard
            title="Package Categories"
            description="Browse packages by category: Apps, Utilities, Themes, Extensions, Games, and more."
            icon={Package}
            accentColor="cyan"
          />
          <DocCard
            title="Featured Packages"
            description="Discover curated packages in the Featured section, hand-picked by the UUR team."
            icon={Zap}
            accentColor="cyan"
          />
          <DocCard
            title="Dependencies"
            description="Packages can now declare dependencies. The system auto-installs required packages."
            icon={Layers}
            accentColor="cyan"
          />
        </div>
      </DocSection>

      <DocSection title="DEF-DEV Console Enhancements" icon={Bug} accentColor="amber" id="defdev">
        <p className="mb-4">
          Developer tools have been significantly upgraded with new debugging capabilities.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Search className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400">Command Search</strong>
              <p className="text-sm text-slate-400 mt-1">
                Search through all available DEF-DEV commands with fuzzy matching and descriptions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400">Export/Import Config</strong>
              <p className="text-sm text-slate-400 mt-1">
                Save and restore your DEF-DEV preferences including filters, theme, and custom settings.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <Terminal className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400">Terminal Scripts</strong>
              <p className="text-sm text-slate-400 mt-1">
                Save multiple terminal commands as a script and execute them with a single command.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Desktop Improvements" icon={Monitor} accentColor="purple" id="desktop">
        <div className="grid gap-4 md:grid-cols-2">
          <DocCard
            title="Multiple Desktops"
            description="Create up to 8 virtual desktops to organize your windows. Switch with Ctrl+Win+←/→"
            icon={Layers}
            accentColor="purple"
          />
          <DocCard
            title="Window Groups"
            description="Group related windows together. Minimize, restore, or close entire groups at once."
            icon={Layers}
            accentColor="purple"
          />
          <DocCard
            title="File Associations"
            description="Double-click files to open them with the right app. .txt → Notepad, .img → Image Editor."
            icon={FileText}
            accentColor="purple"
          />
          <DocCard
            title="Doc Search"
            description="Search across all documentation from the docs page header. Find anything instantly."
            icon={Search}
            accentColor="purple"
          />
        </div>
      </DocSection>

      <DocSection title="Crash & Recovery System" icon={Shield} accentColor="red" id="crash">
        <p className="mb-4">
          Enhanced error handling and recovery options to keep your system safe.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-400">Bugcheck Severity Levels</strong>
              <p className="text-sm text-slate-400 mt-1">
                Errors now have severity levels: WARNING (recoverable), CRITICAL (action needed), 
                and FATAL (system halt).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <FileText className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-red-400">Crash Dump Files</strong>
              <p className="text-sm text-slate-400 mt-1">
                Download detailed .dmp files with full crash information for debugging and reporting.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Sound Effects" icon={Volume2} accentColor="green" id="sounds">
        <p className="mb-4">
          Immersive audio feedback for system events (when enabled in Settings).
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["🔊 Boot sounds", "🔔 Notifications", "📧 Messages", "✓ Success", "⚠ Warnings", "❌ Errors", "🔐 Login/Logout", "📦 App open/close"].map((item) => (
            <div key={item} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default Features;