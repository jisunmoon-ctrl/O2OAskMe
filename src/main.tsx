import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global } from '@emotion/react';
import { DesignSystemProvider, GLOBAL_STYLE } from '@bucketplace/design-system';
import './i18n'; // ods-prototype get_starter_files 의 i18n 최소 초기화 (ODS_PROTOTYPE_GUIDE §2.3)
import { App } from './App';

// 실행 전제: ods-prototype MCP `get_starter_files` 로 .npmrc / vite.config.ts / tsconfig.json /
// src/i18n.ts 스캐폴드를 받은 뒤 이 파일을 엔트리로 사용합니다.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={GLOBAL_STYLE} />
    <DesignSystemProvider mode="light">
      <App />
    </DesignSystemProvider>
  </React.StrictMode>,
);
