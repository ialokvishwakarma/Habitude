import React, { useState, useEffect } from 'react';

export default function FocusModal({ isOpen, onClose, onSubmit, initialFocus = null }) {
  const [focusName, setFocusName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(initialFocus);

  useEffect(() => {
    if (initialFocus) {
      setFocusName(initialFocus.name || '');
    } else {
      setFocusName('');
    }
    setError('');
  }, [initialFocus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!focusName.trim()) {
      setError('Focus area name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(focusName.trim());
      setFocusName('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Try another name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="auth-header">
          <h2>{isEdit ? 'Update Focus Area' : 'New Focus Area'}</h2>
          <p>
            {isEdit
              ? `Rename "${initialFocus?.name}" to a new title`
              : 'Add a primary domain like Coding, Fitness, or Reading'}
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Focus Area Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. DSA & Algorithms"
              value={focusName}
              onChange={(e) => {
                setFocusName(e.target.value);
                setError('');
              }}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-sm)' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Name' : 'Create Focus'}
          </button>
        </form>
      </div>
    </div>
  );
}