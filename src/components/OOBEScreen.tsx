import { useState } from "react";
import { Settings, Globe, Clock, Monitor, Check, Shield, Info, Volume2, Wifi, Battery, Accessibility, Bell, Palette, Code } from "lucide-react";
import { toast } from "sonner";
import { StorageStep, SecurityStep, AccountsStep, DeveloperStep, BackgroundStep } from "./OOBESteps";

interface OOBEScreenProps {
  onComplete: () => void;
}

export const OOBEScreen = ({ onComplete }: OOBEScreenProps) => {
  const [step, setStep] = useState<"welcome" | "region" | "time" | "display" | "sound" | "network" | "power" | "accessibility" | "notifications" | "background" | "privacy" | "advanced" | "storage" | "accounts" | "developer" | "security" | "performance" | "telemetry" | "personalization" | "survey" | "finish">("welcome");
  const [region, setRegion] = useState("North America");
  const [timezone, setTimezone] = useState("UTC-5 (EST)");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [animations, setAnimations] = useState(true);
  
  // Privacy settings
  const [analytics, setAnalytics] = useState(false);
  const [crashReports, setCrashReports] = useState(true);
  const [diagnostics, setDiagnostics] = useState(true);
  
  // Sound settings
  const [volume, setVolume] = useState(70);
  const [soundEffects, setSoundEffects] = useState(true);
  
  // Network settings
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  
  // Power settings
  const [powerMode, setPowerMode] = useState("balanced");
  const [sleepTimer, setSleepTimer] = useState(30);
  
  // Accessibility
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  
  // Background gradient
  const [bgGradientStart, setBgGradientStart] = useState("#1a1a2e");
  const [bgGradientEnd, setBgGradientEnd] = useState("#16213e");
  
  // Advanced
  const [developerMode, setDeveloperMode] = useState(false);
  const [bootAnimations, setBootAnimations] = useState(true);
  const [oemUnlocked, setOemUnlocked] = useState(false);
  const [usbDebugging, setUsbDebugging] = useState(false);
  
  // Storage
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [cacheSize, setCacheSize] = useState(5);
  
  // Security
  const [encryption, setEncryption] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  
  // Performance
  const [performanceMode, setPerformanceMode] = useState("balanced");
  const [visualEffects, setVisualEffects] = useState(true);
  
  // Telemetry
  const [telemetry, setTelemetry] = useState(true);
  const [errorReporting, setErrorReporting] = useState(true);
  
  // Personalization
  const [systemName, setSystemName] = useState("URBANSHADE-TERMINAL");
  const [bootMessage, setBootMessage] = useState("Welcome to UrbanShade OS");
  
  // Survey
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleNext = () => {
    if (step === "welcome") setStep("region");
    else if (step === "region") setStep("time");
    else if (step === "time") setStep("display");
    else if (step === "display") setStep("sound");
    else if (step === "sound") setStep("network");
    else if (step === "network") setStep("power");
    else if (step === "power") setStep("accessibility");
    else if (step === "accessibility") setStep("notifications");
    else if (step === "notifications") setStep("background");
    else if (step === "background") setStep("storage");
    else if (step === "storage") setStep("security");
    else if (step === "security") setStep("accounts");
    else if (step === "accounts") setStep("developer");
    else if (step === "developer") setStep("privacy");
    else if (step === "privacy") setStep("performance");
    else if (step === "performance") setStep("telemetry");
    else if (step === "telemetry") setStep("personalization");
    else if (step === "personalization") setStep("advanced");
    else if (step === "advanced") setStep("survey");
    else if (step === "survey") setStep("finish");
  };
  
  const handleBack = () => {
    if (step === "region") setStep("welcome");
    else if (step === "time") setStep("region");
    else if (step === "display") setStep("time");
    else if (step === "sound") setStep("display");
    else if (step === "network") setStep("sound");
    else if (step === "power") setStep("network");
    else if (step === "accessibility") setStep("power");
    else if (step === "notifications") setStep("accessibility");
    else if (step === "background") setStep("notifications");
    else if (step === "storage") setStep("background");
    else if (step === "security") setStep("storage");
    else if (step === "accounts") setStep("security");
    else if (step === "developer") setStep("accounts");
    else if (step === "privacy") setStep("developer");
    else if (step === "performance") setStep("privacy");
    else if (step === "telemetry") setStep("performance");
    else if (step === "personalization") setStep("telemetry");
    else if (step === "advanced") setStep("personalization");
    else if (step === "survey") setStep("advanced");
    else if (step === "finish") setStep("survey");
  };

  const handleComplete = () => {
    localStorage.setItem("urbanshade_oobe_complete", "true");
    localStorage.setItem("urbanshade_settings", JSON.stringify({
      region,
      timezone,
      theme,
      animations,
      analytics,
      crashReports,
      diagnostics,
      volume,
      soundEffects,
      wifiEnabled,
      autoConnect,
      powerMode,
      sleepTimer,
      highContrast,
      largeText,
      notificationsEnabled,
      doNotDisturb,
      bgGradientStart,
      bgGradientEnd,
      developerMode,
      bootAnimations,
      oemUnlocked,
      usbDebugging,
      autoCleanup,
      cacheSize,
      encryption,
      biometrics,
      performanceMode,
      visualEffects,
      telemetry,
      errorReporting,
      systemName,
      bootMessage,
      role,
      experience,
      purpose
    }));
    
    // Save settings to localStorage using same keys as Settings component
    localStorage.setItem("settings_developer_mode", JSON.stringify(developerMode));
    localStorage.setItem("settings_oem_unlocked", JSON.stringify(oemUnlocked));
    localStorage.setItem("settings_usb_debugging", JSON.stringify(usbDebugging));
    localStorage.setItem("settings_bg_gradient_start", JSON.stringify(bgGradientStart));
    localStorage.setItem("settings_bg_gradient_end", JSON.stringify(bgGradientEnd));
    localStorage.setItem("settings_theme", JSON.stringify(theme));
    localStorage.setItem("settings_animations", JSON.stringify(animations));
    
    // Apply background gradient
    document.documentElement.style.setProperty('--bg-gradient-start', bgGradientStart);
    document.documentElement.style.setProperty('--bg-gradient-end', bgGradientEnd);
    
    toast.success("Setup complete!");
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 text-foreground flex items-center justify-center p-8 animate-fade-in">
      <div className="max-w-2xl w-full">
        {step === "welcome" && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center animate-scale-in">
              <Settings className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">Let's personalize your experience in a few quick steps</p>
              <p className="text-sm text-muted-foreground/70 mt-2">This will only take a couple of minutes</p>
            </div>
            <button
              onClick={handleNext}
              className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 transition-all text-lg font-bold text-primary-foreground shadow-lg hover:scale-105"
            >
              Let's Go! →
            </button>
          </div>
        )}

        {step === "region" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-primary/20">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Choose Your Region 🌍</h2>
                <p className="text-sm text-muted-foreground mt-1">This helps with time zones and formats</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {["North America", "Europe", "Asia Pacific", "South America", "Africa", "Middle East"].map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    region === r 
                      ? "bg-primary/20 border-primary shadow-lg scale-105" 
                      : "bg-card/50 border-border hover:border-primary/50 hover:scale-102"
                  }`}
                >
                  <div className="text-lg font-bold">{r}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 justify-between">
              <button onClick={handleBack} className="px-6 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-all">
                ← Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg">
                Continue →
              </button>
            </div>
            <div className="text-center text-sm text-muted-foreground/70">
              Step 2 of many • You're doing great! ✨
            </div>
          </div>
        )}

        {step === "time" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Set Time Zone</h2>
            </div>
            
            <div className="space-y-4">
              {[
                "UTC-8 (PST)",
                "UTC-5 (EST)",
                "UTC+0 (GMT)",
                "UTC+1 (CET)",
                "UTC+8 (CST)",
                "UTC+9 (JST)"
              ].map(tz => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    timezone === tz 
                      ? "bg-primary/20 border-primary" 
                      : "bg-black/40 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="font-bold">{tz}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "privacy" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Privacy Settings</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Configure what data the system can collect to improve your experience.
                All data is stored locally - nothing is sent to external servers.
              </p>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Usage Analytics</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Track which features you use most to optimize your experience. 
                    Data stays on your device.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={crashReports}
                  onChange={(e) => setCrashReports(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Crash Reports</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Help diagnose system crashes and errors. Includes error logs and system state.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={diagnostics}
                  onChange={(e) => setDiagnostics(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">System Diagnostics</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Collect performance metrics and system health data for troubleshooting.
                  </div>
                </div>
              </label>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 mt-6">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-primary">Privacy Note:</strong> This is a simulated system. 
                  All settings only affect local browser storage. No actual data collection occurs.
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "background" && <BackgroundStep bgGradientStart={bgGradientStart} setBgGradientStart={setBgGradientStart} bgGradientEnd={bgGradientEnd} setBgGradientEnd={setBgGradientEnd} handleNext={handleNext} handleBack={handleBack} />}

        {step === "storage" && <StorageStep autoCleanup={autoCleanup} setAutoCleanup={setAutoCleanup} cacheSize={cacheSize} setCacheSize={setCacheSize} handleNext={handleNext} handleBack={handleBack} />}

        {step === "security" && <SecurityStep encryption={encryption} setEncryption={setEncryption} biometrics={biometrics} setBiometrics={setBiometrics} handleNext={handleNext} handleBack={handleBack} />}

        {step === "accounts" && <AccountsStep handleNext={handleNext} handleBack={handleBack} />}

        {step === "developer" && <DeveloperStep developerMode={developerMode} setDeveloperMode={setDeveloperMode} oemUnlocked={oemUnlocked} setOemUnlocked={setOemUnlocked} usbDebugging={usbDebugging} setUsbDebugging={setUsbDebugging} handleNext={handleNext} handleBack={handleBack} />}

        {step === "performance" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Monitor className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Performance Settings</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Optimize system performance based on your needs.
              </p>

              <div>
                <label className="text-lg font-bold mb-4 block">Performance Mode</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "power-saver", label: "Power Saver", desc: "Maximize battery life" },
                    { value: "balanced", label: "Balanced", desc: "Recommended" },
                    { value: "performance", label: "Performance", desc: "Maximum speed" }
                  ].map(mode => (
                    <button
                      key={mode.value}
                      onClick={() => setPerformanceMode(mode.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        performanceMode === mode.value 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold">{mode.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={visualEffects}
                  onChange={(e) => setVisualEffects(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Visual Effects</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Enable transparency, shadows, and animations for a richer interface
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "telemetry" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Info className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Data & Telemetry</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Help improve UrbanShade OS by sharing usage data. All data is anonymous and stored locally.
              </p>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={telemetry}
                  onChange={(e) => setTelemetry(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Send Telemetry Data</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Share anonymous usage statistics to help us improve the system
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={errorReporting}
                  onChange={(e) => setErrorReporting(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Automatic Error Reporting</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Automatically report errors and crashes to help diagnose issues
                  </div>
                </div>
              </label>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-blue-400">Note:</strong> You can change these settings at any time in the System Settings.
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "personalization" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Palette className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Personalization</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-muted-foreground mb-6">
                Make this system truly yours with custom names and messages.
              </p>

              <div>
                <label className="text-lg font-bold mb-3 block">System Name</label>
                <input
                  type="text"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  placeholder="URBANSHADE-TERMINAL"
                  className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This name will appear in the terminal and system logs
                </p>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Boot Message</label>
                <input
                  type="text"
                  value={bootMessage}
                  onChange={(e) => setBootMessage(e.target.value)}
                  placeholder="Welcome to UrbanShade OS"
                  className="w-full p-4 rounded-lg bg-black/40 border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Custom greeting shown during system startup
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "advanced" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Code className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Advanced Settings</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Configure advanced system options. These settings are for experienced users only.
              </p>

              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
                <input
                  type="checkbox"
                  checked={bootAnimations}
                  onChange={(e) => setBootAnimations(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold">Boot Animations</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Show animated boot sequence on system startup
                  </div>
                </div>
              </label>

              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-amber-500">Note:</strong> Advanced settings can affect system behavior. 
                  Only change these if you understand their purpose.
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "survey" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Info className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Quick Survey</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-muted-foreground mb-6">
                Help us understand how you'll use UrbanShade OS (optional)
              </p>

              <div>
                <label className="text-lg font-bold mb-3 block">What's your role?</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Facility Administrator", "Research Personnel", "Security Officer", "Engineer", "Medical Staff", "Just Exploring"].map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        role === r 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-sm">{r}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Experience level?</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Beginner", "Intermediate", "Advanced"].map(exp => (
                    <button
                      key={exp}
                      onClick={() => setExperience(exp)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        experience === exp 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-center">{exp}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold mb-3 block">Primary purpose?</label>
                <div className="space-y-2">
                  {[
                    "Facility planning & design",
                    "Security & monitoring",
                    "Research & experimentation",
                    "Entertainment & exploration",
                    "Learning & education"
                  ].map(p => (
                    <button
                      key={p}
                      onClick={() => setPurpose(p)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        purpose === p 
                          ? "bg-primary/20 border-primary" 
                          : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold">{p}</div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                All responses are optional and stored locally only
              </p>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "display" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Monitor className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Display Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-lg font-bold mb-4 block">Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      theme === "dark" 
                        ? "bg-primary/20 border-primary" 
                        : "bg-black/40 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold">Dark Mode</div>
                    <div className="text-sm text-muted-foreground mt-2">Recommended for facility operations</div>
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      theme === "light" 
                        ? "bg-primary/20 border-primary" 
                        : "bg-black/40 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold">Light Mode</div>
                    <div className="text-sm text-muted-foreground mt-2">Better visibility in bright areas</div>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={animations}
                  onChange={(e) => setAnimations(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Enable Animations</div>
                  <div className="text-sm text-muted-foreground">Smooth transitions and effects</div>
                </div>
              </label>
            </div>

            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "sound" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Volume2 className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Sound Settings</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block font-bold mb-3">Volume: {volume}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Enable Sound Effects</div>
                  <div className="text-sm text-muted-foreground">Play UI feedback sounds</div>
                </div>
              </label>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "network" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Wifi className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Network</h2>
            </div>
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={wifiEnabled}
                  onChange={(e) => setWifiEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Enable Wi‑Fi</div>
                  <div className="text-sm text-muted-foreground">Turn wireless connectivity on</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={autoConnect}
                  onChange={(e) => setAutoConnect(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Auto-connect</div>
                  <div className="text-sm text-muted-foreground">Join known networks automatically</div>
                </div>
              </label>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "power" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Battery className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Power</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block font-bold mb-3">Power Mode</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "power-saver", label: "Power Saver" },
                    { value: "balanced", label: "Balanced" },
                    { value: "performance", label: "Performance" },
                  ].map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setPowerMode(m.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        powerMode === m.value ? "bg-primary/20 border-primary" : "bg-black/40 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold mb-3">Sleep after: {sleepTimer} min</label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={sleepTimer}
                  onChange={(e) => setSleepTimer(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "accessibility" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Accessibility className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Accessibility</h2>
            </div>
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">High Contrast</div>
                  <div className="text-sm text-muted-foreground">Boost contrast for readability</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Large Text</div>
                  <div className="text-sm text-muted-foreground">Increase base font size</div>
                </div>
              </label>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "notifications" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
              <Bell className="w-12 h-12 text-primary" />
              <h2 className="text-4xl font-bold">Notifications</h2>
            </div>
            <div className="space-y-6">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Enable Notifications</div>
                  <div className="text-sm text-muted-foreground">Allow alerts and messages</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
                <input
                  type="checkbox"
                  checked={doNotDisturb}
                  onChange={(e) => setDoNotDisturb(e.target.checked)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-bold">Do Not Disturb</div>
                  <div className="text-sm text-muted-foreground">Silence notifications temporarily</div>
                </div>
              </label>
            </div>
            <div className="flex gap-4 justify-end">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                Back
              </button>
              <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "finish" && (
          <div className="text-center space-y-8 animate-fade-in">
            <Check className="w-24 h-24 mx-auto text-green-500 animate-pulse" />
            <div>
              <h1 className="text-5xl font-bold mb-4">All Set!</h1>
              <p className="text-xl text-muted-foreground mb-6">Your UrbanShade OS is ready to use</p>
              <div className="glass-panel p-6 text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-bold">{region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Zone:</span>
                  <span className="font-bold">{timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span className="font-bold capitalize">{theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Animations:</span>
                  <span className="font-bold">{animations ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="px-8 py-4 rounded-lg bg-primary hover:bg-primary/80 transition-colors text-lg font-bold"
            >
              Start Using UrbanShade OS
            </button>
          </div>
        )}

        {step !== "welcome" && step !== "finish" && (
          <div className="flex gap-2 justify-center mt-8">
            {["region", "time", "display", "privacy", "survey"].map((s, i) => (
              <div
                key={s}
                className={`h-2 w-12 rounded-full transition-all ${
                  ["region", "time", "display", "privacy", "survey"].indexOf(step) >= i
                    ? "bg-primary"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
