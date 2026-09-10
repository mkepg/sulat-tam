import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import './index.css';
import './css/fonts.scss';

import App from './App.tsx';
import { UserInfoProvider } from './context/UserInfoProvider.tsx';
import { ArticleInfoProvider } from './context/ArticleInfoProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <UserInfoProvider>
        <ArticleInfoProvider>
          <App />
        </ArticleInfoProvider>
      </UserInfoProvider>
    </HashRouter>
  </StrictMode>,
)
