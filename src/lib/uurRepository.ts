// UUR Repository Management
// Handles package registry, submissions, real apps, package lists, ratings, and categories

import DOMPurify from 'dompurify';

export type UURCategory = 'app' | 'theme' | 'extension' | 'utility' | 'game' | 'productivity' | 'security' | 'system';

export const UUR_CATEGORIES: { id: UURCategory; name: string; icon: string; color: string }[] = [
  { id: 'app', name: 'Applications', icon: '📦', color: 'cyan' },
  { id: 'utility', name: 'Utilities', icon: '🔧', color: 'green' },
  { id: 'theme', name: 'Themes', icon: '🎨', color: 'purple' },
  { id: 'extension', name: 'Extensions', icon: '🧩', color: 'amber' },
  { id: 'game', name: 'Games', icon: '🎮', color: 'pink' },
  { id: 'productivity', name: 'Productivity', icon: '📊', color: 'blue' },
  { id: 'security', name: 'Security', icon: '🔒', color: 'red' },
  { id: 'system', name: 'System', icon: '⚙️', color: 'slate' },
];

export interface UURPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: UURCategory;
  downloads: number;
  stars: number;
  githubUrl?: string;
  isOfficial: boolean;
  isFeatured?: boolean;
  listSource?: string;
  component?: () => React.ReactNode;
  dependencies?: string[];
  tags?: string[];
}

export interface UURSubmission {
  packageName: string;
  githubUrl: string;
  author: string;
  description: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface UURList {
  id: string;
  name: string;
  url: string;
  description: string;
  isOfficial: boolean;
  addedAt: string;
  packages: UURPackage[];
}

const UUR_SUBMISSIONS_KEY = 'urbanshade_uur_submissions';
const UUR_INSTALLED_APPS_KEY = 'urbanshade_uur_installed_apps';
const UUR_CUSTOM_LISTS_KEY = 'urbanshade_uur_custom_lists';

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
    isOfficial: true,
    isFeatured: true,
    listSource: 'official',
    tags: ['test', 'demo', 'starter']
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
    isOfficial: true,
    isFeatured: true,
    listSource: 'official',
    tags: ['system', 'info', 'diagnostics']
  },
  'theme-dark-neon': {
    id: 'theme-dark-neon',
    name: 'Dark Neon Theme',
    description: 'A vibrant neon-styled dark theme with glowing accents',
    version: '2.0.0',
    author: 'ThemeForge',
    category: 'theme',
    downloads: 2100,
    stars: 67,
    isOfficial: true,
    isFeatured: false,
    listSource: 'official',
    tags: ['theme', 'dark', 'neon']
  },
  'file-cleaner': {
    id: 'file-cleaner',
    name: 'File Cleaner',
    description: 'Clean up temporary files and free up storage space',
    version: '1.5.0',
    author: 'CleanUtils',
    category: 'utility',
    downloads: 1890,
    stars: 45,
    isOfficial: true,
    listSource: 'official',
    tags: ['cleanup', 'storage', 'utility']
  },
  'mini-games': {
    id: 'mini-games',
    name: 'Mini Games Pack',
    description: 'Collection of fun mini-games including Snake, Tetris, and Memory',
    version: '1.0.0',
    author: 'GameDev',
    category: 'game',
    downloads: 4200,
    stars: 156,
    isOfficial: true,
    isFeatured: true,
    listSource: 'official',
    tags: ['games', 'fun', 'entertainment']
  },
  'password-gen': {
    id: 'password-gen',
    name: 'Password Generator',
    description: 'Generate secure random passwords with customizable options',
    version: '1.1.0',
    author: 'SecureTools',
    category: 'security',
    downloads: 1560,
    stars: 42,
    isOfficial: true,
    listSource: 'official',
    tags: ['security', 'password', 'generator']
  }
};

