import React, { useMemo } from "react";
import { ComponentSchema } from "../../types/schema";
import { getComponent } from "../../registry/componentRegistry";

interface RenderEngineProps {
  schema: ComponentSchema;
  mode?: 'edit' | 'preview'; // 编辑模式 or 预览模式
  onSelect?: (id: string) => void; // 选中组件回调
  onUpdate?: (id: string, updates: Partial<ComponentSchema>) => void; // 更新组件回调
}

// 单个组件渲染器（尝试性使用memo优化）
const ComponentRenderer = React.memo(({
  schema,
  mode = 'edit',
  onSelect,
  onUpdate,
}: RenderEngineProps) => {
  const componentInfo = getComponent(schema.type);
  if (!componentInfo) return null;
  const { component, meta } = componentInfo;
  const isEditMode = mode === 'edit';
  const { dragProps } = useDrag({
    initialPosition: {
      x: schema.style?.left || 0,
      y: schema.style?.top || 0,
    },
    enabled: isEditMode && !schema.editor?.locked,
    onDragEnd: ()
  })
}, (prev, next) => {
  // return prev.schema === next.schema && prev.mode === next.mode;
});
