import React from 'react';

export default function Topbar({ title, actionButton }) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
      </div>
      {actionButton && <div>{actionButton}</div>}
    </header>
  );
}