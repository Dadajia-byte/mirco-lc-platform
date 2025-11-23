import { ComponentType } from "react";
// 组件元数据
export interface ComponentMeta {
  name: string; // 组件名称
  title: string; // 组件标题(显示在组件库中的名称)
  icon?: string; // 组件图标
  category: string; // 组件分类
  description?: string; // 组件描述
  defaultProps?: Record<string, any>; // 组件默认属性
  props?: Record<string, any>; // 组件属性
  propConfig?: any; // 组件属性配置面板配置
  defaultStyle?: Record<string, any>; // 组件默认样式
  styleConfig?: Record<string, any>; // 组件样式配置面板配置
  // ...其他组件元数据 todo
}

// 组件注册表
export const componentRegistry = new Map<string, {
  component: ComponentType<any>;
  meta: ComponentMeta;
}>();

// 注册组件
export const registerComponent = (
  name: string,
  component: ComponentType<any>,
  meta: ComponentMeta
) => !componentRegistry.has(name) && componentRegistry.set(name, { component, meta });

// 获取组件
export const getComponent = (name: string) => componentRegistry.get(name);

// 获取所有组件元数据(用于组件库展示)
export const getAllComponentsMeta = () => Array.from(componentRegistry.values()).map(({ meta }) => meta);