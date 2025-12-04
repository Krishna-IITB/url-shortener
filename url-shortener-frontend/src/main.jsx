

// // Import Tailwind CSS
// import './index.css'
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import App from './App.jsx'  // Main React component
// import AnalyticsPage from './AnalyticsPage.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/analytics/:code" element={<AnalyticsPage />} />
//       </Routes>
//     </BrowserRouter>
//   </StrictMode>,
// )


// src/main.jsx

import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App.jsx';
import AnalyticsPage from './AnalyticsPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/analytics/:code" element={<AnalyticsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
