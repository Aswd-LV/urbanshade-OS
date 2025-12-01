import { useEffect } from 'react';

export const useBiosSettings = () => {
  useEffect(() => {
    // Apply BIOS settings on boot
    const fastBoot = localStorage.getItem('bios_fast_boot') === 'true';
    const bootOrder = localStorage.getItem('bios_boot_order') || 'hdd';
    const securityLevel = localStorage.getItem('bios_security_level') || 'standard';

    // Store in session for boot sequence access
    sessionStorage.setItem('fast_boot_enabled', String(fastBoot));
    sessionStorage.setItem('boot_order', bootOrder);
    sessionStorage.setItem('security_level', securityLevel);
  }, []);

  return {
    getFastBoot: () => localStorage.getItem('bios_fast_boot') === 'true',
    getBootOrder: () => localStorage.getItem('bios_boot_order') || 'hdd',
    getSecurityLevel: () => localStorage.getItem('bios_security_level') || 'standard',
  };
};
