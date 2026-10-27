import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const mainNavItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Focus Areas', path: '/focus' },
    { name: 'Habits', path: '/habits' },
    { name: 'Activities', path: '/activities' },
    { name: 'Goals', path: '/goals' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Recommendations', path: '/recommendations' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Habitude</div>

      <nav className="sidebar-nav">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border-subtle, #e2e8f0)', paddingTop: '12px' }}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
          style={{ marginBottom: '8px' }}
        >
          Profile
        </NavLink>

        <button className="btn btn-outline" style={{ width: '100%' }} onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}