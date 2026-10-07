import '@fontsource-variable/inter';
import '@fontsource-variable/heebo';
import '@fontsource/dm-mono';
import './globalStyles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing application root');
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
