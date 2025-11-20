/**
 * 事件发射器类
 */
export class EventEmitter {
  private static instance: EventEmitter;
  private events: Record<string, ((...args: any[]) => void)[]> = {};

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  /**
   * 监听事件
   */
  public on(type: string, callback: (...args: any[]) => void): void {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(callback);
  }

  /**
   * 移除事件
   */
  public off(type: string, callback: (...args: any[]) => void): void {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(cb => cb !== callback);
    }
  }

  /**
   * 触发事件
   */
  public emit(type: string, ...args: any[]): void {
    if (this.events[type]) {
      this.events[type].forEach(callback => callback(...args));
    }
  }

  /**
   * 一次性事件
   */
  public once(type: string, callback: (...args: any[]) => void): void {
    const wrappedCallback = (...args: any[]) => {
      callback(...args);
      this.off(type, wrappedCallback);
    };
    this.on(type, wrappedCallback);
  }

  /**
   * 清除指定类型的所有事件
   */
  public clear(type: string): void {
    if (this.events[type]) {
      this.events[type] = [];
    }
  }

  /**
   * 清除所有事件
   */
  public clearAll(): void {
    this.events = {};
  }

  /**
   * 获取指定类型的事件列表
   */
  public getEventListByType(type: string): ((...args: any[]) => void)[] {
    return this.events[type] || [];
  }

  /**
   * 获取所有事件列表
   */
  public getEventList(): ((...args: any[]) => void)[][] {
    return Object.values(this.events);
  }
}

/**
 * 默认事件发射器实例
 */
export const eventEmitter = EventEmitter.getInstance();