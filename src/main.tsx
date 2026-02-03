import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'leaflet/dist/leaflet.css'
import 'leaflet-measure/dist/leaflet-measure.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/railway-route-tracker">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
