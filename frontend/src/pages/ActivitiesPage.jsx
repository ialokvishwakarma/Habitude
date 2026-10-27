import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import activityService from '../features/activities/activityService';
import ActivityModal from '../features/activities/ActivityModal';
import focusService from '../features/focus/focusService';
import habitService from '../features/habits/habitService';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [focuses, setFocuses] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const loadData = async () => {
    setLoading(true);

    // 1. Load Focus Areas independently
    try {
      const focusData = await focusService.getMyFocuses();
      setFocuses(Array.isArray(focusData) ? focusData : focusData?.content || []);
    } catch (err) {
      console.error('Focus fetch failed:', err);
    }

    // 2. Load Habits independently
    try {
      const habitData = await habitService.getMyHabits();
      setHabits(Array.isArray(habitData) ? habitData : habitData?.content || []);
    } catch (err) {
      console.error('Habits fetch failed:', err);
    }

    // 3. Load Activities independently
    try {
      const actPage = await activityService.getActivities(0, 50);
      setActivities(actPage?.content || (Array.isArray(actPage) ? actPage : []));
    } catch (err) {
      console.error('Activities fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    if (focuses.length === 0) {
      alert('Please create at least one Focus Area first.');
      return;
    }
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act) => {
    setEditingActivity(act);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity entry?')) return;
    try {
      await activityService.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const handleSubmit = async ({ id, payload }) => {
    if (id) {
      const updated = await activityService.updateActivity(id, payload);
      setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } else {
      const created = await activityService.logActivity(payload);
      setActivities((prev) => [created, ...prev]);
    }
  };

  return (
    <div>
      <Topbar
        title="Activity Logs"
        actionButton={
          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#0284c7',
              borderColor: '#0284c7',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
            }}
          >
            + Log Activity
          </button>
        }
      />
      <div className="page-body">
        <ActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          focusList={focuses}
          habitList={habits}
          editingActivity={editingActivity}
        />

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading activities...</p>
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <h4>No Activities Logged</h4>
            <p>Log output, workout durations, or study blocks against your focuses.</p>
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ backgroundColor: '#0284c7' }}>
              + Log First Activity
            </button>
          </div>
        ) : (
          <div className="activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.map((act) => (
              <div
                key={act.id}
                className="activity-item"
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(2, 132, 199, 0.16)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div className="activity-main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{act.title}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(79, 70, 229, 0.08)',
                        color: '#4f46e5',
                      }}
                    >
                      {act.focusName ? act.focusName.toUpperCase() : 'GENERAL'}
                    </span>
                    {act.habitTitle && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(124, 58, 237, 0.08)',
                          color: '#7c3aed',
                        }}
                      >
                        Habit: {act.habitTitle}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>
                      {act.activityDateTime
                        ? new Date(act.activityDateTime).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                    {act.description && <span>&bull; {act.description}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.25)',
                      color: '#0369a1',
                      fontWeight: 750,
                      fontSize: '14px',
                    }}
                  >
                    {act.value} {act.customUnit || ''}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleOpenEdit(act)}
                      style={{ color: '#475569', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDelete(act.id)}
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