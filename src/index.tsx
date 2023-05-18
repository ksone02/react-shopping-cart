import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './components/App';
import { ResetStyle } from './styles/ResetStyle';
import { worker } from './mock/browsers';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
worker.start();
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <ResetStyle />
      <App />
    </RecoilRoot>
  </React.StrictMode>,
);
