// import './index.css'; // or './main.css'

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import './index.css'         // Import Tailwind CSS
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'  // Main React component

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />  // Renders your main UI
//   </StrictMode>,
// )

// Import Tailwind CSS
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'  // Main React component
import AnalyticsPage from './AnalyticsPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/analytics/:code" element={<AnalyticsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
