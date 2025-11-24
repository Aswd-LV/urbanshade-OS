import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";

export const ChangelogDialog = () => {
  const [open, setOpen] = useState(false);
  const currentVersion = "2.1";

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

  const changelog = {
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
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            What's New in URBANSHADE OS v{currentVersion}
          </DialogTitle>
        </DialogHeader>

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
