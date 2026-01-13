import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, Globe, Keyboard, Wifi, User, Lock, Eye, EyeOff, Check, ChevronRight, Cloud, Monitor, Mail, Download, Loader2 } from "lucide-react";
import { useOnlineAccount } from "@/hooks/useOnlineAccount";
import { VERSION } from "@/lib/versionInfo";

interface OOBEScreenProps {
  onComplete: () => void;
}

export const OOBEScreen = ({ onComplete }: OOBEScreenProps) => {
  const [step, setStep] = useState<"welcome" | "region" | "keyboard" | "network" | "online-choice" | "online-signup" | "email-verify" | "online-signin" | "import-settings" | "account" | "password" | "privacy" | "finish">("welcome");
  const [progress, setProgress] = useState(0);
  
  // Region & Keyboard
  const [region, setRegion] = useState("Deep Sea Sector Alpha");
  const [keyboardLayout, setKeyboardLayout] = useState("US QWERTY");
  
  // Account (local)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountError, setAccountError] = useState("");
  
  // Online account
  const [email, setEmail] = useState("");
  const [onlinePassword, setOnlinePassword] = useState("");
  const [onlineUsername, setOnlineUsername] = useState("");
  const [onlineError, setOnlineError] = useState("");
  const [isOnlineLoading, setIsOnlineLoading] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [hasCloudSettings, setHasCloudSettings] = useState(false);
  const [isLoadingCloudSettings, setIsLoadingCloudSettings] = useState(false);
  const { signUp, signIn, isDevMode, loadCloudSettings, checkForConflict } = useOnlineAccount();
  
  // Privacy
  const [telemetry, setTelemetry] = useState(true);
  const [locationServices, setLocationServices] = useState(false);
  const [crashReports, setCrashReports] = useState(true);

  // Finishing animation
  const [finishProgress, setFinishProgress] = useState(0);
  const [finishMessages, setFinishMessages] = useState<string[]>([]);

  const regions = [
    "Deep Sea Sector Alpha",
    "Abyssal Zone Beta",
    "Trench Division Gamma",
    "Hadal Research Station",
    "Benthic Outpost Delta",
    "Twilight Zone Epsilon"
  ];

  const keyboards = [
    "US QWERTY",
    "UK QWERTY",
    "German QWERTZ",
    "French AZERTY",
    "Japanese Kana"
  ];

  const stepIndex = ["welcome", "region", "keyboard", "network", "online-choice", "online-signup", "email-verify", "online-signin", "import-settings", "account", "password", "privacy", "finish"].indexOf(step);
  const totalSteps = 7;

  useEffect(() => {
    const stepMapping: Record<string, number> = {
      "welcome": 0,
      "region": 1,
      "keyboard": 2,
      "network": 3,
      "online-choice": 4,
      "online-signup": 4,
      "email-verify": 4,
      "online-signin": 4,
      "import-settings": 4,
      "account": 4,
      "password": 5,
      "privacy": 6,
      "finish": 7
    };
    setProgress((stepMapping[step] / totalSteps) * 100);
  }, [step]);

  useEffect(() => {
    if (step === "finish") {
      const messages = [
        "Initializing user profile...",
        "Configuring security protocols...",
        "Setting up containment permissions...",
        "Syncing regional settings...",
        "Calibrating depth sensors...",
        "Establishing secure connection...",
        "Finalizing system preferences...",
        "Setup complete!"
      ];
      
      let msgIndex = 0;
      const interval = setInterval(() => {
        if (msgIndex < messages.length) {
          setFinishMessages(prev => [...prev, messages[msgIndex]]);
          setFinishProgress(((msgIndex + 1) / messages.length) * 100);
          msgIndex++;
        } else {
          clearInterval(interval);
        }
      }, 400);
      
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleAccountNext = () => {
    setAccountError("");
    if (!username.trim()) {
      setAccountError("Please enter a username");
      return;
    }
    if (username.trim().length < 3) {
      setAccountError("Username must be at least 3 characters");
      return;
    }
    setStep("password");
  };

  const handlePasswordNext = () => {
    setAccountError("");
    
    if (password && password.length < 4) {
      setAccountError("Password must be at least 4 characters or empty");
      return;
    }
    
    if (password !== confirmPassword) {
      setAccountError("Passwords don't match");
      return;
    }
    
    const accounts = JSON.parse(localStorage.getItem("urbanshade_accounts") || "[]");
    const newAccount = {
      id: Date.now().toString(),
      username: username.trim(),
      password: password,
      name: username.trim(),
      role: "Operator",
      clearance: 3,
      avatar: null,
      createdAt: new Date().toISOString()
    };
    accounts.push(newAccount);
    localStorage.setItem("urbanshade_accounts", JSON.stringify(accounts));
    
    setStep("privacy");
  };

  const handleOnlineSignup = async () => {
    setOnlineError("");
    
    if (!email.trim() || !email.includes("@")) {
      setOnlineError("Please enter a valid email address");
      return;
    }
    if (!onlineUsername.trim() || onlineUsername.length < 3) {
      setOnlineError("Username must be at least 3 characters");
      return;
    }
    if (!onlinePassword || onlinePassword.length < 6) {
      setOnlineError("Password must be at least 6 characters");
      return;
    }

    setIsOnlineLoading(true);
    
    const { error } = await signUp(email, onlinePassword, onlineUsername);
    
    setIsOnlineLoading(false);

    if (error) {
      setOnlineError(error.message);
      return;
    }

    setUsername(onlineUsername);
    setPassword("");
    
    const accounts = JSON.parse(localStorage.getItem("urbanshade_accounts") || "[]");
    const newAccount = {
      id: Date.now().toString(),
      username: onlineUsername.trim(),
      password: "",
      name: onlineUsername.trim(),
      role: "Operator",
      clearance: 3,
      avatar: null,
      isOnline: true,
      email: email,
      createdAt: new Date().toISOString()
    };
    accounts.push(newAccount);
    localStorage.setItem("urbanshade_accounts", JSON.stringify(accounts));
    
    toast.success("Online account created! Check your email to confirm.");
    setStep("email-verify");
  };

  const checkEmailVerification = async () => {
    setIsCheckingVerification(true);
    setOnlineError("");
    
    try {
      const { data, error } = await signIn(email, onlinePassword);
      
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setOnlineError("Email not yet verified. Please check your inbox and spam folder.");
        } else {
          setOnlineError(error.message);
        }
        setIsCheckingVerification(false);
        return;
      }
      
      const displayName = data.user?.user_metadata?.username || onlineUsername || email.split("@")[0];
      setUsername(displayName);
      
      const accounts = JSON.parse(localStorage.getItem("urbanshade_accounts") || "[]");
      const newAccount = {
        id: Date.now().toString(),
        username: displayName,
        password: "",
        name: displayName,
        role: "Operator",
        clearance: 3,
        avatar: null,
        isOnline: true,
        email: email,
        createdAt: new Date().toISOString()
      };
      accounts.push(newAccount);
      localStorage.setItem("urbanshade_accounts", JSON.stringify(accounts));
      
      toast.success("Email verified! Account ready.");
      setStep("privacy");
    } catch (err) {
      setOnlineError("Verification check failed. Try again.");
    }
    
    setIsCheckingVerification(false);
  };

  const handleOnlineSignin = async () => {
    setOnlineError("");
    
    if (!email.trim() || !email.includes("@")) {
      setOnlineError("Please enter a valid email address");
      return;
    }
    if (!onlinePassword) {
      setOnlineError("Please enter your password");
      return;
    }

    setIsOnlineLoading(true);
    
    const { data, error } = await signIn(email, onlinePassword);
    
    setIsOnlineLoading(false);

    if (error) {
      setOnlineError(error.message);
      return;
    }

    const displayName = data.user?.user_metadata?.username || email.split("@")[0];
    setUsername(displayName);
    
    const accounts = JSON.parse(localStorage.getItem("urbanshade_accounts") || "[]");
    const existingOnline = accounts.find((a: any) => a.email === email);
    if (!existingOnline) {
      const newAccount = {
        id: Date.now().toString(),
        username: displayName,
        password: "",
        name: displayName,
        role: "Operator",
        clearance: 3,
        avatar: null,
        isOnline: true,
        email: email,
        createdAt: new Date().toISOString()
      };
      accounts.push(newAccount);
      localStorage.setItem("urbanshade_accounts", JSON.stringify(accounts));
    }
    
    const conflict = await checkForConflict();
    if (conflict?.cloudSettings) {
      setHasCloudSettings(true);
      setStep("import-settings");
    } else {
      toast.success("Signed in successfully!");
      setStep("privacy");
    }
  };

  const handleImportCloudSettings = async () => {
    setIsLoadingCloudSettings(true);
    await loadCloudSettings();
    setIsLoadingCloudSettings(false);
    toast.success("Settings imported from cloud!");
    setStep("privacy");
  };

  const handleSkipImport = () => {
    toast.success("Signed in successfully!");
    setStep("privacy");
  };

  const handleComplete = () => {
    localStorage.setItem("urbanshade_oobe_complete", "true");
    localStorage.setItem("urbanshade_settings", JSON.stringify({
      region,
      keyboardLayout,
      telemetry,
      locationServices,
      crashReports,
      theme: "dark",
      animations: true
    }));
    
    toast.success("Welcome to UrbanShade OS");
    onComplete();
  };

  // Step indicator dots
  const StepIndicator = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const stepMapping: Record<string, number> = {
          "welcome": 0, "region": 1, "keyboard": 2, "network": 3,
          "online-choice": 4, "online-signup": 4, "email-verify": 4,
          "online-signin": 4, "import-settings": 4, "account": 4,
          "password": 5, "privacy": 6, "finish": 7
        };
        const currentStepNum = stepMapping[step];
        const isComplete = i < currentStepNum;
        const isCurrent = i === currentStepNum;
        
        return (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              isComplete 
                ? "w-8 bg-cyan-400" 
                : isCurrent 
                  ? "w-8 bg-cyan-500/50" 
                  : "w-4 bg-slate-700"
            }`}
          />
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/50 to-cyan-950/20" />
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-lg">
          
          {/* Welcome */}
          {step === "welcome" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-4xl font-light text-white mb-2">Welcome</h1>
                <p className="text-slate-400">Let's set up your UrbanShade workstation</p>
              </div>
              
              <div className="space-y-3 mb-10">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-cyan-400">1</div>
                  <span>Configure region & input</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-cyan-400">2</div>
                  <span>Connect to network</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-cyan-400">3</div>
                  <span>Create your account</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-cyan-400">4</div>
                  <span>Privacy preferences</span>
                </div>
              </div>

              <button
                onClick={() => setStep("region")}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Region */}
          {step === "region" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Select your region</h1>
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegion(r)}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between ${
                      region === r 
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-white" 
                        : "bg-slate-800/50 border border-transparent text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{r}</span>
                    {region === r && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("welcome")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("keyboard")}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Keyboard */}
          {step === "keyboard" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <Keyboard className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Keyboard layout</h1>
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                {keyboards.map((k) => (
                  <button
                    key={k}
                    onClick={() => setKeyboardLayout(k)}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between ${
                      keyboardLayout === k 
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-white" 
                        : "bg-slate-800/50 border border-transparent text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{k}</span>
                    {keyboardLayout === k && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("region")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("network")}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Network */}
          {step === "network" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Network connection</h1>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="px-4 py-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">URBANSHADE-SECURE</div>
                      <div className="text-xs text-slate-400">Encrypted • 2.4/5GHz</div>
                    </div>
                  </div>
                  <span className="text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">Connected</span>
                </div>
                
                <div className="px-4 py-4 bg-slate-800/30 rounded-xl flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-slate-400">FACILITY-GUEST</div>
                      <div className="text-xs text-slate-600">Secured</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("keyboard")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => isDevMode ? setStep("account") : setStep("online-choice")}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Online Account Choice */}
          {step === "online-choice" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6">
                  <h1 className="text-2xl font-light text-white">How would you like to sign in?</h1>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setStep("online-signup")}
                  className="w-full p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl text-left transition-all hover:border-cyan-400 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                      <Cloud className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">Create online account</div>
                      <div className="text-slate-400 text-sm">Sync settings across devices</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => setStep("online-signin")}
                  className="w-full p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-left transition-all hover:border-slate-600"
                >
                  <span className="text-slate-400">Already have an account? </span>
                  <span className="text-cyan-400">Sign in</span>
                </button>

                <button
                  onClick={() => setStep("account")}
                  className="w-full p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl text-left transition-all hover:border-slate-600 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0">
                      <Monitor className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-300 font-medium mb-1">Use local account</div>
                      <div className="text-slate-500 text-sm">Stay offline, data on this device only</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </div>
                </button>
              </div>

              <button
                onClick={() => setStep("network")}
                className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
            </div>
          )}

          {/* Online Signup */}
          {step === "online-signup" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Create your account</h1>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={onlineUsername}
                    onChange={(e) => setOnlineUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm text-slate-400 mb-2">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={onlinePassword}
                    onChange={(e) => setOnlinePassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {onlineError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {onlineError}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("online-choice")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleOnlineSignup}
                  disabled={isOnlineLoading}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isOnlineLoading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          )}

          {/* Email Verification */}
          {step === "email-verify" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-2xl font-light text-white mb-2">Check your email</h1>
                <p className="text-slate-400">We sent a verification link to <span className="text-cyan-400">{email}</span></p>
              </div>
              
              <div className="space-y-4 mb-8">
                {onlineError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {onlineError}
                  </div>
                )}
                
                <button
                  onClick={checkEmailVerification}
                  disabled={isCheckingVerification}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingVerification ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isCheckingVerification ? "Checking..." : "I've verified my email"}
                </button>
                
                <p className="text-xs text-slate-500 text-center">
                  Didn't receive it? Check your spam folder.
                </p>
              </div>

              <button
                onClick={() => setStep("online-signup")}
                className="w-full text-center text-slate-400 hover:text-white transition-colors text-sm"
              >
                Back to signup
              </button>
            </div>
          )}

          {/* Import Settings */}
          {step === "import-settings" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Download className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-2xl font-light text-white mb-2">Import your settings?</h1>
                <p className="text-slate-400">We found settings from your cloud account</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleImportCloudSettings}
                  disabled={isLoadingCloudSettings}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoadingCloudSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isLoadingCloudSettings ? "Importing..." : "Import settings"}
                </button>
                
                <button
                  onClick={handleSkipImport}
                  className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
                >
                  Start fresh instead
                </button>
              </div>
            </div>
          )}

          {/* Online Signin */}
          {step === "online-signin" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Sign in</h1>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm text-slate-400 mb-2">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={onlinePassword}
                    onChange={(e) => setOnlinePassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {onlineError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {onlineError}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("online-choice")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleOnlineSignin}
                  disabled={isOnlineLoading}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isOnlineLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </div>
          )}

          {/* Account (Local) */}
          {step === "account" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Create your account</h1>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>
                
                {accountError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {accountError}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => isDevMode ? setStep("network") : setStep("online-choice")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAccountNext}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          {step === "password" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-2xl font-light text-white">Set a password</h1>
                </div>
                <p className="text-slate-500 text-sm mt-1">Optional - leave empty to skip</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <label className="block text-sm text-slate-400 mb-2">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (or leave empty)"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Confirm password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
                
                {accountError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {accountError}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("account")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePasswordNext}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Privacy */}
          {step === "privacy" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <StepIndicator />
                <div className="mt-6">
                  <h1 className="text-2xl font-light text-white">Privacy settings</h1>
                  <p className="text-slate-500 text-sm mt-1">Choose what data to share</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="p-4 bg-slate-800/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">System telemetry</div>
                    <div className="text-xs text-slate-500">Help improve UrbanShade</div>
                  </div>
                  <button
                    onClick={() => setTelemetry(!telemetry)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${telemetry ? 'bg-cyan-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${telemetry ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">Location services</div>
                    <div className="text-xs text-slate-500">Enable depth tracking</div>
                  </div>
                  <button
                    onClick={() => setLocationServices(!locationServices)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${locationServices ? 'bg-cyan-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${locationServices ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                
                <div className="p-4 bg-slate-800/30 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">Crash reports</div>
                    <div className="text-xs text-slate-500">Send diagnostic data</div>
                  </div>
                  <button
                    onClick={() => setCrashReports(!crashReports)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${crashReports ? 'bg-cyan-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${crashReports ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("password")}
                  className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("finish")}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  Finish Setup <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Finish */}
          {step === "finish" && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-light text-white mb-2">Welcome, {username}</h1>
                <p className="text-slate-400">Setting up your workstation...</p>
              </div>
              
              <div className="bg-slate-800/30 rounded-xl p-4 mb-6 font-mono text-xs max-h-48 overflow-y-auto">
                {finishMessages.filter(Boolean).map((msg, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <span className="text-slate-600">&gt;</span>
                    <span className={msg?.includes("complete") ? "text-green-400" : "text-slate-400"}>{msg}</span>
                  </div>
                ))}
                {finishProgress < 100 && <span className="text-cyan-400 animate-pulse">_</span>}
              </div>

              <div className="mb-8">
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${finishProgress}%` }}
                  />
                </div>
              </div>

              {finishProgress >= 100 && (
                <button
                  onClick={handleComplete}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-slate-900 transition-all animate-fade-in"
                >
                  Enter UrbanShade
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="h-12 flex items-center justify-between px-8 text-xs text-slate-600 relative z-10">
        <span>{VERSION.displayVersion}</span>
        <span>© 2024 UrbanShade Corporation</span>
      </div>
    </div>
  );
};
