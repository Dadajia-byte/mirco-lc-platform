import styles from './index.module.scss';
import avator from '../../assets/temp/avator.png';
import Menu from './components/Menu';
import Operation from './components/Operation.tsx/operation';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logo_icon}>LC</div>
        <div className={styles.logo_text}>低代码平台</div>
      </div>
      <Menu />
      <Operation />
      <div className={styles.user}>
        <div className={styles.avator}>
          <img src={avator} />
        </div>
      </div>
    </div>
  )
}

export default Header;