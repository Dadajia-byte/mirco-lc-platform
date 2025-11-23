export interface ComponentSchema {
  id: string; // 组件唯一ID
  type: string; // 组件类型(对应组件库中的组件名)
  props: Record<string, any>; // 组件属性
  children: ComponentSchema[]; // 子组件
  parentId?: string; // 父组件ID
  style?: { // 样式配置
    position?: 'absolute' | 'relative' | 'fixed';
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    // ...其他样式 todo
  };
  editor?: { // 编辑相关配置
    locked?: boolean; // 是否锁定
    visible?: boolean; // 是否可见
    // ...其他编辑相关配置 todo
  };
}

// 画布整体布局配置
export interface CanvasSchema {
  id: string; // 画布唯一ID
  name: string; // 画布名称
  width: number; // 画布宽度
  height: number; // 画布高度
  components: ComponentSchema[]; // 组件列表
  config?: { // 画布配置
    backgroundColor?: string; // 画布背景颜色
    backgroundImage?: string; // 画布背景图片
    backgroundSize?: string; // 画布背景大小
    backgroundPosition?: string; // 画布背景位置
    backgroundRepeat?: string; // 画布背景重复
    backgroundAttachment?: string; // 画布背景附件
    backgroundOrigin?: string; // 画布背景原点
    grid?: { // 网格配置
      enabled?: boolean; // 是否启用网格
      size?: number; // 网格大小
      color?: string; // 网格颜色
      // ...其他网格配置 todo
    };
    // ...其他配置 todo
  }
}