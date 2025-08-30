/**
 * 数据导入导出工具
 */

import { AppStateV2 } from '@/types/app-state';
import { loadAppData, prepareExportData } from '@/utils/versionManager';
import { wasmLoader, createCompressionOptions } from '@/utils/wasmLoader';

/**
 * 导出数据为JSON文件
 * @param appState 要导出的应用状态
 * @param filename 文件名
 */
export function exportDataAsJson(appState: AppStateV2, filename: string): void {
  try {
    const exportData = prepareExportData(appState);
    const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
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

/**
 * 导出数据为二进制压缩文件 (.kbz)
 * @param appState 要导出的应用状态
 * @param filename 文件名（建议使用 .kbz 扩展名）
 * @returns Promise<void>
 */
export async function exportDataAsCompressed(appState: AppStateV2, filename: string): Promise<void> {
  try {
    // 动态加载WASM模块
    const wasmModule = await wasmLoader.loadWasm();
    
    // 准备导出数据
    const exportData = prepareExportData(appState);
    const jsonString = JSON.stringify(exportData);
    
    // 创建压缩选项
    // 启用值池：重复2次以上且长度>=6的字符串会被压缩
    const options = createCompressionOptions(true, 2, 6);
    
    // 压缩为二进制数据
    const compressedBytes = wasmModule.compress_to_bytes(jsonString, options);
    
    // 创建二进制Blob并下载
    // 创建新的ArrayBuffer并复制数据，确保与Blob API的兼容性
    // 这样避免了SharedArrayBuffer的兼容性问题
    const arrayBuffer = new ArrayBuffer(compressedBytes.length);
    const view = new Uint8Array(arrayBuffer);
    view.set(compressedBytes);
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    // 触发下载
    if (typeof a.click === 'function') {
      a.click();
    } else {
      // 兼容性备用方案
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      a.dispatchEvent(evt);
    }
    
    // 延迟清理
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    // 记录压缩效果
    const originalSize = new TextEncoder().encode(jsonString).length;
    const compressedSize = compressedBytes.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`压缩完成: ${originalSize} bytes → ${compressedSize} bytes (节省 ${compressionRatio}%)`);
    
  } catch (error) {
    console.error('压缩导出失败:', error);
    throw new Error('压缩导出失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
}

/**
 * 从二进制压缩文件导入数据 (.kbz)
 * @param file 要导入的二进制压缩文件
 * @returns Promise<AppStateV2> 返回迁移后的 AppStateV2 数据
 */
export async function importDataFromCompressed(file: File): Promise<AppStateV2> {
  try {
    if (!file) {
      throw new Error('未选择文件');
    }
    
    // 动态加载WASM模块
    const wasmModule = await wasmLoader.loadWasm();
    
    // 读取文件为二进制数据
    const arrayBuffer = await file.arrayBuffer();
    const compressedBytes = new Uint8Array(arrayBuffer);
    
    // 解压缩
    const decompressedJson = wasmModule.decompress_from_bytes(compressedBytes);
    const parsedData = JSON.parse(decompressedJson);
    
    // 处理完整的导出格式（包含 version, exportedAt, data）
    let dataToMigrate = parsedData;
    if (parsedData.data) {
      dataToMigrate = parsedData.data;
    }
    
    // 使用版本管理器处理数据迁移
    const migratedData = loadAppData(dataToMigrate);
    
    // 记录解压效果
    const compressedSize = compressedBytes.length;
    const decompressedSize = new TextEncoder().encode(decompressedJson).length;
    const compressionRatio = ((decompressedSize - compressedSize) / decompressedSize * 100).toFixed(1);
    
    console.log(`解压完成: ${compressedSize} bytes → ${decompressedSize} bytes (压缩率 ${compressionRatio}%)`);
    
    return migratedData;
    
  } catch (error) {
    console.error('压缩文件解析失败:', error);
    throw new Error('压缩文件解析失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
}

/**
 * 检测文件类型并选择合适的导入方法
 * @param file 要导入的文件
 * @returns Promise<AppStateV2> 返回迁移后的 AppStateV2 数据
 */
export async function importDataFromFile(file: File): Promise<AppStateV2> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.kbz')) {
    // 压缩格式
    return importDataFromCompressed(file);
  } else if (fileName.endsWith('.json')) {
    // JSON格式
    return importDataFromJson(file);
  } else {
    // 尝试按JSON格式解析
    try {
      return await importDataFromJson(file);
    } catch {
      // JSON解析失败，尝试压缩格式
      try {
        return await importDataFromCompressed(file);
      } catch {
        throw new Error(`不支持的文件格式。请选择 .json 或 .kbz 文件`);
      }
    }
  }
}