import { ArrowLeft, Rocket, User, Monitor, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const GettingStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Getting Started</h1>
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
          <Rocket className="w-16 h-16 mx-auto text-primary animate-bounce" />
          <h2 className="text-4xl font-bold">Welcome Aboard, New Recruit!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            So you've been assigned to an underwater research facility 8,247 meters below sea level. 
            Don't worry, the pressure is only... extreme. Let's get you set up!
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">1</span>
            The Installation Process
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <p className="text-muted-foreground">
              When you first launch URBANSHADE OS, you'll be greeted by our friendly installer. 
              It's like a regular OS installation, except everything is fake and nothing matters! 
              Choose your installation type:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="font-bold">Minimal</span>
                  <span className="text-muted-foreground"> - For those who like to live dangerously with fewer apps</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="font-bold">Standard</span>
                  <span className="text-muted-foreground"> - The "I just want things to work" option (recommended)</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <span className="font-bold">Complete</span>
                  <span className="text-muted-foreground"> - Everything. All of it. Maximum chaos potential.</span>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">2</span>
            OOBE (Out of Box Experience)
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <p className="text-muted-foreground">
              After installation, you'll go through OOBE. It's like setting up a new phone, 
              but instead of syncing your photos, you're configuring a deep-sea research station. 
              Fun times!
            </p>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-sm">
                <span className="font-bold text-primary">Pro tip:</span> Pay attention during OOBE. 
                This is where you set up your facility name and initial preferences. 
                You can change most things later, but first impressions matter... to no one, because this is a simulation.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">3</span>
            Creating Your Admin Account
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-12 h-12 text-primary" />
              <div>
                <p className="text-muted-foreground">
                  You'll need to create an admin account. This involves:
                </p>
              </div>
            </div>
            <ul className="space-y-2 ml-4 text-muted-foreground">
              <li>• Choosing a username (be creative, or don't, we're not judging)</li>
              <li>• Setting a password (minimum 4 characters - yes, we know, very secure)</li>
              <li>• Selecting your role and clearance level</li>
            </ul>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-500">
                <span className="font-bold">⚠️ Remember:</span> This is a simulation! 
                Don't use real passwords. Everything is stored in your browser's localStorage, 
                which is about as secure as a screen door on a submarine.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold">4</span>
            Your First Login
          </h3>
          <div className="p-6 rounded-lg bg-black/40 border border-white/10 space-y-4">
            <div className="flex items-center gap-4">
              <Monitor className="w-12 h-12 text-primary" />
              <p className="text-muted-foreground">
                After setup, you'll see the login screen. Select your user, enter your password, 
                and boom - you're in! Welcome to your underwater command center.
              </p>
            </div>
            <p className="text-muted-foreground">
              The desktop awaits with icons, a taskbar, and the Start Menu. 
              It's just like a real operating system, except nothing you do here will 
              accidentally delete your actual files. We hope.
            </p>
          </div>
        </section>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs" className="text-primary hover:underline">← Back to Documentation</Link>
          <Link to="/docs/applications" className="text-primary hover:underline">Applications Guide →</Link>
        </div>
      </main>
    </div>
  );
};

export default GettingStarted;
