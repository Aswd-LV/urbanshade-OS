import { useEffect, useCallback, useState } from 'react';

interface WindowData {
  id: string;
  app: { id: string; name: string };
  zIndex: number;
  minimized?: boolean;
}

interface UseKeyboardShortcutsProps {
  windows: WindowData[];
  onFocusWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onToggleStartMenu: () => void;
  openWindow: (app: any) => void;
  allApps: any[];
}

export const useKeyboardShortcuts = ({
  windows,
  onFocusWindow,
  onMinimizeWindow,
  onCloseWindow,
  onToggleStartMenu,
  openWindow,
  allApps
}: UseKeyboardShortcutsProps) => {
  const [altTabActive, setAltTabActive] = useState(false);
  const [altTabIndex, setAltTabIndex] = useState(0);

  // Get non-minimized windows sorted by z-index
  const sortedWindows = [...windows]
    .filter(w => !w.minimized)
    .sort((a, b) => b.zIndex - a.zIndex);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Alt+Tab - Window switcher
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
      if (sortedWindows.length > 1) {
        setAltTabActive(true);
        setAltTabIndex(prev => (prev + 1) % sortedWindows.length);
      }
      return;
    }

    // Win key (Meta) - Toggle start menu
    if (e.key === 'Meta' && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      onToggleStartMenu();
      return;
    }

    // Ctrl+Alt+Delete - Open task manager
    if (e.ctrlKey && e.altKey && e.key === 'Delete') {
      e.preventDefault();
      const taskManager = allApps.find(a => a.id === 'task-manager');
      if (taskManager) openWindow(taskManager);
      return;
    }

    // Win+D - Minimize all windows (show desktop)
    if (e.metaKey && e.key === 'd') {
      e.preventDefault();
      windows.forEach(w => {
        if (!w.minimized) onMinimizeWindow(w.id);
      });
      return;
    }

    // Win+E - Open file explorer
    if (e.metaKey && e.key === 'e') {
      e.preventDefault();
      const explorer = allApps.find(a => a.id === 'explorer');
      if (explorer) openWindow(explorer);
      return;
    }

    // Win+R / Ctrl+Alt+T - Open terminal
    if ((e.metaKey && e.key === 'r') || (e.ctrlKey && e.altKey && e.key === 't')) {
      e.preventDefault();
      const terminal = allApps.find(a => a.id === 'terminal');
      if (terminal) openWindow(terminal);
      return;
    }

    // Win+I - Open settings
    if (e.metaKey && e.key === 'i') {
      e.preventDefault();
      const settings = allApps.find(a => a.id === 'settings');
      if (settings) openWindow(settings);
      return;
    }

    // Win+L - Lock screen (logout)
    if (e.metaKey && e.key === 'l') {
      e.preventDefault();
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('system-logout'));
      return;
    }

    // Alt+F4 - Close focused window
    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      if (sortedWindows.length > 0) {
        onCloseWindow(sortedWindows[0].id);
      }
      return;
    }

    // F11 - Toggle fullscreen
    if (e.key === 'F11') {
      e.preventDefault();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
      return;
    }

  }, [sortedWindows, windows, onToggleStartMenu, onMinimizeWindow, onCloseWindow, openWindow, allApps]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Alt released - confirm alt+tab selection
    if (altTabActive && e.key === 'Alt') {
      setAltTabActive(false);
      if (sortedWindows[altTabIndex]) {
        onFocusWindow(sortedWindows[altTabIndex].id);
      }
      setAltTabIndex(0);
    }
  }, [altTabActive, altTabIndex, sortedWindows, onFocusWindow]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    altTabActive,
    altTabIndex,
    sortedWindows
  };
};
