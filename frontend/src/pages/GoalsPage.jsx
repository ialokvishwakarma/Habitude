import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import goalService from '../features/goals/goalService';
import GoalModal from '../features/goals/GoalModal';
import focusService from '../features/focus/focusService';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [focuses, setFocuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const loadData = async () => {
    setLoading(true);

    // 1. Load Focus Areas
    try {
      const focusData = await focusService.getMyFocuses();
      setFocuses(Array.isArray(focusData) ? focusData : focusData?.content || []);
    } catch (err) {
      console.error('Focus fetch failed in Goals:', err);
    }

    // 2. Load Goals
    try {
      const goalData = await goalService.getMyGoals();
      setGoals(Array.isArray(goalData) ? goalData : goalData?.content || []);
    } catch (err) {
      console.error('Goals fetch failed:', err);
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
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal milestone?')) return;
    try {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete goal');
    }
  };

  const handleSubmit = async ({ id, payload }) => {
    if (id) {
      const updated = await goalService.updateGoal(id, payload);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } else {
      const created = await goalService.createGoal(payload);
      setGoals((prev) => [...prev, created]);
    }
  };

  return (
    <div>
      <Topbar
        title="Target Goals"
        actionButton={
          <button
            className="btn btn-primary"
            onClick={handleOpenAdd}
            style={{
              backgroundColor: '#059669',
              borderColor: '#059669',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
            }}
          >
            + Set Goal
          </button>
        }
      />
      <div className="page-body">
        <GoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          focusList={focuses}
          editingGoal={editingGoal}
        />

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading goals...</p>
        ) : goals.length === 0 ? (
          <div className="empty-state">
            <h4>No Goals Defined</h4>
            <p>Define clear milestones with target metrics and completion deadlines.</p>
            <button className="btn btn-primary" onClick={handleOpenAdd} style={{ backgroundColor: '#059669' }}>
              + Set First Goal
            </button>
          </div>
        ) : (
          <div className="goal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {goals.map((g) => {
              const progress = g.totalProgress || 0;
              const target = g.targetValue || 1;
              const percent = Math.min(100, Math.round((progress / target) * 100));

              return (
                <div
                  key={g.id}
                  className="goal-card"
                  style={{
                    padding: '22px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(5, 150, 105, 0.2)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
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
                        {g.focusName ? g.focusName.toUpperCase() : 'GENERAL'}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: percent >= 100 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: percent >= 100 ? '#059669' : '#d97706',
                        }}
                      >
                        {(g.status || 'IN_PROGRESS').replace('_', ' ')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '4px 0 6px' }}>
                      {g.title ? g.title.split('#')[0].trim() : ''}
                    </h3>

                    <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '14px', lineHeight: '1.4' }}>
                      {g.description || 'Target milestone'}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                      <span>Progress: <strong style={{ color: '#0f172a' }}>{progress} / {target} {g.customUnit || ''}</strong></span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>{percent}%</span>
                    </div>

                    {/* Emerald Minimal Progress Bar */}
                    <div style={{ width: '100%', height: '7px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          backgroundColor: '#059669',
                          borderRadius: '999px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Deadline: {g.endDate || 'No limit'}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenEdit(g)}
                        style={{ color: '#475569', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleDelete(g.id)}
                        style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, padding: '4px 8px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}