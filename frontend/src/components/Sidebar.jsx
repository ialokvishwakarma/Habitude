
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const mainNavItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Focus Areas', path: '/focus' },
    { name: 'Habits', path: '/habits' },
    { name: 'Activities', path: '/activities' },
    { name: 'Goals', path: '/goals' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Recommendations', path: '/recommendations' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="mobile-app-header">
        <span className="sidebar-brand-mobile">Habitude</span>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <button
          className="sidebar-backdrop"
          onClick={closeMenu}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">Habitude</div>

        <nav className="sidebar-nav">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink
            to="/profile"
            onClick={closeMenu}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            Profile
          </NavLink>

          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => {
              closeMenu();
              onLogout();
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
