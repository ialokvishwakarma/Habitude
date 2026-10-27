import React, { useState, useEffect } from 'react';

export default function HabitModal({ isOpen, onClose, onSubmit, focusList = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    focusId: '',
    frequency: 'DAILY',
    habitType: 'GOOD',
    targetValue: '',
    customUnit: 'times',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      title: '',
      description: '',
      focusId: focusList.length > 0 ? focusList[0].id : '',
      frequency: 'DAILY',
      habitType: 'GOOD',
      targetValue: '1',
      customUnit: 'times',
    });
    setError('');
  }, [isOpen, focusList]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.focusId) {
      setError('Please select a focus area');
      return;
    }
    if (!formData.targetValue || Number(formData.targetValue) <= 0) {
      setError('Target value must be greater than zero');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description ? formData.description.trim() : '',
        focusId: Number(formData.focusId),
        frequency: formData.frequency,
        habitType: formData.habitType,
        targetValue: Number(formData.targetValue),
        customUnit: formData.customUnit.trim() || 'units',
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="auth-header">
          <h2>Create New Habit</h2>
          <p>Establish routines, track consistency, and build streaks.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Title</label>
            <input
              type="text"
              name="title"
              maxLength={30}
              className="form-input"
              placeholder="e.g. Read 15 Pages"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Focus Area</label>
              <select
                name="focusId"
                className="form-input"
                value={formData.focusId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Focus</option>
                {focusList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Habit Nature</label>
              <select
                name="habitType"
                className="form-input"
                value={formData.habitType}
                onChange={handleChange}
              >
                <option value="GOOD">Build Positive (GOOD)</option>
                <option value="BAD">Break Habit (BAD)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Frequency</label>
              <select
                name="frequency"
                className="form-input"
                value={formData.frequency}
                onChange={handleChange}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Value</label>
              <input
                type="number"
                step="any"
                min="0.1"
                name="targetValue"
                className="form-input"
                placeholder="e.g. 1"
                value={formData.targetValue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Unit</label>
            <input
              type="text"
              name="customUnit"
              className="form-input"
              placeholder="e.g. times, pages, mins"
              value={formData.customUnit}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              maxLength={150}
              rows={2}
              className="form-input"
              placeholder="Why this habit matters..."
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-sm)' }}
            disabled={loading}
          >
            {loading ? 'Creating Habit...' : 'Create Habit'}
          </button>
        </form>
      </div>
    </div>
  );
}