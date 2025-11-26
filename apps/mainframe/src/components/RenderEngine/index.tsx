// apps/mainframe/src/components/RenderEngine/index.tsx
import React, { useMemo, useCallback } from 'react';
import { ComponentSchema } from '@/types/schema';
import { getComponent, ComponentLibrary } from '@/registry/index';
import useDrag from '@/hooks/canvas/useDrag';
import useCanvasStore from '@/store/canvasStore';
import './index.scss';

interface RenderEngineProps {
  schema: ComponentSchema;
  mode?: 'edit' | 'preview'; // 编辑模式 or 预览模式
  onSelect?: (id: string) => void; // 选中组件回调
  onUpdate?: (id: string, updates: Partial<ComponentSchema>) => void; // 更新组件回调
  containerRef?: React.RefObject<HTMLElement>;
  scale?: number;
}

// 单个组件渲染器
const ComponentRenderer = React.memo(({
  schema,
  mode = 'edit',
  onSelect,
  onUpdate,
  containerRef,
  scale = 1,
}: RenderEngineProps) => {
  const { selectedComponents } = useCanvasStore();
  const isEditMode = mode === 'edit';
  const isSelected = selectedComponents.includes(schema.id);
  // 确定组件库（优先使用 schema 中的，否则使用默认的 'antd'）
  const library: ComponentLibrary = schema.library || 'antd';
  // 获取组件信息
  const componentInfo = getComponent(library, schema.type);
  if (!componentInfo) {
    console.warn(`Component ${schema.type} not found in library ${library}`);
    return (
      <div className="component-error" style={schema.style}>
        组件 {schema.type} 未找到
      </div>
    );
  }
  const { component: Component, meta } = componentInfo;
  // 拖拽功能（仅在编辑模式且未锁定时）
  const { dragProps } = useDrag({
    initialPosition: {
      x: schema.style?.left || 0,
      y: schema.style?.top || 0,
    },
    enabled: isEditMode && !schema.editor?.locked,
    scale,
    containerRef,
    onDragEnd: (position) => {
      onUpdate?.(schema.id, {
        style: {
          ...schema.style,
          left: position.x,
          top: position.y,
        },
      });
    },
  });
  // 处理点击选中
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      onSelect?.(schema.id);
    }
  }, [isEditMode, schema.id, onSelect]);
  // 合并样式
  const mergedStyle = useMemo(() => {
    const baseStyle = schema.style || {};
    const dragStyle = isEditMode ? dragProps.style : {};
    return {
      ...baseStyle,
      ...dragStyle,
      opacity: schema.editor?.visible === false ? 0.5 : 1,
      pointerEvents: schema.editor?.locked ? 'none' : 'auto',
      zIndex: isSelected ? (baseStyle.zIndex || 0) + 1000 : baseStyle.zIndex,
    };
  }, [schema.style, schema.editor, isEditMode, isSelected, dragProps.style]);

  // 合并属性 并分离 children（使用默认属性 + schema 属性）
  const { children: propsChildren, ...restProps } = useMemo(() => {
    return {
      ...meta.defaultProps,
      ...schema.props,
    };
  }, [meta.defaultProps, schema.props]);

  // 决定使用哪个 children
  // 优先使用 schema.children（子组件 Schema），如果没有则使用 props.children（文本内容）
  const renderChildren = useMemo(() => {
    // 如果有子组件 Schema，渲染子组件
    if (schema.children && schema.children.length > 0) {
      return schema.children.map((child) => (
        <ComponentRenderer
          key={child.id}
          schema={child}
          mode={mode}
          onSelect={onSelect}
          onUpdate={onUpdate}
          containerRef={containerRef}
          scale={scale}
        />
      ));
    }
    // 否则使用 props 中的 children（文本内容）
    return propsChildren;
  }, [schema.children, propsChildren, mode, onSelect, onUpdate, containerRef, scale]);

  return (
    <div
      {...(isEditMode ? { ...dragProps, onMouseDown: dragProps.onMouseDown } : {})}
      onClick={handleClick}
      style={mergedStyle}
      className={`component-wrapper ${isSelected ? 'selected' : ''} ${schema.editor?.locked ? 'locked' : ''}`}
      data-component-id={schema.id}
      data-component-type={schema.type}
      data-component-library={library}
    >
      <Component {...restProps}>
        {renderChildren}
      </Component>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.schema.id === nextProps.schema.id &&
    prevProps.schema === nextProps.schema &&
    prevProps.mode === nextProps.mode
  );
});

ComponentRenderer.displayName = 'ComponentRenderer';

export default ComponentRenderer;