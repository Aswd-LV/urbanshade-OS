import { useState, useEffect } from "react";
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Search, ExternalLink, Skull, AlertTriangle, Eye, ShieldOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { vpnState } from "@/lib/vpnState";
import { toast } from "sonner";
import { trackDarkWebVisit, trackDarkVPNConnect } from "@/hooks/useAchievementTriggers";

interface Page {
  url: string;
  title: string;
  content: JSX.Element;
  requiresVPN?: boolean;
  requiresDarkVPN?: boolean;
  darkSiteId?: 'depths' | 'blackmarket' | 'void';
}

export const Browser = () => {
  const pages: Record<string, Page> = {
    "urbanshade.local": {
      url: "urbanshade.local",
      title: "Urbanshade Intranet Portal",
      content: (
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">URBANSHADE INTRANET</h1>
            <p className="text-muted-foreground text-sm">Secure Internal Network Portal</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { url: "research.urbanshade.local", title: "Research Division", desc: "Access research data", color: "primary" },
              { url: "security.urbanshade.local", title: "Security Protocols", desc: "Security procedures", color: "primary" },
              { url: "personnel.urbanshade.local", title: "Personnel Directory", desc: "Employee contacts", color: "primary" },
              { url: "operations.urbanshade.local", title: "Operations", desc: "Daily schedules", color: "primary" },
              { url: "docs.urbanshade.local", title: "Documentation", desc: "System guides", color: "blue" },
              { url: "uur.urbanshade.local", title: "UUR Repository", desc: "Community packages", color: "cyan" },
              { url: "enhance.urbanshade.local", title: "✨ Enhanced Experience", desc: "Install as app", color: "green" },
            ].map(link => (
              <button
                key={link.url}
                onClick={() => navigate(link.url)}
                className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                  link.color === "cyan" 
                    ? "bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10" 
                    : link.color === "blue"
                    ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10"
                    : link.color === "green"
                    ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                    : "bg-muted/20 border-border/30 hover:bg-muted/30"
                }`}
              >
                <h3 className={`font-bold text-sm mb-1 ${
                  link.color === "cyan" ? "text-cyan-400" : 
                  link.color === "blue" ? "text-blue-400" : 
                  link.color === "green" ? "text-green-400" : "text-primary"
                }`}>{link.title}</h3>
                <p className="text-xs text-muted-foreground">{link.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("classified.urbanshade.local")}
            className="w-full mt-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm text-red-400">Classified Archives</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Level 5+ clearance required</p>
          </button>

          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="font-bold text-primary text-sm mb-1">System Notice</div>
            <div className="text-xs text-muted-foreground">
              All network activity is monitored. Unauthorized access will result in security response.
            </div>
          </div>
        </div>
      )
    },
    "research.urbanshade.local": {
      url: "research.urbanshade.local",
      title: "Research Division Portal",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">RESEARCH DIVISION</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Active Specimen Research</h3>
                <span className="text-xs text-red-400">CLEARANCE LEVEL 4+</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div>Z-13 "Pressure" - Behavioral Analysis Phase 3</div>
                <div>Z-96 "Pandemonium" - Containment Protocol Review</div>
                <div>Z-283 "Angler" - Deep Sea Adaptation Study</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Recent Publications</h3>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div>Pressure Resistance in Extreme Environments (Dr. Chen)</div>
                <div>Adaptive Behavior Patterns of Deep Sea Specimens</div>
                <div>Containment Optimization Strategies</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="font-bold text-red-400 text-sm mb-1">Z-13 Behavioral Alert</div>
              <div className="text-xs text-red-400/80">
                Subject has demonstrated unprecedented pattern recognition. Maintain minimum safe distance.
              </div>
            </div>
          </div>
        </div>
      )
    },
    "security.urbanshade.local": {
      url: "security.urbanshade.local",
      title: "Security Protocols",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-red-400 mb-6">SECURITY PROTOCOLS</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <h3 className="font-bold text-red-400 text-sm mb-3">Active Alerts</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Zone 4 - Elevated pressure readings
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Terminal T-07 - Failed login attempts
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Clearance Levels</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div>Level 5 - Full facility access</div>
                <div>Level 4 - Research and specimen areas</div>
                <div>Level 3 - General facility areas</div>
                <div>Level 2 - Common areas only</div>
                <div>Level 1 - Public zones</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Emergency Procedures</h3>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div>1. Containment breach - Activate lockdown</div>
                <div>2. Hull integrity warning - Evacuate to safe zones</div>
                <div>3. Power failure - Backup systems auto-engage</div>
                <div>4. Medical emergency - Contact medical bay</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "personnel.urbanshade.local": {
      url: "personnel.urbanshade.local",
      title: "Personnel Directory",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">PERSONNEL DIRECTORY</h1>
          
          <div className="space-y-2">
            {[
              { name: "Aswd", role: "Administrator", dept: "Administration", clearance: "5" },
              { name: "Dr. Chen", role: "Lead Researcher", dept: "Research", clearance: "4" },
              { name: "Tech Morgan", role: "Chief Engineer", dept: "Engineering", clearance: "3" },
              { name: "Officer Blake", role: "Security Chief", dept: "Security", clearance: "3" },
              { name: "Dr. Martinez", role: "Medical Officer", dept: "Medical", clearance: "4" },
            ].map((person, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{person.name}</div>
                  <div className="text-xs text-muted-foreground">{person.role} - {person.dept}</div>
                </div>
                <div className="text-xs font-mono text-primary px-2 py-1 rounded bg-primary/10">
                  LVL-{person.clearance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    "operations.urbanshade.local": {
      url: "operations.urbanshade.local",
      title: "Operations Center",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">OPERATIONS CENTER</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Facility Status</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Power Systems</div>
                  <div className="text-green-400 font-medium">OPERATIONAL</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Life Support</div>
                  <div className="text-green-400 font-medium">NOMINAL</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Hull Integrity</div>
                  <div className="text-green-400 font-medium">98.7%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Containment</div>
                  <div className="text-green-400 font-medium">SECURE</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Today's Schedule</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div>08:00 - Morning system diagnostics</div>
                <div>10:00 - Specimen feeding cycle</div>
                <div>14:00 - Staff meeting (Research Division)</div>
                <div>16:00 - Zone 4 pressure maintenance</div>
                <div>20:00 - Evening security sweep</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "classified.urbanshade.local": {
      url: "classified.urbanshade.local",
      title: "Classified Archives - Level 5+",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-red-400 mb-6">CLASSIFIED ARCHIVES</h1>
          
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
            <div className="font-bold text-red-400 text-sm">LEVEL 5 CLEARANCE VERIFIED</div>
            <div className="text-xs text-muted-foreground">User: aswd - Access Granted</div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-red-500/20">
              <h3 className="font-bold text-red-400 text-sm mb-3">PROJECT BLACKBOX</h3>
              <div className="text-sm space-y-1.5 text-muted-foreground">
                <div><span className="text-primary">Objective:</span> [REDACTED] at depth exceeding [REDACTED] meters</div>
                <div><span className="text-primary">Status:</span> Phase 3 - Active monitoring</div>
                <div><span className="text-primary">Lead:</span> Director Morrison</div>
                <div className="text-red-400 text-xs mt-2">Do not discuss outside Level 5 clearance</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-yellow-500/20">
              <h3 className="font-bold text-yellow-400 text-sm mb-3">INCIDENT LOG - Z-13</h3>
              <div className="text-sm space-y-1.5">
                <div className="text-red-400 text-xs">Date: [REDACTED]</div>
                <div className="text-muted-foreground">Subject breached primary containment for 3.7 seconds before recapture. Two casualties. Enhanced protocols implemented.</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Personnel Notes</h3>
              <div className="text-xs space-y-1.5 text-muted-foreground font-mono">
                <div>"It was never about the fish." - Director Morrison</div>
                <div>"The deeper you go, the less the rules apply." - Dr. Chen</div>
                <div>"We're not studying them. They're studying us." - [DELETED]</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "docs.urbanshade.local": {
      url: "docs.urbanshade.local",
      title: "Documentation Center",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-primary mb-6">DOCUMENTATION CENTER</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Getting Started</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Welcome to Urbanshade OS - managing all aspects of deep-sea facility operations.</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use the Start Menu to access applications</li>
                  <li>Double-click desktop icons to open apps</li>
                  <li>Check Messages regularly for communications</li>
                  <li>Monitor System Status for facility health</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Terminal Commands</h3>
              <div className="text-sm space-y-1 font-mono">
                <div><span className="text-primary">help</span> - Display all commands</div>
                <div><span className="text-primary">status</span> - Show system status</div>
                <div><span className="text-primary">scan</span> - Run diagnostics</div>
                <div><span className="text-primary">list</span> - List directory contents</div>
                <div><span className="text-primary">logs</span> - View system logs</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Keyboard Shortcuts</h3>
              <div className="text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open Start Menu</span>
                  <kbd className="px-2 py-0.5 bg-background/50 rounded text-xs">Click U logo</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recovery Mode</span>
                  <kbd className="px-2 py-0.5 bg-background/50 rounded text-xs">Hold Space</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "uur.urbanshade.local": {
      url: "uur.urbanshade.local",
      title: "UUR - UrbanShade User Repository",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-cyan-400 mb-6">UUR - UrbanShade User Repository</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <h3 className="font-bold text-cyan-400 text-sm mb-2">What is UUR?</h3>
              <p className="text-sm text-muted-foreground">
                Community-driven package manager for extensions, themes, and utilities.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Quick Commands</h3>
              <div className="text-sm space-y-1 font-mono">
                <div><span className="text-cyan-400">uur inst &lt;package&gt;</span> - Install</div>
                <div><span className="text-cyan-400">uur rm &lt;package&gt;</span> - Remove</div>
                <div><span className="text-cyan-400">uur search &lt;query&gt;</span> - Search</div>
                <div><span className="text-cyan-400">uur lst app</span> - List all</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
              <h3 className="font-bold text-sm mb-3">Featured Packages</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div><strong>hello-world</strong> - Test your UUR installation</div>
                <div><strong>system-info</strong> - Display system information</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-sm">
              <div className="font-bold text-cyan-400 mb-1">Tip</div>
              <div className="text-muted-foreground text-xs">
                Open the UUR Manager app from Desktop for a GUI experience.
              </div>
            </div>
          </div>
        </div>
      )
    },
    "enhance.urbanshade.local": {
      url: "enhance.urbanshade.local",
      title: "Enhanced Experience - Install as App",
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">✨ Enhanced Experience</h1>
            <p className="text-muted-foreground text-sm mb-4">
              Install UrbanShade OS as a standalone app for the best experience — no browser search bar, better performance, and native-app feel.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🖥️", label: "No address bar", desc: "Full immersion, no browser UI clutter" },
                { icon: "⚡", label: "Better FPS", desc: "Improved rendering performance" },
                { icon: "📌", label: "Desktop shortcut", desc: "Launch from taskbar or desktop" },
                { icon: "🎮", label: "Native feel", desc: "Behaves like a real application" },
              ].map((b, i) => (
                <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-center">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold text-primary">{b.label}</div>
                  <div className="text-[10px] text-muted-foreground">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <h2 className="text-lg font-bold text-primary mb-4">How to Install (Chrome)</h2>

          {/* Step 1 */}
          <div className="mb-6">
            <div className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
              Click the three-dot menu in Chrome
            </div>
            <div className="flex justify-center">
              <div className="bg-[#292b2f] rounded-lg p-1 inline-flex items-center gap-1 border border-[#3c3f44]">
                <div className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#3c3f44] text-[#e8eaed] cursor-default">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="13" r="1.2"/></svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Look for ⋮ in the top-right corner of your browser</p>
          </div>

          {/* Step 2 — Chrome menu mockup */}
          <div className="mb-6">
            <div className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
              Find "Save, share, and copy"
            </div>
            <div className="flex justify-center">
              <div className="bg-[#292b2f] rounded-lg border border-[#3c3f44] w-[260px] py-1.5 text-[#e8eaed] text-[13px] shadow-xl select-none">
                {[
                  { label: "New tab", shortcut: "Ctrl+T" },
                  { label: "New window", shortcut: "Ctrl+N" },
                  { label: "New Incognito window", shortcut: "Ctrl+Shift+N" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-1 hover:bg-[#3c3f44]">
                    <span>{item.label}</span>
                    <span className="text-[#9aa0a6] text-[11px]">{item.shortcut}</span>
                  </div>
                ))}
                <div className="border-t border-[#3c3f44] my-1" />
                {["Passwords and autofill", "History", "Downloads", "Bookmarks and lists", "Tab groups", "Extensions", "Clear browsing data..."].map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-1 hover:bg-[#3c3f44]">
                    <span>{item}</span>
                    {item === "History" && <span className="text-[#9aa0a6] text-[11px]">▸</span>}
                    {item === "Bookmarks and lists" && <span className="text-[#9aa0a6] text-[11px]">▸</span>}
                    {item === "Extensions" && <span className="text-[#9aa0a6] text-[11px]">▸</span>}
                  </div>
                ))}
                <div className="border-t border-[#3c3f44] my-1" />
                <div className="px-3 py-1 hover:bg-[#3c3f44] flex justify-between">
                  <span>Zoom</span>
                  <span className="text-[#9aa0a6] text-[11px]">100%</span>
                </div>
                <div className="border-t border-[#3c3f44] my-1" />
                {["Print...", "Search with Google Lens", "Translate...", "Find and edit"].map((item, i) => (
                  <div key={i} className="px-3 py-1 hover:bg-[#3c3f44]">{item}</div>
                ))}
                {/* HIGHLIGHTED */}
                <div className="px-3 py-1 bg-blue-500/20 border-l-2 border-blue-400 text-blue-300 font-medium flex justify-between">
                  <span>Save, share, and copy</span>
                  <span className="text-blue-400 text-[11px]">▸</span>
                </div>
                <div className="border-t border-[#3c3f44] my-1" />
                {["More tools", "Help", "Settings", "Exit"].map((item, i) => (
                  <div key={i} className="px-3 py-1 hover:bg-[#3c3f44]">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 — Submenu mockup */}
          <div className="mb-6">
            <div className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
              Click "Create shortcut..."
            </div>
            <div className="flex justify-center">
              <div className="bg-[#292b2f] rounded-lg border border-[#3c3f44] w-[220px] py-1.5 text-[#e8eaed] text-[13px] shadow-xl select-none">
                <div className="px-3 py-1 hover:bg-[#3c3f44]">Cast...</div>
                <div className="px-3 py-1 hover:bg-[#3c3f44] flex justify-between">
                  <span>Save page as...</span>
                  <span className="text-[#9aa0a6] text-[11px]">Ctrl+S</span>
                </div>
                {/* HIGHLIGHTED */}
                <div className="px-3 py-1 bg-blue-500/20 border-l-2 border-blue-400 text-blue-300 font-medium">
                  Create shortcut...
                </div>
                <div className="px-3 py-1 hover:bg-[#3c3f44]">Copy link</div>
                <div className="border-t border-[#3c3f44] my-1" />
                <div className="px-3 py-1 text-[#9aa0a6]/50">Send to your devices</div>
                <div className="px-3 py-1 text-[#9aa0a6]/50">QR Code</div>
              </div>
            </div>
          </div>

          {/* Step 4 — Checkbox note */}
          <div className="mb-8">
            <div className="text-sm font-bold mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
              Check "Open as window" and confirm
            </div>
            <div className="flex justify-center">
              <div className="bg-[#292b2f] rounded-lg border border-[#3c3f44] w-[300px] p-4 shadow-xl select-none">
                <div className="text-[#e8eaed] text-sm font-medium mb-3">Create shortcut?</div>
                <div className="bg-[#202124] rounded px-3 py-1.5 text-[#e8eaed] text-[13px] mb-3 border border-[#3c3f44]">
                  UrbanShade OS
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-sm bg-blue-500 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2"><path d="M2 5l2 2 4-4"/></svg>
                  </div>
                  <span className="text-[#e8eaed] text-[13px]">Open as window</span>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="px-4 py-1.5 rounded text-[13px] text-[#8ab4f8] hover:bg-[#8ab4f8]/10 cursor-default">Cancel</div>
                  <div className="px-4 py-1.5 rounded text-[13px] bg-[#8ab4f8] text-[#202124] font-medium cursor-default">Create</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">⚠️ Make sure "Open as window" is checked!</p>
          </div>

          {/* Other browsers */}
          <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
            <h3 className="font-bold text-sm mb-2">Other Browsers</h3>
            <div className="text-sm text-muted-foreground space-y-1.5">
              <div><strong>Microsoft Edge:</strong> Click ⋯ → Apps → Install this site as an app</div>
              <div><strong>Firefox:</strong> Not natively supported — use Chrome or Edge for the best experience</div>
              <div><strong>Opera / Brave:</strong> Same steps as Chrome (Chromium-based)</div>
            </div>
          </div>
        </div>
      )
    },
    // Dark Web Pages - Require VPN with Dark Server
    "depths.urbanshade.local": {
      url: "depths.urbanshade.local",
      title: "THE DEPTHS - Classified",
      requiresDarkVPN: true,
      darkSiteId: 'depths',
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-500/30">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
              <Skull className="w-4 h-4" />
              <span className="font-mono">RESTRICTED ACCESS - DARK NETWORK</span>
            </div>
          </div>
          
          <h1 className="text-xl font-bold text-red-400 mb-6 font-mono">// THE DEPTHS</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20">
              <h3 className="font-bold text-red-400 text-sm mb-3 font-mono">INCIDENT_LOG_Z13_BREACH.txt</h3>
              <div className="text-sm space-y-2 font-mono text-red-400/80">
                <div className="text-xs opacity-60">[RECOVERED DATA - CORRUPTED]</div>
                <p>Day 47: The subject has... changed. It no longer responds to containment protocols.</p>
                <p>Day 48: ██████████ reported seeing it outside the tank. Impossible. The pressure would...</p>
                <p>Day 49: Three casualties. The official report says "equipment malfunction." We both know that's a lie.</p>
                <p className="text-red-400">[DATA EXPUNGED]</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20">
              <h3 className="font-bold text-red-400 text-sm mb-3 font-mono">PROJECT_ABYSS.enc</h3>
              <div className="text-sm space-y-2 font-mono text-red-400/80">
                <p>The deeper you go, the less the rules apply.</p>
                <p>At 8,000 meters, physics becomes... negotiable.</p>
                <p>At 10,000 meters, reality is merely a suggestion.</p>
                <p className="text-yellow-400 text-xs mt-4">// Achievement unlocked: Into The Abyss</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-black/50 border border-red-500/30">
              <h3 className="font-bold text-red-400 text-sm mb-3 font-mono flex items-center gap-2">
                <Eye className="w-4 h-4" />
                OBSERVER_NOTES.log
              </h3>
              <div className="text-xs space-y-1 font-mono text-red-400/60">
                <p>They think they're studying the specimens.</p>
                <p>They don't realize the specimens have been studying them.</p>
                <p>Every camera. Every sensor. Every terminal.</p>
                <p className="text-cyan-400">It watches.</p>
                <p className="text-cyan-400">It waits.</p>
                <p className="text-cyan-400">It learns.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "blackmarket.urbanshade.local": {
      url: "blackmarket.urbanshade.local",
      title: "The Black Market",
      requiresDarkVPN: true,
      darkSiteId: 'blackmarket',
      content: (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="mb-6 p-4 rounded-lg bg-purple-950/30 border border-purple-500/30">
            <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
              <ShieldOff className="w-4 h-4" />
              <span className="font-mono">UNAUTHORIZED TRADING POST</span>
            </div>
          </div>
          
          <h1 className="text-xl font-bold text-purple-400 mb-6 font-mono">FACILITY BLACK MARKET</h1>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/20">
              <h3 className="font-bold text-purple-400 text-sm mb-3">Available "Services"</h3>
              <div className="space-y-2 text-sm text-purple-400/70">
                <div className="flex justify-between items-center p-2 rounded bg-black/30">
                  <span>Falsified Clearance Cards</span>
                  <span className="text-yellow-400">500 K₩</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/30">
                  <span>Security Camera Blind Spots Map</span>
                  <span className="text-yellow-400">250 K₩</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/30">
                  <span>Specimen Feeding Schedule (Leaked)</span>
                  <span className="text-yellow-400">100 K₩</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-black/30 border border-red-500/30">
                  <span className="text-red-400">Z-13 Containment Override Codes</span>
                  <span className="text-red-400">DO NOT PURCHASE</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-950/20 border border-yellow-500/20">
              <h3 className="font-bold text-yellow-400 text-sm mb-3">Whisper Network</h3>
              <div className="text-xs space-y-2 font-mono text-yellow-400/70">
                <p>{">"} [ANON_47]: Anyone else hear the scratching in Sector 7?</p>
                <p>{">"} [ANON_12]: Don't ask questions you don't want answered.</p>
                <p>{">"} [ANON_89]: The walls have ears. And eyes. And teeth.</p>
                <p>{">"} [SYSTEM]: User ANON_89 has been disconnected.</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              This page is not real. It's part of the UrbanShade experience. Don't actually try to buy anything. 🙃
            </div>
          </div>
        </div>
      )
    },
    "void.urbanshade.local": {
      url: "void.urbanshade.local",
      title: "V̷͎̓O̶̜͝I̵̛̜D̵̰̊",
      requiresDarkVPN: true,
      darkSiteId: 'void',
      content: (
        <div className="p-6 max-w-3xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
          <div className="text-center space-y-6 animate-pulse">
            <div className="text-6xl font-mono text-red-500/30">
              ẘ̸̛̳e̷̜̓ ̵̢͑s̵͚̈́e̵̳͊ë̵̝́ ̷̡̛y̵̳̓o̷͎̊u̵̲̎
            </div>
            <div className="text-sm font-mono text-red-400/50">
              w̵̛̭ẹ̶͠ ̵̨̛k̸̙̕n̵͕̄o̶̗͊w̵̲̃ ̴̖́w̵̙̒h̷͖̀a̷̧͂t̵̰̓ ̶̨̾y̶̡̓o̷̝͑u̶͈͌ ̴̨̆d̵̮͝i̴̞͂d̷̰͝
            </div>
            <div className="text-xs text-muted-foreground/30 mt-8">
              [This page intentionally left cryptic for atmosphere. You're not actually in danger. Probably.]
            </div>
          </div>
        </div>
      )
    }
  };

  const [currentUrl, setCurrentUrl] = useState("urbanshade.local");
  const [inputUrl, setInputUrl] = useState("urbanshade.local");
  const [history, setHistory] = useState<string[]>(["urbanshade.local"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState(["urbanshade.local", "docs.urbanshade.local", "uur.urbanshade.local"]);
  const [isVPNConnected, setIsVPNConnected] = useState(false);
  const [isDarkVPN, setIsDarkVPN] = useState(false);

  // Subscribe to VPN state changes
  useEffect(() => {
    const unsubscribe = vpnState.subscribe((connected, serverId) => {
      setIsVPNConnected(connected);
      setIsDarkVPN(connected && (serverId?.startsWith("dark-") || false));
    });
    
    // Check initial state
    setIsVPNConnected(vpnState.isConnected());
    const serverId = vpnState.getServerId();
    setIsDarkVPN(vpnState.isConnected() && (serverId?.startsWith("dark-") || false));
    
    return unsubscribe;
  }, []);

  const navigate = (url: string) => {
    const page = pages[url];
    if (page) {
      // Check VPN requirements
      if (page.requiresDarkVPN && !isDarkVPN) {
        toast.error("Access denied. Connect to a Dark Network VPN server to access this site.", {
          description: "Try the Abyss Node or Void Relay in the VPN app."
        });
        return;
      }
      
      // Track dark web visits for achievements
      if (page.darkSiteId) {
        trackDarkWebVisit(page.darkSiteId);
      }
      
      setCurrentUrl(url);
      setInputUrl(url);
      const newHistory = [...history.slice(0, historyIndex + 1), url];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(inputUrl);
  };

  const currentPage = pages[currentUrl] || pages["urbanshade.local"];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tab Bar */}
      <div className="flex items-center gap-0 bg-muted/20 px-1 pt-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-t-lg border border-b-0 border-border/20 text-xs max-w-[200px]">
          <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{currentPage.title}</span>
        </div>
        <div className="flex-1" />
      </div>

      {/* Navigation + URL Bar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-background border-b border-border/20">
        <Button
          size="sm"
          variant="ghost"
          onClick={goBack}
          disabled={historyIndex === 0}
          className="w-7 h-7 p-0 rounded-full hover:bg-muted/40"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="w-7 h-7 p-0 rounded-full hover:bg-muted/40"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(currentUrl)}
          className="w-7 h-7 p-0 rounded-full hover:bg-muted/40"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate("urbanshade.local")}
          className="w-7 h-7 p-0 rounded-full hover:bg-muted/40"
        >
          <Home className="w-3.5 h-3.5" />
        </Button>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center">
          <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border/10 hover:bg-muted/40 focus-within:bg-muted/50 focus-within:border-primary/30 transition-colors">
            <Lock className="w-3 h-3 text-green-400 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-transparent outline-none text-xs font-mono py-0.5"
              placeholder="Enter URL..."
            />
            <button type="submit" className="hover:text-primary transition-colors">
              <Search className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        </form>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const url = currentUrl;
            if (!bookmarks.includes(url)) {
              setBookmarks(prev => [...prev, url]);
              toast.success("Bookmark added");
            }
          }}
          className="w-7 h-7 p-0 rounded-full hover:bg-muted/40"
        >
          <Star className={`w-3.5 h-3.5 ${bookmarks.includes(currentUrl) ? 'fill-primary text-primary' : ''}`} />
        </Button>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-0.5 px-2 py-1 bg-background/80 border-b border-border/10 overflow-x-auto">
        {bookmarks.map(url => (
          <button
            key={url}
            onClick={() => navigate(url)}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] whitespace-nowrap transition-all ${
              currentUrl === url 
                ? "bg-primary/15 text-primary font-medium" 
                : "hover:bg-muted/30 text-muted-foreground"
            }`}
          >
            <Globe className="w-3 h-3 shrink-0 opacity-50" />
            {url.replace(".urbanshade.local", "").replace("urbanshade.local", "Home")}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <ScrollArea className="flex-1">
        {currentPage.content}
      </ScrollArea>

      {/* Status Bar */}
      <div className="h-5 px-3 border-t border-border/10 bg-muted/10 flex items-center justify-between text-[10px] text-muted-foreground/70">
        <span className="truncate">{currentPage.url}</span>
        <span className="flex items-center gap-1 shrink-0">
          <Lock className="w-2.5 h-2.5 text-green-400/70" />
          Secure
        </span>
      </div>
    </div>
  );
};
