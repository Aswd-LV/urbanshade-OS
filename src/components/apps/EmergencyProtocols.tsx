import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, Radio, Skull, Lock, Siren, Zap, Shield, Users, Database } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface Protocol {
  id: string;
  code: string;
  name: string;
  severity: "HIGH" | "CRITICAL" | "EXTREME";
  description: string;
  steps: string[];
  activated: boolean;
  effects: string[];
  icon: React.ReactNode;
  color: string;
}

interface EmergencyProtocolsProps {
  onLockdown?: (protocolName: string) => void;
}

export const EmergencyProtocols = ({ onLockdown }: EmergencyProtocolsProps) => {
  const [protocols, setProtocols] = useState<Protocol[]>(() => 
    loadState('emergency_protocols', [
      {
        id: "black",
        code: "CODE-BLACK",
        name: "Total Facility Lockdown",
        severity: "EXTREME",
        description: "Complete facility lockdown. All zones sealed, life support reduced to minimum, containment priority mode.",
        steps: [
          "1. Sound facility-wide alarm (145dB klaxon)",
          "2. Seal all bulkhead doors and airlocks",
          "3. Activate emergency blast shields on all containment cells",
          "4. Switch life support to minimum operational levels",
          "5. Disable all non-essential power systems",
          "6. Lock down personnel in current zones",
          "7. Activate automated defense systems",
          "8. Establish communications blackout (internal only)",
          "9. Deploy security teams to containment breach zones",
          "10. Prepare emergency evacuation pods (armed personnel only)",
        ],
        effects: ["All doors sealed", "Power redirected", "Communications restricted", "Automated defenses active"],
        activated: false,
        icon: <Lock className="w-6 h-6" />,
        color: "red"
      },
      {
        id: "red",
        code: "CODE-RED",
        name: "Containment Breach",
        severity: "CRITICAL",
        description: "Major specimen containment breach detected. Immediate threat to personnel safety.",
        steps: [
          "1. Activate breach alarm in affected zones",
          "2. Seal affected zones immediately",
          "3. Deploy containment teams with sedation equipment",
          "4. Evacuate non-essential personnel from affected areas",
          "5. Activate specimen tracking systems",
          "6. Engage automated capture protocols",
          "7. Notify emergency response teams",
        ],
        effects: ["Affected zones sealed", "Security teams deployed", "Tracking systems active"],
        activated: false,
        icon: <ShieldAlert className="w-6 h-6" />,
        color: "orange"
      },
      {
        id: "yellow",
        code: "CODE-YELLOW",
        name: "Chemical Hazard",
        severity: "HIGH",
        description: "Chemical leak or contamination detected. Immediate decontamination required.",
        steps: [
          "1. Activate ventilation override in affected zones",
          "2. Deploy hazmat teams to contamination site",
          "3. Seal ventilation ducts to prevent spread",
          "4. Evacuate personnel from contaminated areas",
          "5. Initiate automated decontamination sequence",
          "6. Monitor air quality sensors",
        ],
        effects: ["Ventilation sealed", "Hazmat teams deployed", "Decontamination active"],
        activated: false,
        icon: <Skull className="w-6 h-6" />,
        color: "yellow"
      },
      {
        id: "blue",
        code: "CODE-BLUE",
        name: "Medical Emergency",
        severity: "HIGH",
        description: "Mass casualty event or critical medical emergency requiring immediate medical response.",
        steps: [
          "1. Alert all medical personnel",
          "2. Prepare emergency medical bay",
          "3. Deploy medical response teams",
          "4. Activate triage protocols",
          "5. Secure blood bank and medical supplies",
          "6. Establish emergency surgery capacity",
        ],
        effects: ["Medical teams deployed", "Emergency bay active", "Triage protocols engaged"],
        activated: false,
        icon: <Users className="w-6 h-6" />,
        color: "blue"
      },
      {
        id: "green",
        code: "CODE-GREEN",
        name: "System Evacuation",
        severity: "EXTREME",
        description: "Full facility evacuation. All personnel must proceed to emergency evacuation points.",
        steps: [
          "1. Sound evacuation alarm",
          "2. Open all emergency exits",
          "3. Guide personnel to evacuation zones",
          "4. Activate emergency lighting",
          "5. Deploy evacuation coordinators",
          "6. Prepare emergency vehicles",
          "7. Secure all sensitive data",
          "8. Lockdown containment cells",
        ],
        effects: ["Evacuation in progress", "Emergency exits open", "Data secured"],
        activated: false,
        icon: <Siren className="w-6 h-6" />,
        color: "green"
      },
      {
        id: "purple",
        code: "CODE-PURPLE",
        name: "Hostile Threat",
        severity: "CRITICAL",
        description: "Active threat or hostile intrusion. Security forces engaged.",
        steps: [
          "1. Alert all security personnel",
          "2. Lock down facility entrances",
          "3. Deploy armed response teams",
          "4. Activate security cameras and tracking",
          "5. Secure sensitive areas",
          "6. Establish command center",
        ],
        effects: ["Security deployed", "Facility locked", "Threat tracking active"],
        activated: false,
        icon: <Shield className="w-6 h-6" />,
        color: "purple"
      },
    ])
  );

  const [selected, setSelected] = useState<Protocol | null>(null);
  const [activating, setActivating] = useState(false);
  const userClearanceLevel = 5;

  useEffect(() => {
    saveState('emergency_protocols', protocols);
  }, [protocols]);

  const handleActivate = (protocol: Protocol) => {
    if (protocol.activated) {
      setActivating(true);
      toast.info(`Deactivating ${protocol.code}...`);
      setTimeout(() => {
        setProtocols(prev => prev.map(p => p.id === protocol.id ? { ...p, activated: false } : p));
        setActivating(false);
        toast.success(`${protocol.code} deactivated`);
      }, 2000);
      return;
    }

    if (userClearanceLevel < 4) {
      toast.error("Access denied. Clearance Level 4+ required.");
      return;
    }

    setActivating(true);
    toast.warning(`Activating ${protocol.code}...`);
    setTimeout(() => {
      setProtocols(prev => prev.map(p => p.id === protocol.id ? { ...p, activated: true } : { ...p, activated: false }));
      setActivating(false);
      toast.error(`${protocol.code} ACTIVATED!`);
      
      // Trigger lockdown for CODE-BLACK
      if (protocol.id === "black" && onLockdown) {
        setTimeout(() => {
          onLockdown(protocol.name);
        }, 1000);
      }
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "EXTREME": return "border-red-500/50 bg-red-500/10";
      case "CRITICAL": return "border-orange-500/50 bg-orange-500/10";
      case "HIGH": return "border-yellow-500/50 bg-yellow-500/10";
      default: return "border-primary/50 bg-primary/10";
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      red: "from-red-500/20 to-red-600/20 border-red-500/50",
      orange: "from-orange-500/20 to-orange-600/20 border-orange-500/50",
      yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50",
      blue: "from-blue-500/20 to-blue-600/20 border-blue-500/50",
      green: "from-green-500/20 to-green-600/20 border-green-500/50",
      purple: "from-purple-500/20 to-purple-600/20 border-purple-500/50",
    };
    return colors[color as keyof typeof colors] || colors.red;
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-background via-background to-destructive/5">
      {/* Protocols List */}
      <div className="w-80 border-r border-border bg-gradient-to-b from-background to-muted/20">
        <div className="p-6 border-b border-border bg-gradient-to-r from-destructive/10 to-background">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-destructive/20 border border-destructive/30">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Emergency Protocols</h2>
              <p className="text-xs text-muted-foreground">Level 4+ Access Required</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${protocols.some(p => p.activated) ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-muted-foreground">
              {protocols.filter(p => p.activated).length} Active Protocols
            </span>
          </div>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto" style={{ height: "calc(100% - 140px)" }}>
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => setSelected(protocol)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                protocol.activated 
                  ? `${getColorClasses(protocol.color)} animate-pulse shadow-lg scale-[1.02]` 
                  : selected?.id === protocol.id 
                  ? "bg-primary/20 border-primary/50 shadow-md" 
                  : "hover:bg-muted/50 border-transparent hover:border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  protocol.activated ? `bg-${protocol.color}-500/20` : 'bg-muted'
                }`}>
                  {protocol.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-1">{protocol.code}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{protocol.name}</div>
                  <div className={`text-xs font-bold mt-2 px-2 py-1 rounded inline-block ${
                    protocol.severity === "EXTREME" ? "bg-red-500/20 text-red-400" :
                    protocol.severity === "CRITICAL" ? "bg-orange-500/20 text-orange-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {protocol.severity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Details */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-8 max-w-4xl mx-auto">
            <div className={`p-6 rounded-2xl border-2 mb-6 bg-gradient-to-br ${getColorClasses(selected.color)}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${
                  selected.color === 'red' ? 'from-red-500 to-red-600' :
                  selected.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  selected.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                  selected.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  selected.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-purple-500 to-purple-600'
                }`}>
                  {selected.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selected.code}</h2>
                  <p className="text-lg text-muted-foreground">{selected.name}</p>
                </div>
                {selected.activated && (
                  <div className="px-4 py-2 rounded-lg bg-destructive/20 border border-destructive animate-pulse">
                    <span className="text-destructive font-bold text-sm">● ACTIVE</span>
                  </div>
                )}
              </div>
              <p className="text-foreground/90">{selected.description}</p>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${getSeverityColor(selected.severity)}`}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Activation Sequence
                </h3>
                <div className="space-y-2">
                  {selected.steps.map((step, i) => (
                    <div key={i} className="p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border text-sm font-mono">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  System Effects
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selected.effects.map((effect, i) => (
                    <div key={i} className="p-3 bg-background/50 rounded-lg border border-primary/20 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {effect}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleActivate(selected)}
                  disabled={activating}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                    selected.activated 
                      ? "bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-2 border-primary/50 hover:scale-[1.02]" 
                      : "bg-gradient-to-r from-destructive/20 to-destructive/30 text-destructive border-2 border-destructive/50 hover:scale-[1.02] shadow-lg"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {activating ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      PROCESSING...
                    </span>
                  ) : selected.activated ? (
                    "DEACTIVATE PROTOCOL"
                  ) : (
                    "ACTIVATE PROTOCOL"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Select an emergency protocol to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
