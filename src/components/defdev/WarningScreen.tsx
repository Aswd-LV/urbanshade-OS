import { Bug, Terminal, Activity, Database, HardDrive, Shield, Skull, Zap, AlertTriangle, Lock, ChevronRight, Cloud, Gavel } from "lucide-react";

interface WarningScreenProps {
  firstBootSetup: boolean;
  actionConsentChecked: boolean;
  onConsentChange: (checked: boolean) => void;
  onAccept: () => void;
  onCancel: () => void;
}

const WarningScreen = ({ 
  firstBootSetup, 
  actionConsentChecked, 
  onConsentChange, 
  onAccept,
  onCancel
}: WarningScreenProps) => {
  return (
    <div className="fixed inset-0 bg-[#050508] flex items-center justify-center p-4 overflow-auto">
      {/* Animated scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251,191,36,0.05) 2px, rgba(251,191,36,0.05) 4px)',
        }} />
        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent animate-pulse" style={{ top: '30%' }} />
      </div>
      
      <div className="relative max-w-4xl w-full my-8">
        {/* Main Terminal */}
        <div className="bg-[#0a0d12] border-2 border-amber-500/40 rounded-xl overflow-hidden shadow-2xl shadow-amber-500/10">
          {/* Title bar - SCP:SL style */}
          <div className="bg-gradient-to-r from-amber-900/90 via-orange-900/80 to-amber-900/90 px-4 py-3 flex items-center gap-3 border-b-2 border-amber-500/40">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
            </div>
            <div className="flex-1 text-center">
              <span className="font-mono text-sm text-amber-300">DEF-DEV@URBANSHADE:~ [AUTHORIZATION REQUIRED]</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400/60 font-mono">v3.0</span>
              <Bug className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          
          {/* Terminal content */}
          <div className="p-6 font-mono text-sm space-y-4 max-h-[80vh] overflow-auto">
            {/* Boot sequence */}
            <div className="text-amber-500/70 text-xs space-y-1">
              <p>[BOOT] Initializing DEF-DEV environment...</p>
              <p>[BOOT] Loading kernel modules... OK</p>
              <p>[BOOT] Mounting virtual filesystem... OK</p>
              <p>[BOOT] Starting action dispatcher... OK</p>
              <p>[BOOT] Connecting to facility network... OK</p>
            </div>

            {/* ASCII art header */}
            <pre className="text-amber-400 text-xs leading-tight overflow-x-auto">
{`╔════════════════════════════════════════════════════════════════════╗
║  ██████╗ ███████╗███████╗    ██████╗ ███████╗██╗   ██╗             ║
║  ██╔══██╗██╔════╝██╔════╝    ██╔══██╗██╔════╝██║   ██║             ║
║  ██║  ██║█████╗  █████╗█████╗██║  ██║█████╗  ██║   ██║             ║
║  ██║  ██║██╔══╝  ██╔══╝╚════╝██║  ██║██╔══╝  ╚██╗ ██╔╝             ║
║  ██████╔╝███████╗██║         ██████╔╝███████╗ ╚████╔╝              ║
║  ╚═════╝ ╚══════╝╚═╝         ╚═════╝ ╚══════╝  ╚═══╝               ║
║                                                                     ║
║  Developer Environment Framework - Development Console    v3.0      ║
║  UrbanShade OS Advanced Debugging & System Management Tool          ║
╚════════════════════════════════════════════════════════════════════╝`}
            </pre>
            
            <div className="text-orange-400">
              <span className="text-amber-500">root@def-dev:~#</span> cat /etc/def-dev/ABOUT
            </div>
            
            {/* About section - SCP:SL facility style */}
            <div className="bg-slate-900/80 border-2 border-slate-700/50 rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  WHAT IS DEF-DEV?
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  DEF-DEV (Developer Environment Framework - Development) is a comprehensive system debugging 
                  and administration console for UrbanShade OS. It provides low-level access to system internals,
                  real-time monitoring, Supabase integration, and advanced administrative controls.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2 text-xs">CORE MODULES</h4>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li className="flex items-center gap-2"><Terminal className="w-3 h-3 text-cyan-400" /> Real-time console capture</li>
                    <li className="flex items-center gap-2"><Activity className="w-3 h-3 text-purple-400" /> System action monitoring</li>
                    <li className="flex items-center gap-2"><Database className="w-3 h-3 text-blue-400" /> LocalStorage inspection</li>
                    <li className="flex items-center gap-2"><HardDrive className="w-3 h-3 text-orange-400" /> Recovery image management</li>
                    <li className="flex items-center gap-2"><Shield className="w-3 h-3 text-red-400" /> Bugcheck reports</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-orange-400 font-semibold mb-2 text-xs">NEW IN v3.0</h4>
                  <ul className="text-gray-400 text-xs space-y-1">
                    <li className="flex items-center gap-2"><Cloud className="w-3 h-3 text-emerald-400" /> Supabase debugging panel</li>
                    <li className="flex items-center gap-2"><Gavel className="w-3 h-3 text-rose-400" /> FakeMod testing system</li>
                    <li className="flex items-center gap-2"><Skull className="w-3 h-3 text-amber-400" /> Enhanced crash triggers</li>
                    <li className="flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-400" /> Improved command queue</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-500/10 border-2 border-red-500/40 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-bold mb-2">⚠ FACILITY SECURITY WARNING</h4>
                  <p className="text-gray-300 text-xs mb-3">
                    This console provides unrestricted access to system internals. Improper use may cause:
                  </p>
                  <ul className="text-red-300/70 text-xs space-y-1 list-disc list-inside">
                    <li>System instability or crashes</li>
                    <li>Data loss or corruption</li>
                    <li>Security vulnerabilities</li>
                    <li>Unrecoverable system states</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* First boot consent */}
            {firstBootSetup && (
              <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={actionConsentChecked}
                    onChange={(e) => onConsentChange(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-amber-500/50 bg-transparent text-amber-500 focus:ring-amber-500/50"
                  />
                  <div>
                    <h4 className="text-amber-400 font-bold mb-1">Enable Action Persistence</h4>
                    <p className="text-gray-400 text-xs">
                      Allow DEF-DEV to persist system actions to localStorage for later analysis. 
                      This helps with debugging but uses additional storage space.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Accept button */}
            <div className="pt-4 border-t border-slate-700/50">
              <button
                onClick={onAccept}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
              >
                <span>AUTHORIZE ACCESS</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-gray-600 mt-3">
                By proceeding, you acknowledge the risks and accept responsibility for your actions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningScreen;
