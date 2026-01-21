import { ArrowLeft, HelpCircle, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Troubleshooting = () => {
  const faqs = [
    {
      question: "I forgot my password!",
      answer: "Don't panic! Press F2 during boot to enter Recovery Mode. From there, you can reset your password. Or just clear your browser's localStorage if you want to start completely fresh.",
      solution: "Recovery Mode → Reset Password"
    },
    {
      question: "The system won't boot!",
      answer: "Try refreshing the page. If that doesn't work, clear localStorage for this site. Your browser might have cached something weird. It happens to the best of us.",
      solution: "Refresh page or clear localStorage"
    },
    {
      question: "My settings aren't saving!",
      answer: "Make sure your browser allows localStorage. Some privacy settings or incognito mode can block it. Also, check if you're out of storage (unlikely, but possible).",
      solution: "Check browser storage settings"
    },
    {
      question: "I exported my system but can't import it!",
      answer: "The import file must be valid JSON exported from URBANSHADE OS. Make sure you're selecting the right file and that it wasn't modified. JSON is picky like that.",
      solution: "Use original export file"
    },
    {
      question: "Everything is broken and I hate it!",
      answer: "We've all been there. Go to Recovery Mode (F2 during boot) and do a Factory Reset. It's the nuclear option, but sometimes you just need a fresh start.",
      solution: "Factory Reset via Recovery Mode"
    },
    {
      question: "Where did my data go after clearing browser data?",
      answer: "It's gone. Forever. Into the void. That's what 'clear browser data' means. The disclaimer warned about this! Time to reinstall and start your underwater adventure anew.",
      solution: "Reinstall and learn from this experience"
    }
  ];

  const knownIssues = [
    {
      issue: "Window positions reset after refresh",
      status: "known",
      workaround: "This is expected behavior - window positions are not persisted between sessions."
    },
    {
      issue: "Some keyboard shortcuts don't work",
      status: "partial",
      workaround: "Not all shortcuts are implemented. We're a simulation, not a real OS!"
    },
    {
      issue: "Camera feeds show static",
      status: "feature",
      workaround: "That's... that's the point. It's an abandoned underwater facility. What did you expect, Netflix?"
    },
    {
      issue: "DEF-DEV console not capturing logs",
      status: "known",
      workaround: "Make sure you've accepted the warning screen and dev mode is enabled in Settings."
    },
    {
      issue: "Action Logger showing bugcheck errors",
      status: "fixed",
      workaround: "This was fixed in v2.4 - update to the latest version."
    }
  ];

  return (
    <>
    <SEO 
      title="Troubleshooting" 
      description="FAQ and troubleshooting guide for Urbanshade OS - password recovery, boot issues, and common problems."
      path="/docs/troubleshooting"
    />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-cyan-400">Troubleshooting</h1>
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
          <HelpCircle className="w-16 h-16 mx-auto text-cyan-400" />
          <h2 className="text-4xl font-bold text-white">Houston, We Have a Problem</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Something went wrong? Don't worry, it's probably not a real containment breach. 
            Let's figure out what's happening.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">The Universal Fix</h3>
          <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-cyan-400" />
              <p className="text-lg font-bold text-white">Have you tried turning it off and on again?</p>
            </div>
            <p className="text-slate-400">
              Seriously though, most issues can be fixed by:
            </p>
            <ol className="space-y-2 ml-4 text-slate-400">
              <li>1. Refreshing the page (Ctrl+R or Cmd+R)</li>
              <li>2. Hard refreshing (Ctrl+Shift+R or Cmd+Shift+R)</li>
              <li>3. Clearing localStorage and starting fresh</li>
              <li>4. Using Recovery Mode (F2 during boot)</li>
            </ol>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h4 className="font-bold text-white">{faq.question}</h4>
                    <p className="text-sm text-slate-400">{faq.answer}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">{faq.solution}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Known Issues & "Features"</h3>
          <p className="text-slate-400">
            Some things that might seem like bugs are actually intentional. Or we're just calling them features. Same thing, really.
          </p>
          <div className="space-y-3">
            {knownIssues.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-cyan-500/20 flex items-start gap-3">
                {item.status === "feature" ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : item.status === "known" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-sm text-white">{item.issue}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.workaround}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Nuclear Options</h3>
          <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 space-y-4">
            <p className="text-slate-400">
              If nothing else works, here are the last resort options:
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-white">Clear Site Data</p>
                <p className="text-xs text-slate-400 mt-1">
                  Open DevTools (F12) → Application → Storage → Clear site data
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-white">Factory Reset via Recovery</p>
                <p className="text-xs text-slate-400 mt-1">
                  Press F2 during boot → Select Factory Reset → Confirm
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-white">Manual localStorage Clear</p>
                <p className="text-xs text-slate-400 mt-1">
                  Open DevTools Console → Type: localStorage.clear() → Refresh
                </p>
              </div>
            </div>
            <p className="text-xs text-red-400">
              ⚠️ All of these will delete your saved data. Export first if you want to keep anything!
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-white">DEF-DEV Debugging</h3>
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <p className="text-slate-400">
              If you have Developer Mode enabled, DEF-DEV provides powerful debugging tools:
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-amber-400">Console Tab</p>
                <p className="text-xs text-slate-400 mt-1">
                  View real-time logs with error simplification - great for understanding what went wrong
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-amber-400">Actions Tab</p>
                <p className="text-xs text-slate-400 mt-1">
                  Monitor all system events and user interactions
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-amber-400">Storage Tab</p>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect and edit localStorage entries directly
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50">
                <p className="font-bold text-sm text-amber-400">Recovery Images</p>
                <p className="text-xs text-slate-400 mt-1">
                  Create snapshots of your system state to restore later
                </p>
              </div>
            </div>
            <p className="text-xs text-amber-400">
              Enable Developer Mode in Settings → Developer Options to access DEF-DEV
            </p>
          </div>
        </section>

        <section className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <h3 className="font-bold text-cyan-400 mb-2">Still stuck?</h3>
          <p className="text-sm text-slate-400">
            Remember, this is a fictional simulation for fun. If something really isn't working, 
            the worst case scenario is refreshing and starting over. No real submarines were 
            harmed in the making of this software.
          </p>
        </section>

        <div className="flex justify-between pt-8 border-t border-cyan-500/20">
          <Link to="/docs/shortcuts" className="text-cyan-400 hover:underline">← Keyboard Shortcuts</Link>
          <Link to="/docs" className="text-cyan-400 hover:underline">Back to Docs Home →</Link>
        </div>
      </main>
    </div>
    </>
  );
};

export default Troubleshooting;
