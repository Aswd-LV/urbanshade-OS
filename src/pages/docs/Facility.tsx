import { ArrowLeft, Camera, Shield, Zap, Map, Users, AlertTriangle, Thermometer, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Facility = () => {
  const facilityApps = [
    {
      icon: Camera,
      name: "Security Cameras",
      description: "Big Brother, but underwater",
      details: "Monitor every corner of the facility through our extensive camera network. Watch corridors, containment areas, and the break room (someone keeps stealing lunches). Toggle between feeds and spot anomalies before they become problems.",
      warning: null
    },
    {
      icon: Shield,
      name: "Containment Monitor",
      description: "Keep the specimens where they belong",
      details: "Track containment status for all specimens in the facility. View vital signs, containment integrity, and threat levels. Green means good. Red means... well, you'll find out.",
      warning: "Some specimens may be more 'contained' than others. Results may vary."
    },
    {
      icon: Zap,
      name: "Power Grid",
      description: "Electricity: It's kind of important down here",
      details: "Manage the facility's power distribution. Monitor consumption, reroute power during emergencies, and pray the reactor doesn't have a bad day. Includes backup generator status and power priority management.",
      warning: null
    },
    {
      icon: Map,
      name: "Facility Planner",
      description: "Interior design, but for underwater bunkers",
      details: "View and edit the facility layout. Plan expansions, mark hazardous areas, and visualize the labyrinthine corridors you'll definitely get lost in. Features room editing and hallway planning tools.",
      warning: null
    },
    {
      icon: Users,
      name: "Personnel Directory",
      description: "Who's who in the underwater zoo",
      details: "Access information on all facility staff. Find contact details, clearance levels, and department assignments. Great for knowing who to call when things go wrong (they will).",
      warning: null
    },
    {
      icon: AlertTriangle,
      name: "Emergency Protocols",
      description: "For when everything goes sideways",
      details: "Initiate and manage emergency procedures. Lockdowns, evacuations, containment breaches - we've got a protocol for everything! Hopefully you won't need them. Probably you will.",
      warning: "Emergency protocols are not responsible for any existential dread they may cause."
    },
    {
      icon: Thermometer,
      name: "Environmental Control",
      description: "Climate control, 8km under the sea",
      details: "Monitor and adjust temperature, humidity, oxygen levels, and pressure throughout the facility. Because comfort matters, even in the abyss.",
      warning: null
    },
    {
      icon: Activity,
      name: "Incident Reports",
      description: "Documentation of 'oopsies'",
      details: "Log and review facility incidents. From minor spills to major containment failures, every incident gets documented. Great for learning from mistakes. Even better for covering them up.",
      warning: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Facility Applications</h1>
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
          <Shield className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Facility Management Suite</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These are the applications that keep our underwater research facility running. 
            Use them wisely. Or don't. It's a simulation - go wild.
          </p>
        </section>

        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
          <p className="text-sm text-destructive">
            ⚠️ <span className="font-bold">CLASSIFIED NOTICE:</span> Some facility applications 
            may contain information about specimens that definitely don't exist and events that 
            absolutely never happened. Please disregard any tentacles you may or may not see.
          </p>
        </div>

        <div className="grid gap-6">
          {facilityApps.map((app, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <app.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-bold">{app.name}</h3>
                  <p className="text-primary text-sm">{app.description}</p>
                  <p className="text-muted-foreground text-sm">{app.details}</p>
                  {app.warning && (
                    <p className="text-xs text-yellow-500 italic mt-2">* {app.warning}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-lg bg-primary/10 border border-primary/30">
          <h3 className="font-bold text-primary mb-2">🔬 Research Tip</h3>
          <p className="text-sm text-muted-foreground">
            For the full deep-sea research facility experience, try using the Security Cameras 
            while monitoring the Containment systems. Nothing says "immersive simulation" like 
            watching empty corridors and pretending something is lurking just off-screen.
          </p>
        </div>

        <div className="flex justify-between pt-8 border-t border-white/10">
          <Link to="/docs/applications" className="text-primary hover:underline">← Core Applications</Link>
          <Link to="/docs/terminal" className="text-primary hover:underline">Terminal Guide →</Link>
        </div>
      </main>
    </div>
  );
};

export default Facility;
