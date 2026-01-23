import { useState, useEffect, useCallback } from "react";
import { saveState, loadState } from "@/lib/persistence";

export interface IPCamera {
  id: string;
  name: string;
  url: string;
  protocol: 'mjpeg' | 'hls' | 'image' | 'simulated';
  username?: string;
  password?: string;
  zone: string;
  status: 'online' | 'offline' | 'connecting';
  thumbnail?: string;
  refreshInterval?: number; // For image protocol, in seconds
  createdAt: number;
}

const STORAGE_KEY = 'ip_cameras';

export const useIPCameras = () => {
  const [cameras, setCameras] = useState<IPCamera[]>(() => 
    loadState<IPCamera[]>(STORAGE_KEY, [])
  );
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  // Save to localStorage whenever cameras change
  useEffect(() => {
    saveState(STORAGE_KEY, cameras);
  }, [cameras]);

  // Set first camera as selected if none selected
  useEffect(() => {
    if (cameras.length > 0 && !selectedCameraId) {
      setSelectedCameraId(cameras[0].id);
    }
  }, [cameras, selectedCameraId]);

  const addCamera = useCallback((camera: Omit<IPCamera, 'id' | 'createdAt' | 'status'>) => {
    const newCamera: IPCamera = {
      ...camera,
      id: `cam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'connecting',
      createdAt: Date.now(),
    };
    setCameras(prev => [...prev, newCamera]);
    return newCamera;
  }, []);

  const updateCamera = useCallback((id: string, updates: Partial<IPCamera>) => {
    setCameras(prev => prev.map(cam => 
      cam.id === id ? { ...cam, ...updates } : cam
    ));
  }, []);

  const removeCamera = useCallback((id: string) => {
    setCameras(prev => prev.filter(cam => cam.id !== id));
    if (selectedCameraId === id) {
      setSelectedCameraId(null);
    }
  }, [selectedCameraId]);

  const testConnection = useCallback(async (url: string, protocol: IPCamera['protocol']): Promise<boolean> => {
    // For simulated cameras, always return true
    if (protocol === 'simulated') return true;

    try {
      // For MJPEG and image protocols, try to load the image
      if (protocol === 'mjpeg' || protocol === 'image') {
        return new Promise((resolve) => {
          const img = new Image();
          const timeout = setTimeout(() => {
            img.src = '';
            resolve(false);
          }, 5000);

          img.onload = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
          };
          img.src = url;
        });
      }

      // For HLS, we'd need to check if the manifest is accessible
      // This is a simplified check
      if (protocol === 'hls') {
        const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        return true; // If no CORS error, assume it's accessible
      }

      return false;
    } catch {
      return false;
    }
  }, []);

  const setStatus = useCallback((id: string, status: IPCamera['status']) => {
    updateCamera(id, { status });
  }, [updateCamera]);

  const selectedCamera = cameras.find(c => c.id === selectedCameraId) || null;

  return {
    cameras,
    selectedCamera,
    selectedCameraId,
    setSelectedCameraId,
    addCamera,
    updateCamera,
    removeCamera,
    testConnection,
    setStatus,
  };
};
