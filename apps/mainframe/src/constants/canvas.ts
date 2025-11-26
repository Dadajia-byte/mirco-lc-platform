import { CanvasSchema } from '@/types/schema';
import { generateId } from '@mlc/utils';

/**
 * 默认画布schema设置
 */
export const DEFAULT_CANVAS_SCHEMA: CanvasSchema = {
  id: generateId('canvas_'),
  name: '未命名画布',
  width: 800,
  height: 1000,
  components: [],
  config: {
  },
};

/**
 * 画布视口默认配置
 */
export const CANVAS_VIEWPORT_CONFIG = {
  /** 初始缩放比例 */
  initialScale: 1,
  /** 最小缩放比例 */
  minScale: 0.2,
  /** 最大缩放比例 */
  maxScale: 3,
  /** 缩放步进 */
  scaleStep: 0.1,
} as const;