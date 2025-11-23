import './index.scss'
import { useRef } from 'react';
import useDropSelect from '../../hooks/common/useDropSelect';
import DropSelect from '../../components/DropSelect';
import EditorBlocks from './EditorBlocks';
const Canvas = () => {
  // const { isOpen, position, options, openDropSelect, closeDropSelect } = useDropSelect();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    // 中间画布
    <div className='editor-container'>
      {/* 产生滚动条 */}
      <div className='editor-container-canvas'>
        {/* 产生内容区域 */}
        <div 
          className='editor-container-canvas-content'
        >
          <canvas ref={canvasRef}></canvas>
          {/* <EditorBlock /> */}
        </div>
      </div>
    </div>
  )
}
export default Canvas