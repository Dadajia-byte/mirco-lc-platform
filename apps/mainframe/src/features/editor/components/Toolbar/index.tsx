import { useState, useEffect } from 'react';
import './index.scss';
import { InputNumber } from 'antd';
import { ToolMode } from '@/types/schema';

interface ToolbarProps {
  scale: number;
  minScale: number;
  maxScale: number;
  onScaleChange: (scale: number) => void;
  zoom: {
    zoomIn: () => void;
    zoomOut: () => void;
    zoomToFit: () => void;
  }
  toolMode: ToolMode;
  toolModeChange: (toolMode: ToolMode) => void;
}

const Toolbar = ({ scale, minScale, maxScale, zoom, onScaleChange, toolMode, toolModeChange }: ToolbarProps) => {
  const [showMore, setShowMore] = useState(true);
  const [activeItem, setActiveItem] = useState<ToolMode>(toolMode);
  const [currentScale, setCurrentScale] = useState(scale);
  const { zoomIn, zoomOut, zoomToFit } = zoom;

  useEffect(() => {
    setCurrentScale(scale);
  }, [scale]);


  const handleScaleChange = (value: number | null) => {
    if (value === null) return;
    // 限制在最小和最大范围内
    const clampedValue = Math.max(minScale, Math.min(maxScale, value / 100));
    setCurrentScale(clampedValue);
    onScaleChange?.(clampedValue);
  };

  const formatScale = (value: number) => {
    return Math.round(value * 100);
  };

  const [toolbarItems] = useState([
    {
      icon: 'icon-shouhuajiantou',
      key: 'hand',
      tooltip: '抓手',
      onClick: () => {
        setActiveItem('hand');
        toolModeChange(ToolMode.HAND);
      },
    },
    {
      icon: 'icon-shubiaojiantou',
      key: 'mouse',
      tooltip: '鼠标',
      onClick: () => {
        setActiveItem('mouse');
        toolModeChange(ToolMode.MOUSE);
      },
    },
    {
      icon: 'icon-shiyingpingmu',
      key: 'fit-screen',
      tooltip: '适应屏幕',
      onClick: () => {
        setActiveItem(null);
        zoomToFit?.();
      },
    },
    {
      icon: 'icon-quark-yi-bi-yi',
      key: 'original-size',
      tooltip: '原始尺寸',
      onClick: () => {
        setActiveItem(null);
        onScaleChange?.(1);
      },
    }
  ]);
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {showMore && (
          <div className="toolbar-left-items">
            {toolbarItems.map((item) => (
              <div
                className={`toolbar-left-items-item${activeItem === item.key ? ' active' : ''}`}
                key={item.key}
                onClick={item.onClick}
                title={item.tooltip}
              >
                {item.icon ? <i className={`iconfont ${item.icon}`}></i> : null}
              </div>
            ))}
          </div>
        )}
        <div className="toolbar-left-scale-btn">
          <InputNumber
            className='toolbar-left-scale-btn-input'
            mode='spinner'
            size='small'
            value={formatScale(currentScale)}
            onChange={handleScaleChange}
            formatter={(value) => `${value}%`}
            parser={(value) => parseFloat(value?.replace('%', '') || '0')}
            min={formatScale(minScale)}
            max={formatScale(maxScale)}
            step={0.1}
            precision={0}
            onStep={(_value, info) => {
              if (info.type === 'up') {
                zoomIn?.();
              } else if (info.type === 'down') {
                zoomOut?.();
              }
            }}
          />
        </div>
      </div>
      
      <div className="toolbar-more" onClick={() => setShowMore(!showMore)}>
        <i className={`iconfont ${showMore ? 'icon-xiangyouzhankai' : 'icon-xiangzuoshouqi'}`}></i>
      </div>
    </div>
  );
};

export default Toolbar;