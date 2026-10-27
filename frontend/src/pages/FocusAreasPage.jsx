import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import focusService from '../features/focus/focusService';
import FocusModal from '../features/focus/FocusModal';

export default function FocusAreasPage() {
  const [focuses, setFocuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFocus, setEditingFocus] = useState(null);

  const fetchFocuses = async () => {
    try {
      setLoading(true);
      const data = await focusService.getMyFocuses();
      setFocuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFocuses();
  }, []);

  const handleOpenAdd = () => {
    setEditingFocus(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingFocus(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Delete "${name}" focus area?`)) return;
    try {
      await focusService.deleteFocus(name);
      setFocuses((prev) => prev.filter((f) => f.name !== name));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete focus');
    }
  };

  const handleSubmit = async (enteredName) => {
    if (editingFocus) {
      await focusService.updateFocus(editingFocus.name, enteredName);
      setFocuses((prev) =>
        prev.map((f) => (f.name === editingFocus.name ? { ...f, name: enteredName } : f))
      );
    } else {
      const created = await focusService.addFocus(enteredName);
      setFocuses((prev) => [...prev, created]);
    }
  };

  return (
    <div>
      <Topbar
        title="Focus Areas"
        actionButton={
          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#4f46e5',
              borderColor: '#4f46e5',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)',
            }}
          >
            + Add Focus
          </button>
        }
      />
      <div className="page-body">
        <FocusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialFocus={editingFocus}
        />

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading focus areas...</p>
        ) : focuses.length === 0 ? (
          <div className="empty-state">
            <h4>No Focus Areas Created Yet</h4>
            <p>Create focus categories to anchor your activities, habits, and milestones.</p>
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ backgroundColor: '#4f46e5' }}>
              + Create Focus
            </button>
          </div>
        ) : (
          <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {focuses.map((item) => (
              <div
                key={item.id || item.name}
                className="focus-card"
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(79, 70, 229, 0.16)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.3px' }}>
                    {item.name.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(79, 70, 229, 0.08)',
                      color: '#4f46e5',
                      border: '1px solid rgba(79, 70, 229, 0.2)',
                      letterSpacing: '0.4px',
                    }}
                  >
                    FOCUS DOMAIN
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleOpenEdit(item)}
                      style={{ color: '#475569', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
                    >
                      Rename
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDelete(item.name)}
                      style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}