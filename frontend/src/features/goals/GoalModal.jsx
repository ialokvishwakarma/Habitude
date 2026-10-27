import React, { useState, useEffect } from 'react';

export default function GoalModal({
  isOpen,
  onClose,
  onSubmit,
  focusList = [],
  editingGoal = null,
}) {
  const isEdit = Boolean(editingGoal);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    focusId: '',
    targetValue: '',
    customUnit: 'hours',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: 'NOT_STARTED',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      const matchedFocus = focusList.find((f) => f.name === editingGoal.focusName);
      setFormData({
        title: editingGoal.title || '',
        description: editingGoal.description || '',
        focusId: matchedFocus ? matchedFocus.id : (focusList[0]?.id || ''),
        targetValue: editingGoal.targetValue || '',
        customUnit: editingGoal.customUnit || 'hours',
        startDate: editingGoal.startDate || new Date().toISOString().slice(0, 10),
        endDate: editingGoal.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: editingGoal.status || 'NOT_STARTED',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        focusId: focusList.length > 0 ? focusList[0].id : '',
        targetValue: '',
        customUnit: 'hours',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: 'NOT_STARTED',
      });
    }
    setError('');
  }, [editingGoal, isOpen, focusList]);

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
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End date cannot be earlier than start date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await onSubmit({
          id: editingGoal.id,
          payload: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            focusId: Number(formData.focusId),
            targetValue: Number(formData.targetValue),
            customUnit: formData.customUnit.trim() || 'units',
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status,
          },
        });
      } else {
        await onSubmit({
          payload: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            focusId: Number(formData.focusId),
            targetValue: Number(formData.targetValue),
            customUnit: formData.customUnit.trim() || 'units',
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
        });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <div className="auth-header">
          <h2>{isEdit ? 'Edit Goal' : 'Create New Target Goal'}</h2>
          <p>Define clear milestones, target units, and execution timelines.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Goal Title</label>
            <input
              type="text"
              name="title"
              maxLength={60}
              className="form-input"
              placeholder="e.g. Master Dynamic Programming"
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

            {isEdit && (
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="PENDING">Pending</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Target Value</label>
              <input
                type="number"
                step="any"
                min="0.1"
                name="targetValue"
                className="form-input"
                placeholder="e.g. 100"
                value={formData.targetValue}
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
                placeholder="e.g. problems, hours, km"
                value={formData.customUnit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-input"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Deadline / End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-input"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              maxLength={250}
              rows={2}
              className="form-input"
              placeholder="Why this milestone matters..."
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
            {loading ? 'Saving...' : isEdit ? 'Update Goal' : 'Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
}