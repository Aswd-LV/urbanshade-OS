// Action Dispatcher for DEF-DEV Action Logger
// Dispatches system actions that DEF-DEV can listen to

export type ActionType = "SYSTEM" | "APP" | "FILE" | "USER" | "SECURITY" | "WINDOW" | "ERROR";

export interface ActionEvent {
  type: ActionType;
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
}

// Error types for special formatting
export const ERROR_TYPES = {
  FILE_NOT_FOUND: "!COULDN'T FIND BIN/FILE!",
  STORAGE_ERROR: "!LOCALSTORAGE ACCESS DENIED!",
  PERMISSION_DENIED: "!ACCESS LEVEL INSUFFICIENT!",
  CONNECTION_FAILED: "!NETWORK BIND FAILED!",
  PROCESS_CRASH: "!PROCESS TERMINATED UNEXPECTEDLY!",
  MEMORY_OVERFLOW: "!MEMORY ALLOCATION FAILED!",
  TIMEOUT: "!OPERATION TIMED OUT!",
  INVALID_OPERATION: "!INVALID OPERATION REQUESTED!",
  CORRUPT_DATA: "!DATA CORRUPTION DETECTED!",
  AUTH_FAILED: "!AUTHENTICATION FAILED!",
} as const;

class ActionDispatcher {
  private listeners: Set<(action: ActionEvent) => void> = new Set();
  private actionHistory: ActionEvent[] = [];
  private maxHistory = 500;
  private persistToStorage = false;
  private storageKey = 'def-dev-actions';

  constructor() {
    // Check if persistence is enabled
    this.persistToStorage = localStorage.getItem('def_dev_actions_consent') === 'true';
    
    // Load existing actions from storage
    if (this.persistToStorage) {
      this.loadFromStorage();
    }
  }

  // Enable/disable persistence
  setPersistence(enabled: boolean) {
    this.persistToStorage = enabled;
    localStorage.setItem('def_dev_actions_consent', enabled ? 'true' : 'false');
    if (enabled) {
      this.saveToStorage();
    }
  }

  isPersistenceEnabled(): boolean {
    return this.persistToStorage;
  }

  // Load actions from localStorage
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.actionHistory = parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }));
      }
    } catch (e) {
      console.error("Failed to load action history from storage");
    }
  }

  // Save actions to localStorage
  private saveToStorage() {
    if (!this.persistToStorage) return;
    try {
      const toSave = this.actionHistory.slice(-this.maxHistory).map(a => ({
        ...a,
        timestamp: a.timestamp.toISOString()
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(toSave));
    } catch (e) {
      console.error("Failed to save action history to storage");
    }
  }

  // Subscribe to actions
  subscribe(callback: (action: ActionEvent) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Dispatch an action
  dispatch(type: ActionType, message: string, details?: Record<string, any>) {
    const action: ActionEvent = {
      type,
      message,
      timestamp: new Date(),
      details,
    };

    this.actionHistory.push(action);
    if (this.actionHistory.length > this.maxHistory) {
      this.actionHistory = this.actionHistory.slice(-this.maxHistory);
    }

    // Save to localStorage if enabled
    if (this.persistToStorage) {
      this.saveToStorage();
    }

    // Notify all listeners
    this.listeners.forEach(listener => listener(action));

    // Also dispatch as a custom event for DEF-DEV
    window.dispatchEvent(new CustomEvent('defdev-action', { 
      detail: { type, message, details } 
    }));
  }

  // Refresh from storage
  refreshFromStorage(): ActionEvent[] {
    this.loadFromStorage();
    return this.actionHistory;
  }

  // Clear stored actions
  clearStorage() {
    localStorage.removeItem(this.storageKey);
    this.actionHistory = [];
  }

  // Dispatch error with formatted type
  dispatchError(errorType: keyof typeof ERROR_TYPES, context: string, details?: Record<string, any>) {
    const errorMessage = `${ERROR_TYPES[errorType]} - ${context}`;
    this.dispatch("ERROR", errorMessage, { errorType, ...details });
  }

  // Get action history
  getHistory(): ActionEvent[] {
    return [...this.actionHistory];
  }

  // Clear history
  clearHistory() {
    this.actionHistory = [];
  }

  // Convenience methods
  system(message: string, details?: Record<string, any>) {
    this.dispatch("SYSTEM", message, details);
  }

  app(message: string, details?: Record<string, any>) {
    this.dispatch("APP", message, details);
  }

  file(message: string, details?: Record<string, any>) {
    this.dispatch("FILE", message, details);
  }

  user(message: string, details?: Record<string, any>) {
    this.dispatch("USER", message, details);
  }

  security(message: string, details?: Record<string, any>) {
    this.dispatch("SECURITY", message, details);
  }

  window(message: string, details?: Record<string, any>) {
    this.dispatch("WINDOW", message, details);
  }

  // Check localStorage key exists
  checkStorageKey(key: string): boolean {
    const exists = localStorage.getItem(key) !== null;
    if (!exists) {
      this.dispatchError("FILE_NOT_FOUND", `localStorage key '${key}' does not exist`);
    }
    return exists;
  }
}

// Singleton instance
export const actionDispatcher = new ActionDispatcher();

// Export for direct use
export const dispatchAction = actionDispatcher.dispatch.bind(actionDispatcher);
export const dispatchError = actionDispatcher.dispatchError.bind(actionDispatcher);
