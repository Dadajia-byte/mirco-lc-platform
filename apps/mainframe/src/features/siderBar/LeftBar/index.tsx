// apps/mainframe/src/features/siderBar/LeftBar/index.tsx
import { useState, useMemo } from 'react';
import { getAllComponentsMeta } from '@/registry';
import './index.scss';

const LeftBar = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  // 获取所有物料（默认显示 antd）
  const materials = useMemo(() => {
    return getAllComponentsMeta('antd');
  }, []);

  // 按分类分组
  const materialsByCategory = useMemo(() => {
    const grouped: Record<string, typeof materials> = {};
    materials.forEach((material) => {
      if (!grouped[material.category]) {
        grouped[material.category] = [];
      }
      grouped[material.category].push(material);
    });
    return grouped;
  }, [materials]);

  // 过滤物料
  const filteredMaterials = useMemo(() => {
    if (!searchKeyword) return materials;
    return materials.filter(
      (material) =>
        material.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        material.category.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [materials, searchKeyword]);

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, componentType: string, library: string) => {
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.setData('componentLibrary', library);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="left-bar">
      <div className="left-bar-header">
        <div className="left-bar-header-title">Ant Design 物料库</div>
        <div className="left-bar-header-manager">
          <i className="iconfont icon-shezhi"></i>
          <span>管理</span>
        </div>
      </div>

      <div className="left-bar-search">
        <input
          className="left-bar-search-input"
          type="text"
          placeholder="搜索组件..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="left-bar-content">
        {filteredMaterials.length === 0 ? (
          <div className="left-bar-empty">暂无组件</div>
        ) : searchKeyword ? (
          // 搜索模式：显示所有匹配的组件
          <div className="material-list">
            {filteredMaterials.map((material) => (
              <div
                key={material.name}
                className="material-item"
                draggable
                onDragStart={(e) => handleDragStart(e, material.name, material.library)}
              >
                <div className="material-item-icon">
                 <i className={`iconfont ${material.icon}`}></i>
                </div>
                <div className="material-item-info">
                  <div className="material-item-title">{material.title}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 正常模式：按分类显示
          <div className="material-categories">
            {Object.entries(materialsByCategory).map(([category, items]) => (
              <div key={category} className="material-category">
                <div className="material-category-title">{category}</div>
                <div className="material-list">
                  {items.map((material) => (
                    <div
                      key={material.name}
                      className="material-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, material.name, material.library)}
                    >
                      <div className="material-item-title">{material.name} {material.title}</div>
                      <div className='material-item-thumbnail'>
                        <img src={material.thumbnail} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftBar;