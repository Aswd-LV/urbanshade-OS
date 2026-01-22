import { Shield, Lock, Eye, Zap, Skull, Sparkles, AlertTriangle, Palette } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocCode } from "@/components/docs";

const AdminPanelDocs = () => {
  return (
    <DocLayout
      title="Admin Panel"
      description="Access the powerful Admin Panel in UrbanShade OS for crash testing, system control, and chaos management."
      keywords={["admin", "panel", "secret", "effects", "crash", "chaos"]}
      accentColor="amber"
      prevPage={{ title: "Advanced Features", path: "/docs/advanced" }}
      nextPage={{ title: "Keyboard Shortcuts", path: "/docs/shortcuts" }}
    >
      <DocHero
        icon={Shield}
        title="The Admin Panel"
        subtitle="The most powerful (and dangerous) tool in UrbanShade OS. With great power comes great potential for chaos. 🚨"
        accentColor="amber"
        badge="🔓 Secret Access"
      />

      <DocAlert variant="warning" title="Handle With Care">
        Some actions in the Admin Panel actually affect your localStorage. 
        Factory reset will delete everything. You've been warned!
      </DocAlert>

      <DocSection title="How to Access" icon={Lock} accentColor="amber">
        <div className="grid gap-4 md:grid-cols-3">
          <DocCard
            title="Terminal Command"
            description="Type 'secret' in the Terminal app. Classic hacker move."
            icon={Shield}
            accentColor="amber"
          />
          <DocCard
            title="Browser Console"
            description="Press F12 and type: adminPanel() — for when you want to feel like a real developer."
            icon={Zap}
            accentColor="cyan"
          />
          <DocCard
            title="HTML Source"
            description="Look for hidden comments in the HTML source code. Old school easter egg hunting."
            icon={Eye}
            accentColor="purple"
          />
        </div>
        <DocCode language="javascript" title="Console Access" code={`// Open browser console (F12) and type:
adminPanel()

// Alternative:
window.adminPanel()`} />
      </DocSection>

      <DocSection title="Visual Effects" icon={Eye} accentColor="purple">
        <p className="text-muted-foreground mb-4">
          Transform your interface into a psychedelic nightmare:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: "Rainbow Mode", desc: "Pride month is all year round" },
            { name: "Glitch Mode", desc: "Everything looks corrupted (it's a feature!)" },
            { name: "Matrix Mode", desc: "Green monospace for that 1999 aesthetic" },
            { name: "Blur Effect", desc: "For when you've had too much coffee" },
            { name: "Grayscale", desc: "Turn everything sad and depressing" },
            { name: "Invert Colors", desc: "Welcome to Opposite Day" },
          ].map((effect) => (
            <div key={effect.name} className="p-3 rounded-lg border border-border bg-card">
              <div className="font-medium text-foreground">{effect.name}</div>
              <div className="text-sm text-muted-foreground">{effect.desc}</div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="System Modifications" icon={Zap} accentColor="blue">
        <p className="text-muted-foreground mb-4">
          Mess with the fundamental fabric of reality (the UI):
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: "Tilt Mode", desc: "Slightly off-angle, just enough to be annoying" },
            { name: "Rotate 180°", desc: "For when upside-down is your thing" },
            { name: "Shake Screen", desc: "Earthquake simulator 3000" },
            { name: "Zoom 1.5x", desc: "Everything is BIG now" },
            { name: "Slow Motion", desc: "Cinematic UI movements" },
            { name: "Flash Bang", desc: "Brief white screen. RIP retinas." },
          ].map((mod) => (
            <div key={mod.name} className="p-3 rounded-lg border border-border bg-card">
              <div className="font-medium text-foreground">{mod.name}</div>
              <div className="text-sm text-muted-foreground">{mod.desc}</div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Security Controls" icon={Shield} accentColor="red">
        <DocAlert variant="danger" title="These Actually Work">
          Security controls affect your localStorage. Factory reset will 
          delete all your data. Don't blame us!
        </DocAlert>
        <div className="grid gap-3 md:grid-cols-2 mt-4">
          {[
            { name: "Toggle System Security", desc: "Turn the safety off" },
            { name: "Disable Authentication", desc: "Who needs passwords anyway?" },
            { name: "Clear BIOS Password", desc: "Forgot your password? Problem solved!" },
            { name: "Factory Reset", desc: "The nuclear option. Deletes everything." },
          ].map((ctrl) => (
            <div key={ctrl.name} className="p-3 rounded-lg border border-red-500/20 bg-red-500/5">
              <div className="font-medium text-red-400">{ctrl.name}</div>
              <div className="text-sm text-muted-foreground">{ctrl.desc}</div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Crash Builder" icon={Skull} accentColor="red">
        <p className="text-muted-foreground mb-4">
          Design your own blue screen of death! Choose crash type, customize the message, 
          and trigger it to freak out your friends.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Kernel Panic", "Virus", "Blue Screen", "Memory", "Corruption", "Overload"].map((type) => (
            <span key={type} className="px-3 py-1 rounded-full text-sm border border-red-500/30 bg-red-500/10 text-red-400">
              {type}
            </span>
          ))}
        </div>
        <DocAlert variant="tip" title="Pro Tip">
          Take a screenshot of a custom crash screen and send it to your tech-illiterate 
          relatives. Tell them your computer is broken. Enjoy the panic.
        </DocAlert>
      </DocSection>

      <DocSection title="Chaos Engineering" icon={Sparkles} accentColor="amber">
        <p className="text-muted-foreground mb-4">
          For when you want to test your mental stability:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: "Random Chaos", desc: "Surprise me! (You'll regret this)" },
            { name: "Spawn Icons", desc: "Desktop icons everywhere!" },
            { name: "Corrupt Text", desc: "All text becomes gibberish" },
            { name: "Trigger Lockdown", desc: "Emergency containment activated" },
          ].map((chaos) => (
            <div key={chaos.name} className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <div className="font-medium text-amber-400">{chaos.name}</div>
              <div className="text-sm text-muted-foreground">{chaos.desc}</div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Safety Tips" icon={AlertTriangle} accentColor="amber">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <span className="text-amber-400 font-bold">1.</span>
            <span><strong>Most effects are temporary</strong> — refresh the page to reset</span>
          </div>
          <div className="flex gap-3">
            <span className="text-amber-400 font-bold">2.</span>
            <span><strong>Some actions affect localStorage</strong> — factory reset deletes data</span>
          </div>
          <div className="flex gap-3">
            <span className="text-amber-400 font-bold">3.</span>
            <span><strong>Exit button in top right</strong> — use it when things get chaotic</span>
          </div>
          <div className="flex gap-3">
            <span className="text-amber-400 font-bold">4.</span>
            <span><strong>Effects can stack</strong> — Rainbow + Glitch + Shake = chaos</span>
          </div>
        </div>
      </DocSection>

      <DocSection title="Fun Things to Try" icon={Palette} accentColor="cyan">
        <div className="grid gap-4 md:grid-cols-2">
          <DocCard
            title="🎬 Create a Horror Movie"
            description="Enable glitch mode, trigger a virus crash, share screenshots. 'My computer is haunted.'"
            accentColor="purple"
          />
          <DocCard
            title="🎪 Maximum Chaos Mode"
            description="Enable Rainbow + Glitch + Rotate + Shake + Blur all at once. See how long you last."
            accentColor="amber"
          />
          <DocCard
            title="🎨 Custom Errors"
            description="Use crash builder to create custom messages. 'ERROR: Coffee levels critically low.'"
            accentColor="red"
          />
          <DocCard
            title="🎮 Challenge Friends"
            description="Contest to find all three access methods. Winner gets bragging rights."
            accentColor="cyan"
          />
        </div>
      </DocSection>
    </DocLayout>
  );
};

export default AdminPanelDocs;