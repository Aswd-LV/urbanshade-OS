import { Camera, Shield, Zap, Map, Users, AlertTriangle, Thermometer, Activity, FileText } from "lucide-react";
import { DocLayout, DocHero, DocSection, DocCard, DocAlert, DocTable } from "@/components/docs";

const Facility = () => {
  const securityApps = [
    {
      icon: Camera,
      name: "Security Cameras",
      description: "Monitor every corner of the facility through the camera network.",
      features: ["Live feeds", "Pan/Tilt/Zoom", "Motion detection", "Recording playback"],
      status: "Active"
    },
    {
      icon: Shield,
      name: "Containment Monitor",
      description: "Track containment status for all specimens in the facility.",
      features: ["Vital signs", "Containment integrity", "Threat levels", "Alert system"],
      status: "Critical"
    },
    {
      icon: AlertTriangle,
      name: "Emergency Protocols",
      description: "Initiate and manage emergency procedures.",
      features: ["Lockdown", "Evacuation", "Containment breach", "All-clear"],
      status: "Standby"
    }
  ];

  const infrastructureApps = [
    {
      icon: Zap,
      name: "Power Grid",
      description: "Manage the facility's power distribution and backup systems.",
      features: ["Power routing", "Load balancing", "Generator status", "Priority management"]
    },
    {
      icon: Thermometer,
      name: "Environmental Control",
      description: "Monitor and adjust climate conditions throughout the facility.",
      features: ["Temperature", "Humidity", "Oxygen levels", "Pressure regulation"]
    },
    {
      icon: Map,
      name: "Facility Planner",
      description: "View and edit the facility layout and room configurations.",
      features: ["Floor plans", "Room editing", "Hallway planning", "Zone management"]
    }
  ];

  const personnelApps = [
    {
      icon: Users,
      name: "Personnel Directory",
      description: "Access information on all facility staff members.",
      features: ["Contact details", "Clearance levels", "Department info", "Status tracking"]
    },
    {
      icon: Activity,
      name: "Incident Reports",
      description: "Log and review facility incidents and anomalies.",
      features: ["Report creation", "Category tagging", "Timeline view", "Export options"]
    },
    {
      icon: FileText,
      name: "Research Notes",
      description: "Access and manage research documentation.",
      features: ["Document viewer", "Annotations", "Classification", "Collaboration"]
    }
  ];

  return (
    <DocLayout
      title="Facility Applications"
      description="Security cameras, containment monitors, power grid management, and other tools for managing the underwater research facility."
      keywords={["security cameras", "containment", "power grid", "facility map", "emergency protocols", "personnel"]}
      accentColor="purple"
      prevPage={{ title: "Core Applications", path: "/docs/applications" }}
      nextPage={{ title: "Terminal Guide", path: "/docs/terminal" }}
    >
      <DocHero
        icon={Shield}
        title="Facility Applications"
        subtitle="These specialized tools keep the underwater research facility operational. Monitor security, manage infrastructure, and coordinate personnel."
        accentColor="purple"
        badge="⚠️ CLASSIFIED ACCESS"
      />

      <DocAlert variant="danger" title="Classified Notice">
        Some facility applications contain information about specimens that definitely don't exist 
        and events that absolutely never happened. Please disregard any tentacles you may see.
      </DocAlert>

      <DocSection title="Security & Safety" icon={Camera} accentColor="purple" id="security">
        <p>
          Critical systems for maintaining facility security and specimen containment.
        </p>

        <div className="grid gap-4 mt-6">
          {securityApps.map((app) => (
            <DocCard
              key={app.name}
              title={app.name}
              description={app.description}
              icon={app.icon}
              accentColor="purple"
            >
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {app.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 text-xs rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  app.status === "Active" ? "bg-green-500/20 text-green-400" :
                  app.status === "Critical" ? "bg-red-500/20 text-red-400" :
                  "bg-amber-500/20 text-amber-400"
                }`}>
                  {app.status}
                </span>
              </div>
            </DocCard>
          ))}
        </div>

        <DocAlert variant="warning" title="Containment Warning">
          Green status means contained. Yellow means caution. Red means... well, you'll want 
          to initiate emergency protocols immediately.
        </DocAlert>
      </DocSection>

      <DocSection title="Infrastructure" icon={Zap} accentColor="purple" id="infrastructure">
        <p>
          Manage the facility's critical infrastructure systems.
        </p>

        <div className="grid gap-4 lg:grid-cols-3 mt-6">
          {infrastructureApps.map((app) => (
            <DocCard
              key={app.name}
              title={app.name}
              description={app.description}
              icon={app.icon}
              accentColor="purple"
            >
              <ul className="mt-3 text-xs text-slate-500 space-y-1">
                {app.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="Personnel & Documentation" icon={Users} accentColor="purple" id="personnel">
        <p>
          Tools for managing staff and maintaining facility documentation.
        </p>

        <div className="grid gap-4 lg:grid-cols-3 mt-6">
          {personnelApps.map((app) => (
            <DocCard
              key={app.name}
              title={app.name}
              description={app.description}
              icon={app.icon}
              accentColor="purple"
            >
              <ul className="mt-3 text-xs text-slate-500 space-y-1">
                {app.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </DocCard>
          ))}
        </div>
      </DocSection>

      <DocSection title="Security Clearance Levels" icon={Shield} accentColor="purple">
        <DocTable
          headers={["Level", "Access", "Applications"]}
          rows={[
            ["Level 0", "Public areas only", "File Explorer, Notepad, Calculator"],
            ["Level 1", "General staff", "+ Personnel Directory, Incident Reports"],
            ["Level 2", "Research staff", "+ Research Notes, Environmental Control"],
            ["Level 3", "Security personnel", "+ Security Cameras, Containment Monitor"],
            ["Level 4", "Senior staff", "+ Power Grid, Emergency Protocols"],
            ["Level 5", "Director only", "Full facility access + Admin Panel"],
          ]}
          accentColor="purple"
        />
      </DocSection>

      <DocSection title="Research Tip" icon={Activity} accentColor="purple">
        <DocAlert variant="tip">
          For the full deep-sea research facility experience, try using Security Cameras 
          while monitoring Containment systems. Nothing says "immersive simulation" like 
          watching empty corridors and pretending something is lurking just off-screen.
        </DocAlert>
      </DocSection>
    </DocLayout>
  );
};

export default Facility;
