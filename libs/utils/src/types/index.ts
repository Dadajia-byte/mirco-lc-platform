/**
 * 存储类型
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * 存储配置
 */
export interface StorageConfig {
  prefix?: string;
  expire?: number; // 过期时间（毫秒）
}

/**
 * 存储项
 */
export interface StorageItem<T = any> {
  value: T;
  expire?: number; // 过期时间戳
}