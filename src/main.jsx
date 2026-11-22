import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ReportsApp from './ReportsApp';
import './index.css';

const isReportsPage = window.location.pathname.endsWith('/reportes.html');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isReportsPage ? <ReportsApp /> : <App />}
  </React.StrictMode>
);
