import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

export const ChangelogDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("2.5");
  const currentVersion = "2.5";

  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("urbanshade_last_seen_version");
    if (lastSeenVersion !== currentVersion) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("urbanshade_last_seen_version", currentVersion);
    setOpen(false);
  };

  const changelogs: Record<string, Record<string, string[]>> = {
    "2.5": {
      "UUR Manager": [
        "New UUR Manager app accessible from Desktop and Terminal",
        "Real built-in packages: Hello World (test app) and System Info (utility)",
        "Package submission system for community contributions",
        "Install, uninstall, and run UUR apps directly in the OS",
        "GitHub-based package submission with review workflow"
      ],
      "CrashScreen Redesign": [
        "Styled crash screen with different colors per crash type",
        "Clear labeling as 'Styled Crash Screen' for testing",
        "Distinct visual separation from real BugcheckScreen"
      ],
      "Command Queue Expansion": [
        "Admin tools now use command queue instead of page redirects",
        "Added UUR commands (uur inst, uur rm, uur up, uur search)",
        "New commands: MAINTENANCE, SAFE_MODE, LOGOUT",
        "Package management helpers for apt install/remove"
      ],
      "Documentation": [
        "UUR docs expanded with full command reference",
        "Table of contents and featured packages section",
        "In-app Browser can now load documentation pages",
        "DEF-DEV docs link added to UUR documentation"
      ],
      "DEF-DEV Improvements": [
        "Redesigned DEF-DEV warning with terminal aesthetic",
        "Enhanced admin tools using SystemBus APIs",
        "Improved crash entry mode workflow"
      ]
    },
    "2.4": {
      "DEF-DEV Enhancements": [
        "Redesigned warning screen with terminal aesthetic and detailed info",
        "Added first-boot DEF-DEV setup with consent flow",
        "Persistent warning acceptance while dev mode is enabled",
        "Alternative dev storage for development mode data",
        "Enhanced crash entry mode with automatic bugcheck tab navigation",
        "New Diagnostics tab for system health monitoring"
      ],
      "System Improvements": [
        "AdminPanel now uses SystemBus API more extensively",
        "Added UUR and Diagnostics routes to documentation",
        "Fixed action logger spamming errors on open",
        "Improved crash screen with clear 'not a simulation' message"
      ],
      "Documentation Updates": [
        "Expanded all documentation sections",
        "Added UUR (UrbanShade User Repository) documentation",
        "New Diagnostics documentation page",
        "Updated DEF-DEV Index with new sections",
        "Enhanced Getting Started and Applications guides"
      ],
      "Bug Fixes": [
        "Fixed dev mode toggle opening DEF-DEV in new window before refresh",
        "Fixed logging not working properly in DEF-DEV",
        "Corrected HTML title to show v2.4"
      ]
    },
    "2.3": {
      "DEF-DEV Overhaul": [
        "Complete DEF-DEV documentation with 8 dedicated sub-pages",
        "New DEF-DEV Terminal with command queue support for remote execution",
        "Enhanced bugcheck system with detailed error analysis",
        "Action monitoring with persistence and consent system",
        "Recovery image management with import/export/editing"
      ],
      "Bugcheck System": [
        "New BugcheckScreen with severity levels and readable explanations",
        "Automatic bugcheck logging to DEF-DEV console",
        "System info capture including memory usage and browser details",
        "Stack trace support for debugging"
      ],
      "Documentation": [
        "DEF-DEV Setup & Access guide",
        "Console Tab documentation",
        "Actions Tab documentation",
        "Storage Tab documentation",
        "Terminal documentation",
        "Admin Panel documentation",
        "Bugchecks documentation",
        "API Reference documentation"
      ],
      "Improvements": [
        "Enhanced crash screen with detailed 'not a simulation' warning",
        "Fixed desktop icon dragging issues - now uses grid layout",
        "DEF-DEV link added to main documentation page"
      ]
    },
    "2.2": {
      "New Features": [
        "Added comprehensive Documentation System with 7 detailed guide pages",
        "Power menu now includes 'Reboot Options' dropdown with BIOS and Recovery shortcuts",
        "Created multi-version changelog viewer to track update history",
        "Enhanced disclaimer screen with detailed privacy and security information"
      ],
      "Improvements": [
        "Documentation includes jokes and personality for better user experience",
        "Improved startup disclaimer with clearer data storage explanations",
        "Better navigation between documentation pages",
        "Enhanced visual consistency across system components"
      ],
      "Bug Fixes": [
        "Fixed window minimize functionality - windows now properly minimize to taskbar",
        "Fixed new user accounts not appearing on login screen",
        "Improved account persistence across sessions"
      ],
      "Documentation": [
        "Getting Started guide for new users",
        "Core Applications reference",
        "Facility Applications guide",
        "Terminal command reference",
        "Advanced Features documentation",
        "Keyboard Shortcuts reference",
        "Troubleshooting guide"
      ]
    },
    "2.1": {
      "New Features": [
        "Redesigned BIOS to modern UEFI interface",
        "Added proper app installer with configuration options",
        "File Reader now supports editing files",
        "Enhanced Task Manager with more detailed process information",
        "Improved Emergency Protocols with additional options",
        "Added 'Open with File Reader' integration in File Explorer"
      ],
      "Improvements": [
        "Recovery Mode now uses consistent Urbanshade theme",
        "Settings now have more functional options",
        "Enhanced hallway visuals in Facility Planner",
        "Better UI consistency across all applications",
        "Improved contributor attribution (Aswdbatch)",
        "Better facility plan export functionality"
      ],
      "Bug Fixes": [
        "Fixed File Reader not appearing in app list",
        "Fixed Facility Planner room selection issues",
        "Corrected version numbers throughout system",
        "Various stability improvements"
      ],
      "System Updates": [
        "Updated to Urbanshade OS v2.1",
        "Improved performance and responsiveness",
        "Better error handling throughout the system",
        "Enhanced animations and transitions"
      ]
    },
    "2.0": {
      "Major Changes": [
        "Complete rewrite using React and Tailwind CSS",
        "Modern component-based architecture",
        "Improved performance and maintainability",
        "Enhanced visual design system"
      ],
      "New Foundation": [
        "TypeScript for better code quality",
        "Vite for faster development",
        "Modern build pipeline",
        "Responsive design system"
      ]
    }
  };

  const changelog = changelogs[selectedVersion] || changelogs["2.2"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            URBANSHADE OS Updates
          </DialogTitle>
        </DialogHeader>

        {/* Version Selector */}
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(changelogs).map((version) => (
            <button
              key={version}
              onClick={() => setSelectedVersion(version)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedVersion === version
                  ? "bg-primary text-black"
                  : "bg-black/40 border border-white/10 hover:border-primary/50"
              }`}
            >
              v{version}
            </button>
          ))}
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {selectedVersion === currentVersion && <span className="text-primary font-semibold">Latest Version</span>}
          {selectedVersion === "2.0" && <span className="text-yellow-500">Foundation Release - React Migration</span>}
        </div>

        <div className="space-y-6 py-4">
          {Object.entries(changelog).map(([section, items], sectionIndex) => (
            <div key={section} className="space-y-3">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Check className="w-5 h-5" />
                {section}
              </h3>
              <ul className="space-y-2 text-sm ml-7">
                {items.map((text, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 animate-fade-in"
                    style={{ animationDelay: `${0.1 * (sectionIndex * 5 + i)}s` }}
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Thank you for using URBANSHADE OS!
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose} className="animate-fade-in">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
