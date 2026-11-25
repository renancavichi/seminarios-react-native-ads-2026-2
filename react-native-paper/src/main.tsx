import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/global.css';
import './styles/shell.css';
import './styles/slides.css';
import './styles/playground.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento #root não encontrado em index.html');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary label="a apresentação">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
