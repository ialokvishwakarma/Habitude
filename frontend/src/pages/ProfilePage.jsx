import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import userService from '../features/user/userService';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        age: data.age || '',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to load profile details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      age: profile?.age || '',
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      setMessage({ type: 'error', text: 'First name is required' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updated = await userService.updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName ? formData.lastName.trim() : '',
        age: formData.age ? Number(formData.age) : null,
      });
      setProfile(updated);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Topbar title="User Profile" />
        <div className="page-body">
          <p style={{ color: 'var(--text-secondary)' }}>Loading user profile...</p>
        </div>
      </div>
    );
  }

  const initials = `${(profile?.firstName?.[0] || 'U')}${(profile?.lastName?.[0] || '')}`.toUpperCase();

  return (
    <div>
      <Topbar title="User Profile" />
      <div className="page-body" style={{ maxWidth: '900px' }}>
        {message.text && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              color: message.type === 'error' ? '#dc2626' : '#059669',
              border: `1px solid ${message.type === 'error' ? '#fca5a5' : '#a7f3d0'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Section 1: User Identity Card */}
        <div
          className="section-card"
          style={{
            padding: '28px',
            marginBottom: '28px',
            borderRadius: '14px',
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, #ffffff 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header Row: Avatar + Name + Edit Pencil Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.3)',
                }}
              >
                {initials}
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'User Profile'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  {profile?.email} &bull; Member since{' '}
                  {profile?.memberSince
                    ? new Date(profile.memberSince).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent'}
                </p>
              </div>
            </div>

            {/* Edit Profile Action Button */}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  borderColor: '#cbd5e1',
                  color: '#334155',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                Edit Details
              </button>
            )}
          </div>

          {/* Body: Conditional Rendering between View Mode and Edit Form */}
          {!isEditing ? (
            /* VIEW MODE: Clean, read-only grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                padding: '16px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #f1f5f9',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  First Name
                </span>
                <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                  {profile?.firstName || '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Last Name
                </span>
                <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                  {profile?.lastName || '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Age
                </span>
                <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                  {profile?.age ? `${profile.age} yrs` : 'Not set'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Account Status
                </span>
                <p style={{ margin: '4px 0 0', fontSize: '14px', fontWeight: 600, color: '#059669' }}>
                  Active User
                </p>
              </div>
            </div>
          ) : (
            /* EDIT MODE: Form inputs with Save/Cancel */
            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    min="10"
                    max="120"
                    className="form-input"
                    placeholder="e.g. 21"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profile?.email || ''}
                    disabled
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#64748b',
                      cursor: 'not-allowed',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline"
                  disabled={saving}
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 600 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Section 2: Performance Snapshot Cards */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '14px' }}>
            Performance & Consistency Snapshot
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Metric 1: Goal Progress */}
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '18px 20px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', textTransform: 'uppercase' }}>
                Goal Completion
              </span>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#065f46', margin: '8px 0 0' }}>
                {Math.round(profile?.averageGoalProgress || 0)}%
              </h3>
            </div>

            {/* Metric 2: Longest Streak */}
            <div
              style={{
                backgroundColor: 'rgba(124, 58, 237, 0.05)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: '12px',
                padding: '18px 20px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase' }}>
                Best Streak
              </span>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#5b21b6', margin: '8px 0 0' }}>
                {profile?.longestStreak || 0} <span style={{ fontSize: '14px', fontWeight: 600 }}>Days</span>
              </h3>
            </div>

            {/* Metric 3: Active Habits */}
            <div
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                padding: '18px 20px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#d97706', textTransform: 'uppercase' }}>
                Active Habits
              </span>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#92400e', margin: '8px 0 0' }}>
                {profile?.totalActiveHabits || 0}
              </h3>
            </div>

            {/* Metric 4: Total Logs */}
            <div
              style={{
                backgroundColor: 'rgba(14, 165, 233, 0.05)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '12px',
                padding: '18px 20px',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', textTransform: 'uppercase' }}>
                Total Logs
              </span>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#075985', margin: '8px 0 0' }}>
                {profile?.totalActivitiesLogged || 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}