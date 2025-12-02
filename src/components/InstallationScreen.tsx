import { useState, useEffect } from "react";
import { Shield, HardDrive, Settings, User, Check, Loader2 } from "lucide-react";

interface InstallationScreenProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

export const InstallationScreen = ({ onComplete }: InstallationScreenProps) => {
  const [stage, setStage] = useState<"welcome" | "product-key" | "tos" | "options" | "installing" | "settings" | "user-setup" | "rebooting">("welcome");
  const [installProgress, setInstallProgress] = useState(0);
  const [installLogs, setInstallLogs] = useState<string[]>([]);
  const [installationType, setInstallationType] = useState<"standard" | "minimal" | "full">("standard");
  
  // Settings
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [keyboardLayout, setKeyboardLayout] = useState("US");
  
  // User setup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  // Product key and TOS
  const [productKey, setProductKey] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);

  const getInstallSteps = () => {
    const baseSteps = [
      { text: "Preparing installation environment...", duration: 2000 },
      { text: "Creating system partitions...", duration: 3000 },
      { text: "Installing bootloader (GRUB)...", duration: 1500 },
      { text: "Copying system files...", duration: 4000 },
      { text: "Installing kernel modules...", duration: 2500 }
    ];

    if (installationType === "minimal") {
      return [
        ...baseSteps,
        { text: "Configuring system services...", duration: 1000 },
        { text: "Setting up network stack...", duration: 1500 },
        { text: "Finalizing installation...", duration: 1000 },
        { text: "Installation complete!", duration: 500 }
      ];
    } else if (installationType === "standard") {
      return [
        ...baseSteps,
        { text: "Configuring system services...", duration: 2000 },
        { text: "Setting up network stack...", duration: 2500 },
        { text: "Installing security modules...", duration: 3000 },
        { text: "Configuring containment systems...", duration: 2000 },
        { text: "Setting up monitoring tools...", duration: 1500 },
        { text: "Installing database drivers...", duration: 2500 },
        { text: "Configuring authentication system...", duration: 1800 },
        { text: "Finalizing installation...", duration: 1500 },
        { text: "Running system diagnostics...", duration: 2000 },
        { text: "Installation complete!", duration: 500 }
      ];
    } else { // full
      return [
        ...baseSteps,
        { text: "Configuring system services...", duration: 3000 },
        { text: "Setting up network stack...", duration: 3500 },
        { text: "Installing security modules...", duration: 4000 },
        { text: "Configuring containment systems...", duration: 3000 },
        { text: "Setting up monitoring tools...", duration: 2500 },
        { text: "Installing database drivers...", duration: 3500 },
        { text: "Configuring authentication system...", duration: 2800 },
        { text: "Setting up specimen tracking...", duration: 3200 },
        { text: "Installing emergency protocols...", duration: 2500 },
        { text: "Configuring pressure monitoring...", duration: 2000 },
        { text: "Setting up communication systems...", duration: 3000 },
        { text: "Installing power grid controls...", duration: 2800 },
        { text: "Installing all applications...", duration: 5000 },
        { text: "Finalizing installation...", duration: 2000 },
        { text: "Running system diagnostics...", duration: 3000 },
        { text: "Installation complete!", duration: 500 }
      ];
    }
  };

  useEffect(() => {
    if (stage === "installing") {
      const steps = getInstallSteps();
      if (!steps || steps.length === 0) {
        console.error("Installation steps not available");
        return;
      }
      
      let currentStep = 0;
      const totalSteps = steps.length;
      
      const runStep = () => {
        if (currentStep < totalSteps && steps[currentStep]) {
          const step = steps[currentStep];
          if (step && step.text) {
            setInstallLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.text}`]);
            setInstallProgress(((currentStep + 1) / totalSteps) * 100);
            const duration = step.duration || 1000;
            currentStep++;
            setTimeout(runStep, duration);
          } else {
            console.error("Invalid step data at index", currentStep);
            currentStep++;
            setTimeout(runStep, 100);
          }
        } else if (currentStep >= totalSteps) {
          setTimeout(() => setStage("settings"), 1000);
        }
      };

      runStep();
    }
  }, [stage, installationType]);

  const handleUserSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Save installation type
    localStorage.setItem("urbanshade_install_type", installationType);
    
    // Trigger reboot sequence
    setStage("rebooting");
    setTimeout(() => {
      onComplete({ username: username.trim(), password });
    }, 5000); // 5 seconds of reboot
  };

  if (stage === "welcome") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center text-foreground font-mono p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center animate-scale-in">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-primary">Welcome! 🎉</h1>
            <p className="text-lg">Let's set up UrbanShade OS</p>
            <div className="mt-6 text-sm text-primary/70">
              Ready to create your underwater desktop?
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="space-y-3 text-sm">
              <p className="text-primary font-bold text-lg">Hey there! 👋</p>
              <p className="text-muted-foreground leading-relaxed">
                This friendly wizard will help you set up your simulated deep-sea facility management system.
                Don't worry, it's quick and easy!
              </p>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-sm">
                <strong className="text-primary">Quick Setup:</strong> We'll create your account, configure some settings, 
                and get you diving in no time. Takes about 2-3 minutes!
              </div>
            </div>

            <button
              onClick={() => setStage("product-key")}
              className="w-full px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Let's Get Started! →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "product-key") {
    const validKeys = ["URBSH-2024-FACIL-MGMT", "DEMO-KEY-URBANSHADE", "TEST-INSTALL-KEY"];
    const isValidKey = validKeys.includes(productKey.toUpperCase());

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center text-foreground font-mono p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Quick Activation 🔑</h2>
            <p className="text-sm text-muted-foreground mt-2">Enter any demo key to continue</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 shadow-xl">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-bold text-primary mb-2 block">Product Key</span>
                <input
                  type="text"
                  value={productKey}
                  onChange={(e) => setProductKey(e.target.value.toUpperCase())}
                  placeholder="XXXXX-XXXX-XXXXX-XXXX"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-center text-lg font-mono tracking-wider"
                  maxLength={25}
                />
              </label>

              {productKey && !isValidKey && (
                <div className="text-xs text-destructive flex items-center gap-2">
                  <span>❌ Try one of the demo keys below!</span>
                </div>
              )}

              {isValidKey && (
                <div className="text-xs text-green-500 flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4" />
                  ✅ Perfect! You're all set
                </div>
              )}

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-xs">
                <p className="font-bold mb-2 text-primary">✨ Demo Keys (pick any!):</p>
                <ul className="space-y-1 font-mono text-muted-foreground">
                  <li className="hover:text-primary cursor-pointer transition-colors">• URBSH-2024-FACIL-MGMT</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">• DEMO-KEY-URBANSHADE</li>
                  <li className="hover:text-primary cursor-pointer transition-colors">• TEST-INSTALL-KEY</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage("welcome")}
                className="flex-1 px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStage("tos")}
                disabled={!isValidKey}
                className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "tos") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">TERMS OF SERVICE</h2>
            <p className="text-sm text-muted-foreground mt-2">Please read carefully before proceeding</p>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <div className="h-96 overflow-y-auto p-4 rounded-lg bg-black/50 border border-white/10 text-xs space-y-3">
              <h3 className="font-bold text-primary text-sm">URBANSHADE OPERATING SYSTEM LICENSE AGREEMENT</h3>
              
              <p className="text-muted-foreground">
                This License Agreement ("Agreement") is between you and Urbanshade Corporation ("Urbanshade").
              </p>

              <div className="space-y-2">
                <p className="font-bold text-primary">1. ACCEPTANCE OF TERMS</p>
                <p className="text-muted-foreground">
                  By installing, copying, or using this software, you agree to be bound by the terms of this Agreement.
                  If you do not agree, do not install or use the software.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-primary">2. CLASSIFIED SYSTEM OPERATIONS</p>
                <p className="text-muted-foreground">
                  This software is designed for deep-sea facility management and classified operations. 
                  Unauthorized access, distribution, or disclosure of system information is strictly prohibited 
                  and may result in severe penalties.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-primary">3. SECURITY AND CONTAINMENT</p>
                <p className="text-muted-foreground">
                  Users must maintain all security protocols and containment procedures at all times. 
                  Failure to follow safety guidelines may result in catastrophic events.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-primary">4. DATA COLLECTION</p>
                <p className="text-muted-foreground">
                  This system collects operational data including but not limited to: facility monitoring,
                  personnel tracking, specimen containment status, and system diagnostics.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-primary">5. WARRANTY DISCLAIMER</p>
                <p className="text-muted-foreground">
                  This software is provided "AS IS" without warranty of any kind. Urbanshade Corporation 
                  shall not be liable for any damages arising from the use of this software, including but 
                  not limited to containment breaches, system failures, or entity escapes.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-primary">6. TERMINATION</p>
                <p className="text-muted-foreground">
                  This license is effective until terminated. Urbanshade may terminate this license at any time 
                  if you fail to comply with its terms.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-destructive">⚠ EMERGENCY PROTOCOLS</p>
                <p className="text-muted-foreground">
                  In the event of a containment breach or system compromise, follow all emergency protocols 
                  immediately. Personnel safety is secondary to containment integrity.
                </p>
              </div>

              <p className="text-muted-foreground mt-6">
                © 2024 Urbanshade Corporation. All rights reserved.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tosAccepted}
                onChange={(e) => setTosAccepted(e.target.checked)}
                className="w-5 h-5 mt-1"
              />
              <span className="text-sm">
                I have read and agree to the Terms of Service and understand the risks associated 
                with operating this classified system.
              </span>
            </label>

            <div className="flex gap-4">
              <button
                onClick={() => setStage("product-key")}
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStage("options")}
                disabled={!tosAccepted}
                className="flex-1 px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "options") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary">INSTALLATION OPTIONS</h2>
            <p className="text-sm text-muted-foreground mt-2">Select installation type</p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => setInstallationType("minimal")}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                installationType === "minimal"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <HardDrive className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-2">MINIMAL INSTALLATION</h3>
                  <p className="text-sm text-muted-foreground">
                    Core system only. Recommended for backup terminals.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">~2.4 GB required</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setInstallationType("standard")}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                installationType === "standard"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <Settings className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-2">STANDARD INSTALLATION (Recommended)</h3>
                  <p className="text-sm text-muted-foreground">
                    All essential features for facility management.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">~5.7 GB required</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setInstallationType("full")}
              className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                installationType === "full"
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-primary mb-2">FULL INSTALLATION</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete system with all features, monitoring, and security modules.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">~12.3 GB required</p>
                </div>
              </div>
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStage("welcome")}
              className="flex-1 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
            >
              BACK
            </button>
            <button
              onClick={() => setStage("installing")}
              className="flex-1 px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "installing") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">INSTALLING URBANSHADE OS</h2>
            <p className="text-sm text-muted-foreground">Installation Type: {installationType.toUpperCase()}</p>
          </div>

          <div className="glass-panel p-6 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary font-bold">{Math.round(installProgress)}%</span>
              </div>
              <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300"
                  style={{ width: `${installProgress}%` }}
                />
              </div>
            </div>

            {/* Installation Logs */}
            <div className="h-96 bg-black/50 rounded-lg p-4 overflow-y-auto border border-white/10 font-mono text-xs space-y-1">
              {installLogs.map((log, i) => (
                <div key={i} className="text-green-400">
                  {log}
                  {i === installLogs.length - 1 && <span className="animate-pulse">_</span>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-yellow-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please do not power off the system...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "settings") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Settings className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">SYSTEM SETTINGS</h2>
            <p className="text-sm text-muted-foreground">Configure your installation</p>
          </div>

          <div className="glass-panel p-6 space-y-6">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Installation completed successfully!</span>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-3">
                Automatic Updates
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setAutoUpdates(true)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left text-sm ${
                    autoUpdates ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold">Enable automatic updates</div>
                  <div className="text-xs text-muted-foreground">Recommended for security patches</div>
                </button>
                <button
                  onClick={() => setAutoUpdates(false)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left text-sm ${
                    !autoUpdates ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="font-bold">Manual updates only</div>
                  <div className="text-xs text-muted-foreground">You control when to update</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-primary mb-3">
                Keyboard Layout
              </label>
              <select
                value={keyboardLayout}
                onChange={(e) => setKeyboardLayout(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
              >
                <option value="US">US (QWERTY)</option>
                <option value="UK">UK (QWERTY)</option>
                <option value="DE">German (QWERTZ)</option>
                <option value="FR">French (AZERTY)</option>
                <option value="ES">Spanish</option>
                <option value="JP">Japanese</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">* Layout selection is cosmetic only</p>
            </div>

            <button
              onClick={() => setStage("user-setup")}
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              CONTINUE TO USER SETUP
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "user-setup") {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white font-mono p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">CREATE ADMINISTRATOR</h2>
            <p className="text-sm text-muted-foreground">Setup your admin account</p>
          </div>

          <form onSubmit={handleUserSetup} className="glass-panel p-6 space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-500 text-xs flex items-start gap-2">
              <User className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Settings saved. Create your administrator account.</span>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Administrator Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                placeholder="Enter username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                placeholder="Confirm password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              CREATE ACCOUNT & FINISH
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Rebooting stage
  if (stage === "rebooting") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white font-mono">
        <div className="text-center space-y-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-xl text-primary font-bold">SYSTEM REBOOTING...</p>
            <p className="text-sm text-muted-foreground">Finalizing installation</p>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>[SYSTEM] Saving configuration...</div>
            <div>[SYSTEM] Preparing first boot...</div>
            <div>[SYSTEM] Initializing user environment...</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
