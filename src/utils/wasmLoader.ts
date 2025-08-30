/**
 * WASM模块动态加载器 - 支持懒加载和缓存
 */

import type { 
  Options as CompressionOptions,
  compress_to_bytes,
  decompress_from_bytes
} from 'json-packer-wasm';

interface WasmModule {
  Options: typeof CompressionOptions;
  compress_to_bytes: typeof compress_to_bytes;
  decompress_from_bytes: typeof decompress_from_bytes;
  default: () => Promise<unknown>;
}

class WasmLoader {
  private static instance: WasmLoader;
  private wasmModule: WasmModule | null = null;
  private loadingPromise: Promise<WasmModule> | null = null;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): WasmLoader {
    if (!WasmLoader.instance) {
      WasmLoader.instance = new WasmLoader();
    }
    return WasmLoader.instance;
  }

  /**
   * 动态加载WASM模块
   * @returns Promise<WasmModule> WASM模块实例
   */
  async loadWasm(): Promise<WasmModule> {
    // 如果已加载，直接返回
    if (this.wasmModule) {
      return this.wasmModule;
    }

    // 如果正在加载，等待加载完成
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // 开始加载
    this.loadingPromise = this.performLoad();
    return this.loadingPromise;
  }

  private async performLoad(): Promise<WasmModule> {
    try {
      console.log('开始加载 JSON Packer WASM 模块...');
      
      // 动态导入模块
      let wasmModule;
      try {
        wasmModule = await import('json-packer-wasm');
        console.log('WASM模块导入成功，模块对象:', wasmModule);
      } catch (importError) {
        console.error('动态导入失败:', importError);
        throw new Error(`模块导入失败: ${importError instanceof Error ? importError.message : '未知错误'}`);
      }
      
      // 检查模块是否包含必要的函数
      if (!wasmModule.default || typeof wasmModule.default !== 'function') {
        throw new Error('WASM模块格式不正确，缺少default初始化函数');
      }
      
      // 初始化WASM
      if (!this.initPromise) {
        console.log('开始初始化WASM...');
        try {
          this.initPromise = wasmModule.default().then(() => {
            console.log('WASM初始化完成');
          });
        } catch (initError) {
          console.error('WASM初始化失败:', initError);
          throw new Error(`WASM初始化失败: ${initError instanceof Error ? initError.message : '未知错误'}`);
        }
      }
      await this.initPromise;
      
      // 缓存模块
      this.wasmModule = wasmModule as WasmModule;
      
      console.log('JSON Packer WASM 模块加载完成');
      return this.wasmModule;
      
    } catch (error) {
      console.error('WASM模块加载失败:', error);
      // 重置状态，允许重试
      this.loadingPromise = null;
      this.initPromise = null;
      
      // 提供更详细的错误信息
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new Error(`压缩模块加载失败: ${errorMessage}`);
    }
  }

  /**
   * 检查WASM模块是否已加载
   */
  isLoaded(): boolean {
    return this.wasmModule !== null;
  }

  /**
   * 获取已加载的模块（同步）
   * @throws Error 如果模块未加载
   */
  getModule(): WasmModule {
    if (!this.wasmModule) {
      throw new Error('WASM模块未加载，请先调用loadWasm()');
    }
    return this.wasmModule;
  }

  /**
   * 重置加载状态（用于错误恢复）
   */
  reset(): void {
    this.wasmModule = null;
    this.loadingPromise = null;
    this.initPromise = null;
  }
}

// 导出单例实例
export const wasmLoader = WasmLoader.getInstance();

// 便捷的压缩选项创建函数
export function createCompressionOptions(
  enableValuePool: boolean = true,
  poolMinRepeats: number = 2,
  poolMinStringLen: number = 6
): CompressionOptions {
  const module = wasmLoader.getModule();
  return new module.Options(enableValuePool, poolMinRepeats, poolMinStringLen);
}
