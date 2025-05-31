import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // Import for QueryClient and QueryClientProvider
import reportWebVitals from './reportWebVitals';
import './index.css'; // Ako ste koristili index.css za Tailwind direktive


// Kreiranje instanci QueryClient-a
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Obavijanje aplikacije s QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Mjerenje performansi, nije obavezno
reportWebVitals();
