import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface PerformanceConfig {
  enableAnimations: boolean;
  enableParticles: boolean;
  lowPowerMode: boolean;
}

export function usePerformance() {
  const [config, setConfig] = useLocalStorage<PerformanceConfig>('performance-config', {
    enableAnimations: true,
    enableParticles: true,
    lowPowerMode: false
  });

  const checkDeviceCapabilities = useCallback(() => {
    const memory = (navigator as any).deviceMemory;
    const connection = (navigator as any).connection?.effectiveType;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (
      (memory && memory < 4) ||
      (connection && (connection === '2g' || connection === 'slow-2g')) ||
      (isMobile && !matchMedia('(min-width: 768px)').matches)
    ) {
      setConfig({
        enableAnimations: false,
        enableParticles: false,
        lowPowerMode: true
      });
    }
  }, [setConfig]);

  useEffect(() => {
    checkDeviceCapabilities();
  }, [checkDeviceCapabilities]);

  const updateConfig = (newConfig: Partial<PerformanceConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return {
    config,
    updateConfig
  };
}

