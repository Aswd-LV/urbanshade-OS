import { ArrowLeft, Palette, Droplets, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";

const Theming = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-teal-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-teal-100">Theming & Styling</h1>
          <Link 
            to="/docs/dev" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dev Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Palette className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Theming & Styling</h2>
              <p className="text-slate-400">Create custom themes for UrbanShade OS</p>
            </div>
          </div>
        </section>

        {/* Design Tokens */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-purple-400" />
            Design Tokens
          </h3>
          <p className="text-slate-400">
            UrbanShade uses CSS custom properties (variables) for theming. These are defined in <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">index.css</code>.
          </p>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
{`:root {
  --background: 212 75% 4%;
  --foreground: 192 100% 96%;
  --primary: 186 100% 44%;
  --primary-foreground: 210 100% 3%;
  --accent: 186 100% 50%;
  --muted: 210 30% 15%;
  --glow: 186 100% 50%;
  /* ... more tokens */
}`}
            </pre>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white">Core Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Primary", color: "bg-primary", hsl: "186 100% 44%" },
              { name: "Background", color: "bg-background", hsl: "212 75% 4%" },
              { name: "Foreground", color: "bg-foreground", hsl: "192 100% 96%" },
              { name: "Accent", color: "bg-accent", hsl: "186 100% 50%" },
              { name: "Muted", color: "bg-muted", hsl: "210 30% 15%" },
              { name: "Destructive", color: "bg-destructive", hsl: "0 84% 60%" },
              { name: "Secondary", color: "bg-secondary", hsl: "212 40% 10%" },
              { name: "Glow", color: "bg-cyan-400", hsl: "186 100% 50%" }
            ].map((c, i) => (
              <div key={i} className="space-y-2">
                <div className={`h-16 rounded-lg ${c.color} border border-slate-700`} />
                <div>
                  <p className="font-medium text-white text-sm">{c.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{c.hsl}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Light/Dark Mode */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <Moon className="w-5 h-5 text-blue-400" />
            Light & Dark Mode
          </h3>
          <p className="text-slate-400">
            The <code className="px-2 py-0.5 bg-slate-800 rounded text-cyan-400">.light</code> class provides alternate token values for light mode. 
            Toggle is handled by the Settings app.
          </p>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm">
            <pre className="text-slate-300">
{`.light {
  --background: 210 20% 98%;
  --foreground: 212 75% 10%;
  --primary: 186 100% 35%;
  /* ... light mode overrides */
}`}
            </pre>
          </div>
        </section>

        {/* Usage */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white">Using Tokens in Components</h3>
          <p className="text-slate-400">
            Always use Tailwind's semantic classes that reference these tokens:
          </p>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm">
            <pre className="text-slate-300">
{`// ✅ Correct - uses design tokens
<div className="bg-background text-foreground border-border">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>

// ❌ Avoid - hardcoded colors
<div className="bg-slate-900 text-white border-gray-700">
  <button className="bg-cyan-500 text-black">
    Click me
  </button>
</div>`}
            </pre>
          </div>
        </section>

        <footer className="pt-8 border-t border-slate-800">
          <Link to="/docs/dev" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Developer Docs
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Theming;
