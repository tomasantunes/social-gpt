import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'
import './index.css'
import App from './App.jsx'

window.bootstrap = bootstrap

createRoot(document.getElementById('root')).render(
  <App />
)
