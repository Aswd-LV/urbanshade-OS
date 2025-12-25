import { useState } from "react";
import { Info, CheckCircle, ShieldCheck, Github, BookOpen, FastForward, AlertTriangle, Lock, Database, Eye, Cloud, Wifi } from "lucide-react";

interface DisclaimerScreenProps {
  onAccept: (skipInstall?: boolean) => void;
}

export const DisclaimerScreen = ({ onAccept }: DisclaimerScreenProps) => {
  const [understood, setUnderstood] = useState(false);
  const [skipInstall, setSkipInstall] = useState(false);
  const [showFullWarning, setShowFullWarning] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6 animate-scale-in">
            <ShieldCheck className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            UrbanShade OS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A browser-based operating system simulator inspired by underwater research facilities
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-mono text-cyan-400">Version 2.9.0 • Simulation Active</span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "50ms" }}>
          <div className="p-5 bg-gradient-to-r from-amber-950/50 to-amber-900/30 border-2 border-amber-500/40 rounded-2xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-7 h-7 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3 flex-1">
                <h3 className="text-lg font-bold text-amber-400">Important Notice</h3>
                <div className="text-sm text-amber-200/80 space-y-2">
                  <p>
                    <strong className="text-amber-300">This is a simulation.</strong> Everything you see here—the desktop, 
                    files, apps, and system messages—is fictional. No actual software is installed on your device.
                  </p>
                  {showFullWarning && (
                    <>
                      <p>
                        <strong className="text-amber-300">Crash screens and errors:</strong> Some features intentionally 
                        trigger "crash screens" or "bugchecks" as part of the simulation experience. However, 
                        <strong className="text-red-400"> real errors can also occur</strong>—these will be clearly labeled 
                        as "NOT A SIMULATION" and indicate actual bugs in the application code.
                      </p>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setShowFullWarning(!showFullWarning)}
                  className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2"
                >
                  {showFullWarning ? "Show less" : "Read more about error handling..."}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 mb-6">
          {/* Main Info Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Info className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-foreground">What This Actually Is</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This is a <strong className="text-foreground">fictional operating system simulator</strong> that runs 
                  entirely in your web browser. It mimics the look and feel of a real OS interface, complete with apps, 
                  files, and system tools—but everything you see here is simulated.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
                    <CheckCircle className="w-3 h-3 inline mr-1.5" />
                    Browser-Based Only
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
                    <Lock className="w-3 h-3 inline mr-1.5" />
                    No Installation
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400">
                    <ShieldCheck className="w-3 h-3 inline mr-1.5" />
                    Completely Safe
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Grid - Account Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Local Mode Card */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Local Mode</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>All data stored in browser's <strong className="text-foreground">localStorage</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Nothing uploaded to any server—stays on your device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Clearing browser data resets the simulation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>Incognito mode won't save progress</span>
                </li>
              </ul>
            </div>

            {/* Cloud Mode Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "300ms" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Cloud Mode <span className="text-xs font-normal text-cyan-400">(Optional)</span></h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Sign up with <strong className="text-foreground">email &amp; password</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Settings, desktop icons, and apps sync to cloud</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Send <strong className="text-foreground">real messages</strong> to other users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Data stored securely via <strong className="text-foreground">Supabase</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Privacy & Security Card */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "350ms" }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Eye className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Privacy & Security</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠</span>
                  <span><strong className="text-foreground">Never enter real passwords</strong> or sensitive info</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>This is a simulation—use fake credentials only</span>
                </li>
              </ul>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>No tracking, analytics, or data collection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>Your privacy is respected</span>
                </li>
              </ul>
            </div>
          </div>

          {/* What Gets Synced (Cloud) */}
          <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-sm text-blue-400">What Gets Synced (Cloud Mode Only)</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Profile Info', 'System Settings', 'Desktop Icons', 'Installed Apps', 'Messages', 'Sync History'].map(item => (
                <span key={item} className="px-3 py-1 rounded-full bg-blue-500/10 text-xs text-blue-300 border border-blue-500/20">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Open Source Card */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "450ms" }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <Github className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Open Source Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by <strong className="text-cyan-400">aswdBatch</strong> and the community. 
                    Free to explore, modify, and learn from.
                  </p>
                </div>
              </div>
              <a
                href="https://github.com/aswdBatch/urbanshade-7e993958"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all font-semibold text-sm"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5 text-center animate-fade-in" style={{ animationDelay: "500ms" }}>
            <BookOpen className="w-5 h-5 text-blue-400 inline mr-2" />
            <span className="text-sm text-muted-foreground">
              First time here? Check out the{" "}
              <a 
                href="/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-2 hover:underline-offset-4 transition-all"
              >
                User Guide & Documentation
              </a>
            </span>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <label className="block cursor-pointer group">
            <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 hover:border-cyan-500/50 rounded-2xl p-5 transition-all group-hover:scale-[1.01]">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="w-5 h-5 mt-0.5 cursor-pointer accent-cyan-500 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="font-bold text-foreground mb-2 group-hover:text-cyan-400 transition-colors">
                    I understand and agree to the following:
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li>• This is a fictional simulation for entertainment purposes only</li>
                    <li>• I will not enter real passwords or sensitive information</li>
                    <li>• Data is stored locally or optionally synced to cloud via Supabase</li>
                    <li>• I understand this is not a real operating system</li>
                  </ul>
                </div>
              </div>
            </div>
          </label>

          {/* Skip Installation Option */}
          <label className="block cursor-pointer group">
            <div className={`bg-slate-800/30 backdrop-blur-sm border-2 ${skipInstall ? 'border-amber-500/50' : 'border-slate-700/50'} hover:border-amber-500/30 rounded-xl p-4 transition-all`}>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={skipInstall}
                  onChange={(e) => setSkipInstall(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-amber-500 flex-shrink-0"
                />
                <FastForward className={`w-5 h-5 ${skipInstall ? 'text-amber-500' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <div className={`font-medium text-sm ${skipInstall ? 'text-amber-500' : 'text-foreground'}`}>
                    Skip installation (quick start)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Use default settings and create a default admin account
                  </div>
                </div>
              </div>
            </div>
          </label>

          <button
            onClick={() => onAccept(skipInstall)}
            disabled={!understood}
            className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 group shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] disabled:hover:scale-100 disabled:shadow-none"
          >
            {understood ? (
              <>
                <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {skipInstall ? "Quick Start" : "Enter UrbanShade OS"}
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 opacity-50" />
                Please accept to continue
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground/60 space-y-1 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <div>By proceeding, you acknowledge this is a simulation and agree to use it responsibly.</div>
          <div>© 2025 UrbanShade OS Project • Not affiliated with any real organization</div>
        </div>
      </div>
    </div>
  );
};
