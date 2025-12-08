import { useEffect, useRef, useCallback } from 'react';
import { commandQueue } from '@/lib/commandQueue';

interface UseAutoBugcheckProps {
  triggerBugcheck: (code: string, description: string, location?: string, stackTrace?: string) => void;
}

export const useAutoBugcheck = ({ triggerBugcheck }: UseAutoBugcheckProps) => {
  const renderCountRef = useRef<Map<string, { count: number; lastTime: number }>>(new Map());
  const storageCheckRef = useRef<number>(0);

  // Check for storage quota exceeded
  const checkStorageQuota = useCallback(() => {
    try {
      const testKey = '__storage_test__';
      const testData = 'x'.repeat(1024 * 1024); // 1MB test
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
    } catch (e) {
      if (e instanceof Error && (e.name === 'QuotaExceededError' || e.message.includes('quota'))) {
        triggerBugcheck(
          'STORAGE_QUOTA_EXCEEDED',
          'LocalStorage quota has been exceeded. System data may be lost.',
          'localStorage',
          `Storage size: ~${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB`
        );
      }
    }
  }, [triggerBugcheck]);

  // Detect rapid re-renders (potential infinite loop)
  const detectRapidRerenders = useCallback((componentId: string) => {
    const now = Date.now();
    const data = renderCountRef.current.get(componentId) || { count: 0, lastTime: now };
    
    // If more than 50 renders in 1 second, likely infinite loop
    if (now - data.lastTime < 1000) {
      data.count++;
      if (data.count > 50) {
        triggerBugcheck(
          'INFINITE_LOOP_DETECTED',
          `Component "${componentId}" is re-rendering excessively (${data.count} times in 1 second)`,
          componentId,
          'This may indicate an infinite loop or improper state management'
        );
        data.count = 0; // Reset to avoid spam
      }
    } else {
      data.count = 1;
      data.lastTime = now;
    }
    
    renderCountRef.current.set(componentId, data);
  }, [triggerBugcheck]);

  // Monitor for critical errors
  useEffect(() => {
    // Check storage on mount
    checkStorageQuota();
    
    // Periodic storage check every 30 seconds
    const storageInterval = setInterval(checkStorageQuota, 30000);

    // Listen for unhandled errors
    const handleError = (event: ErrorEvent) => {
      // Only trigger bugcheck for critical errors
      const criticalPatterns = [
        /maximum call stack/i,
        /out of memory/i,
        /cannot read.*null/i,
        /cannot read.*undefined/i,
        /is not a function/i,
      ];

      const isCritical = criticalPatterns.some(p => p.test(event.message));
      
      if (isCritical && !commandQueue.areBugchecksDisabled()) {
        triggerBugcheck(
          'UNHANDLED_EXCEPTION',
          event.message,
          `${event.filename}:${event.lineno}:${event.colno}`,
          event.error?.stack
        );
      }
    };

    // Listen for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason);
      const criticalPatterns = [
        /network error/i,
        /failed to fetch/i,
        /abort/i,
      ];

      const isCritical = criticalPatterns.some(p => p.test(reason));
      
      if (isCritical && !commandQueue.areBugchecksDisabled()) {
        triggerBugcheck(
          'ASYNC_FAILURE',
          `Unhandled promise rejection: ${reason}`,
          'async operation'
        );
      }
    };

    // Monitor for memory pressure (if available)
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usedRatio > 0.9) {
          triggerBugcheck(
            'MEMORY_PRESSURE',
            `JavaScript heap usage is at ${(usedRatio * 100).toFixed(1)}%`,
            'memory',
            `Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB / ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(1)} MB`
          );
        }
      }
    };

    // Check memory every minute
    const memoryInterval = setInterval(checkMemory, 60000);

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      clearInterval(storageInterval);
      clearInterval(memoryInterval);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [checkStorageQuota, triggerBugcheck]);

  return {
    detectRapidRerenders,
    checkStorageQuota
  };
};
