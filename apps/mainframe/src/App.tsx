// import { Routes, Route } from 'react-router-dom'
import '@/styles/app.scss'
import Header from "./features/header"
import LeftBar from "./features/siderBar/leftBar"
import BottomBar from "./features/siderBar/bottomBar"
import Canvas from "./features/canvas"
import RightBar from "./features/siderBar/rightBar"
function App() {
  return (
    <div className="app">
      <Header/>
      <main className="main-content">
        <LeftBar />
        <Canvas />
        <RightBar />
      </main>
      <BottomBar />
    </div>
  ) 
}

export default App
