/**
 * 类型判断工具函数
 */
export function isFunction(func: any): func is Function {
  return typeof func === 'function';
}

export function isObject(obj: any): obj is Record<string, any> {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export function isArray(arr: any): arr is any[] {
  return Array.isArray(arr);
}

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isNumber(num: any): num is number {
  return typeof num === 'number' && !isNaN(num);
}

export function isBoolean(bool: any): bool is boolean {
  return typeof bool === 'boolean';
}

export function isNull(val: any): val is null {
  return val === null;
}

export function isUndefined(val: any): val is undefined {
  return typeof val === 'undefined';
}

export function isNullish(val: any): val is null | undefined {
  return val === null || val === undefined;
}