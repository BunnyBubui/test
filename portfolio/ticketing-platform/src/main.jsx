import React from 'react'
import ReactDOM from 'react-dom/client' // 🌟 ใช้ client
import App from './App'
import './App.css'

// 🌟 ลบ hydrateRoot ออก แล้วใช้ createRoot แทน
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)