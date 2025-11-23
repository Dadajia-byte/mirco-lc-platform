import './leftBar.scss';
const LeftBar = () => {
  return (
    <div className="left-bar">
      <div className='left-bar-header'>
          <div className='left-bar-header-title'>xx组件库</div>
          <div className='left-bar-header-manager'>
            <i className='iconfont icon-shezhi'></i>
            <span>管理</span>
          </div>
      </div>
      <div className='left-bar-search'>
        <input className='left-bar-search-input' type="text" placeholder='搜索组件...'/>
      </div>
      <div className='left-bar-content'>
        {/* 这里使用微前端嵌入？ */}
      </div>
    </div>
  )
}

export default LeftBar;
