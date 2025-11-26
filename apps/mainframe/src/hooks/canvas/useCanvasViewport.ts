import { useEffect, useCallback, useRef, useState } from 'react';
import { isFunction } from '@mlc/utils';
import { ToolMode } from '@/types/schema';

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface UseCanvasViewportOptions {
  initialScale?: number;
  maxScale?: number;
  minScale?: number;
  scaleStep?: number;
  onViewportChange?: (state: ViewportState) => void;
  initialToolMode?: ToolMode;
}

export interface UseCanvasViewportReturn {
  viewport: ViewportState;
  isDragging: boolean;
  toolMode: ToolMode;
  setToolMode: (toolMode: ToolMode) => void;
  setViewport: (updater: Partial<ViewportState> | ((prev: ViewportState) => ViewportState)) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: (canvasWidth: number, canvasHeight: number, containerWidth: number, containerHeight: number) => void;
  screenToCanvas: (screenX: number, screenY: number) => { x: number, y: number };
  canvasToScreen: (canvasX: number, canvasY: number) => { x: number, y: number };
  containerRef: React.RefObject<HTMLElement>;
  viewportProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
  }
}

const DEFAULT_OPTIONS: Required<Omit<UseCanvasViewportOptions, 'onViewportChange'>> = {
  initialScale: 1,
  minScale: 0.2,
  maxScale: 3,
  scaleStep: 0.1,
};

/**
 * 画布视口管理hook
 * @param options 配置选项
 * @returns 返回值
 * - viewport: 当前视口状态
 * - isDragging: 是否正在拖拽
 * - setViewportState: 设置视口状态
 * - resetViewportState: 重置视口状态
 * - zoomIn: 放大视口
 * - zoomOut: 缩小视口
 * - zoomToFit: 适应容器
 * - screenToCanvas: 屏幕坐标转换为画布坐标
 * - canvasToScreen: 画布坐标转换为屏幕坐标
 * - viewportProps: 视口属性
 */
