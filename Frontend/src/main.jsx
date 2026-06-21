import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // ← Assurez-vous que c'est App.jsx
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);