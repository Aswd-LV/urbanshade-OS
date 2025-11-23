import { useState } from "react";
import { Shield, AlertTriangle, Activity } from "lucide-react";

interface Specimen {
  id: string;
  name: string;
  code: string;
  threat: "LOW" | "MEDIUM" | "HIGH" | "EXTREME";
  status: "SECURE" | "WARNING" | "BREACH";
  location: string;
  lastCheck: string;
}

export const ContainmentMonitor = () => {
  const [selected, setSelected] = useState<Specimen | null>(null);

  const specimens: Specimen[] = [
    { id: "Z-13", name: "Pressure", code: "Z-13", threat: "EXTREME", status: "WARNING", location: "Containment Cell 13 - ZONE 4", lastCheck: "30 sec ago" },
    { id: "Z-08", name: "Eyefestation", code: "Z-08", threat: "HIGH", status: "SECURE", location: "Containment Cell 08", lastCheck: "5 min ago" },
    { id: "Z-96", name: "Pandemonium", code: "Z-96", threat: "EXTREME", status: "BREACH", location: "LAST KNOWN: Cell 96 - Beta-7", lastCheck: "43 min ago" },
    { id: "Z-90", name: "Wall Dweller", code: "Z-90", threat: "MEDIUM", status: "SECURE", location: "Containment Cell 90", lastCheck: "3 min ago" },
    { id: "Z-283", name: "Angler", code: "Z-283", threat: "HIGH", status: "WARNING", location: "Containment Cell 283", lastCheck: "18 min ago" },
    { id: "Z-367", name: "Mimic", code: "Z-367", threat: "MEDIUM", status: "SECURE", location: "Containment Cell 367", lastCheck: "4 min ago" },
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "EXTREME": return "text-red-500";
      case "HIGH": return "text-orange-500";
      case "MEDIUM": return "text-yellow-500";
      case "LOW": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SECURE": return "text-primary";
      case "WARNING": return "text-yellow-500";
      case "BREACH": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Containment Monitor</h2>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {specimens.length} specimens under containment
          </div>
        </div>

        <div className="p-2">
          {specimens.map((specimen) => (
            <div
              key={specimen.id}
              onClick={() => setSelected(specimen)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                selected?.id === specimen.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-lg">{specimen.code}</div>
                <div className={`text-xs font-bold ${getStatusColor(specimen.status)}`}>
                  ● {specimen.status}
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-1">"{specimen.name}"</div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold ${getThreatColor(specimen.threat)}`}>
                  {specimen.threat} THREAT
                </span>
                <span className="text-muted-foreground">{specimen.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-96 p-6 bg-black/10">
        {selected ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-2xl font-black ${getThreatColor(selected.threat)}`}>
                  {selected.code}
                </div>
                <div>
                  <h3 className="font-bold text-xl">"{selected.name}"</h3>
                  <div className="text-sm text-muted-foreground">{selected.code}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className={`font-bold text-lg ${getStatusColor(selected.status)}`}>
                  ● {selected.status}
                </div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Threat Level</div>
                <div className={`font-bold text-lg ${getThreatColor(selected.threat)}`}>
                  {selected.threat}
                </div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Location</div>
                <div className="font-bold">{selected.location}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Last Check</div>
                <div className="font-mono text-primary">{selected.lastCheck}</div>
              </div>

              {selected.status === "WARNING" && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 animate-pulse">
                  <div className="text-xs text-yellow-500 font-bold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    {selected.id === "Z-13" ? "CRITICAL WARNING" : "WARNING"}
                  </div>
                  <div className="text-xs text-yellow-400">
                    {selected.id === "Z-13" 
                      ? "⚠️ Subject pressing against containment glass. Structural stress at 98%. Backup containment on standby."
                      : "Irregular activity detected. Monitoring increased."}
                  </div>
                </div>
              )}
              
              {selected.status === "BREACH" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-pulse">
                  <div className="text-xs text-destructive font-bold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    CONTAINMENT BREACH
                  </div>
                  <div className="text-xs text-destructive/80">
                    🔴 ALERT: Specimen escaped secondary containment at 16:14. Search teams deployed. All personnel in affected zones advised to evacuate immediately.
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <div className="text-xs text-muted-foreground mb-2 font-bold">CONTAINMENT ACTIONS</div>
                <div className="flex gap-2 mb-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                    View Logs
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors">
                    Alert
                  </button>
                </div>
                <button 
                  className="w-full px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors"
                  onClick={() => {
                    // This would trigger opening specimen data in File Reader
                    console.log("Open specimen data in File Reader:", selected.code);
                  }}
                >
                  Open Data in File Reader
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a specimen to view details
          </div>
        )}
      </div>
    </div>
  );
};
