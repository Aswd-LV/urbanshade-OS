import { useState } from "react";
import { Shield, Trash2, Download, Clock } from "lucide-react";
import { toast } from "sonner";
import { BugcheckEntry } from "../hooks/useDefDevState";

const BugchecksTab = () => {
  const [bugchecks, setBugchecks] = useState<BugcheckEntry[]>(() => {
    const saved = localStorage.getItem('urbanshade_bugchecks');
    return saved ? JSON.parse(saved) : [];
  });

  const clearBugchecks = () => {
    setBugchecks([]);
    localStorage.removeItem('urbanshade_bugchecks');
    toast.success("Bugcheck reports cleared");
  };

  const exportBugchecks = () => {
    const blob = new Blob([JSON.stringify(bugchecks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugchecks-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <Shield className="w-5 h-5 text-red-400" />
        <span className="font-bold text-red-400">Bugcheck Reports</span>
        <span className="text-xs text-slate-500">({bugchecks.length} recorded)</span>
        <div className="flex-1" />
        <button onClick={exportBugchecks} className="p-2 hover:bg-slate-800 rounded border border-slate-700">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={clearBugchecks} className="p-2 hover:bg-red-500/20 rounded border border-red-500/30 text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {bugchecks.length === 0 ? (
          <div className="text-center text-slate-600 py-12">
            <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No bugchecks recorded</p>
          </div>
        ) : (
          bugchecks.map((bc, idx) => (
            <div key={idx} className="p-4 bg-red-500/5 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono font-bold text-red-400">{bc.code}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(bc.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-300">{bc.description}</p>
              {bc.location && <p className="text-xs text-slate-500 mt-1">Location: {bc.location}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BugchecksTab;
