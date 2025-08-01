import { AppStateV2 } from '@/types';
import { loadAppData, createDefaultAppState } from '@/utils/versionManager';

const STORAGE_KEY = 'known-board-data';

/**
 * 从 localStorage 加载数据，自动处理版本检测和迁移
 */
export const loadFromStorage = (): AppStateV2 => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const rawData = JSON.parse(stored);
      const migratedData = loadAppData(rawData);
      
      // 如果数据被迁移了，立即保存新格式
      if (rawData.version !== '2.0') {
        console.log('数据已迁移，正在保存新格式到 localStorage');
        saveToStorage(migratedData);
      }
      
      return migratedData;
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  }
  
  return createDefaultAppState();
};

/**
 * 保存数据到 localStorage (始终保存为 2.0 格式)
 */
export const saveToStorage = (state: AppStateV2): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

/**
 * 清除 localStorage 中的数据
 */
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};