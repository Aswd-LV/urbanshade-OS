import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Database, Shield, Smartphone, AlertTriangle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { to: "/acc-manage/general", label: "General", icon: User, description: "Profile and account info" },
  { to: "/acc-manage/data", label: "Data", icon: Database, description: "Manage stored data" },
  { to: "/acc-manage/security", label: "Security", icon: Shield, description: "Password and credentials" },
  { to: "/acc-manage/devices", label: "Devices", icon: Smartphone, description: "Sync history and devices" },
  { to: "/acc-manage/danger", label: "Danger Zone", icon: AlertTriangle, description: "Destructive actions" },
];

export default function AccManageLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 border-r border-cyan-500/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/")}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Desktop
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Settings className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-cyan-400">Account Manager</h1>
              <p className="text-xs text-slate-500">Manage your URBANSHADE account</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? item.to.includes("danger")
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : item.to.includes("danger")
                        ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-[10px] opacity-70 truncate">{item.description}</div>
                </div>
              </NavLink>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/20">
          <p className="text-[10px] text-slate-600 text-center">
            URBANSHADE OS v2.8
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto p-8">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
