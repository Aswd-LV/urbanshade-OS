import { ArrowLeft, Package, Upload, FileCode, ChevronRight, Copy, Check, BookOpen, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const UURDocs = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const manifestExample = `{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "displayName": "My Awesome App",
  "description": "A cool app for UrbanShade OS",
  "author": "YourUsername",
  "icon": "Rocket",
  "category": "utilities",
  "main": "index.tsx",
  "permissions": ["filesystem", "notifications"],
  "tags": ["productivity", "tools"]
}`;

  const componentExample = `// index.tsx - Your app's entry point
import { useState } from "react";

export const MyAwesomeApp = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-cyan-400">
        My Awesome App
      </h1>
      <p className="text-slate-400">
        Count: {count}
      </p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-cyan-500 rounded-lg"
      >
        Increment
      </button>
    </div>
  );
};

export default MyAwesomeApp;`;

  const categories = [
    { name: "utilities", description: "General utility apps", examples: "Calculator, Notes, Clock" },
    { name: "games", description: "Games and entertainment", examples: "Dice Roller, Reaction Test" },
    { name: "productivity", description: "Work and productivity tools", examples: "Spreadsheet, Calendar" },
    { name: "system", description: "System management apps", examples: "Task Manager, Settings" },
    { name: "facility", description: "Facility-specific apps", examples: "Containment Monitor, Cameras" },
    { name: "social", description: "Communication and social", examples: "Chat, Messages" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-teal-100">UUR Packages</h1>
              <p className="text-xs text-teal-500/70">Developer Documentation</p>
            </div>
          </div>
          <Link 
            to="/docs/dev" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-white">UrbanShade User Repository</h2>
          <p className="text-slate-400 leading-relaxed">
            The UUR (UrbanShade User Repository) is the official package repository for community-created
            apps, themes, and extensions. Share your creations with other users or install packages from
            the community.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-center">
              <Upload className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <h4 className="font-medium text-teal-100">Publish Apps</h4>
              <p className="text-xs text-teal-500/70 mt-1">Share with the community</p>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
              <Package className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <h4 className="font-medium text-cyan-100">Install Packages</h4>
              <p className="text-xs text-cyan-500/70 mt-1">One-click installation</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <h4 className="font-medium text-blue-100">Moderated</h4>
              <p className="text-xs text-blue-500/70 mt-1">Safe & reviewed packages</p>
            </div>
          </div>
        </section>

        {/* Package Structure */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-teal-400" />
            Package Structure
          </h3>
          
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="font-mono text-sm text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">📁</span> my-awesome-app/
              </div>
              <div className="pl-6 flex items-center gap-2">
                <span className="text-amber-400">📄</span> manifest.json
                <span className="text-xs text-slate-500">← Package metadata</span>
              </div>
              <div className="pl-6 flex items-center gap-2">
                <span className="text-teal-400">📄</span> index.tsx
                <span className="text-xs text-slate-500">← Entry point</span>
              </div>
              <div className="pl-6 flex items-center gap-2">
                <span className="text-slate-500">📄</span> README.md
                <span className="text-xs text-slate-500">← Documentation</span>
              </div>
              <div className="pl-6 flex items-center gap-2">
                <span className="text-slate-500">📁</span> assets/
                <span className="text-xs text-slate-500">← Optional assets</span>
              </div>
            </div>
          </div>
        </section>

        {/* Manifest */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            Package Manifest
          </h3>
          
          <p className="text-slate-400 text-sm">
            Every package requires a <code className="text-teal-400">manifest.json</code> file:
          </p>
          
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-sm font-mono overflow-x-auto">
              <code className="text-slate-300">{manifestExample}</code>
            </pre>
            <button
              onClick={() => copyCode(manifestExample, 'manifest')}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copied === 'manifest' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            Package Categories
          </h3>
          
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((cat, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700">
                <code className="text-teal-400 text-sm font-mono">{cat.name}</code>
                <p className="text-slate-400 text-sm mt-1">{cat.description}</p>
                <p className="text-slate-600 text-xs mt-2">Examples: {cat.examples}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Component Example */}
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-teal-400" />
            Example App Component
          </h3>
          
          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-sm font-mono overflow-x-auto">
              <code className="text-slate-300">{componentExample}</code>
            </pre>
            <button
              onClick={() => copyCode(componentExample, 'component')}
              className="absolute top-3 right-3 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {copied === 'component' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </section>

        {/* Submission */}
        <section className="p-6 rounded-xl bg-gradient-to-br from-teal-500/10 via-slate-800/50 to-cyan-500/10 border border-teal-500/20 space-y-4">
          <h3 className="text-lg font-bold text-teal-100">Ready to Submit?</h3>
          <p className="text-slate-400 text-sm">
            Once your package is ready, submit it through the UUR app in UrbanShade OS.
            All submissions are reviewed by our moderation team before being published.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/docs/applications"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 hover:bg-teal-500/30 transition-all text-sm"
            >
              View Apps Docs
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <Link to="/docs/dev/system-bus" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              System Bus API
            </Link>
            <Link to="/docs/dev/contributing" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
              Contributing
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default UURDocs;
