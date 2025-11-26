import React, { useCallback, useRef } from 'react';
import useCanvasStore from '@/store/canvasStore';
import { RenderEngine, CanvasViewport } from '@/components';
import { generateId } from '@mlc/utils';
import { getComponent } from '@/registry/index';
import { useCanvasViewport } from '@/hooks/index';
import './index.scss';
import Toolbar from './components/Toolbar/index';
import CanvasSelection from './components/CanvasSelection/index';

const Editor = () => {
  const {
    canvas,
    addComponent,
    updateComponent,
    selectComponent,
  } = useCanvasStore();

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const screenToCanvasRef = useRef<((x: number, y: number) => { x: number; y: number }) | null>(null);

  const viewportConfig = {
    initialScale: 1,
    minScale: 0.3,
    maxScale: 3,
  };
  // 使用视口 hook
  const { 
    viewport,
    screenToCanvas,
    zoomIn,
    zoomOut,
    zoomToFit,
    setViewport,
    containerRef,
    viewportProps,
    toolMode,
    setToolMode,
  } = useCanvasViewport({
    initialScale: viewportConfig.initialScale,
    minScale: viewportConfig.minScale,
    maxScale: viewportConfig.maxScale,
  });

  // 保存坐标转换方法引用
  React.useEffect(() => {
    screenToCanvasRef.current = screenToCanvas;
  }, [screenToCanvas]);

  // 处理画布点击（取消选中）
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        selectComponent(null);
      }
    },
    [selectComponent]
  );

  // 处理组件选中/更新
  const handleSelect = useCallback(
    (id: string) => selectComponent(id),
    [selectComponent]
  );

  const handleUpdate = useCallback(
    (id: string, updates: any) => updateComponent(id, updates),
    [updateComponent]
  );

  // 处理拖拽到画布
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const componentType = e.dataTransfer.getData('componentType');
      const componentLibrary = e.dataTransfer.getData('componentLibrary') || 'antd';
      if (!componentType || !canvas) return;

      const componentInfo = getComponent(componentLibrary as any, componentType);
      if (!componentInfo) return;

      const { x, y } = screenToCanvas(e.clientX, e.clientY);

      const newComponent = {
        id: generateId('comp_'),
        type: componentType,
        library: componentLibrary as any,
        props: {
          ...componentInfo.meta.defaultProps,
        },
        children: [],
        style: {
          position: 'absolute' as const,
          left: x,
          top: y,
        },
        editor: {
          selected: true,
        },
      };

      addComponent(newComponent);
      selectComponent(newComponent.id);
    },
    [addComponent, selectComponent, canvas, screenToCanvas]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  if (!canvas) return null;

  return (
    <div className="editor">
      <CanvasViewport
        canvasWidth={canvas.width}
        canvasHeight={canvas.height}
        initialScale={viewportConfig.initialScale}
        viewport={viewport}
        viewportProps={viewportProps}
        containerRef={containerRef}
        setViewport={setViewport}
      >
        <div
          ref={canvasContainerRef}
          className="canvas"
          onClick={handleCanvasClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* 组件渲染 */}
          {canvas.components.map((component) => (
            <RenderEngine
              key={component.id}
              schema={component}
              mode="edit"
              onSelect={handleSelect}
              onUpdate={handleUpdate}
              scale={viewport.scale}
              containerRef={canvasContainerRef}
            />
          ))}
          {/* 框选组件 */}
          <CanvasSelection
            screenToCanvas={screenToCanvas}
            components={canvas.components}
            canvasContainerRef={canvasContainerRef}
            toolMode={toolMode}
          />
        </div>
      </CanvasViewport>
      <Toolbar
        scale={viewport.scale}
        minScale={viewportConfig.minScale}
        maxScale={viewportConfig.maxScale}
        zoom={
          {
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            zoomToFit: () => zoomToFit(canvas.width, canvas.height, containerRef.current?.clientWidth || 0, containerRef.current?.clientHeight || 0),
          }
        }
        toolMode={toolMode}
        toolModeChange={setToolMode}
        onScaleChange={(scale: number) => setViewport({ scale })}
      />
    </div>
  );
};

export default Editor;