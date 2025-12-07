import { ArrowLeft, Package, Download, Star, Users, Search, Filter, Shield, Zap, Code, BookOpen, ExternalLink, CheckCircle, AlertTriangle, Terminal, RefreshCw, Trash2, Info, List, Upload, Database } from "lucide-react";
import { Link } from "react-router-dom";

const UURDocs = () => {
  const featuredPackages = [
    { name: "urbanshade-themes", description: "Custom theme packs for UrbanShade OS", downloads: "2.4k", stars: 48, author: "aswdBatch", version: "2.1.0" },
    { name: "facility-sounds", description: "Ambient sound effects and alerts", downloads: "1.8k", stars: 32, author: "community", version: "1.3.2" },
    { name: "extended-terminal", description: "Additional terminal commands and utilities", downloads: "3.1k", stars: 67, author: "defdev-team", version: "3.0.1" },
    { name: "custom-bugchecks", description: "Create your own bugcheck screens", downloads: "890", stars: 21, author: "community", version: "1.0.5" },
    { name: "dark-mode-plus", description: "Enhanced dark mode with OLED black", downloads: "1.5k", stars: 38, author: "themes-team", version: "1.2.0" },
    { name: "sys-monitor-pro", description: "Advanced system monitoring widgets", downloads: "2.2k", stars: 55, author: "defdev-team", version: "2.0.0" },
  ];

  const commands = [
    { cmd: "uur inst <package>_<version>", desc: "Install a specific version of a package", example: "uur inst extended-terminal_3.0.1" },
    { cmd: "uur inst <package>", desc: "Install latest version of a package", example: "uur inst dark-mode-plus" },
    { cmd: "uur rm <package>", desc: "Remove an installed package", example: "uur rm facility-sounds" },
    { cmd: "uur up", desc: "Update all installed packages", example: "uur up" },
    { cmd: "uur up <package>", desc: "Update a specific package", example: "uur up extended-terminal" },
    { cmd: "uur lst app", desc: "List all available packages", example: "uur lst app" },
    { cmd: "uur lst ver", desc: "Show UUR version info", example: "uur lst ver" },
    { cmd: "uur lst installed", desc: "List installed packages", example: "uur lst installed" },
    { cmd: "uur search <query>", desc: "Search for packages", example: "uur search theme" },
    { cmd: "uur info <package>", desc: "Show package details", example: "uur info urbanshade-themes" },
    { cmd: "uur imp <listname>", desc: "Import a package list/source", example: "uur imp community-list" },
    { cmd: "uur exp", desc: "Export installed packages list", example: "uur exp" },
    { cmd: "uur sync", desc: "Sync with repository", example: "uur sync" },
    { cmd: "uur clean", desc: "Clean package cache", example: "uur clean" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-cyan-400">UUR Documentation</h1>
            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full">v1.2</span>
          </div>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-4">
              <Package className="w-10 h-10 text-cyan-400" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              UrbanShade User Repository
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Community-driven package repository for UrbanShade OS extensions, themes, and utilities
            </p>
            <p className="text-sm text-slate-500 italic">(Inspired by the Arch User Repository)</p>
            <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                <Package className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">120+ Packages</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm text-slate-300">50+ Contributors</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                <Download className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">10k+ Downloads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Table of Contents</h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <a href="#what-is-uur" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <BookOpen className="w-4 h-4" /> What is UUR?
            </a>
            <a href="#commands" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Terminal className="w-4 h-4" /> Command Reference
            </a>
            <a href="#packages" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Package className="w-4 h-4" /> Featured Packages
            </a>
            <a href="#installing" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Download className="w-4 h-4" /> Installation Guide
            </a>
            <a href="#package-types" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Filter className="w-4 h-4" /> Package Types
            </a>
            <a href="#creating" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Code className="w-4 h-4" /> Creating Packages
            </a>
            <a href="#guidelines" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Shield className="w-4 h-4" /> Guidelines
            </a>
            <a href="#api" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
              <Zap className="w-4 h-4" /> Package API
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* What is UUR */}
        <section id="what-is-uur" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            What is UUR?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-bold text-slate-100 mb-3">Community Repository</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The UrbanShade User Repository (UUR) is a community-driven collection of packages, themes, 
                extensions, and utilities created by UrbanShade OS users. Anyone can submit packages, and 
                the community votes on quality and usefulness.
              </p>
            </div>
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-bold text-slate-100 mb-3">Easy Installation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Packages can be installed directly through the DEF-DEV terminal using the <code className="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400">uur</code> command-line 
                tool, or via the App Store application in UrbanShade OS.
              </p>
            </div>
          </div>
        </section>

        {/* Command Reference */}
        <section id="commands" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Terminal className="w-6 h-6 text-cyan-400" />
            Command Reference
          </h3>
          <p className="text-slate-400">
            All UUR commands can be run from the DEF-DEV Terminal. The general syntax is:
          </p>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-sm">
            <span className="text-green-400">$</span> uur <span className="text-cyan-400">&lt;command&gt;</span> <span className="text-slate-500">[arguments]</span>
          </div>
          
          <div className="space-y-3">
            {commands.map((cmd, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <code className="text-cyan-400 font-mono text-sm">{cmd.cmd}</code>
                  <span className="text-slate-400 text-sm">{cmd.desc}</span>
                </div>
                <div className="font-mono text-xs bg-slate-950 p-2 rounded text-slate-500">
                  Example: <span className="text-green-400">$</span> {cmd.example}
                </div>
              </div>
            ))}
          </div>

          {/* Quick reference cards */}
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Download className="w-5 h-5 text-green-400" />
                <h4 className="font-bold text-green-400">Install</h4>
              </div>
              <code className="text-xs text-slate-400 font-mono">uur inst &lt;pkg&gt;_&lt;ver&gt;</code>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-red-400">Remove</h4>
              </div>
              <code className="text-xs text-slate-400 font-mono">uur rm &lt;package&gt;</code>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-blue-400">Update</h4>
              </div>
              <code className="text-xs text-slate-400 font-mono">uur up [package]</code>
            </div>
          </div>
        </section>

        {/* Package Types */}
        <section id="package-types" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Filter className="w-6 h-6 text-cyan-400" />
            Package Types
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-xl">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-bold text-purple-400 mb-2">Themes</h4>
              <p className="text-sm text-slate-400">
                Visual customizations including color schemes, icons, wallpapers, and UI modifications.
              </p>
            </div>
            <div className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-xl">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                <Code className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="font-bold text-green-400 mb-2">Extensions</h4>
              <p className="text-sm text-slate-400">
                Functional additions like new terminal commands, system utilities, and integrations.
              </p>
            </div>
            <div className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30 rounded-xl">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="font-bold text-blue-400 mb-2">Applications</h4>
              <p className="text-sm text-slate-400">
                Complete applications that add new functionality to UrbanShade OS.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Packages */}
        <section id="packages" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-400" />
            Featured Packages
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredPackages.map((pkg) => (
              <div key={pkg.name} className="p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-cyan-400">{pkg.name}</h4>
                    <p className="text-xs text-slate-500">by {pkg.author} • v{pkg.version}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Download className="w-3 h-3" /> {pkg.downloads}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-3 h-3" /> {pkg.stars}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-3">{pkg.description}</p>
                <code className="text-xs text-green-400 font-mono bg-slate-950 px-2 py-1 rounded">
                  uur inst {pkg.name}_{pkg.version}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Installation */}
        <section id="installing" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Download className="w-6 h-6 text-cyan-400" />
            Installing Packages
          </h3>
          
          <div className="space-y-4">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                Via DEF-DEV Terminal
              </h4>
              <div className="space-y-3 font-mono text-sm bg-slate-950 p-4 rounded-lg">
                <p className="text-slate-500"># Search for a package</p>
                <p><span className="text-green-400">$</span> uur search <span className="text-cyan-400">theme</span></p>
                <p className="text-slate-500 mt-4"># Install with specific version</p>
                <p><span className="text-green-400">$</span> uur inst <span className="text-cyan-400">urbanshade-themes_2.1.0</span></p>
                <p className="text-slate-500 mt-4"># Install latest version</p>
                <p><span className="text-green-400">$</span> uur inst <span className="text-cyan-400">extended-terminal</span></p>
                <p className="text-slate-500 mt-4"># Update all packages</p>
                <p><span className="text-green-400">$</span> uur up</p>
                <p className="text-slate-500 mt-4"># Remove a package</p>
                <p><span className="text-green-400">$</span> uur rm <span className="text-cyan-400">facility-sounds</span></p>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-amber-400" />
                Importing Package Lists
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                You can import custom package lists from the community to add additional repositories:
              </p>
              <div className="space-y-3 font-mono text-sm bg-slate-950 p-4 rounded-lg">
                <p className="text-slate-500"># Import a community list</p>
                <p><span className="text-green-400">$</span> uur imp <span className="text-cyan-400">community-extras</span></p>
                <p className="text-slate-500 mt-4"># Import a custom list</p>
                <p><span className="text-green-400">$</span> uur imp <span className="text-cyan-400">mylist</span></p>
                <p className="text-slate-500 mt-4"># Sync with all repositories</p>
                <p><span className="text-green-400">$</span> uur sync</p>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
              <h4 className="font-bold text-slate-100 mb-4">Via App Store</h4>
              <ol className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500/20 rounded text-center text-xs leading-6 text-cyan-400 flex-shrink-0">1</span>
                  <span>Open the App Store application from the desktop or start menu</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500/20 rounded text-center text-xs leading-6 text-cyan-400 flex-shrink-0">2</span>
                  <span>Navigate to the "UUR" tab</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500/20 rounded text-center text-xs leading-6 text-cyan-400 flex-shrink-0">3</span>
                  <span>Browse or search for packages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-500/20 rounded text-center text-xs leading-6 text-cyan-400 flex-shrink-0">4</span>
                  <span>Click "Install" on the package you want</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Creating Packages */}
        <section id="creating" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Code className="w-6 h-6 text-cyan-400" />
            Creating Packages
          </h3>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
            <p className="text-slate-400">
              Anyone can create and submit packages to UUR. Here's what you need:
            </p>
            
            <h4 className="font-bold text-slate-100 mt-4">Package Structure</h4>
            <div className="font-mono text-sm bg-slate-950 p-4 rounded-lg text-slate-400">
              <pre>{`my-package/
├── package.json      # Package metadata
├── README.md         # Documentation
├── src/              # Source files
│   ├── index.ts      # Entry point
│   └── ...
├── assets/           # Static assets
└── LICENSE           # License file`}</pre>
            </div>

            <h4 className="font-bold text-slate-100 mt-6">package.json Example</h4>
            <div className="font-mono text-xs bg-slate-950 p-4 rounded-lg text-slate-400 overflow-x-auto">
              <pre>{`{
  "name": "my-awesome-package",
  "version": "1.0.0",
  "description": "An awesome UUR package",
  "author": "your-username",
  "type": "extension",
  "tags": ["utility", "terminal"],
  "dependencies": [],
  "minVersion": "2.0.0",
  "entry": "src/index.ts"
}`}</pre>
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section id="guidelines" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            Submission Guidelines
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-xl">
              <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Do's
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Include clear documentation</li>
                <li>• Test on latest UrbanShade version</li>
                <li>• Use semantic versioning</li>
                <li>• Respond to user feedback</li>
                <li>• Keep packages updated</li>
                <li>• Include screenshots for visual packages</li>
              </ul>
            </div>
            <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl">
              <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Don'ts
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Include malicious code</li>
                <li>• Copy others' work without credit</li>
                <li>• Break existing functionality</li>
                <li>• Use excessive localStorage</li>
                <li>• Create duplicate packages</li>
                <li>• Ignore security best practices</li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section id="api" className="space-y-6 scroll-mt-20">
          <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            Package API
          </h3>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
            <p className="text-slate-400">
              Packages have access to the UrbanShade OS API for integration:
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="p-3 bg-slate-950 rounded-lg">
                <code className="text-green-400">urbanshade.storage.get(key)</code>
                <p className="text-xs text-slate-500 mt-1">Read from localStorage</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <code className="text-green-400">urbanshade.storage.set(key, value)</code>
                <p className="text-xs text-slate-500 mt-1">Write to localStorage</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <code className="text-green-400">urbanshade.terminal.registerCommand(name, handler)</code>
                <p className="text-xs text-slate-500 mt-1">Add custom terminal command</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <code className="text-green-400">urbanshade.theme.apply(themeConfig)</code>
                <p className="text-xs text-slate-500 mt-1">Apply theme customizations</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <code className="text-green-400">urbanshade.notifications.show(title, message)</code>
                <p className="text-xs text-slate-500 mt-1">Display system notification</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <code className="text-green-400">urbanshade.bus.emit(event, payload)</code>
                <p className="text-xs text-slate-500 mt-1">Emit system bus event</p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="flex flex-wrap gap-4 pt-8 border-t border-slate-800">
          <Link
            to="/docs"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documentation
          </Link>
          <Link
            to="/docs/def-dev"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-sm text-amber-400 transition-colors ml-auto"
          >
            DEF-DEV Documentation
            <ExternalLink className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default UURDocs;
