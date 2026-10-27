import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import analyticsService from '../features/analytics/analyticsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await analyticsService.getDashboardAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <Topbar title="Performance Analytics" />
        <div className="page-body">
          <p style={{ color: 'var(--text-secondary)' }}>Aggregating analytics data...</p>
        </div>
      </div>
    );
  }

  const { goalAnalytics, habitAnalytics, activityAnalytics } = data || {};

  // Helpers to transform backend Map<String, Number> to Recharts array format [{ name, value }]
  const mapToChartData = (mapObj) => {
    if (!mapObj) return [];
    return Object.entries(mapObj).map(([key, value]) => ({
      name: key.toUpperCase(),
      value: Number(value),
    }));
  };

  const activitiesByFocusData = mapToChartData(activityAnalytics?.activitiesByFocus);
  const habitsByTypeData = mapToChartData(habitAnalytics?.habitsByType);
  const goalsByFocusData = mapToChartData(goalAnalytics?.goalsByFocus);

  const goalStatusData = [
    { name: 'Completed', value: goalAnalytics?.completedGoals || 0, color: '#16a34a' },
    { name: 'Active', value: goalAnalytics?.activeGoals || 0, color: 'var(--primary)' },
    { name: 'Not Started', value: goalAnalytics?.notStartedGoals || 0, color: '#94a3b8' },
  ].filter((item) => item.value > 0);

  const PIE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div>
      <Topbar title="Performance Analytics" />
      <div className="page-body">
        {/* Top Highlight Metric Cards */}
        <div className="grid-cols-4">
          <div className="metric-card">
            <span>Average Goal Progress</span>
            <h3>{Math.round(goalAnalytics?.averageProgress || 0)}%</h3>
          </div>
          <div className="metric-card">
            <span>Longest Streak</span>
            <h3>{habitAnalytics?.longestStreak || 0} Days</h3>
          </div>
          <div className="metric-card">
            <span>Avg Current Streak</span>
            <h3>{(habitAnalytics?.averageCurrentStreak || 0).toFixed(1)} Days</h3>
          </div>
          <div className="metric-card">
            <span>Total Logged Actions</span>
            <h3>{activityAnalytics?.totalActivities || 0}</h3>
          </div>
        </div>

        {/* Charts Row 1: Activities Distribution & Goal Status Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-xl)',
          }}
        >
          {/* Bar Chart: Activities per Focus */}
          <div className="section-card">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Activity Volume by Focus Area</h3>
            {activitiesByFocusData.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                No activity logs available for distribution.
              </p>
            ) : (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={activitiesByFocusData}>
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Donut Chart: Goals Status */}
          <div className="section-card">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Goal Completion Distribution</h3>
            {goalStatusData.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                No goals defined yet.
              </p>
            ) : (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={goalStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                    >
                      {goalStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2: Habits by Type & Focus Target Milestones */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-xl)',
          }}
        >
          {/* Habits By Type (Good vs Bad) */}
          <div className="section-card">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Habit Nature Breakdown</h3>
            {habitsByTypeData.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                No habits created yet.
              </p>
            ) : (
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={habitsByTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {habitsByTypeData.map((entry, index) => (
                        <Cell
                          key={`type-cell-${index}`}
                          fill={entry.name === 'GOOD' ? '#16a34a' : '#ef4444'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Goals by Focus Category */}
          <div className="section-card">
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Goals Grouped by Focus</h3>
            {goalsByFocusData.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                No focus-linked goals.
              </p>
            ) : (
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <BarChart data={goalsByFocusData}>
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="var(--text-secondary)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}