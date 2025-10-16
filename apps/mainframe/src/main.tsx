import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { initFlexible } from '@mirco-lc-platform/utils'
import './styles/index.scss'

initFlexible({
  designWidth: 375,
  maxWidth: 768,
  baseCount: 24,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
