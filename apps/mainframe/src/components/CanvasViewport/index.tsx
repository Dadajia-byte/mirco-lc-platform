import React, { useMemo, useRef, useEffect } from 'react';
import { ViewportState } from '@/hooks/index';
import './index.scss';

export interface CanvasViewportProps {
  canvasWidth: number;
  canvasHeight: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onScreenToCanvas?: (screenX: number, screenY: number) => { x: number; y: number };
  initialScale: number;
  /** 是否初始化居中 默认是true */
  initialCenter?: boolean;
  viewport: ViewportState;
  viewportProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
  };
  containerRef: React.RefObject<HTMLElement>;
  setViewport: (updater: Partial<ViewportState> | ((prev: ViewportState) => ViewportState)) => void;
}

const CanvasViewport: React.FC<CanvasViewportProps> = ({
  canvasWidth,
  canvasHeight,
  children,
  onScreenToCanvas,
  initialScale,
  initialCenter = true,
  viewport,
  viewportProps,
  containerRef,
  setViewport,
}) => {

  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // 初始化居中逻辑：设置滚动条到中间位置
  useEffect(() => {
    if (!initialCenter || hasInitializedRef.current || !containerRef.current || !wrapperRef.current) return;
    
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    
    // 等待 DOM 渲染完成
    const initScroll = () => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (containerWidth > 0 && containerHeight > 0) {
        // 计算 wrapper 的完整尺寸
        const wrapperWidth = wrapper.scrollWidth;
        const wrapperHeight = wrapper.scrollHeight;

        // 设置滚动条到中间位置
        const scrollLeft = (wrapperWidth - containerWidth) / 2;
        const scrollTop = (wrapperHeight - containerHeight) / 2;

        container.scrollLeft = scrollLeft;
        container.scrollTop = scrollTop;

        // 计算画布在 wrapper 中的居中位置
        const scaledWidth = canvasWidth * initialScale;
        const scaledHeight = canvasHeight * initialScale;
        
        // 画布应该在 wrapper 的中心位置
        const centerX = (wrapperWidth - scaledWidth) / 2;
        const centerY = (wrapperHeight - scaledHeight) / 2;

        setViewport({
          x: centerX,
          y: centerY,
          scale: initialScale,
        });

        hasInitializedRef.current = true;
      }
    }; 
    // 使用 requestAnimationFrame 确保 DOM 已渲染
    requestAnimationFrame(() => {
      requestAnimationFrame(initScroll);
    });
  }, [initialCenter, initialScale, canvasWidth, canvasHeight, setViewport]);

  // 计算容器尺寸 - wrapper 需要足够大，确保可以滚动到中间
  const containerSize = useMemo(() => {
    const canvasScaledWidth = canvasWidth * viewport.scale;
    const canvasScaledHeight = canvasHeight * viewport.scale;
        
    // wrapper 的尺寸应该是视口的 2 倍，这样滚动条可以在中间位置
    // 画布在 wrapper 的中心，视口也在 wrapper 的中心（通过滚动实现）
    const multiplier = 2;
    return {
      width: canvasScaledWidth * multiplier,
      height: canvasScaledHeight * multiplier,
    };
  }, [canvasWidth, canvasHeight, viewport.scale]);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const scaledWidth = canvasWidth * viewport.scale;
    const scaledHeight = canvasHeight * viewport.scale;

    // 画布在 wrapper 中心
    setViewport(prev => ({
      ...prev,
      x: (wrapper.scrollWidth - scaledWidth) / 2,
      y: (wrapper.scrollHeight - scaledHeight) / 2,
    }));
  }, [viewport.scale, canvasWidth, canvasHeight, setViewport]);

  return (
    <div 
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="canvas-viewport" 
      {...viewportProps}
    >
      <div
        className="canvas-viewport__wrapper"
        ref={wrapperRef}
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        <div
          className="canvas-viewport__content"
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CanvasViewport;
