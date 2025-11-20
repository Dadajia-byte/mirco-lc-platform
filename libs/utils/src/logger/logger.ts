/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4, // 禁用所有日志
}

/**
 * Console 配置选项
 */
export interface ConsoleConfig {
  // 是否启用日志
  enabled?: boolean;
  // 日志级别阈值（只输出大于等于该级别的日志）
  level?: LogLevel;
  // 是否显示时间戳
  showTimestamp?: boolean;
  // 是否显示日志级别标签
  showLevel?: boolean;
  // 自定义前缀
  prefix?: string;
  // 日志收集器（可选）
  collector?: (level: LogLevel, ...args: any[]) => void;
}

/**
 * 优化的 Console 工具类
 * 支持日志级别管理、格式化输出、日志收集等功能
 */
class Console {
  private static instance: Console;
  private config: Required<ConsoleConfig> = {
    enabled: process.env.NODE_ENV === 'development',
    level: LogLevel.DEBUG,
    showTimestamp: false,
    showLevel: true,
    prefix: '',
    collector: () => { return; },
  };

  private constructor() {
    // 私有构造函数，防止外部实例化
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): Console {
    if (!Console.instance) {
      Console.instance = new Console();
    }
    return Console.instance;
  }

  /**
   * 配置 Console
   */
  public configure(config: Partial<ConsoleConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 获取当前配置
   */
  public getConfig(): Readonly<Required<ConsoleConfig>> {
    return { ...this.config };
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, ...args: any[]): any[] {
    const parts: any[] = [];

    // 添加前缀
    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }

    // 添加时间戳
    if (this.config.showTimestamp) {
      const timestamp = new Date().toISOString();
      parts.push(`[${timestamp}]`);
    }

    // 添加日志级别标签
    if (this.config.showLevel) {
      const levelLabels = {
        [LogLevel.DEBUG]: '🔍 DEBUG',
        [LogLevel.INFO]: 'ℹ️  INFO',
        [LogLevel.WARN]: '⚠️  WARN',
        [LogLevel.ERROR]: '❌ ERROR',
      };
      parts.push(levelLabels[level as keyof typeof levelLabels] || 'LOG');
    }

    // 添加原始参数
    return [...parts, ...args];
  }

  /**
   * 核心日志输出方法
   */
  private output(
    level: LogLevel,
    consoleMethod: (...args: any[]) => void,
    ...args: any[]
  ): void {
    // 检查是否启用
    if (!this.config.enabled) {
      return;
    }

    // 检查日志级别
    if (level < this.config.level) {
      return;
    }

    // 格式化消息
    const formattedArgs = this.formatMessage(level, ...args);

    // 输出到控制台
    consoleMethod(...formattedArgs);

    // 收集日志（如果配置了收集器）
    if (this.config.collector) {
      try {
        this.config.collector(level, ...args);
      } catch (error) {
        // 收集器错误不应影响正常日志输出
        console.error('Logger collector error:', error);
      }
    }
  }

  /**
   * Debug 日志
   */
  public debug(...args: any[]): void {
    this.output(LogLevel.DEBUG, console.debug, ...args);
  }

  /**
   * Info 日志
   */
  public info(...args: any[]): void {
    this.output(LogLevel.INFO, console.info, ...args);
  }

  /**
   * Log 日志（兼容原有 API）
   */
  public log(...args: any[]): void {
    this.output(LogLevel.INFO, console.log, ...args);
  }

  /**
   * Warn 日志
   */
  public warn(...args: any[]): void {
    this.output(LogLevel.WARN, console.warn, ...args);
  }

  /**
   * Error 日志
   */
  public error(...args: any[]): void {
    this.output(LogLevel.ERROR, console.error, ...args);
  }

  /**
   * 分组日志（开始）
   */
  public group(label?: string): void {
    if (this.config.enabled && this.config.level <= LogLevel.DEBUG) {
      console.group(label);
    }
  }

  /**
   * 分组日志（结束）
   */
  public groupEnd(): void {
    if (this.config.enabled && this.config.level <= LogLevel.DEBUG) {
      console.groupEnd();
    }
  }

  /**
   * 分组日志（折叠）
   */
  public groupCollapsed(label?: string): void {
    if (this.config.enabled && this.config.level <= LogLevel.DEBUG) {
      console.groupCollapsed(label);
    }
  }

  /**
   * 表格输出
   */
  public table(data: any): void {
    if (this.config.enabled && this.config.level <= LogLevel.DEBUG) {
      console.table(data);
    }
  }

  /**
   * 计时开始
   */
  public time(label?: string): void {
    if (this.config.enabled && this.config.level <= LogLevel.DEBUG) {
      console.time(label);
    }
  }

  /**
   * 计时结束
   */
  public timeEnd(label?: string): void {
    if (this.config.enabled && this.config.level <= LogLevel.DEBUG) {
      console.timeEnd(label);
    }
  }

  /**
   * 清空控制台
   */
  public clear(): void {
    if (this.config.enabled) {
      console.clear();
    }
  }

  /**
   * 断言
   */
  public assert(condition: boolean, ...args: any[]): void {
    if (this.config.enabled) {
      console.assert(condition, ...args);
    }
  }
}

// 导出单例实例
const logger = Console.getInstance();

// 同时导出类和实例，提供更多灵活性
export { Console };
export default logger;