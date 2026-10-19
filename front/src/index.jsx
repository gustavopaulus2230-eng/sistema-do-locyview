import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AdminApp from './admin/AdminApp';
import './styles/global.css';

const previewRoute = window.location.pathname.replace(/\/+$/, '') === '/preview';

createRoot(document.getElementById('root')).render(previewRoute ? <App /> : <AdminApp />);