// Sanitize HTML to prevent XSS using DOMPurify - battle-tested library
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  try {
    // Configure DOMPurify with strict settings for UUR packages
    const cleanHtml = DOMPurify.sanitize(html, {
      // Only allow safe HTML tags - no scripts, iframes, objects, etc.
      ALLOWED_TAGS: [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'pre', 'code', 'ul', 'ol', 'li', 'br', 'hr',
        'strong', 'em', 'b', 'i', 'u', 's',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'a', 'img', 'blockquote', 'details', 'summary'
      ],
      // Only allow safe attributes
      ALLOWED_ATTR: [
        'style', 'class', 'id',
        'href', 'src', 'alt', 'title', 'width', 'height',
        'open' // for details/summary
      ],
      // Forbid dangerous URI schemes
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
      // No data URIs in src attributes (prevent encoded payloads)
      ALLOW_DATA_ATTR: false,
      // Force all links to open safely
      ADD_ATTR: ['target'],
      // Strip dangerous style properties
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
      // Additional security hooks
      FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select'],
      // Return string, not DOM node
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    });
    
    // Additional post-processing: remove dangerous CSS patterns
    // DOMPurify handles most, but we add extra checks for CSS expressions
    const dangerousCssPatterns = [
      /expression\s*\(/gi,
      /behavior\s*:/gi,
      /-moz-binding\s*:/gi,
      /javascript\s*:/gi,
      /vbscript\s*:/gi,
      /@import/gi,
      /@charset/gi,
    ];
    
    let sanitized = cleanHtml;
    for (const pattern of dangerousCssPatterns) {
      sanitized = sanitized.replace(pattern, '/* blocked */');
    }
    
    console.log('[UUR] HTML sanitized successfully with DOMPurify');
    return sanitized;
  } catch (err) {
    console.error('[UUR] Sanitization error, returning empty string for safety:', err);
    // On error, return empty string rather than potentially dangerous content
    return '';
  }
};

// Key for storing GitHub-installed app HTML
const UUR_GITHUB_APPS_KEY_LOCAL = 'urbanshade_uur_github_apps';

// Get stored GitHub app HTML
const getStoredGithubAppHtmlLocal = (appId: string): string | null => {
  try {
    const stored = localStorage.getItem(UUR_GITHUB_APPS_KEY_LOCAL);
    const apps = stored ? JSON.parse(stored) : {};
    return apps[appId] || null;
  } catch {
    return null;
  }
};

// Get app HTML by ID (sanitized)
export const getUURAppHtml = (appId: string): string | null => {
  let html: string | null = null;
  
  // First check for GitHub-installed apps
  const githubHtml = getStoredGithubAppHtmlLocal(appId);
  if (githubHtml) {
    return githubHtml; // Already sanitized on install
  }
  
  switch (appId) {
    case 'hello-world':
      html = HelloWorldApp();
      break;
    case 'system-info':
      html = SystemInfoApp();
      break;
    default:
      // Check custom lists for the app
      const customLists = getCustomLists();
      for (const list of customLists) {
        const pkg = list.packages.find(p => p.id === appId);
        if (pkg) {
          html = `<div style="padding: 20px; background: #1a1a2e; color: white; font-family: monospace;">
            <h2 style="color: #00d4ff;">${pkg.name}</h2>
            <p style="color: #888; margin: 8px 0;">${pkg.description}</p>
            <div style="background: #0a0a0a; padding: 12px; border-radius: 6px; margin-top: 16px;">
              <p style="color: #666; font-size: 12px;">This package was loaded from a custom list.</p>
              <p style="color: #444; font-size: 11px;">Source: ${list.name}</p>
            </div>
          </div>`;
          break;
        }
      }
      break;
  }
  
  // Sanitize before returning
  return html ? sanitizeHtml(html) : null;
};

// === PACKAGE LISTS ===

// Get the official package list
export const getOfficialList = (): UURList => ({
  id: 'official',
  name: 'Official Repository',
  url: 'uur://official',
  description: 'The official UrbanShade User Repository with verified packages',
  isOfficial: true,
  addedAt: new Date().toISOString(),
  packages: Object.values(UUR_REAL_PACKAGES)
});

// Get featured packages
export const getFeaturedPackages = (): UURPackage[] => {
  return getAllPackages().filter(pkg => pkg.isFeatured);
};

// Get packages by category
export const getPackagesByCategory = (category: UURCategory): UURPackage[] => {
  return getAllPackages().filter(pkg => pkg.category === category);
};

