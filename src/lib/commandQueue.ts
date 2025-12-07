// Command Queue System for DEF-DEV
// Allows queuing commands from DEF-DEV that the main OS page executes

export type CommandType = 
  | "CRASH" 
  | "BUGCHECK" 
  | "REBOOT" 
  | "SHUTDOWN" 
  | "LOCKDOWN"
  | "RECOVERY"
  | "WIPE"
  | "WRITE_STORAGE"
  | "DELETE_STORAGE"
  | "EXEC_TERMINAL"
  | "TOAST"
  | "CUSTOM"
  | "SET_BUGCHECK"
  | "APT_INSTALL"
  | "APT_REMOVE"
  | "UUR_IMPORT"
  | "UUR_INSTALL"
  | "UUR_REMOVE"
  | "UUR_UPDATE"
  | "MAINTENANCE"
  | "SAFE_MODE"
  | "UPDATE"
  | "LOGOUT";

export interface QueuedCommand {
  id: string;
  type: CommandType;
  payload: Record<string, any>;
  timestamp: string;
  executed?: boolean;
  source: string;
}

const QUEUE_KEY = 'urbanshade_command_queue';
const PERSISTENCE_KEY = 'def_dev_persistence_enabled';
const BUGCHECK_DISABLED_KEY = 'urbanshade_bugchecks_disabled';
const UUR_PACKAGES_KEY = 'urbanshade_uur_packages';
const UUR_LISTS_KEY = 'urbanshade_uur_lists';

class CommandQueue {
  private pollInterval: number | null = null;
  private listeners: Map<CommandType, Set<(cmd: QueuedCommand) => void>> = new Map();
  private globalListeners: Set<(cmd: QueuedCommand) => void> = new Set();

  // Generate unique ID
  private generateId(): string {
    return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Queue a command
  queue(type: CommandType, payload: Record<string, any> = {}, source: string = 'def-dev'): string {
    const commands = this.getQueue();
    const id = this.generateId();
    const cmd: QueuedCommand = {
      id,
      type,
      payload,
      timestamp: new Date().toISOString(),
      source,
    };
    commands.push(cmd);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(commands));
    return id;
  }

