import { useState, useEffect, useCallback } from 'react';

export interface BiosSettings {
  // Boot settings
  fastBoot: boolean;
  bootLogo: boolean;
  secureBoot: boolean;
  bootTimeout: number;
  bootOrder: string[];
  
  // Advanced settings
  hyperThreading: boolean;
  virtualization: boolean;
  turboBoost: boolean;
  cStates: boolean;
  sataMode: 'ahci' | 'raid' | 'ide';
  pcieLinkSpeed: 'auto' | 'gen3' | 'gen4' | 'gen5';
  iommu: boolean;
  
  // Security settings
  tpmEnabled: boolean;
  adminPassword: string | null;
  bootPassword: string | null;
}

const DEFAULT_SETTINGS: BiosSettings = {
  fastBoot: false,
  bootLogo: true,
  secureBoot: true,
  bootTimeout: 3,
  bootOrder: ['hdd', 'usb', 'network'],
  hyperThreading: true,
  virtualization: true,
  turboBoost: true,
  cStates: true,
  sataMode: 'ahci',
  pcieLinkSpeed: 'gen4',
  iommu: true,
  tpmEnabled: true,
  adminPassword: null,
  bootPassword: null,
};

const STORAGE_KEY = 'bios_settings';

export const useBiosSettings = () => {
  const [settings, setSettings] = useState<BiosSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_SETTINGS;
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Persist settings on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Also store in session for boot sequence access
    sessionStorage.setItem('fast_boot_enabled', String(settings.fastBoot));
    sessionStorage.setItem('boot_timeout', String(settings.bootTimeout));
    sessionStorage.setItem('boot_logo_enabled', String(settings.bootLogo));
    sessionStorage.setItem('boot_order', JSON.stringify(settings.bootOrder));
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof BiosSettings>(
    key: K,
    value: BiosSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const toggleSetting = useCallback((key: keyof BiosSettings) => {
    setSettings(prev => {
      const current = prev[key];
      if (typeof current === 'boolean') {
        return { ...prev, [key]: !current };
      }
      return prev;
    });
    setHasChanges(true);
  }, []);

  const setBootOrder = useCallback((order: string[]) => {
    setSettings(prev => ({ ...prev, bootOrder: order }));
    setHasChanges(true);
  }, []);

  const loadDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  }, []);

  const saveChanges = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
  }, [settings]);

  const setAdminPassword = useCallback((password: string | null) => {
    setSettings(prev => ({ ...prev, adminPassword: password }));
    setHasChanges(true);
  }, []);

  const setBootPassword = useCallback((password: string | null) => {
    setSettings(prev => ({ ...prev, bootPassword: password }));
    setHasChanges(true);
  }, []);

  const verifyAdminPassword = useCallback((password: string): boolean => {
    return settings.adminPassword === password;
  }, [settings.adminPassword]);

  const verifyBootPassword = useCallback((password: string): boolean => {
    return settings.bootPassword === password;
  }, [settings.bootPassword]);

  return {
    settings,
    hasChanges,
    updateSetting,
    toggleSetting,
    setBootOrder,
    loadDefaults,
    saveChanges,
    setAdminPassword,
    setBootPassword,
    verifyAdminPassword,
    verifyBootPassword,
    DEFAULT_SETTINGS,
  };
};

// Static utility for external access without hook
export const getBiosSettings = (): BiosSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
};

// Export BIOS config to JSON string
export const exportBiosConfig = (): string => {
  const settings = getBiosSettings();
  // Don't export passwords for security
  const exportable = {
    ...settings,
    adminPassword: null,
    bootPassword: null,
    exportedAt: new Date().toISOString(),
    version: '2.9.0'
  };
  return JSON.stringify(exportable, null, 2);
};

// Import BIOS config from JSON string
export const importBiosConfig = (jsonString: string): { success: boolean; error?: string } => {
  try {
    const imported = JSON.parse(jsonString);
    
    // Validate it has expected fields
    if (typeof imported.fastBoot !== 'boolean' || 
        typeof imported.bootLogo !== 'boolean' ||
        !Array.isArray(imported.bootOrder)) {
      return { success: false, error: 'Invalid configuration format' };
    }
    
    // Merge with defaults (don't import passwords)
    const newSettings: BiosSettings = {
      ...DEFAULT_SETTINGS,
      fastBoot: imported.fastBoot,
      bootLogo: imported.bootLogo,
      secureBoot: imported.secureBoot ?? DEFAULT_SETTINGS.secureBoot,
      bootTimeout: imported.bootTimeout ?? DEFAULT_SETTINGS.bootTimeout,
      bootOrder: imported.bootOrder,
      hyperThreading: imported.hyperThreading ?? DEFAULT_SETTINGS.hyperThreading,
      virtualization: imported.virtualization ?? DEFAULT_SETTINGS.virtualization,
      turboBoost: imported.turboBoost ?? DEFAULT_SETTINGS.turboBoost,
      cStates: imported.cStates ?? DEFAULT_SETTINGS.cStates,
      sataMode: imported.sataMode ?? DEFAULT_SETTINGS.sataMode,
      pcieLinkSpeed: imported.pcieLinkSpeed ?? DEFAULT_SETTINGS.pcieLinkSpeed,
      iommu: imported.iommu ?? DEFAULT_SETTINGS.iommu,
      tpmEnabled: imported.tpmEnabled ?? DEFAULT_SETTINGS.tpmEnabled,
      adminPassword: null, // Never import passwords
      bootPassword: null,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Failed to parse configuration file' };
  }
};

// Check if boot password is required
export const requiresBootPassword = (): boolean => {
  const settings = getBiosSettings();
  return settings.bootPassword !== null;
};

// Check if admin password is required for BIOS
export const requiresAdminPassword = (): boolean => {
  const settings = getBiosSettings();
  return settings.adminPassword !== null;
};

// Verify boot password
export const verifyBootPassword = (password: string): boolean => {
  const settings = getBiosSettings();
  return settings.bootPassword === password;
};

// Verify admin password
export const verifyAdminPassword = (password: string): boolean => {
  const settings = getBiosSettings();
  return settings.adminPassword === password;
};
