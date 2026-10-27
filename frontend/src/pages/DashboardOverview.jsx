import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/Topbar';
import focusService from '../features/focus/focusService';
import activityService from '../features/activities/activityService';
import habitService from '../features/habits/habitService';
import goalService from '../features/goals/goalService';

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState({ focus: 0, activities: 0, habits: 0, goals: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [focusData, activityPage, habitData, goalData] = await Promise.all([
          focusService.getMyFocuses(),
          activityService.getActivities(0, 5),
          habitService.getMyHabits(),
          goalService.getMyGoals(),
        ]);
        setMetrics({
          focus: Array.isArray(focusData) ? focusData.length : 0,
          activities: activityPage?.totalElements || activityPage?.content?.length || 0,
          habits: Array.isArray(habitData) ? habitData.length : 0,
          goals: Array.isArray(goalData) ? goalData.length : 0,
        });
        setRecentActivities(activityPage?.content || []);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <Topbar title="Dashboard Overview" />
      <div className="page-body" style={{ maxWidth: '1100px' }}>
        {/* Metric Cards Grid with Palette Accents */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {/* Card 1: Focus Areas (Indigo) */}
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.18)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Focus Areas
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#312e81', margin: '8px 0 0' }}>
              {metrics.focus}
            </h3>
          </div>

          {/* Card 2: Logged Activities (Sky Blue) */}
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(2, 132, 199, 0.05)',
              border: '1px solid rgba(2, 132, 199, 0.18)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Logged Activities
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#0c4a6e', margin: '8px 0 0' }}>
              {metrics.activities}
            </h3>
          </div>

          {/* Card 3: Active Habits (Violet) */}
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(124, 58, 237, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.18)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Active Habits
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#4c1d95', margin: '8px 0 0' }}>
              {metrics.habits}
            </h3>
          </div>

          {/* Card 4: Active Goals (Emerald Green) */}
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.18)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Active Goals
            </span>
            <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#064e3b', margin: '8px 0 0' }}>
              {metrics.goals}
            </h3>
          </div>
        </div>

        {/* Section Card: Recent Activities */}
        <div
          className="section-card"
          style={{
            padding: '24px',
            borderRadius: '14px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Recent Activities
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                Latest telemetry data recorded across your active routines.
              </p>
            </div>

            <Link
              to="/activities"
              style={{
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0284c7',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(2, 132, 199, 0.08)',
              }}
            >
              View All &rarr;
            </Link>
          </div>

          {loading ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Loading overview...</p>
          ) : recentActivities.length === 0 ? (
            <div className="empty-state">
              <h4>No Activities Logged</h4>
              <p>Start tracking daily activities inside your focus areas.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div className="activity-main">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                        {act.title}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '5px',
                          backgroundColor: 'rgba(79, 70, 229, 0.08)',
                          color: '#4f46e5',
                          textTransform: 'uppercase',
                        }}
                      >
                        {act.focusName ? act.focusName.toUpperCase() : 'GENERAL'}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {act.activityDateTime
                        ? new Date(act.activityDateTime).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                      {act.description && <span> &bull; {act.description}</span>}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.2)',
                      color: '#0284c7',
                      fontWeight: 700,
                      fontSize: '13px',
                    }}
                  >
                    {act.value} {act.customUnit || ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}