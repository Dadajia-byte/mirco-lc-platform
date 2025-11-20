import { StorageType, StorageConfig, StorageItem } from '../types';

/**
 * 统一存储接口
 */
class Storage {
  private storage: globalThis.Storage;
  private config: Required<StorageConfig>;

  constructor(type: StorageType = 'localStorage', config: StorageConfig = {}) {
    this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
    this.config = {
      prefix: config.prefix || '',
      expire: config.expire || 0,
    };
  }

  private getKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}_${key}` : key;
  }

  /**
   * 设置值
   */
  set<T>(key: string, value: T, expire?: number): void {
    const item: StorageItem<T> = {
      value,
      expire: expire ? Date.now() + expire : undefined,
    };
    try {
      this.storage.setItem(this.getKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  /**
   * 获取值
   */
  get<T>(key: string): T | null {
    try {
      const itemStr = this.storage.getItem(this.getKey(key));
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);

      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  /**
   * 删除值
   */
  remove(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * 清空所有
   */
  clear(): void {
    if (this.config.prefix) {
      // 只清空带前缀的项
      const keys = Object.keys(this.storage);
      keys.forEach(key => {
        if (key.startsWith(`${this.config.prefix}_`)) {
          this.storage.removeItem(key);
        }
      });
    } else {
      this.storage.clear();
    }
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    if (this.config.prefix) {
      return Object.keys(this.storage)
        .filter(key => key.startsWith(`${this.config.prefix}_`))
        .map(key => key.replace(`${this.config.prefix}_`, ''));
    }
    return Object.keys(this.storage);
  }
}

export default Storage;