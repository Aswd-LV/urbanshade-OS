import { useState, useEffect } from "react";
import { App } from "./Desktop";

interface WindowData {
  id: string;
  app: App;
  zIndex: number;
  minimized?: boolean;
}

interface TaskbarProps {
  onStartClick: () => void;
  pinnedApps: App[];
  onPinnedClick: (app: App) => void;
  windows?: WindowData[];
  onRestoreWindow?: (id: string) => void;
}

export const Taskbar = ({ onStartClick, pinnedApps, onPinnedClick, windows = [], onRestoreWindow }: TaskbarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const openWindows = windows.filter(w => !w.minimized);
  const minimizedWindows = windows.filter(w => w.minimized);

  return (
    <div className="fixed left-0 right-0 bottom-0 h-[60px] flex justify-between items-center px-5 z-[800] bg-black/60 backdrop-blur-sm border-t border-white/5 animate-slide-in-right">
      <div className="flex items-center gap-3">
        <button
          onClick={onStartClick}
          data-start-button
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-panel hover:bg-white/5 transition-all duration-200 hover-scale"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-primary to-primary/20 flex items-center justify-center text-black font-extrabold text-lg">
            U
          </div>
          <div className="text-sm font-bold text-muted-foreground">Urbanshade</div>
        </button>

        <div className="flex gap-2">
          {pinnedApps.map(app => (
            <button
              key={app.id}
              onClick={() => onPinnedClick(app)}
              className="w-11 h-11 rounded-lg flex items-center justify-center text-primary hover:bg-white/5 transition-all duration-200 hover-scale"
              title={app.name}
            >
              {app.icon}
            </button>
          ))}
        </div>

        {/* Open & Minimized Windows */}
        {(openWindows.length > 0 || minimizedWindows.length > 0) && (
          <div className="flex gap-2 ml-2 pl-2 border-l border-white/10">
            {/* Open Windows */}
            {openWindows.map(window => (
              <button
                key={window.id}
                onClick={() => onRestoreWindow?.(window.id)}
                className="w-11 h-11 rounded-lg flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover-scale border border-primary/30"
                title={window.app.name}
              >
                {window.app.icon}
              </button>
            ))}
            {/* Minimized Windows */}
            {minimizedWindows.map(window => (
              <button
                key={window.id}
                onClick={() => onRestoreWindow?.(window.id)}
                className="w-11 h-11 rounded-lg flex items-center justify-center text-primary/60 hover:text-primary hover:bg-white/5 transition-all duration-200 hover-scale"
                title={`Restore ${window.app.name}`}
              >
                {window.app.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm font-mono text-muted-foreground">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};
