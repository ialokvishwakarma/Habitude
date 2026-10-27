import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout({ onLogout }) {
  return (
    <div className="layout-root">
      <Sidebar onLogout={onLogout} />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}