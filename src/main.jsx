import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <App />
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
