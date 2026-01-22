import { Package, Terminal, Download, Star, Code, Shield, Zap, Filter, Users, Upload, RefreshCw, Trash2 } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocCode, DocTable, DocAlert } from "@/components/docs";

const UURDocs = () => {
  const commands = [
    ["uur inst <pkg>", "Install latest version of a package"],
    ["uur inst <pkg>_<ver>", "Install a specific version"],
    ["uur rm <pkg>", "Remove an installed package"],
    ["uur up", "Update all installed packages"],
    ["uur up <pkg>", "Update a specific package"],
    ["uur lst app", "List all available packages"],
    ["uur lst installed", "List installed packages"],
    ["uur search <query>", "Search for packages"],
    ["uur info <pkg>", "Show package details"],
    ["uur sync", "Sync with repository"],
    ["uur clean", "Clean package cache"],
  ];

  const featuredPackages = [
    { name: "extended-terminal", desc: "Additional terminal commands", version: "3.0.1", stars: 67 },
    { name: "urbanshade-themes", desc: "Collection of custom themes", version: "2.1.0", stars: 48 },
    { name: "facility-sounds", desc: "Ambient sound effects", version: "1.3.2", stars: 32 },
    { name: "custom-bugchecks", desc: "Create custom crash screens", version: "1.0.5", stars: 21 },
    { name: "dark-mode-plus", desc: "Enhanced dark mode options", version: "1.2.0", stars: 38 },
    { name: "sys-monitor-pro", desc: "Advanced system monitoring", version: "2.0.0", stars: 55 },
  ];

  return (
    <DocLayout
      title="UUR Repository"
      description="UrbanShade User Repository (UUR) - install packages, themes, and extensions for UrbanShade OS."
      keywords={["uur", "packages", "repository", "themes", "extensions", "community"]}
      accentColor="purple"
      prevPage={{ title: "Troubleshooting", path: "/docs/troubleshooting" }}
      nextPage={{ title: "Features Overview", path: "/docs/features" }}
    >
      <DocHero
        icon={Package}
        title="UrbanShade User Repository"
        subtitle="Community-driven package repository for extensions, themes, and utilities. Inspired by the Arch User Repository."
        accentColor="purple"
        badge="Community"
      />

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card">
          <Package className="w-4 h-4 text-indigo-400" />
          <span className="text-sm">50+ Packages</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card">
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-sm">Growing Community</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card">
          <Download className="w-4 h-4 text-blue-400" />
          <span className="text-sm">Easy Installation</span>
        </div>
      </div>

      <DocSection title="Quick Start" icon={Zap} accentColor="cyan">
        <DocCode language="bash" title="Basic Commands" code={`# Search for a package
$ uur search theme

# Install a package
$ uur inst extended-terminal

# Install specific version
$ uur inst urbanshade-themes_2.1.0

# Update all packages
$ uur up

# Remove a package
$ uur rm facility-sounds`} />
      </DocSection>

      <DocSection title="Command Reference" icon={Terminal} accentColor="green">
        <DocTable 
          headers={["Command", "Description"]} 
          rows={commands} 
        />
        <div className="grid gap-3 md:grid-cols-3 mt-6">
          <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 text-center">
            <Download className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="font-medium text-green-400">Install</div>
            <code className="text-xs text-muted-foreground">uur inst &lt;pkg&gt;</code>
          </div>
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-center">
            <Trash2 className="w-6 h-6 mx-auto mb-2 text-red-400" />
            <div className="font-medium text-red-400">Remove</div>
            <code className="text-xs text-muted-foreground">uur rm &lt;pkg&gt;</code>
          </div>
          <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 text-center">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="font-medium text-blue-400">Update</div>
            <code className="text-xs text-muted-foreground">uur up [pkg]</code>
          </div>
        </div>
      </DocSection>

      <DocSection title="Package Types" icon={Filter} accentColor="purple">
        <div className="grid gap-4 md:grid-cols-3">
          <DocCard
            title="Themes"
            description="Color schemes, icons, wallpapers, and UI modifications."
            icon={Star}
            accentColor="purple"
          />
          <DocCard
            title="Extensions"
            description="New terminal commands, system utilities, and integrations."
            icon={Code}
            accentColor="green"
          />
          <DocCard
            title="Applications"
            description="Complete apps that add new functionality to UrbanShade."
            icon={Zap}
            accentColor="blue"
          />
        </div>
      </DocSection>

      <DocSection title="Featured Packages" icon={Star} accentColor="amber">
        <div className="grid gap-3 md:grid-cols-2">
          {featuredPackages.map((pkg) => (
            <div key={pkg.name} className="p-4 rounded-lg border border-border bg-card hover:border-indigo-500/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium text-indigo-400">{pkg.name}</div>
                  <div className="text-xs text-muted-foreground">v{pkg.version}</div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm">
                  <Star className="w-3 h-3" />
                  {pkg.stars}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{pkg.desc}</p>
              <code className="text-xs text-green-400 bg-background px-2 py-1 rounded">
                uur inst {pkg.name}
              </code>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Creating Packages" icon={Upload} accentColor="cyan">
        <DocAlert variant="tip" title="Want to Contribute?">
          Anyone can submit packages to UUR! Check the package structure below.
        </DocAlert>
        <DocCode language="json" title="package.json Structure" code={`{
  "name": "my-awesome-theme",
  "version": "1.0.0",
  "description": "A cool theme for UrbanShade",
  "author": "your-username",
  "type": "theme",
  "files": ["theme.css", "icons/"],
  "dependencies": []
}`} />
      </DocSection>

      <DocSection title="Guidelines" icon={Shield} accentColor="red">
        <div className="space-y-3">
          {[
            "All packages are reviewed before publishing",
            "No malicious code or security risks",
            "Proper versioning (semver) required",
            "Include clear documentation",
            "Respect copyright and licenses",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
              <span className="text-red-400 font-bold">{i + 1}.</span>
              <span className="text-muted-foreground">{rule}</span>
            </div>
          ))}
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default UURDocs;