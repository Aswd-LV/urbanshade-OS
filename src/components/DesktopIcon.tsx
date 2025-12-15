import { App } from "./Desktop";

interface DesktopIconProps {
  app: App;
}

export const DesktopIcon = ({ app }: DesktopIconProps) => {
  return (
    <div
      className="w-[100px] flex flex-col items-center gap-2 text-center select-none group cursor-pointer hover-scale animate-fade-in"
      onDoubleClick={() => app.run()}
    >
      <div className="w-16 h-16 rounded-xl glass-panel flex items-center justify-center text-primary transition-all duration-300 group-hover:urbanshade-glow group-hover:scale-110">
        <div className="w-10 h-10 flex items-center justify-center [&>svg]:w-10 [&>svg]:h-10">
          {app.icon}
        </div>
      </div>
      <div className="text-xs text-muted-foreground transition-colors group-hover:text-foreground max-w-[90px] truncate px-1 py-0.5 rounded bg-black/30">
        {app.name}
      </div>
    </div>
  );
};
