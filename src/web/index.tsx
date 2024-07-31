import React from 'react';
import App from './App';
import { Container, createRoot } from 'react-dom/client';

// import i18n (needs to be bundled)
import './i18n';

const app = document.getElementById(`app`);
const root = createRoot(app as Container);
root.render(
  <>
    <App />
  </>,
);
