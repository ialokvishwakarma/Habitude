import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import habitService from '../features/habits/habitService';
import HabitModal from '../features/habits/HabitModal';
import focusService from '../features/focus/focusService';

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [focuses, setFocuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [habitData, focusData] = await Promise.all([
        habitService.getMyHabits(),
        focusService.getMyFocuses(),
      ]);
      setHabits(Array.isArray(habitData) ? habitData : []);
      setFocuses(Array.isArray(focusData) ? focusData : []);
    } catch (err) {
      console.error(err);
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
    setIsModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    const created = await habitService.addHabit(payload);
    setHabits((prev) => [...prev, created]);
  };

  return (
    <div>
      <Topbar
        title="Habits & Streaks"
        actionButton={
          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#7c3aed',
              borderColor: '#7c3aed',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)',
            }}
          >
            + New Habit
          </button>
        }
      />
      <div className="page-body">
        <HabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          focusList={focuses}
        />

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading habits...</p>
        ) : habits.length === 0 ? (
          <div className="empty-state">
            <h4>No Habits Tracked Yet</h4>
            <p>Define recurring routines to build momentum and record streaks.</p>
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ backgroundColor: '#7c3aed' }}>
              + Create First Habit
            </button>
          </div>
        ) : (
          <div className="habit-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
            {habits.map((h) => (
              <div
                key={h.id}
                className="habit-card"
                style={{
                  padding: '22px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(124, 58, 237, 0.18)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(79, 70, 229, 0.08)',
                        color: '#4f46e5',
                      }}
                    >
                      {h.focusName ? h.focusName.toUpperCase() : 'GENERAL'}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: h.habitType === 'BAD' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        color: h.habitType === 'BAD' ? '#dc2626' : '#059669',
                      }}
                    >
                      {h.habitType === 'BAD' ? 'Break Habit' : 'Good Routine'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '6px 0' }}>
                    {h.title ? h.title.split('#')[0].trim() : ''}
                  </h3>

                  <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '12px' }}>
                    {h.description || 'Consistency target'}
                  </p>

                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                    Target: <strong style={{ color: '#0f172a' }}>{h.targetValue || 1} {h.customUnit || 'times'}</strong> / {(h.frequency || h.habitFrequency || 'DAILY').toLowerCase()}
                  </div>
                </div>

                {/* Violet Streak Banner */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'rgba(124, 58, 237, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.16)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Current Streak
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#5b21b6', marginTop: '2px' }}>
                      {h.currentStreak || 0} {h.frequency === 'DAILY' || !h.frequency ? 'Days' : 'Periods'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Best Record
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                      {h.longestStreak || h.currentStreak || 0} Days
                    </div>
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