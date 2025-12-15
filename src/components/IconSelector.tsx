import { useState } from "react";
import * as icons from "lucide-react";
import { Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

// All available Lucide icon names (subset of popular ones)
const ICON_NAMES = [
  "User", "UserCircle", "UserSquare", "Users", "Smile", "Frown", "Meh", "Ghost",
  "Bot", "Cat", "Dog", "Bird", "Fish", "Rabbit", "Bug", "Skull",
  "Heart", "Star", "Moon", "Sun", "Cloud", "Zap", "Flame", "Snowflake",
  "Mountain", "Tree", "Flower2", "Leaf", "Waves", "Wind", "Droplets", "Rainbow",
  "Music", "Gamepad2", "Dice1", "Trophy", "Medal", "Target", "Crosshair", "Swords",
  "Code", "Terminal", "Braces", "Database", "Server", "Cpu", "HardDrive", "Monitor",
  "Rocket", "Plane", "Car", "Bike", "Ship", "Train", "Bus", "Truck",
  "Home", "Building", "Building2", "Castle", "Tent", "Warehouse", "Hospital", "School",
  "Camera", "Image", "Video", "Film", "Mic", "Headphones", "Speaker", "Radio",
  "Book", "BookOpen", "Newspaper", "FileText", "Folder", "Archive", "Box", "Package",
  "ShoppingCart", "CreditCard", "Wallet", "Banknote", "Coins", "Gift", "Tag", "Percent",
  "Lock", "Unlock", "Key", "Shield", "ShieldCheck", "Eye", "EyeOff", "Fingerprint",
  "Mail", "MessageSquare", "Phone", "Video", "AtSign", "Hash", "Link", "Globe",
  "Calendar", "Clock", "Timer", "Alarm", "Watch", "Hourglass", "Sunrise", "Sunset",
  "Settings", "Sliders", "Tool", "Wrench", "Hammer", "Screwdriver", "Paintbrush", "Palette"
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  color?: string;
}

export const IconSelector = ({ selectedIcon, onSelectIcon, color = "#00d4ff" }: IconSelectorProps) => {
  const [search, setSearch] = useState("");

  const filteredIcons = ICON_NAMES.filter(name => 
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Icon Grid */}
      <ScrollArea className="h-48">
        <div className="grid grid-cols-8 gap-1.5 p-1">
          {filteredIcons.map(iconName => {
            const Icon = (icons as any)[iconName];
            if (!Icon) return null;
            return (
              <button
                key={iconName}
                onClick={() => onSelectIcon(iconName)}
                title={iconName}
                className={`p-2.5 rounded-lg transition-all ${
                  selectedIcon === iconName 
                    ? "bg-cyan-500/30 ring-2 ring-cyan-500" 
                    : "hover:bg-slate-700"
                }`}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: selectedIcon === iconName ? color : "#94a3b8" }} 
                />
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
