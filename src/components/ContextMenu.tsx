import { useEffect, useRef } from "react";
import { FileText, FolderPlus, Settings, Trash2, Copy } from "lucide-react";

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  separator?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

export const ContextMenu = ({ x, y, items, onClose }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-[999] min-w-[200px] rounded-lg glass-panel border border-border shadow-2xl animate-scale-in"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.separator ? (
            <div className="my-1 border-t border-border/30" />
          ) : (
            <button
              onClick={() => {
                item.action();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {item.icon && <span className="text-primary">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const getDesktopMenuItems = (
  onNewFolder: () => void,
  onSettings: () => void
): MenuItem[] => [
  {
    label: "New Folder",
    icon: <FolderPlus className="w-4 h-4" />,
    action: onNewFolder
  },
  {
    label: "Create File",
    icon: <FileText className="w-4 h-4" />,
    action: () => {}
  },
  { separator: true } as MenuItem,
  {
    label: "System Settings",
    icon: <Settings className="w-4 h-4" />,
    action: onSettings
  }
];

export const getFileMenuItems = (
  fileName: string,
  onDelete: () => void,
  onCopy: () => void
): MenuItem[] => [
  {
    label: "Open",
    icon: <FileText className="w-4 h-4" />,
    action: () => {}
  },
  {
    label: "Copy",
    icon: <Copy className="w-4 h-4" />,
    action: onCopy
  },
  { separator: true } as MenuItem,
  {
    label: "Delete",
    icon: <Trash2 className="w-4 h-4" />,
    action: onDelete
  }
];
