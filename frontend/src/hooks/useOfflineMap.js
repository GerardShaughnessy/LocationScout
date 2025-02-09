import { useState, useEffect } from 'react';
import localforage from 'localforage';

export const useOfflineMap = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineData, setOfflineData] = useState(null);

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const saveMapData = async (data) => {
    try {
      await localforage.setItem('mapData', data);
    } catch (error) {
      console.error('Error saving map data:', error);
    }
  };

  const loadMapData = async () => {
    try {
      const data = await localforage.getItem('mapData');
      setOfflineData(data);
      return data;
    } catch (error) {
      console.error('Error loading map data:', error);
      return null;
    }
  };

  return { isOffline, offlineData, saveMapData, loadMapData };
}; 