// apps/super-admin/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from '../app/admin/dashboard/page';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Dashboard />
    </React.StrictMode>,
);
