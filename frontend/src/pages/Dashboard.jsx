import React, { useState, useEffect } from 'react';
import focusService from '../features/focus/focusService';
import FocusModal from '../features/focus/FocusModal';
import activityService from '../features/activities/activityService';
import ActivityModal from '../features/activities/ActivityModal';
import habitService from '../features/habits/habitService';
import HabitModal from '../features/habits/HabitModal';
import goalService from '../features/goals/goalService';
import GoalModal from '../features/goals/GoalModal';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('focus');
  const [focuses, setFocuses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [editingFocus, setEditingFocus] = useState(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [focusData, activityPage, habitData, goalData] = await Promise.all([
        focusService.getMyFocuses(),
        activityService.getActivities(0, 50),
        habitService.getMyHabits(),
        goalService.getMyGoals(),
      ]);
      setFocuses(Array.isArray(focusData) ? focusData : []);
      setActivities(activityPage?.content || []);
      setHabits(Array.isArray(habitData) ? habitData : []);
      setGoals(Array.isArray(goalData) ? goalData : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Goal Handlers
  const handleOpenAddGoal = () => {
    if (focuses.length === 0) {
      alert('Please create at least one Focus Area before setting a goal.');
      setActiveTab('focus');
      return;
    }
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete goal');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await goalService.updateStatus(id, status);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update goal status');
    }
  };

  const handleGoalSubmit = async ({ id, payload }) => {
    if (id) {
      const updated = await goalService.updateGoal(id, payload);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } else {
      const created = await goalService.createGoal(payload);
      setGoals((prev) => [...prev, created]);
    }
  };

  // Habit Handlers
  const handleOpenAddHabit = () => {
    if (focuses.length === 0) {
      alert('Please create at least one Focus Area before creating a habit.');
      setActiveTab('focus');
      return;
    }
    setIsHabitModalOpen(true);
  };

  const handleHabitSubmit = async (payload) => {
    const created = await habitService.addHabit(payload);
    setHabits((prev) => [...prev, created]);
  };

  // Activity Handlers
  const handleOpenLogActivity = () => {
    if (focuses.length === 0) {
      alert('Please create at least one Focus Area before logging an activity.');
      setActiveTab('focus');
      return;
    }
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleDeleteActivity = async (id) => {
    if (!window.confirm('Delete this activity log?')) return;
    try {
      await activityService.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  const handleActivitySubmit = async ({ id, payload }) => {
    if (id) {
      const updated = await activityService.updateActivity(id, payload);
      setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } else {
      const created = await activityService.logActivity(payload);
      setActivities((prev) => [created, ...prev]);
      if (payload.habitId) {
        habitService.getMyHabits().then((data) => setHabits(Array.isArray(data) ? data : []));
      }
    }
  };

  // Focus Handlers
  const handleOpenAddFocus = () => {
    setEditingFocus(null);
    setIsFocusModalOpen(true);
  };

  const handleOpenEditFocus = (focus) => {
    setEditingFocus(focus);
    setIsFocusModalOpen(true);
  };

  const handleDeleteFocus = async (name) => {
    if (!window.confirm(`Delete "${name}" focus area?`)) return;
    try {
      await focusService.deleteFocus(name);
      setFocuses((prev) => prev.filter((f) => f.name !== name));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete focus area');
    }
  };

  const handleFocusSubmit = async (enteredName) => {
    if (editingFocus) {
      const updated = await focusService.updateFocus(editingFocus.name, enteredName);
      setFocuses((prev) =>
        prev.map((f) => (f.name === editingFocus.name ? { ...f, name: enteredName } : f))
      );
    } else {
      const created = await focusService.addFocus(enteredName);
      setFocuses((prev) => [...prev, created]);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Modals */}
      <FocusModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        onSubmit={handleFocusSubmit}
        initialFocus={editingFocus}
      />

      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleActivitySubmit}
        focusList={focuses}
        habitList={habits}
        editingActivity={editingActivity}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSubmit={handleHabitSubmit}
        focusList={focuses}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
        focusList={focuses}
        editingGoal={editingGoal}
      />

      {/* Navbar */}
      <header className="navbar">
        <div className="page-container flex-row-between navbar-inner">
          <div className="brand">Habitude</div>

          <div className="dashboard-nav">
            <button
              className={`tab-btn ${activeTab === 'focus' ? 'active' : ''}`}
              onClick={() => setActiveTab('focus')}
            >
              Focuses
            </button>
            <button
              className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </button>
            <button
              className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
              onClick={() => setActiveTab('habits')}
            >
              Habits
            </button>
            <button
              className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              Goals
            </button>
          </div>

          <div className="flex-row">
            <button className="btn btn-outline" onClick={onLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="page-container" style={{ padding: 'var(--space-xl) var(--space-lg)', flex: 1 }}>
        {/* Metric Cards */}
        <div className="grid-cols-4">
          <div className="metric-card">
            <span>Total Focuses</span>
            <h3>{focuses.length}</h3>
          </div>
          <div className="metric-card">
            <span>Logged Activities</span>
            <h3>{activities.length}</h3>
          </div>
          <div className="metric-card">
            <span>Active Habits</span>
            <h3>{habits.length}</h3>
          </div>
          <div className="metric-card">
            <span>Active Goals</span>
            <h3>{goals.length}</h3>
          </div>
        </div>

        {/* Tab 1: FOCUS */}
        {activeTab === 'focus' && (
          <section>
            <div className="action-bar">
              <div>
                <h2>Your Focus Areas</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Categories that organize your daily activities, targets, and habit streaks.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleOpenAddFocus}>
                + Add Focus
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
            ) : focuses.length === 0 ? (
              <div className="empty-state">
                <h4>No Focus Areas Created Yet</h4>
                <p>Create your first focus area to start attaching activities and habits.</p>
                <button className="btn btn-primary" onClick={handleOpenAddFocus}>
                  + Create Focus
                </button>
              </div>
            ) : (
              <div className="focus-grid">
                {focuses.map((item) => (
                  <div key={item.id || item.name} className="focus-card">
                    <div className="focus-card-header">
                      <span className="focus-title">{item.name.toUpperCase()}</span>
                      <span
                        className="badge"
                        style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary)' }}
                      >
                        Focus Area
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div className="focus-actions">
                        <button className="btn-icon" onClick={() => handleOpenEditFocus(item)}>
                          Rename
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteFocus(item.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: ACTIVITIES */}
        {activeTab === 'activities' && (
          <section>
            <div className="action-bar">
              <div>
                <h2>Activity Logs</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Track effort, duration, and output across your focus areas.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleOpenLogActivity}>
                + Log Activity
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading activities...</p>
            ) : activities.length === 0 ? (
              <div className="empty-state">
                <h4>No Activities Logged</h4>
                <p>Record your completed study blocks, workouts, or tasks.</p>
                <button className="btn btn-primary" onClick={handleOpenLogActivity}>
                  + Log First Activity
                </button>
              </div>
            ) : (
              <div className="activity-list">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-main">
                      <span className="activity-title">{act.title}</span>
                      <div className="activity-meta">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: 'var(--primary-subtle)',
                            color: 'var(--primary)',
                            fontSize: '11px',
                          }}
                        >
                          {act.focusName ? act.focusName.toUpperCase() : 'GENERAL'}
                        </span>
                        {act.habitTitle && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'var(--success-subtle)',
                              color: 'var(--success)',
                              fontSize: '11px',
                            }}
                          >
                            Habit: {act.habitTitle}
                          </span>
                        )}
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

                    <div className="flex-row" style={{ gap: 'var(--space-md)' }}>
                      <div className="activity-value-badge">
                        {act.value} {act.customUnit || ''}
                      </div>
                      <div className="focus-actions">
                        <button className="btn-icon" onClick={() => handleOpenEditActivity(act)}>
                          Edit
                        </button>
                        <button
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteActivity(act.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 3: HABITS */}
        {activeTab === 'habits' && (
          <section>
            <div className="action-bar">
              <div>
                <h2>Habits & Streaks</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Maintain positive routines and monitor your unbroken consistency.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleOpenAddHabit}>
                + New Habit
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading habits...</p>
            ) : habits.length === 0 ? (
              <div className="empty-state">
                <h4>No Habits Tracked Yet</h4>
                <p>Define recurring daily or weekly targets to start building streaks.</p>
                <button className="btn btn-primary" onClick={handleOpenAddHabit}>
                  + Create First Habit
                </button>
              </div>
            ) : (
              <div className="habit-grid">
                {habits.map((h) => (
                  <div key={h.id} className="habit-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {h.focusName ? h.focusName.toUpperCase() : 'GENERAL'}
                        </span>

                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              h.habitType === 'BAD'
                                ? 'rgba(239, 68, 68, 0.1)'
                                : 'rgba(34, 197, 94, 0.1)',
                            color: h.habitType === 'BAD' ? 'var(--danger)' : '#16a34a',
                            fontSize: '11px',
                          }}
                        >
                          {h.habitType === 'BAD' ? 'Break Habit' : 'Good Habit'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: '4px 0' }}>
                        {h.title ? h.title.split('#')[0].trim() : ''}
                      </h3>

                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                        {h.description || 'Consistency target'}
                      </p>

                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Target: <strong>{h.targetValue || 1} {h.customUnit || 'times'}</strong> / {(h.frequency || h.habitFrequency || 'DAILY').toLowerCase()}
                      </div>
                    </div>

                    <div className="habit-streak-banner" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Current Streak
                        </div>
                        <div className="streak-counter" style={{ fontSize: 'var(--text-base)', fontWeight: 750 }}>
                          {h.currentStreak || 0} {h.frequency === 'DAILY' || !h.frequency ? 'Days' : 'Periods'}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Best Record
                        </div>
                        <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {h.longestStreak || h.currentStreak || 0} Days
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 4: GOALS */}
        {activeTab === 'goals' && (
          <section>
            <div className="action-bar">
              <div>
                <h2>Target Goals</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Long-term and short-term targets with status tracking.
                </p>
              </div>
              <button className="btn btn-primary" onClick={handleOpenAddGoal}>
                + Set Goal
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading goals...</p>
            ) : goals.length === 0 ? (
              <div className="empty-state">
                <h4>No Goals Defined Yet</h4>
                <p>Define clear milestones with target metrics and deadlines.</p>
                <button className="btn btn-primary" onClick={handleOpenAddGoal}>
                  + Set First Goal
                </button>
              </div>
            ) : (
              <div className="goal-grid">
                {goals.map((g) => {
                  const progress = g.totalProgress || 0;
                  const target = g.targetValue || 1;
                  const percent = Math.min(100, Math.round((progress / target) * 100));

                  return (
                    <div key={g.id} className="goal-card">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'var(--bg-subtle)',
                              color: 'var(--text-secondary)',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            {g.focusName ? g.focusName.toUpperCase() : 'GENERAL'}
                          </span>

                         <span
    className={`badge status-badge-${g.status || 'NOT_STARTED'}`}
    style={{
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.5px',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
    }}
  >
    {(g.status || 'NOT_STARTED').replace('_', ' ')}
  </span>
                        </div>

                        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: '4px 0' }}>
                         {g.title ? g.title.split('#')[0].trim() : ''}
                        </h3>

                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '12px' }}>
                          {g.description || 'Target milestone'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                          <span>Progress: <strong>{progress} / {target} {g.customUnit || ''}</strong></span>
                          <span><strong>{percent}%</strong></span>
                        </div>

                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${percent}%` }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                          <span>Deadline: {g.endDate || 'No limit'}</span>
                          <div className="focus-actions">
                            <button className="btn-icon" onClick={() => handleOpenEditGoal(g)}>
                              Edit
                            </button>
                            <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteGoal(g.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}