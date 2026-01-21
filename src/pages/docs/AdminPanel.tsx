import { ArrowLeft, Shield, Sparkles, AlertTriangle, Skull, Eye, Palette, Zap, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const AdminPanelDocs = () => {
  return (
    <>
    <SEO 
      title="Admin Panel" 
      description="Access the powerful Admin Panel in Urbanshade OS for crash testing, system control, and chaos management."
      path="/docs/admin-panel"
    />
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Admin Panel Guide</h1>
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
          <Shield className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">The Admin Panel</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Welcome to the most powerful (and dangerous) tool in URBANSHADE OS. 
            With great power comes great potential for hilarious chaos. You've been warned! 🚨
          </p>
        </section>

        {/* Access Methods */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold">How to Access</h3>
          </div>
          <div className="p-6 rounded-lg bg-primary/10 border border-primary/30 space-y-4">
            <p className="text-muted-foreground">
              There are multiple secret ways to access the Admin Panel. Choose your favorite:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <h4 className="font-bold text-primary mb-2">Method 1: Terminal Command</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Type <code className="bg-black/60 px-2 py-1 rounded border border-white/20">secret</code> in the Terminal app
                </p>
                <p className="text-xs text-gray-500 italic">
                  Classic move. Very hacker-esque. 10/10 style points.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <h4 className="font-bold text-primary mb-2">Method 2: Browser Console</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Open browser console (F12) and type: <code className="bg-black/60 px-2 py-1 rounded border border-white/20">adminPanel()</code>
                </p>
                <p className="text-xs text-gray-500 italic">
                  For when you want to feel like a real developer. Press F12, pretend you know JavaScript.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <h4 className="font-bold text-primary mb-2">Method 3: HTML Source Easter Egg</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Look for hidden comments in the HTML source code
                </p>
                <p className="text-xs text-gray-500 italic">
                  Remember when we hid cheat codes in game manuals? This is like that, but nerdier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold">Features & Capabilities</h3>
          </div>
          <p className="text-muted-foreground">
            The Admin Panel is organized into several tabs, each more chaotic than the last:
          </p>
          
          <div className="grid gap-4">
            {/* Visual Tab */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6 text-purple-400" />
                <h4 className="text-xl font-bold text-purple-400">Visual Effects</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform your interface into a psychedelic nightmare! Features include:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• <strong>Rainbow Mode</strong> - Because pride month is all year round</li>
                <li>• <strong>Glitch Mode</strong> - Make everything look corrupted (it's a feature, not a bug!)</li>
                <li>• <strong>Matrix Mode</strong> - Green monospace font for that 1999 hacker aesthetic</li>
                <li>• <strong>Blur Effect</strong> - For when you've had one too many espressos</li>
                <li>• <strong>Grayscale</strong> - Turn everything sad and depressing</li>
                <li>• <strong>Invert Colors</strong> - Welcome to Opposite Day</li>
              </ul>
            </div>

            {/* System Tab */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-400" />
                <h4 className="text-xl font-bold text-blue-400">System Modifications</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Mess with the fundamental fabric of reality (well, the UI at least):
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• <strong>Tilt Mode</strong> - Slightly off-angle, just enough to be annoying</li>
                <li>• <strong>Rotate 180°</strong> - For when upside-down is your thing</li>
                <li>• <strong>Shake Screen</strong> - Earthquake simulator 3000</li>
                <li>• <strong>Zoom 1.5x</strong> - Everything is BIG now</li>
                <li>• <strong>Slow Motion</strong> - Watch your UI move in cinematic glory</li>
                <li>• <strong>Flash Bang</strong> - Brief white screen. Good luck with your retinas.</li>
              </ul>
            </div>

            {/* Security Tab */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-red-400" />
                <h4 className="text-xl font-bold text-red-400">Security Controls</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Where you can disable all the security features you carefully set up:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• <strong>Toggle System Security</strong> - Turn the safety off</li>
                <li>• <strong>Disable Authentication</strong> - Who needs passwords anyway?</li>
                <li>• <strong>Clear BIOS Password</strong> - Forgot your password? Problem solved!</li>
                <li>• <strong>Factory Reset</strong> - The nuclear option. Deletes everything.</li>
              </ul>
              <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-xs text-yellow-500">
                  ⚠️ <strong>Warning:</strong> These actually work! Your localStorage will be affected. 
                  Don't blame us when you have to set everything up again.
                </p>
              </div>
            </div>

            {/* Crash Tab */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <Skull className="w-6 h-6 text-red-400" />
                <h4 className="text-xl font-bold text-red-400">Crash Builder</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Ever wanted to design your own blue screen of death? Now you can!
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Choose from 6 crash types: Kernel Panic, Virus, Blue Screen, Memory, Corruption, Overload</li>
                <li>• Customize the crash title and message</li>
                <li>• Trigger crashes to freak out your friends</li>
                <li>• Create dramatic moments for screenshots</li>
              </ul>
              <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-blue-400">
                  💡 <strong>Pro tip:</strong> Take a screenshot of a custom crash screen and send it to 
                  your tech-illiterate relatives. Tell them your computer is broken. Enjoy the panic.
                </p>
              </div>
            </div>

            {/* Chaos Tab */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h4 className="text-xl font-bold text-yellow-400">Chaos Engineering</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                For when you want to test your mental stability:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• <strong>Random Chaos</strong> - Surprise me! (You'll regret this)</li>
                <li>• <strong>Spawn Icons</strong> - Desktop icons everywhere!</li>
                <li>• <strong>Corrupt Text</strong> - Watch all text turn into gibberish</li>
                <li>• <strong>Trigger Lockdown</strong> - Emergency containment protocol activated</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <h3 className="text-2xl font-bold">Safety Tips (Read This First!)</h3>
          </div>
          <div className="p-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30 space-y-4">
            <p className="text-muted-foreground">
              Before you go crazy with admin powers, here are some things to keep in mind:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">1.</span>
                <span>
                  <strong>Most effects are temporary</strong> - Refresh the page to reset everything to normal
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">2.</span>
                <span>
                  <strong>Some actions affect localStorage</strong> - Factory reset and password clearing will actually delete your data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">3.</span>
                <span>
                  <strong>Exit button is in the top right</strong> - You'll need it when things get too chaotic
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">4.</span>
                <span>
                  <strong>Some effects stack</strong> - Enabling multiple visual effects creates... interesting results
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">5.</span>
                <span>
                  <strong>Not responsible for migraines</strong> - Rainbow Mode + Glitch Mode + Shake = ??? (Try at your own risk)
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Fun Ideas */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Palette className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold">Fun Things to Try</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">🎬 Create a Horror Movie</h4>
              <p className="text-sm text-muted-foreground">
                Enable glitch mode, trigger a virus crash, then share screenshots. 
                "My computer is haunted" has never been more convincing.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">🎪 Maximum Chaos Mode</h4>
              <p className="text-sm text-muted-foreground">
                Enable Rainbow + Glitch + Rotate + Shake + Blur all at once. 
                See how long you can last before getting dizzy.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">🎨 Make It Your Own</h4>
              <p className="text-sm text-muted-foreground">
                Use the crash builder to create custom error messages. 
                "ERROR: Coffee levels critically low" is always a good one.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">🎮 Challenge Your Friends</h4>
              <p className="text-sm text-muted-foreground">
                Have a contest to see who can find all three access methods. 
                Winner gets bragging rights (and maybe coffee).
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="p-6 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30">
          <h3 className="text-xl font-bold text-primary mb-3">Remember</h3>
          <p className="text-muted-foreground mb-2">
            The Admin Panel is all about having fun and exploring what's possible with web interfaces. 
            Nothing you do here will harm your actual computer (unless you somehow manage to trigger an 
            actual nuclear meltdown, but that's on you).
          </p>
          <p className="text-sm text-gray-500 italic">
            Use responsibly. Or don't. We're documentation, not your parents. 🤷
          </p>
        </section>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs/advanced" className="text-primary hover:underline">← Advanced Features</Link>
          <Link to="/docs/shortcuts" className="text-primary hover:underline">Keyboard Shortcuts →</Link>
        </div>
      </main>
    </div>
    </>
  );
};

export default AdminPanelDocs;
