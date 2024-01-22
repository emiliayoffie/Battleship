import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';

import { ModalProvider } from './components/Modal/ModalContext';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </StrictMode>
);
