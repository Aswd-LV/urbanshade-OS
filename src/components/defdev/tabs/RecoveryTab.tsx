import { useState } from "react";
import { HardDrive, Play, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { RecoveryImage } from "../hooks/useDefDevState";

const RecoveryTab = () => {
  const [recoveryImages, setRecoveryImages] = useState<RecoveryImage[]>(() => {
    const saved = localStorage.getItem('urbanshade_recovery_images_data');
    return saved ? JSON.parse(saved) : [];
  });

  const captureCurrentAsImage = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.includes('recovery_images')) {
        data[key] = localStorage.getItem(key) || '';
      }
    }
    const image: RecoveryImage = {
      name: `snapshot_${Date.now()}`,
      data,
      created: new Date().toISOString(),
      size: JSON.stringify(data).length,
    };
    const updated = [image, ...recoveryImages].slice(0, 10);
    setRecoveryImages(updated);
    localStorage.setItem('urbanshade_recovery_images_data', JSON.stringify(updated));
    toast.success('Recovery image captured');
  };

  const loadImage = (image: RecoveryImage) => {
    if (!confirm('This will replace current localStorage. Continue?')) return;
    Object.entries(image.data).forEach(([key, value]) => localStorage.setItem(key, value));
    toast.success('Recovery image loaded');
  };

  const deleteImage = (name: string) => {
    const updated = recoveryImages.filter(i => i.name !== name);
    setRecoveryImages(updated);
    localStorage.setItem('urbanshade_recovery_images_data', JSON.stringify(updated));
    toast.success('Image deleted');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <HardDrive className="w-5 h-5 text-orange-400" />
        <span className="font-bold text-orange-400">Recovery Images</span>
        <div className="flex-1" />
        <button onClick={captureCurrentAsImage} className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded text-orange-400 text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Capture
        </button>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {recoveryImages.length === 0 ? (
          <div className="text-center text-slate-600 py-12">
            <HardDrive className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No recovery images</p>
            <button onClick={captureCurrentAsImage} className="mt-3 px-4 py-2 bg-orange-500/20 border border-orange-500/40 rounded text-orange-400 text-sm">
              Capture Current State
            </button>
          </div>
        ) : (
          recoveryImages.map(image => (
            <div key={image.name} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-orange-400" />
              <div className="flex-1">
                <span className="font-mono text-sm text-orange-400">{image.name}</span>
                <p className="text-xs text-slate-500">{new Date(image.created).toLocaleString()} | {(image.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => loadImage(image)} className="p-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded text-green-400">
                <Play className="w-4 h-4" />
              </button>
              <button onClick={() => deleteImage(image.name)} className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecoveryTab;
