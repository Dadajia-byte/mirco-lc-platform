import { ComponentType } from "react";
export type ComponentLibrary = 'antd' | 'element-plus' | 'custom';


// 组件元数据
export interface ComponentMeta {
  name: string; // 组件名称
  title: string; // 组件标题(显示在组件库中的名称)
  library: ComponentLibrary; // 所属组件库
  icon?: string; // 组件图标
  category: string; // 组件分类
  description?: string; // 组件描述
  defaultProps?: Record<string, any>; // 组件默认属性
  props?: Record<string, any>; // 组件属性
  propConfig?: any; // 组件属性配置面板配置
  defaultStyle?: Record<string, any>; // 组件默认样式
  styleConfig?: Record<string, any>; // 组件样式配置面板配置
  thumbnail?: string; // 组件缩略图
  // ...其他组件元数据 todo
}

// 组件注册项
interface ComponentRegistryItem {
  component: ComponentType<any>;
  meta: ComponentMeta;
}

// 组件库配置
export interface ComponentLibararyConfig {
  id: ComponentLibrary;
  name: string;
  version?: string;
  icon?: string;
  enabled?: boolean;
  components: Map<string, ComponentRegistryItem>;
}


// 组件注册表管理器
class ComponentRegistryManager {
  private libraries: Map<ComponentLibrary, ComponentLibararyConfig> = new Map();
  private currentLibrary: ComponentLibrary | null = null;

  /**
   * 注册组件库
   */
  registerLibrary(config: Omit<ComponentLibararyConfig, 'components'>) {
    if (!this.libraries.has(config.id)) {
      this.libraries.set(config.id, {
        ...config,
        components: new Map(),
      });
    }
    return this;
  }

  /**
   * 注册组件到指定组件库
   */
  registerComponent(
    library: ComponentLibrary,
    name: string,
    component: ComponentType<any>,
    meta: ComponentMeta
  ): ComponentRegistryManager {
    const lib = this.libraries.get(library);
    if (!lib) {
      console.warn(`Component library ${library} not found`);
      return this;
    }
    if (lib.components.has(name)) {
      console.warn(`Component ${name} already registered in library ${library}`);
      return this;
    }
    lib.components.set(name, { component, meta });
    return this;
  }
  
  /**
   * 批量注册组件
   */ 
  registerComponents(
    library: ComponentLibrary,
    components: Array<{
      name: string;
      component: ComponentType<any>;
      meta: ComponentMeta;
    }>
  ): ComponentRegistryManager {
    components.forEach(({ name, component, meta }) => {
      this.registerComponent(library, name, component, meta);
    });
    return this;
  }

  /**
   * 获取组件
   */
  getComponent(library: ComponentLibrary, name: string) {
    return this.libraries.get(library)?.components.get(name);
  }

  /**
   * 获取当前组件库的所有组件
   */
  getCurrentLibraryComponents() {
    if (!this.currentLibrary) return [];
    const lib = this.libraries.get(this.currentLibrary);
    return lib ? Array.from(lib.components.values()) : [];
  }

  /**
   * 获取所有组件元数据
   */
  getAllComponentsMeta(library?: ComponentLibrary) {
    if (library) {
      const lib = this.libraries.get(library);
      return lib
        ? Array.from(lib.components.values()).map(({ meta }) => meta)
        : [];
    }
    // 返回所有启用的组件库的组件
    const allMeta: ComponentMeta[] = [];
    this.libraries.forEach((lib) => {
      if (lib.enabled) {
        lib.components.forEach(({ meta }) => {
          allMeta.push(meta);
        });
      }
    });
    return allMeta;
  }

  /**
   * 设置当前使用的组件库
   */
  setCurrentLibrary(library: ComponentLibrary) {
    if (this.libraries.has(library)) {
      this.currentLibrary = library;
    }
    return this;
  }

  /**
   * 获取当前组件库
   */
  getCurrentLibrary() {
    return this.currentLibrary;
  }

  /**
   * 获取所有组件库配置
   */
  getLibraries() {
    return Array.from(this.libraries.values());
  }

  /**
   * 启用/禁用组件库
   */
  toggleLibrary(library: ComponentLibrary, enabled: boolean) {
    const lib = this.libraries.get(library);
    if (lib) {
      lib.enabled = enabled;
    }
    return this;
  }
}

// 单例导出
export const componentRegistry = new ComponentRegistryManager();

// 便捷方法
export const registerComponent = (
  library: ComponentLibrary,
  name: string,
  component: ComponentType<any>,
  meta: ComponentMeta
) => componentRegistry.registerComponent(library, name, component, meta);

export const getComponent = (library: ComponentLibrary, name: string) => componentRegistry.getComponent(library, name);

export const getAllComponentsMeta = (library?: ComponentLibrary) => componentRegistry.getAllComponentsMeta(library);