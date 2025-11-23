import styles from '../../index.module.scss';
import { useState, useRef, useEffect } from 'react';
const Menu = () => {
  const menuList = [
    {
      icon: 'home',
      name: 'home',
      text: '首页',
      path: '/'
    },
    {
      icon: '',
      name: 'board',
      text: '画板',
      path: '/'
    },
    {
      icon: 'home',
      name: 'projectManagement',
      text: '项目管理',
      path: '/'
    },
    {
      icon: 'home',
      name: 'historyVersion',
      text: '历史版本',
      path: '/'
    },
    {
      icon: 'home',
      name: 'collaboration',
      text: '协作',
      path: '/'
    }
  ]
  const [activeIndex, setActiveIndex] = useState(1);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateUnderlinePosition();
  }, [activeIndex]);

  const updateUnderlinePosition = () => {
    if (menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll(`.${styles.menu_item}`);
      const activeItem = menuItems[activeIndex] as HTMLElement;
      if (activeItem) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const left = itemRect.left - menuRect.left;
        const width = itemRect.width;
        setUnderlineStyle({ left, width });
      }
    }
  };

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.menu} ref={menuRef}>
      <div className={styles.menu_underline} style={{
        left: `${underlineStyle.left}px`,
        width: `${underlineStyle.width}px`
      }}>
      </div>
      {menuList.map((item,index) => (
        <div className={`${styles.menu_item} ${activeIndex === index ? styles.menu_item_active : ''}`} key={item.name} onClick={() => handleItemClick(index)}>
          <div className={styles.menu_item_text}>{item.text}</div>
        </div>
      ))}
    </div>
  )
}

export default Menu;