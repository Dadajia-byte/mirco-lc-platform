import styles from '../../index.module.scss';
import { useState } from 'react';

type ButtonListType = Array<{
  label: string;
  icon: string;
  handler: () => void;
} | {
  label: string;
  isSwitch: true;
  text: string[];
  currentIndex: number;
  handler: (index: number) => void;
}>  

const Operation = () => {
  const [switchIndex, setSwitchIndex] = useState(0);
  const buttonList: ButtonListType = [ 
    {
      label: "下载",
      icon:'icon-xiazai',
      handler: () => console.log('下载')
    }, 
    {
      label: "复制",
      icon:'icon-fuzhi',
      handler: () => console.log('复制')
    },
    {
      label: "转发",
      icon:'icon-zhuanfa',
      handler: () => console.log('转发')
    },
    {
      label: "切换",
      isSwitch: true,
      text: ['代码', '设计'],
      currentIndex: 0,
      handler: (index: number) => {
        setSwitchIndex(index);
      }
    },
    {
      label: "全屏",
      icon:'icon-quanping',
      handler: () => console.log('全屏')
    },
    {
      label: "帮助",
      icon:'icon-bangzhu',  
      handler: () => console.log('帮助')
    }
  ]
  return (
    <div className={styles.operation}>
      {buttonList.map((item) => (
        ('isSwitch' in item) ? (
          <div className={styles.operation_switch} key={item.label}>
            <div 
              className={styles.operation_switch_slider}
              style={{ transform: `translateX(${switchIndex * 100}%)` }}
            />
            {item.text.map((text, index) => (
              <div 
                key={index}
                className={`${styles.operation_switch_item} ${index === switchIndex ? styles.operation_switch_item_active : ''}`}
                onClick={() => item.handler(index)}
              >
                {text}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.operation_icon} key={item.label}>
            <i className={`iconfont ${item.icon}`}></i>
          </div>
        )
      ))} 
    </div>
  )
}

export default Operation;