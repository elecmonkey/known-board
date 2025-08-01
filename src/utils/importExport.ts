/**
 * 数据导入导出工具
 */

import { AppStateV2 } from '@/types/app-state';
import { loadAppData, prepareExportData } from '@/utils/versionManager';

/**
 * 导出数据为JSON文件
 * @param appState 要导出的应用状态
 * @param filename 文件名
 */
export function exportDataAsJson(appState: AppStateV2, filename: string): void {
  try {
    const exportData = prepareExportData(appState);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    // 尝试点击
    if (typeof a.click === 'function') {
      a.click();
    } else {
      // 兼容性备用方案
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
    
    // 延迟清理，确保下载触发
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('导出失败:', error);
    throw new Error('导出失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
}

/**
 * 从文件导入JSON数据并自动处理版本迁移
 * @param file 要导入的文件
 * @returns Promise 返回迁移后的 AppStateV2 数据
 */
export function importDataFromJson(file: File): Promise<AppStateV2> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('未选择文件'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // 处理完整的导出格式（包含 version, exportedAt, data）
        let dataToMigrate = parsedData;
        if (parsedData.data) {
          dataToMigrate = parsedData.data;
        }
        
        // 使用版本管理器处理数据迁移
        const migratedData = loadAppData(dataToMigrate);
        resolve(migratedData);
        
      } catch (error) {
        reject(new Error('文件解析失败: ' + (error instanceof Error ? error.message : '未知错误')));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };
    
    reader.readAsText(file);
  });
}