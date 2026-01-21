import { HelpCircle, AlertTriangle, CheckCircle, XCircle, RotateCcw, Bug, Wrench } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert } from "@/components/docs";

const Troubleshooting = () => {
  const faqs = [
    {
      question: "I forgot my password!",
      answer: "Press F2 during boot to enter Recovery Mode. From there, you can reset your password or do a factory reset.",
      solution: "Recovery Mode → Reset Password"
    },
    {
      question: "The system won't boot!",
      answer: "Try refreshing the page. If that doesn't work, clear localStorage for this site. Some cached data might be corrupted.",
      solution: "Refresh page or clear localStorage"
    },
    {
      question: "My settings aren't saving!",
      answer: "Check if your browser allows localStorage. Private/incognito mode often blocks it. Also check storage quota.",
      solution: "Check browser storage settings"
    },
    {
      question: "I exported my system but can't import it!",
      answer: "The import file must be valid JSON. Make sure you're selecting the right file and it hasn't been modified.",
      solution: "Use original export file"
    },
    {
      question: "Everything is broken!",
      answer: "Go to Recovery Mode (F2 during boot) and do a Factory Reset. Sometimes you just need a fresh start.",
      solution: "Factory Reset via Recovery Mode"
    },
  ];

  const knownIssues = [
    { issue: "Window positions reset after refresh", status: "known", note: "Expected behavior - not persisted" },
    { issue: "Some keyboard shortcuts don't work", status: "partial", note: "Limited implementation" },
    { issue: "Camera feeds show static", status: "feature", note: "That's the point 👀" },
    { issue: "DEF-DEV console not capturing logs", status: "known", note: "Accept warning screen first" },
  ];

  return (
    <DocLayout
      title="Troubleshooting"
      description="FAQ and troubleshooting guide for Urbanshade OS - password recovery, boot issues, and common problems."
      keywords={["help", "troubleshooting", "faq", "problems", "recovery", "reset"]}
      accentColor="red"
      prevPage={{ title: "Keyboard Shortcuts", path: "/docs/shortcuts" }}
      nextPage={{ title: "Back to Docs", path: "/docs" }}
    >
      <DocHero
        icon={HelpCircle}
        title="Houston, We Have a Problem"
        subtitle="Something went wrong? Don't worry, it's probably not a real containment breach. 
        Let's figure out what's happening."
        accentColor="red"
      />

      <DocSection title="The Universal Fix" icon={RotateCcw} accentColor="cyan" id="universal">
        <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-cyan-400" />
            <p className="text-lg font-bold text-slate-100">Have you tried turning it off and on again?</p>
          </div>
          <p className="text-slate-300">Seriously though, most issues can be fixed by:</p>
          <ol className="space-y-2 ml-4 text-slate-300">
            <li>1. Refreshing the page (Ctrl+R or Cmd+R)</li>
            <li>2. Hard refreshing (Ctrl+Shift+R or Cmd+Shift+R)</li>
            <li>3. Clearing localStorage and starting fresh</li>
            <li>4. Using Recovery Mode (F2 during boot)</li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Frequently Asked Questions" icon={HelpCircle} accentColor="amber" id="faq">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-100">{faq.question}</h4>
                  <p className="text-sm text-slate-400">{faq.answer}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-400">{faq.solution}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Known Issues & 'Features'" icon={Bug} accentColor="purple" id="known">
        <p className="mb-4 text-slate-300">
          Some things that might seem like bugs are actually intentional. Or we're just calling them features.
        </p>
        <div className="space-y-3">
          {knownIssues.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-3">
              {item.status === "feature" ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : item.status === "known" ? (
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm text-slate-100">{item.issue}</p>
                <p className="text-xs text-slate-400 mt-1">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Nuclear Options" icon={AlertTriangle} accentColor="red" id="nuclear">
        <DocAlert variant="danger">
          These options will delete your saved data. Export first if you want to keep anything!
        </DocAlert>
        <div className="space-y-3 mt-4">
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
            <p className="font-bold text-sm text-slate-100">Clear Site Data</p>
            <p className="text-xs text-slate-400 mt-1">
              Open DevTools (F12) → Application → Storage → Clear site data
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
            <p className="font-bold text-sm text-slate-100">Factory Reset via Recovery</p>
            <p className="text-xs text-slate-400 mt-1">
              Press F2 during boot → Select Factory Reset → Confirm
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
            <p className="font-bold text-sm text-slate-100">Manual localStorage Clear</p>
            <p className="text-xs text-slate-400 mt-1">
              Open DevTools Console → Type: localStorage.clear() → Refresh
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="DEF-DEV Debugging" icon={Bug} accentColor="amber" id="defdev">
        <p className="mb-4 text-slate-300">
          If you have Developer Mode enabled, DEF-DEV provides powerful debugging tools:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <DocCard
            title="Console Tab"
            description="View real-time logs with error simplification"
            icon={Bug}
            accentColor="amber"
          />
          <DocCard
            title="Actions Tab"
            description="Monitor all system events and user interactions"
            icon={Wrench}
            accentColor="amber"
          />
          <DocCard
            title="Storage Tab"
            description="Inspect and edit localStorage entries directly"
            icon={HelpCircle}
            accentColor="amber"
          />
          <DocCard
            title="Recovery Images"
            description="Create snapshots of your system state"
            icon={RotateCcw}
            accentColor="amber"
          />
        </div>
        <DocAlert variant="tip" title="Enable Developer Mode">
          Go to Settings → Developer Options to enable Developer Mode and access DEF-DEV
        </DocAlert>
      </DocSection>

      <div className="p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
        <h3 className="font-bold text-cyan-400 mb-2">Still stuck?</h3>
        <p className="text-sm text-slate-300">
          Remember, this is a fictional simulation for fun. If something really isn't working, 
          the worst case scenario is refreshing and starting over. No real submarines were 
          harmed in the making of this software.
        </p>
      </div>
    </DocLayout>
  );
};

export default Troubleshooting;