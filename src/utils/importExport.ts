/**
 * 数据导入导出工具
 */

/**
 * 导出数据为JSON文件
 * @param data 要导出的数据
 * @param filename 文件名
 */
export function exportDataAsJson(data: any, filename: string): void {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
 * 从文件导入JSON数据
 * @param file 要导入的文件
 * @returns Promise 返回解析后的数据
 */
export function importDataFromJson(file: File): Promise<any> {
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
        resolve(parsedData);
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