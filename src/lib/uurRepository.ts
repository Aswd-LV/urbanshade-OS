// UUR Repository Management
// Handles package registry, submissions, and real apps

export interface UURPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'app' | 'theme' | 'extension' | 'utility';
  downloads: number;
  stars: number;
  githubUrl?: string;
  isOfficial: boolean;
  component?: () => React.ReactNode;
}

export interface UURSubmission {
  packageName: string;
  githubUrl: string;
  author: string;
  description: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'denied';
}

const UUR_SUBMISSIONS_KEY = 'urbanshade_uur_submissions';
const UUR_INSTALLED_APPS_KEY = 'urbanshade_uur_installed_apps';

// === REAL BUILT-IN UUR APPS ===

// Hello World App - Simple test app
export const HelloWorldApp = () => {
  return `
    <div style="padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); height: 100%; color: white; font-family: monospace;">
      <h1 style="color: #00ff88; margin-bottom: 16px;">🎉 Hello World!</h1>
      <p style="color: #a0aec0; margin-bottom: 12px;">This project works and you installed it correctly!</p>
      <div style="background: #0a0a0a; padding: 16px; border-radius: 8px; border: 1px solid #00ff8833;">
        <p style="color: #00ff88; margin: 0;">✓ UUR Installation: Successful</p>
        <p style="color: #00ff88; margin: 8px 0 0 0;">✓ Package Manager: Working</p>
        <p style="color: #00ff88; margin: 8px 0 0 0;">✓ App Rendering: Functional</p>
      </div>
      <p style="color: #666; margin-top: 16px; font-size: 12px;">Package: hello-world v1.0.0 by UUR-Team</p>
    </div>
  `;
};

// System Info App - More useful utility
export const SystemInfoApp = () => {
  const now = new Date();
  return `
    <div style="padding: 20px; background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%); height: 100%; color: white; font-family: 'Courier New', monospace; overflow: auto;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 12px;">
        <span style="font-size: 24px;">📊</span>
        <h1 style="color: #00d4ff; margin: 0; font-size: 20px;">System Information</h1>
      </div>
      
      <div style="display: grid; gap: 12px;">
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #00d4ff;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">PLATFORM</div>
          <div style="color: #fff;">${navigator.platform}</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #00ff88;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">USER AGENT</div>
          <div style="color: #fff; font-size: 11px; word-break: break-all;">${navigator.userAgent.slice(0, 100)}...</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #ff6b6b;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">SCREEN</div>
          <div style="color: #fff;">${screen.width} × ${screen.height} @ ${window.devicePixelRatio}x</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #ffd93d;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">LANGUAGE</div>
          <div style="color: #fff;">${navigator.language}</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #9b59b6;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">LOCAL TIME</div>
          <div style="color: #fff;">${now.toLocaleString()}</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #e67e22;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">MEMORY (if available)</div>
          <div style="color: #fff;">${(navigator as any).deviceMemory ? (navigator as any).deviceMemory + ' GB' : 'N/A'}</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #1abc9c;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">COOKIES ENABLED</div>
          <div style="color: #fff;">${navigator.cookieEnabled ? 'Yes' : 'No'}</div>
        </div>
        
        <div style="background: #111; padding: 12px; border-radius: 6px; border-left: 3px solid #3498db;">
          <div style="color: #666; font-size: 11px; margin-bottom: 4px;">ONLINE STATUS</div>
          <div style="color: ${navigator.onLine ? '#00ff88' : '#ff6b6b'};">${navigator.onLine ? '🟢 Online' : '🔴 Offline'}</div>
        </div>
      </div>
      
      <p style="color: #444; margin-top: 20px; font-size: 10px; text-align: center;">
        Package: system-info v1.2.0 by UUR-Team • Press refresh to update
      </p>
    </div>
  `;
};

// Registry of real UUR packages
export const UUR_REAL_PACKAGES: Record<string, UURPackage> = {
  'hello-world': {
    id: 'hello-world',
    name: 'Hello World',
    description: 'Simple test app to verify UUR installation works correctly',
    version: '1.0.0',
    author: 'UUR-Team',
    category: 'app',
    downloads: 5420,
    stars: 128,
    isOfficial: true
  },
  'system-info': {
    id: 'system-info',
    name: 'System Info',
    description: 'Display detailed system information including platform, screen, memory, and network status',
    version: '1.2.0',
    author: 'UUR-Team',
    category: 'utility',
    downloads: 3850,
    stars: 89,
    isOfficial: true
  }
};

// Get app HTML by ID
export const getUURAppHtml = (appId: string): string | null => {
  switch (appId) {
    case 'hello-world':
      return HelloWorldApp();
    case 'system-info':
      return SystemInfoApp();
    default:
      return null;
  }
};

// === SUBMISSION MANAGEMENT ===

export const getSubmissions = (): UURSubmission[] => {
  try {
    const stored = localStorage.getItem(UUR_SUBMISSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addSubmission = (submission: Omit<UURSubmission, 'submittedAt' | 'status'>): boolean => {
  try {
    const submissions = getSubmissions();
    const newSubmission: UURSubmission = {
      ...submission,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    submissions.push(newSubmission);
    localStorage.setItem(UUR_SUBMISSIONS_KEY, JSON.stringify(submissions));
    
    // Also update the text file format for easy viewing
    console.log(`[UUR] New submission: ${submission.packageName} from ${submission.author}`);
    return true;
  } catch {
    return false;
  }
};

export const updateSubmissionStatus = (packageName: string, status: 'approved' | 'denied'): boolean => {
  try {
    const submissions = getSubmissions();
    const idx = submissions.findIndex(s => s.packageName === packageName);
    if (idx !== -1) {
      submissions[idx].status = status;
      localStorage.setItem(UUR_SUBMISSIONS_KEY, JSON.stringify(submissions));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// === INSTALLED APPS ===

export interface InstalledUURApp {
  id: string;
  name: string;
  version: string;
  installedAt: string;
  source: 'official' | 'community';
}

export const getInstalledUURApps = (): InstalledUURApp[] => {
  try {
    const stored = localStorage.getItem(UUR_INSTALLED_APPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const installUURApp = (appId: string): boolean => {
  const pkg = UUR_REAL_PACKAGES[appId];
  if (!pkg) return false;
  
  const installed = getInstalledUURApps();
  if (installed.find(a => a.id === appId)) return false; // Already installed
  
  installed.push({
    id: appId,
    name: pkg.name,
    version: pkg.version,
    installedAt: new Date().toISOString(),
    source: pkg.isOfficial ? 'official' : 'community'
  });
  
  localStorage.setItem(UUR_INSTALLED_APPS_KEY, JSON.stringify(installed));
  return true;
};

export const uninstallUURApp = (appId: string): boolean => {
  const installed = getInstalledUURApps();
  const filtered = installed.filter(a => a.id !== appId);
  if (filtered.length !== installed.length) {
    localStorage.setItem(UUR_INSTALLED_APPS_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
};

export const isUURAppInstalled = (appId: string): boolean => {
  return getInstalledUURApps().some(a => a.id === appId);
};
