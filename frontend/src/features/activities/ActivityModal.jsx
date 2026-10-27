import React, { useState, useEffect } from 'react';

export default function ActivityModal({
  isOpen,
  onClose,
  onSubmit,
  focusList = [],
  habitList = [],
  editingActivity = null,
}) {
  const isEdit = Boolean(editingActivity);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    focusId: '',
    habitId: '',
    value: '',
    customUnit: 'mins',
    activityDateTime: new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingActivity) {
      const matchedFocus = focusList.find((f) => f.name === editingActivity.focusName);
      setFormData({
        title: editingActivity.title || '',
        description: editingActivity.description || '',
        focusId: matchedFocus ? matchedFocus.id : (focusList[0]?.id || ''),
        habitId: '',
        value: editingActivity.value || '',
        customUnit: editingActivity.customUnit || 'mins',
        activityDateTime: editingActivity.activityDateTime
          ? new Date(editingActivity.activityDateTime).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        focusId: focusList.length > 0 ? focusList[0].id : '',
        habitId: '',
        value: '',
        customUnit: 'mins',
        activityDateTime: new Date().toISOString().slice(0, 16),
      });
    }
    setError('');
  }, [editingActivity, isOpen, focusList]);

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
    if (!formData.value || Number(formData.value) <= 0) {
      setError('Value must be greater than zero');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await onSubmit({
          id: editingActivity.id,
          payload: {
            title: formData.title.trim(),
            description: formData.description ? formData.description.trim() : '',
            value: Number(formData.value),
            focusId: Number(formData.focusId),
          },
        });
      } else {
        const payload = {
          title: formData.title.trim(),
          description: formData.description ? formData.description.trim() : '',
          focusId: Number(formData.focusId),
          value: Number(formData.value),
          customUnit: formData.customUnit.trim() || 'units',
          activityDateTime: new Date(formData.activityDateTime).toISOString(),
          habitId: formData.habitId ? Number(formData.habitId) : null,
          referenceCategory: null,
          referenceUnit: null,
        };

        await onSubmit({ payload });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save activity');
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
          <h2>{isEdit ? 'Edit Activity Log' : 'Log New Activity'}</h2>
          <p>
            {isEdit
              ? 'Correct the title, description, or metrics of this log'
              : 'Record real time, reps, or distance against your focus'}
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              maxLength={30}
              className="form-input"
              placeholder="e.g. Completed Daily Workout"
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

            {/* Habit Association */}
            <div className="form-group">
              <label>Link Habit (Optional)</label>
              <select
                name="habitId"
                className="form-input"
                value={formData.habitId}
                onChange={handleChange}
                disabled={isEdit}
              >
                <option value="">None (Independent Activity)</option>
                {habitList.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Amount / Value</label>
              <input
                type="number"
                step="any"
                min="0.01"
                name="value"
                className="form-input"
                placeholder="e.g. 45"
                value={formData.value}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit Label</label>
              <input
                type="text"
                name="customUnit"
                className="form-input"
                placeholder="e.g. mins, problems, km"
                value={formData.customUnit}
                onChange={handleChange}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                name="activityDateTime"
                className="form-input"
                value={formData.activityDateTime}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              maxLength={150}
              rows={2}
              className="form-input"
              placeholder="Key notes, blockers, or summary..."
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
            {loading ? 'Saving...' : isEdit ? 'Update Activity' : 'Save Log'}
          </button>
        </form>
      </div>
    </div>
  );
}