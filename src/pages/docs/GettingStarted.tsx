import { Rocket, Monitor, CheckCircle, LogIn, Layout, Terminal, Keyboard, Settings, User } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocCode, DocAlert, DocTable } from "@/components/docs";

const GettingStarted = () => {
  return (
    <DocLayout
      title="Getting Started"
      description="Learn the basics of Urbanshade OS - installation, first boot, OOBE setup, logging in, and navigating the desktop environment."
      keywords={["urbanshade install", "first boot", "oobe", "login", "desktop setup", "new user guide"]}
      accentColor="cyan"
      nextPage={{ title: "Core Applications", path: "/docs/applications" }}
    >
      <DocHero
        icon={Rocket}
        title="Getting Started"
        subtitle="Welcome to the facility, recruit. This guide will walk you through your first boot, setup, and orientation. Try not to break anything."
        accentColor="cyan"
      />

      <DocSection title="Installation Types" icon={Monitor} accentColor="cyan">
        <p>
          When you first launch Urbanshade OS, you'll be greeted by the installation wizard. 
          Choose your installation type based on your needs:
        </p>

        <div className="grid gap-4 mt-6 lg:grid-cols-3">
          <DocCard
            title="Minimal"
            description="Core system only. Fast installation (~2 min) for backup terminals and lightweight usage."
            accentColor="cyan"
          >
            <div className="mt-3 text-xs text-slate-500">
              • Basic desktop • Terminal • Essential apps
            </div>
          </DocCard>

          <DocCard
            title="Standard"
            description="Recommended for most users. Includes facility tools and productivity apps (~5 min)."
            accentColor="cyan"
          >
            <div className="mt-3 text-xs text-slate-500">
              • All minimal features • Facility apps • Settings
            </div>
          </DocCard>

          <DocCard
            title="Complete"
            description="Full installation with all applications, research modules, and developer tools (~10 min)."
            accentColor="cyan"
          >
            <div className="mt-3 text-xs text-slate-500">
              • Everything • DEF-DEV • All games
            </div>
          </DocCard>
        </div>
      </DocSection>

      <DocSection title="OOBE Setup" icon={User} accentColor="cyan" id="oobe">
        <p>
          After installation, you'll go through the Out of Box Experience (OOBE) — 
          a wizard that helps you personalize your workstation.
        </p>

        <DocAlert variant="tip" title="Take Your Time">
          The OOBE wizard guides you through all initial settings. You can always change these later in Settings.
        </DocAlert>

        <DocTable
          headers={["Step", "Description"]}
          rows={[
            ["Welcome", "Introduction and language selection"],
            ["Account Creation", "Set your username and password"],
            ["Theme Selection", "Choose your visual theme"],
            ["Privacy Settings", "Configure data and sync preferences"],
            ["Final Setup", "Review and complete installation"],
          ]}
          accentColor="cyan"
        />
      </DocSection>

      <DocSection title="Login Screen" icon={LogIn} accentColor="cyan" id="login">
        <p>
          After OOBE, you'll see the login screen. Select your user account and enter 
          your password to access the desktop.
        </p>

        <DocAlert variant="warning" title="Simulation Reminder">
          This is a simulation! Don't use real passwords. Everything is stored in your browser's localStorage.
        </DocAlert>

        <ul className="list-disc list-inside space-y-2 text-slate-400 mt-4">
          <li>Click on your user account to select it</li>
          <li>Enter your password in the field</li>
          <li>Press Enter or click the arrow to log in</li>
          <li>Use <kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Win+L</kbd> to lock the screen later</li>
        </ul>
      </DocSection>

      <DocSection title="Desktop Overview" icon={Layout} accentColor="cyan" id="desktop">
        <p>
          Welcome to your underwater command center! The desktop is your primary workspace 
          for managing the facility.
        </p>

        <div className="grid gap-4 mt-6 lg:grid-cols-2">
          <div className="p-5 rounded-xl bg-slate-800/30 border border-cyan-500/20">
            <h4 className="font-bold text-cyan-400 mb-3">Desktop Elements</h4>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• <strong className="text-slate-200">Desktop Icons</strong> — Quick access to apps</li>
              <li>• <strong className="text-slate-200">Taskbar</strong> — Running windows and pinned apps</li>
              <li>• <strong className="text-slate-200">Start Menu</strong> — All applications (bottom left)</li>
              <li>• <strong className="text-slate-200">System Tray</strong> — Notifications and status (bottom right)</li>
              <li>• <strong className="text-slate-200">Quick Settings</strong> — Volume, brightness, toggles</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/30 border border-cyan-500/20">
            <h4 className="font-bold text-cyan-400 mb-3">Quick Actions</h4>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>• <strong className="text-slate-200">Double-click</strong> — Open apps and files</li>
              <li>• <strong className="text-slate-200">Right-click</strong> — Context menus</li>
              <li>• <strong className="text-slate-200">Drag windows</strong> — Snap to edges</li>
              <li>• <strong className="text-slate-200">Click clock</strong> — Calendar and notifications</li>
              <li>• <strong className="text-slate-200">Start button</strong> — Access all apps</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Essential Shortcuts" icon={Keyboard} accentColor="cyan" id="shortcuts">
        <p>Master these keyboard shortcuts to navigate like a pro:</p>

        <DocTable
          headers={["Shortcut", "Action"]}
          rows={[
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Ctrl + Shift + T</kbd>, "Open Terminal"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Alt + F4</kbd>, "Close active window"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Win + L</kbd>, "Lock screen"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Win + D</kbd>, "Show desktop"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">Win + Tab</kbd>, "Task view"],
            [<kbd className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400 text-xs">F11</kbd>, "Toggle fullscreen"],
          ]}
          accentColor="cyan"
        />

        <DocAlert variant="info" title="More Shortcuts">
          For a complete list of keyboard shortcuts, check out the <a href="/docs/shortcuts" className="text-cyan-400 hover:underline">Keyboard Shortcuts</a> documentation.
        </DocAlert>
      </DocSection>

      <DocSection title="Next Steps" icon={Settings} accentColor="cyan">
        <div className="grid gap-4 lg:grid-cols-2">
          <DocCard
            title="Explore Applications"
            description="Learn about File Explorer, Terminal, and other core apps."
            icon={Terminal}
            link="/docs/applications"
            accentColor="cyan"
          />
          <DocCard
            title="Facility Management"
            description="Discover security cameras, containment monitors, and more."
            icon={Monitor}
            link="/docs/facility"
            accentColor="purple"
          />
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default GettingStarted;
