// import { Routes, Route } from 'react-router-dom'
import '@/styles/app.scss'
import Header from "./features/header"
import { LeftBar, RightBar, BottomBar } from "./features/siderBar"
import Editor from "./features/editor"
function App() {
  return (
    <div className="app">
      <Header/>
      <main className="main-content">
        <LeftBar />
        <Editor />
        <RightBar />
      </main>
      <BottomBar />
    </div>
  ) 
}

export default App
