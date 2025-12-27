import { Bug, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const DefDevHeader = () => {
  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-orange-950/60 to-amber-950/80 border-b-2 border-amber-500/40 px-4 py-3 flex items-center justify-between relative overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251,191,36,0.1) 2px, rgba(251,191,36,0.1) 4px)',
        }} />
      </div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-lg flex items-center justify-center">
            <Bug className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="font-bold text-amber-400 text-lg tracking-wide">DEF-DEV 3.0 CONSOLE</h1>
            <p className="text-xs text-amber-600/80 font-mono">UrbanShade Developer Environment - MEGA UPDATE</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3 ml-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-mono">ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded">
            <span className="text-xs text-amber-400 font-mono">SESSION: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 relative z-10">
        <Link 
          to="/docs/def-dev" 
          className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-amber-400" /> 
          <span className="hidden sm:inline">Documentation</span>
        </Link>
        <button 
          onClick={() => window.location.href = "/"} 
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 transition-colors"
        >
          Exit Console
        </button>
      </div>
    </div>
  );
};

export default DefDevHeader;
