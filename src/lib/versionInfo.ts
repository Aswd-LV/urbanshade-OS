// Unified version management for UrbanShade OS
import versionData from './version.json';

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  codename: string;
  build: number;
  fullVersion: string;
  displayVersion: string;
  shortVersion: string;
  releaseDate: string;
}

export const VERSION: VersionInfo = versionData as VersionInfo;

// Helper functions
export const getVersionString = () => VERSION.displayVersion;
export const getFullVersion = () => VERSION.fullVersion;
export const getShortVersion = () => VERSION.shortVersion;
export const getCodename = () => VERSION.codename;
export const getBuildNumber = () => VERSION.build;

// For changelog compatibility - returns just the major.minor
export const getCurrentVersion = () => VERSION.shortVersion;

// Check if version is newer
export const isNewerVersion = (lastSeen: string): boolean => {
  if (!lastSeen) return true;
  const [lastMajor, lastMinor, lastPatch] = lastSeen.split('.').map(Number);
  const current = [VERSION.major, VERSION.minor, VERSION.patch];
  
  if (current[0] > (lastMajor || 0)) return true;
  if (current[0] === lastMajor && current[1] > (lastMinor || 0)) return true;
  if (current[0] === lastMajor && current[1] === lastMinor && current[2] > (lastPatch || 0)) return true;
  
  return false;
};