export default function useCanvasViewport(
  options: UseCanvasViewportOptions = {}
): UseCanvasViewportReturn {
  const {
    initialScale = DEFAULT_OPTIONS.initialScale,
    minScale = DEFAULT_OPTIONS.minScale,
    maxScale = DEFAULT_OPTIONS.maxScale,
    scaleStep = DEFAULT_OPTIONS.scaleStep,
    onViewportChange,
    initialToolMode = ToolMode.MOUSE,
  } = options;

  const [viewport, setViewport] = useState<ViewportState>({
    x: 0,
    y: 0,
    scale: initialScale,
  });

  const [toolMode, setToolMode] = useState<ToolMode>(initialToolMode);

  // 使用 ref 存储最新的 viewport，避免事件监听器频繁重新绑定
  const viewportRef = useRef<ViewportState>(viewport);
  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  // 更新视口状态
  const setViewportState = useCallback(
    (updater: Partial<ViewportState> | ((prev: ViewportState) => ViewportState)) => {
      setViewport((prev) => {
        const next = isFunction(updater) ? updater(prev) : { ...prev, ...updater };
        const clamped = {
          ...next,
          scale: Math.max(minScale, Math.min(maxScale, next.scale)),
        };
        onViewportChange?.(clamped);
        return clamped;
      });
    },
    [minScale, maxScale, onViewportChange]
  );

  const resetViewport = useCallback(() => {
    setViewportState({ x: 0, y: 0, scale: initialScale });
  }, [initialScale, setViewportState]);

  const zoomIn = useCallback(() => {
    setViewportState((prev) => ({ 
      ...prev,
      scale: Math.min(maxScale, prev.scale + scaleStep),
    }));
  }, [maxScale, scaleStep, setViewportState]);

  const zoomOut = useCallback(() => {
    setViewportState((prev) => ({ 
      ...prev,
      scale: Math.max(minScale, prev.scale - scaleStep),
    }));
  }, [minScale, scaleStep, setViewportState]);

  const zoomToFit = useCallback(
    (
      canvasWidth: number,
      canvasHeight: number,
      containerWidth: number,
      containerHeight: number
    ) => {
      const scaleX = containerWidth / canvasWidth;
      const scaleY = containerHeight / canvasHeight;
      const newScale = Math.min(scaleX, scaleY, 1);
      setViewportState((prev) => ({ 
        ...prev,
        scale: newScale,
      }));
    },
    [setViewportState]
  );

  // 将屏幕坐标转化为画布坐标
  const screenToCanvas =
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const currentViewport = viewportRef.current;
      
      // 减去容器的滚动偏移，得到鼠标在视口中的相对位置
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      const relativeX = screenX - rect.left + scrollLeft;
      const relativeY = screenY - rect.top + scrollTop;
      return {
        x: (relativeX - currentViewport.x) / currentViewport.scale,
        y: (relativeY - currentViewport.y) / currentViewport.scale,
      }
    }

  // 将画布坐标转化为屏幕坐标
  const canvasToScreen = useCallback(
    (canvasX: number, canvasY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const currentViewport = viewportRef.current;
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      // 计算相对于视口的坐标
      const containerX = canvasX * currentViewport.scale + currentViewport.x;
      const containerY = canvasY * currentViewport.scale + currentViewport.y;
      return {
        x: containerX - scrollLeft + rect.left,
        y: containerY - scrollTop + rect.top,
      }
    },
    []
  );

  // 处理鼠标按下
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 只在点击画布空白区域或按中中键时拖拽
      if (e.button === 1 || e.target === e.currentTarget) {
        e.preventDefault();
        setIsDragging(true);
        const currentViewport = viewportRef.current;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const scrollLeft = containerRef.current.scrollLeft;
        const scrollTop = containerRef.current.scrollTop;
        // 计算当前鼠标相对于wrapper的位置
        const mouseRelativeX = e.clientX - rect.left + scrollLeft;
        const mouseRelativeY = e.clientY - rect.top + scrollTop;
        // 存储鼠标相对于viewport的偏移
        dragStartRef.current = {
          x: mouseRelativeX - currentViewport.x,
          y: mouseRelativeY - currentViewport.y
        };
      }
    },
    []
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      // 计算当前鼠标相对于wrapper的位置
      const mouseRelativeX = e.clientX - rect.left + scrollLeft;
      const mouseRelativeY = e.clientY - rect.top + scrollTop;
      setViewportState({
        x: mouseRelativeX - dragStartRef.current!.x,
        y: mouseRelativeY - dragStartRef.current!.y,
      });
    }
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setViewportState]);

  // 处理滚轮缩放（react的onWheel是被动监听，无法调用preventDefault，这里用原生实现）
  useEffect(() => {
    const container = containerRef.current;
    
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return;
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const current = viewportRef.current;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;
      // 计算鼠标相对于wrapper的位置
      const mouseX = e.clientX - rect.left + scrollLeft;
      const mouseY = e.clientY - rect.top + scrollTop;

      // 鼠标对应的画布坐标
      const canvasX = (mouseX - current.x) / current.scale;
      const canvasY = (mouseY - current.y) / current.scale;

      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      const newScale = Math.max(minScale, Math.min(maxScale, current.scale * delta));

      // 让同一个画布点在缩放后仍处在鼠标位置
      const newX = mouseX - canvasX * newScale;
      const newY = mouseY - canvasY * newScale;

      setViewportState({
        x: newX,
        y: newY,
        scale: newScale,
      });
    };
    
    // 使用 passive: false 确保滚动事件不会被浏览器默认行为干扰
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [minScale, maxScale, setViewportState]);
  

  return {
    viewport,
    isDragging,
    toolMode,
    setToolMode,
    setViewport: setViewportState,
    resetViewport,
    zoomIn,
    zoomOut,
    zoomToFit,
    screenToCanvas,
    canvasToScreen,
    containerRef,
    viewportProps: {
      onMouseDown: handleMouseDown,
      style: {
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none' as const,
      },
    },
  }
}