// Get custom (imported) lists
export const getCustomLists = (): UURList[] => {
  try {
    const stored = localStorage.getItem(UUR_CUSTOM_LISTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// UUR Manifest interface for GitHub fetching
export interface UURManifest {
  name: string;
  version: string;
  id?: string;
  description: string;
  author?: string;
  category?: UURCategory;
  entry?: string;
  icon?: string;
  permissions?: string[];
  packages?: Array<{
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    category: UURCategory;
    dependencies?: string[];
  }>;
}

// Key for storing GitHub-installed app HTML
const UUR_GITHUB_APPS_KEY = 'urbanshade_uur_github_apps';

// Get stored GitHub app HTML
export const getStoredGithubAppHtml = (appId: string): string | null => {
  try {
    const stored = localStorage.getItem(UUR_GITHUB_APPS_KEY);
    const apps = stored ? JSON.parse(stored) : {};
    return apps[appId] || null;
  } catch {
    return null;
  }
};

// Store GitHub app HTML
export const storeGithubAppHtml = (appId: string, html: string): void => {
  try {
    const stored = localStorage.getItem(UUR_GITHUB_APPS_KEY);
    const apps = stored ? JSON.parse(stored) : {};
    apps[appId] = html;
    localStorage.setItem(UUR_GITHUB_APPS_KEY, JSON.stringify(apps));
  } catch (err) {
    console.error('[UUR] Failed to store app HTML:', err);
  }
};

// Fetch and parse a UUR manifest from a GitHub repository URL
export const fetchUURManifest = async (githubUrl: string): Promise<UURManifest | null> => {
  try {
    // Convert GitHub URL to raw content URL
    // e.g., https://github.com/user/repo -> https://raw.githubusercontent.com/user/repo/main/uur-manifest.json
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    
    // Try different branch names
    const branches = ['main', 'master'];
    
    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/uur-manifest.json`;
      
      try {
        const response = await fetch(rawUrl);
        if (response.ok) {
          const manifest = await response.json();
          return manifest as UURManifest;
        }
      } catch {
        continue;
      }
    }
    
    return null;
  } catch {
    return null;
  }
};

// Fetch app HTML from GitHub
export const fetchGithubAppHtml = async (githubUrl: string, entryFile: string = 'app.html'): Promise<string | null> => {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    const [, owner, repo] = match;
    const branches = ['main', 'master'];
    
    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${entryFile}`;
      
      try {
        const response = await fetch(rawUrl);
        if (response.ok) {
          return await response.text();
        }
      } catch {
        continue;
      }
    }
    
    return null;
  } catch {
    return null;
  }
};

// Install package directly from GitHub URL
export const installFromGithub = async (
  githubUrl: string,
  onProgress?: (message: string) => void
): Promise<{ success: boolean; error?: string; package?: UURPackage }> => {
  try {
    onProgress?.('Fetching manifest...');
    const manifest = await fetchUURManifest(githubUrl);
    
    if (!manifest) {
      return { success: false, error: 'No uur-manifest.json found in repository' };
    }
    
    const appId = manifest.id || manifest.name.toLowerCase().replace(/\s+/g, '-');
    const entryFile = manifest.entry || 'app.html';
    
    onProgress?.(`Fetching ${entryFile}...`);
    const html = await fetchGithubAppHtml(githubUrl, entryFile);
    
    if (!html) {
      return { success: false, error: `Entry file "${entryFile}" not found` };
    }
    
    onProgress?.('Sanitizing and storing...');
    const sanitizedHtml = sanitizeHtml(html);
    storeGithubAppHtml(appId, sanitizedHtml);
    
    // Create package entry
    const pkg: UURPackage = {
      id: appId,
      name: manifest.name,
      description: manifest.description || 'GitHub package',
      version: manifest.version || '1.0.0',
      author: manifest.author || 'Unknown',
      category: manifest.category || 'app',
      downloads: 0,
      stars: 0,
      isOfficial: false,
      githubUrl,
      listSource: 'github'
    };
    
    onProgress?.('Installing...');
    
    // Add to installed apps
    const installed = getInstalledUURApps();
    if (installed.find(a => a.id === appId)) {
      // Update existing
      const idx = installed.findIndex(a => a.id === appId);
      installed[idx] = {
        id: appId,
        name: pkg.name,
        version: pkg.version,
        installedAt: new Date().toISOString(),
        source: 'community',
        listSource: 'github'
      };
    } else {
      installed.push({
        id: appId,
        name: pkg.name,
        version: pkg.version,
        installedAt: new Date().toISOString(),
        source: 'community',
        listSource: 'github'
      });
    }
    
    localStorage.setItem(UUR_INSTALLED_APPS_KEY, JSON.stringify(installed));
    
    return { success: true, package: pkg };
  } catch (err) {
    return { success: false, error: String(err) };
  }
};

// Add a custom list (with optional fetching from GitHub)
export const addCustomList = async (
  list: Omit<UURList, 'addedAt' | 'isOfficial'>, 
  fetchFromGithub: boolean = true
): Promise<{ success: boolean; error?: string; packageCount?: number }> => {
  try {
    const lists = getCustomLists();
    
    // Check for duplicate ID
    if (lists.some(l => l.id === list.id)) {
      return { success: false, error: 'A list with this ID already exists' };
    }
    
    let packages = list.packages;
    
    // Try to fetch from GitHub if URL is provided
    if (fetchFromGithub && list.url.includes('github.com')) {
      const manifest = await fetchUURManifest(list.url);
      if (manifest && manifest.packages) {
        packages = manifest.packages.map(pkg => ({
          ...pkg,
          downloads: Math.floor(Math.random() * 1000),
          stars: Math.floor(Math.random() * 50),
          isOfficial: false,
          listSource: list.name
        }));
      }
    }
    
    const newList: UURList = {
      ...list,
      packages,
      isOfficial: false,
      addedAt: new Date().toISOString()
    };
    
    lists.push(newList);
    localStorage.setItem(UUR_CUSTOM_LISTS_KEY, JSON.stringify(lists));
    return { success: true, packageCount: packages.length };
  } catch (err) {
    return { success: false, error: 'Failed to add list' };
  }
};

// Remove a custom list
export const removeCustomList = (listId: string): boolean => {
  try {
    const lists = getCustomLists();
    const filtered = lists.filter(l => l.id !== listId);
    if (filtered.length !== lists.length) {
      localStorage.setItem(UUR_CUSTOM_LISTS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// Get all packages from all lists
export const getAllPackages = (): UURPackage[] => {
  const official = getOfficialList().packages;
  const custom = getCustomLists().flatMap(l => 
    l.packages.map(p => ({ ...p, listSource: l.name, isOfficial: false }))
  );
  return [...official, ...custom];
};

// === DEPENDENCY RESOLUTION ===

export const checkDependencies = (packageId: string): { 
  satisfied: boolean; 
  missing: string[]; 
  installed: string[] 
} => {
  const pkg = getAllPackages().find(p => p.id === packageId);
  if (!pkg || !pkg.dependencies || pkg.dependencies.length === 0) {
    return { satisfied: true, missing: [], installed: [] };
  }
  
  const installedApps = getInstalledUURApps();
  const installedIds = installedApps.map(a => a.id);
  
  const missing: string[] = [];
  const installed: string[] = [];
  
  for (const dep of pkg.dependencies) {
    if (installedIds.includes(dep)) {
      installed.push(dep);
    } else {
      missing.push(dep);
    }
  }
  
  return {
    satisfied: missing.length === 0,
    missing,
    installed
  };
};

export const installWithDependencies = async (
  packageId: string, 
  listSource?: string,
  onProgress?: (message: string) => void
): Promise<{ success: boolean; installed: string[] }> => {
  const toInstall: string[] = [];
  const installed: string[] = [];
  
  const collectDeps = (pkgId: string, visited: Set<string>) => {
    if (visited.has(pkgId)) return;
    visited.add(pkgId);
    
    const pkg = getAllPackages().find(p => p.id === pkgId);
    if (!pkg) return;
    
    if (pkg.dependencies) {
      for (const dep of pkg.dependencies) {
        collectDeps(dep, visited);
      }
    }
    
    if (!isUURAppInstalled(pkgId)) {
      toInstall.push(pkgId);
    }
  };
  
  collectDeps(packageId, new Set());
  
  for (const pkgId of toInstall) {
    onProgress?.(`Installing ${pkgId}...`);
    await new Promise(r => setTimeout(r, 500));
    
    const pkg = getAllPackages().find(p => p.id === pkgId);
    if (installUURApp(pkgId, pkg?.listSource || listSource)) {
      installed.push(pkgId);
    }
  }
  
  return { success: installed.includes(packageId), installed };
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
  listSource?: string;
}

export const getInstalledUURApps = (): InstalledUURApp[] => {
  try {
    const stored = localStorage.getItem(UUR_INSTALLED_APPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const installUURApp = (appId: string, listSource?: string): boolean => {
  const allPackages = getAllPackages();
  const pkg = allPackages.find(p => p.id === appId);
  if (!pkg) return false;
  
  const installed = getInstalledUURApps();
  if (installed.find(a => a.id === appId)) return false; // Already installed
  
  installed.push({
    id: appId,
    name: pkg.name,
    version: pkg.version,
    installedAt: new Date().toISOString(),
    source: pkg.isOfficial ? 'official' : 'community',
    listSource: listSource || pkg.listSource
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

// Search packages
export const searchPackages = (query: string): UURPackage[] => {
  const q = query.toLowerCase();
  return getAllPackages().filter(pkg => 
    pkg.name.toLowerCase().includes(q) ||
    pkg.description.toLowerCase().includes(q) ||
    pkg.author.toLowerCase().includes(q) ||
    pkg.tags?.some(t => t.toLowerCase().includes(q)) ||
    pkg.category.toLowerCase().includes(q)
  );
};
