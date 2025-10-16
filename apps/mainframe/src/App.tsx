import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <Routes>
      <Route path="/" element={<div className='test'>Home</div>} />
    </Routes>
  ) 
}

export default App
