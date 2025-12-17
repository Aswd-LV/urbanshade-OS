import { useState } from "react";
import { Database, Trash2, AlertTriangle, HardDrive, Package, Palette, History, FileBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const DATA_CATEGORIES = [
  { 
    key: "desktopIcons", 
    label: "Desktop Icons", 
    desc: "Icon positions and custom desktop items",
    icon: HardDrive,
    storageKey: "urbanshade_desktop_icons"
  },
  { 
    key: "installedApps", 
    label: "Installed Apps", 
    desc: "List of installed applications",
    icon: Package,
    storageKey: "urbanshade_installed_apps"
  },
  { 
    key: "systemSettings", 
    label: "System Settings", 
    desc: "Theme, colors, fonts, and preferences",
    icon: Palette,
    storageKey: "settings_" // prefix
  },
  { 
    key: "syncHistory", 
    label: "Sync History", 
    desc: "Cloud sync logs and history",
    icon: History,
    storageKey: "urbanshade_sync_history"
  },
  { 
    key: "uurPackages", 
    label: "UUR Packages", 
    desc: "Installed UUR packages and custom lists",
    icon: FileBox,
    storageKey: "urbanshade_uur_"
  },
  { 
    key: "recentFiles", 
    label: "Recent Files", 
    desc: "Recently opened files history",
    icon: FileBox,
    storageKey: "urbanshade_recent_files"
  },
];

export default function DataPage() {
  const [dataToDelete, setDataToDelete] = useState<Record<string, boolean>>({
    desktopIcons: false,
    installedApps: false,
    systemSettings: false,
    syncHistory: false,
    uurPackages: false,
    recentFiles: false,
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const getStorageSize = (key: string) => {
    try {
      if (key.endsWith("_")) {
        // Prefix - count all matching
        const keys = Object.keys(localStorage).filter(k => k.startsWith(key));
        let total = 0;
        keys.forEach(k => {
          total += (localStorage.getItem(k) || "").length;
        });
        return total;
      }
      const data = localStorage.getItem(key);
      return data ? data.length : 0;
    } catch {
      return 0;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDeleteData = () => {
    const toDelete = Object.entries(dataToDelete).filter(([, v]) => v);
    if (toDelete.length === 0) {
      toast.error("Select at least one data type to delete");
      return;
    }

    toDelete.forEach(([key]) => {
      const category = DATA_CATEGORIES.find(c => c.key === key);
      if (!category) return;

      if (category.storageKey.endsWith("_")) {
        // Prefix - delete all matching
        const keys = Object.keys(localStorage).filter(k => k.startsWith(category.storageKey));
        keys.forEach(k => localStorage.removeItem(k));
      } else {
        localStorage.removeItem(category.storageKey);
      }
    });

    toast.success(`Deleted ${toDelete.length} data categories`);
    setShowConfirm(false);
    setDataToDelete({
      desktopIcons: false,
      installedApps: false,
      systemSettings: false,
      syncHistory: false,
      uurPackages: false,
      recentFiles: false,
    });
  };

  const selectedCount = Object.values(dataToDelete).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">Data Management</h1>
        <p className="text-slate-400 text-sm">View and delete locally stored data</p>
      </div>

      {/* Data Categories */}
      <section className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold">Stored Data</h2>
        </div>

        <div className="space-y-2">
          {DATA_CATEGORIES.map(item => {
            const size = getStorageSize(item.storageKey);
            return (
              <label 
                key={item.key}
                className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-all group"
              >
                <Checkbox
                  checked={dataToDelete[item.key] || false}
                  onCheckedChange={(checked) => 
                    setDataToDelete(d => ({ ...d, [item.key]: !!checked }))
                  }
                  className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                />
                <div className="p-2 rounded-lg bg-slate-700/50 group-hover:bg-cyan-500/20 transition-colors">
                  <item.icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                  {formatSize(size)}
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => setShowConfirm(true)}
            disabled={selectedCount === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" /> 
            Delete Selected ({selectedCount})
          </Button>
        </div>
      </section>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold text-red-400">Confirm Deletion</h3>
            </div>
            <p className="text-slate-300 mb-4">
              Are you sure you want to delete the following data?
            </p>
            <ul className="mb-6 space-y-1">
              {Object.entries(dataToDelete)
                .filter(([, v]) => v)
                .map(([key]) => {
                  const cat = DATA_CATEGORIES.find(c => c.key === key);
                  return (
                    <li key={key} className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="text-red-400">•</span> {cat?.label}
                    </li>
                  );
                })}
            </ul>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDeleteData}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