  // Get all queued commands
  getQueue(): QueuedCommand[] {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Get and clear next command (FIFO)
  dequeue(): QueuedCommand | null {
    const commands = this.getQueue();
    if (commands.length === 0) return null;
    
    const cmd = commands.shift()!;
    localStorage.setItem(QUEUE_KEY, JSON.stringify(commands));
    return cmd;
  }

  // Clear specific command by ID
  remove(id: string): boolean {
    const commands = this.getQueue();
    const filtered = commands.filter(c => c.id !== id);
    if (filtered.length !== commands.length) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // Clear all commands
  clear(): void {
    localStorage.removeItem(QUEUE_KEY);
  }

  // Subscribe to specific command type
  on(type: CommandType, callback: (cmd: QueuedCommand) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
    return () => this.listeners.get(type)?.delete(callback);
  }

  // Subscribe to all commands
  onAny(callback: (cmd: QueuedCommand) => void): () => void {
    this.globalListeners.add(callback);
    return () => this.globalListeners.delete(callback);
  }

  // Process a command and notify listeners
  private processCommand(cmd: QueuedCommand): void {
    // Notify specific listeners
    this.listeners.get(cmd.type)?.forEach(cb => cb(cmd));
    // Notify global listeners
    this.globalListeners.forEach(cb => cb(cmd));
  }

  // Start polling for commands (call from main page)
  startPolling(intervalMs: number = 250): void {
    if (this.pollInterval) return;
    
    this.pollInterval = window.setInterval(() => {
      const cmd = this.dequeue();
      if (cmd) {
        this.processCommand(cmd);
      }
    }, intervalMs);
  }

  // Stop polling
  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  // Check if polling is active
  isPolling(): boolean {
    return this.pollInterval !== null;
  }

  // === Bugcheck Control ===
  
  areBugchecksDisabled(): boolean {
    return sessionStorage.getItem(BUGCHECK_DISABLED_KEY) === 'true';
  }

  setBugchecksDisabled(disabled: boolean): void {
    if (disabled) {
      sessionStorage.setItem(BUGCHECK_DISABLED_KEY, 'true');
    } else {
      sessionStorage.removeItem(BUGCHECK_DISABLED_KEY);
    }
  }

  // === Persistence System ===
  
  isPersistenceEnabled(): boolean {
    return localStorage.getItem(PERSISTENCE_KEY) === 'true';
  }

  setPersistence(enabled: boolean): void {
    localStorage.setItem(PERSISTENCE_KEY, enabled ? 'true' : 'false');
  }

  // === UUR Package Management ===

  getInstalledPackages(): Record<string, { version: string; installedAt: string; source: string }> {
    try {
      const stored = localStorage.getItem(UUR_PACKAGES_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  installPackage(name: string, version: string, source: string = 'uur'): boolean {
    const packages = this.getInstalledPackages();
    packages[name] = { version, installedAt: new Date().toISOString(), source };
    localStorage.setItem(UUR_PACKAGES_KEY, JSON.stringify(packages));
    return true;
  }

  removePackage(name: string): boolean {
    const packages = this.getInstalledPackages();
    if (packages[name]) {
      delete packages[name];
      localStorage.setItem(UUR_PACKAGES_KEY, JSON.stringify(packages));
      return true;
    }
    return false;
  }

  isPackageInstalled(name: string): boolean {
    return !!this.getInstalledPackages()[name];
  }

  getPackageVersion(name: string): string | null {
    return this.getInstalledPackages()[name]?.version || null;
  }

  // UUR Lists (package sources)
  getUurLists(): Record<string, { url: string; addedAt: string; packages: string[] }> {
    try {
      const stored = localStorage.getItem(UUR_LISTS_KEY);
      return stored ? JSON.parse(stored) : { 
        official: { 
          url: 'uur://official', 
          addedAt: new Date().toISOString(),
          packages: Object.keys(UUR_AVAILABLE_PACKAGES)
        }
      };
    } catch {
      return {};
    }
  }

  importUurList(name: string, packages: string[]): boolean {
    const lists = this.getUurLists();
    lists[name] = { 
      url: `uur://${name}`, 
      addedAt: new Date().toISOString(),
      packages 
    };
    localStorage.setItem(UUR_LISTS_KEY, JSON.stringify(lists));
    return true;
  }

  // === Convenience methods for common commands ===

  queueCrash(crashType: string, process: string = 'system.exe'): string {
    return this.queue('CRASH', { type: crashType, process });
  }

  queueBugcheck(code: string, description: string): string {
    return this.queue('BUGCHECK', { code, description });
  }

  queueReboot(): string {
    return this.queue('REBOOT', {});
  }

  queueShutdown(): string {
    return this.queue('SHUTDOWN', {});
  }

  queueLockdown(protocol: string): string {
    return this.queue('LOCKDOWN', { protocol });
  }

  queueRecovery(): string {
    return this.queue('RECOVERY', {});
  }

  queueWipe(): string {
    return this.queue('WIPE', {});
  }

  queueStorageWrite(key: string, value: string): string {
    return this.queue('WRITE_STORAGE', { key, value });
  }

  queueStorageDelete(key: string): string {
    return this.queue('DELETE_STORAGE', { key });
  }

  queueTerminalCommand(command: string): string {
    return this.queue('EXEC_TERMINAL', { command });
  }

  queueToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): string {
    return this.queue('TOAST', { message, type });
  }

  queueCustom(action: string, data: Record<string, any> = {}): string {
    return this.queue('CUSTOM', { action, ...data });
  }

  queueSetBugcheck(enabled: boolean): string {
    return this.queue('SET_BUGCHECK', { enabled });
  }

  queueAptInstall(appId: string): string {
    return this.queue('APT_INSTALL', { appId });
  }

  queueAptRemove(appId: string): string {
    return this.queue('APT_REMOVE', { appId });
  }

  queueUurInstall(packageName: string, version: string = 'latest'): string {
    return this.queue('UUR_INSTALL', { packageName, version });
  }

  queueUurRemove(packageName: string): string {
    return this.queue('UUR_REMOVE', { packageName });
  }

  queueUurUpdate(packageName?: string): string {
    return this.queue('UUR_UPDATE', { packageName });
  }

  queueMaintenance(enable: boolean): string {
    return this.queue('MAINTENANCE', { enable });
  }

  queueSafeMode(): string {
    return this.queue('SAFE_MODE', {});
  }

  queueUpdate(): string {
    return this.queue('UPDATE', {});
  }

  queueLogout(): string {
    return this.queue('LOGOUT', {});
  }
}

// Singleton
export const commandQueue = new CommandQueue();

// Terminal command parser
export interface TerminalResult {
  output: string;
  success: boolean;
  type: 'output' | 'error' | 'info' | 'system';
}

export const parseTerminalCommand = (input: string): { command: string; args: string[] } => {
  const parts = input.trim().split(/\s+/);
  return {
    command: parts[0]?.toLowerCase() || '',
    args: parts.slice(1)
  };
};

export const TERMINAL_COMMANDS: Record<string, { desc: string; usage: string; category: string }> = {
  // Basic commands
  help: { desc: 'Show available commands', usage: 'help [command]', category: 'basic' },
  echo: { desc: 'Print text to terminal', usage: 'echo <text>', category: 'basic' },
  clear: { desc: 'Clear terminal output', usage: 'clear', category: 'basic' },
  date: { desc: 'Show current date and time', usage: 'date', category: 'basic' },
  whoami: { desc: 'Show current user', usage: 'whoami', category: 'basic' },
  uptime: { desc: 'Show system uptime', usage: 'uptime', category: 'basic' },
  
  // System control
  crash: { desc: 'Trigger a styled crash screen', usage: 'crash <type>', category: 'system' },
  bugcheck: { desc: 'Trigger a real bugcheck', usage: 'bugcheck <code> [message]', category: 'system' },
  reboot: { desc: 'Reboot the system', usage: 'reboot', category: 'system' },
  shutdown: { desc: 'Shutdown the system', usage: 'shutdown', category: 'system' },
  lockdown: { desc: 'Trigger lockdown protocol', usage: 'lockdown <protocol>', category: 'system' },
  recovery: { desc: 'Enter recovery mode', usage: 'recovery', category: 'system' },
  maintenance: { desc: 'Toggle maintenance mode', usage: 'maintenance [on|off]', category: 'system' },
  safemode: { desc: 'Enter safe mode', usage: 'safemode', category: 'system' },
  logout: { desc: 'Log out current user', usage: 'logout', category: 'system' },
  
  // Storage commands
  ls: { desc: 'List localStorage keys', usage: 'ls [filter]', category: 'storage' },
  get: { desc: 'Get localStorage value', usage: 'get <key>', category: 'storage' },
  set: { desc: 'Set localStorage value', usage: 'set <key> <value>', category: 'storage' },
  del: { desc: 'Delete localStorage key', usage: 'del <key>', category: 'storage' },
  wipe: { desc: 'Wipe all system data', usage: 'wipe --confirm', category: 'storage' },
  
  // Notifications
  toast: { desc: 'Show a toast notification', usage: 'toast <type> <message>', category: 'notify' },
  alert: { desc: 'Show an alert dialog', usage: 'alert <message>', category: 'notify' },
  
  // Queue and status
  status: { desc: 'Show system status', usage: 'status', category: 'info' },
  queue: { desc: 'Show command queue', usage: 'queue', category: 'info' },
  exec: { desc: 'Execute command on OS', usage: 'exec <command>', category: 'system' },
  
  // Privileged commands
  sudo: { desc: 'Execute privileged commands', usage: 'sudo <command> [args]', category: 'admin' },
  apt: { desc: 'Package manager', usage: 'apt <install|remove|list> <package>', category: 'admin' },
  
  // UUR commands
  uur: { desc: 'UrbanShade User Repository', usage: 'uur <command> [args]', category: 'uur' },
};

// UUR subcommands
export const UUR_COMMANDS: Record<string, { desc: string; usage: string }> = {
  inst: { desc: 'Install a package', usage: 'uur inst <package>_<version>' },
  rm: { desc: 'Remove a package', usage: 'uur rm <package>' },
  up: { desc: 'Update packages', usage: 'uur up [package]' },
  lst: { desc: 'List packages or version', usage: 'uur lst [app|ver]' },
  search: { desc: 'Search for packages', usage: 'uur search <query>' },
  info: { desc: 'Get package info', usage: 'uur info <package>' },
  imp: { desc: 'Import a package list', usage: 'uur imp <listname>' },
  exp: { desc: 'Export installed packages', usage: 'uur exp' },
  sync: { desc: 'Sync with repository', usage: 'uur sync' },
  clean: { desc: 'Clean package cache', usage: 'uur clean' },
};

// Available UUR packages (simulated repository)
export const UUR_AVAILABLE_PACKAGES: Record<string, { 
  name: string; 
  description: string; 
  version: string; 
  author: string;
  category: string;
  downloads: number;
  stars: number;
}> = {
  'urbanshade-themes': {
    name: 'UrbanShade Themes',
    description: 'Custom theme packs for UrbanShade OS',
    version: '2.1.0',
    author: 'aswdBatch',
    category: 'themes',
    downloads: 2400,
    stars: 48
  },
  'facility-sounds': {
    name: 'Facility Sounds',
    description: 'Ambient sound effects and alerts',
    version: '1.3.2',
    author: 'community',
    category: 'audio',
    downloads: 1800,
    stars: 32
  },
  'extended-terminal': {
    name: 'Extended Terminal',
    description: 'Additional terminal commands and utilities',
    version: '3.0.1',
    author: 'defdev-team',
    category: 'utility',
    downloads: 3100,
    stars: 67
  },
  'custom-bugchecks': {
    name: 'Custom Bugchecks',
    description: 'Create your own bugcheck screens',
    version: '1.0.5',
    author: 'community',
    category: 'developer',
    downloads: 890,
    stars: 21
  },
  'dark-mode-plus': {
    name: 'Dark Mode Plus',
    description: 'Enhanced dark mode with OLED black',
    version: '1.2.0',
    author: 'themes-team',
    category: 'themes',
    downloads: 1560,
    stars: 38
  },
  'sys-monitor-pro': {
    name: 'System Monitor Pro',
    description: 'Advanced system monitoring widgets',
    version: '2.0.0',
    author: 'defdev-team',
    category: 'utility',
    downloads: 2200,
    stars: 55
  },
  'file-tools': {
    name: 'File Tools',
    description: 'Extended file management utilities',
    version: '1.5.3',
    author: 'community',
    category: 'utility',
    downloads: 1300,
    stars: 29
  },
  'security-suite': {
    name: 'Security Suite',
    description: 'Enhanced security and privacy tools',
    version: '1.1.0',
    author: 'security-team',
    category: 'security',
    downloads: 980,
    stars: 42
  },
  'notification-center-plus': {
    name: 'Notification Center+',
    description: 'Enhanced notification management',
    version: '1.0.2',
    author: 'community',
    category: 'utility',
    downloads: 720,
    stars: 18
  },
  'retro-theme': {
    name: 'Retro Theme',
    description: 'Classic Windows-style retro theme',
    version: '1.0.0',
    author: 'nostalgia-dev',
    category: 'themes',
    downloads: 1100,
    stars: 45
  },
};

// Available apps for apt install
export const INSTALLABLE_APPS: Record<string, { name: string; category: string }> = {
  terminal: { name: "Terminal", category: "system" },
  fileexplorer: { name: "File Explorer", category: "system" },
  calculator: { name: "Calculator", category: "utility" },
  notepad: { name: "Notepad", category: "utility" },
  browser: { name: "Browser", category: "utility" },
  settings: { name: "Settings", category: "system" },
  taskmanager: { name: "Task Manager", category: "system" },
  paint: { name: "Paint", category: "creative" },
  clock: { name: "Clock", category: "utility" },
  weather: { name: "Weather", category: "utility" },
  systemmonitor: { name: "System Monitor", category: "system" },
  emailclient: { name: "Email Client", category: "communication" },
  musicplayer: { name: "Music Player", category: "media" },
  videoplayer: { name: "Video Player", category: "media" },
  imageviewer: { name: "Image Viewer", category: "media" },
  vpn: { name: "VPN", category: "security" },
  firewall: { name: "Firewall", category: "security" },
  diskmanager: { name: "Disk Manager", category: "system" },
  registryeditor: { name: "Registry Editor", category: "system" },
  facilitymap: { name: "Facility Map", category: "facility" },
  securitycameras: { name: "Security Cameras", category: "facility" },
  personneldirectory: { name: "Personnel Directory", category: "facility" },
  containmentmonitor: { name: "Containment Monitor", category: "facility" },
  emergencyprotocols: { name: "Emergency Protocols", category: "facility" },
  researchnotes: { name: "Research Notes", category: "facility" },
  incidentreports: { name: "Incident Reports", category: "facility" },
  audiologs: { name: "Audio Logs", category: "facility" },
  powergrid: { name: "Power Grid", category: "facility" },
  environmentalcontrol: { name: "Environmental Control", category: "facility" },
  databaseviewer: { name: "Database Viewer", category: "facility" },
  networkscanner: { name: "Network Scanner", category: "security" },
  spreadsheet: { name: "Spreadsheet", category: "utility" },
  messages: { name: "Messages", category: "communication" },
  instantchat: { name: "Instant Chat", category: "communication" },
};
