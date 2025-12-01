import { ArrowLeft, HelpCircle, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Troubleshooting</h1>
          <Link 
            to="/docs" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Docs
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section className="text-center space-y-4">
          <HelpCircle className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Houston, We Have a Problem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Something went wrong? Don't worry, it's probably not a real containment breach. 
            Let's figure out what's happening.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">The Universal Fix</h3>
          <div className="p-6 rounded-lg bg-primary/10 border border-primary/30 space-y-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-primary" />
              <p className="text-lg font-bold">Have you tried turning it off and on again?</p>
            </div>
            <p className="text-muted-foreground">
              Seriously though, most issues can be fixed by:
            </p>
            <ol className="space-y-2 ml-4 text-muted-foreground">
              <li>1. Refreshing the page (Ctrl+R or Cmd+R)</li>
              <li>2. Hard refreshing (Ctrl+Shift+R or Cmd+Shift+R)</li>
              <li>3. Clearing localStorage and starting fresh</li>
              <li>4. Using Recovery Mode (F2 during boot)</li>
            </ol>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <h4 className="font-bold">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
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
          <h3 className="text-2xl font-bold">Known Issues & "Features"</h3>
          <p className="text-muted-foreground">
            Some things that might seem like bugs are actually intentional. Or we're just calling them features. Same thing, really.
          </p>
          <div className="space-y-3">
            {knownIssues.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-start gap-3">
                {item.status === "feature" ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : item.status === "known" ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-sm">{item.issue}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.workaround}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold">Nuclear Options</h3>
          <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/30 space-y-4">
            <p className="text-muted-foreground">
              If nothing else works, here are the last resort options:
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded bg-black/40">
                <p className="font-bold text-sm">Clear Site Data</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Open DevTools (F12) → Application → Storage → Clear site data
                </p>
              </div>
              <div className="p-3 rounded bg-black/40">
                <p className="font-bold text-sm">Factory Reset via Recovery</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Press F2 during boot → Select Factory Reset → Confirm
                </p>
              </div>
              <div className="p-3 rounded bg-black/40">
                <p className="font-bold text-sm">Manual localStorage Clear</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Open DevTools Console → Type: localStorage.clear() → Refresh
                </p>
              </div>
            </div>
            <p className="text-xs text-destructive">
              ⚠️ All of these will delete your saved data. Export first if you want to keep anything!
            </p>
          </div>
        </section>

        <section className="p-6 rounded-lg bg-primary/10 border border-primary/30">
          <h3 className="font-bold text-primary mb-2">Still stuck?</h3>
          <p className="text-sm text-muted-foreground">
            Remember, this is a fictional simulation for fun. If something really isn't working, 
            the worst case scenario is refreshing and starting over. No real submarines were 
            harmed in the making of this software.
          </p>
        </section>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs/shortcuts" className="text-primary hover:underline">← Keyboard Shortcuts</Link>
          <Link to="/docs" className="text-primary hover:underline">Back to Docs Home →</Link>
        </div>
      </main>
    </div>
  );
};

export default Troubleshooting;
