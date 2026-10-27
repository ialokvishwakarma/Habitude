import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import recommendationService from '../features/recommendations/recommendationService';
import axiosClient from '../api/axiosClient';

export default function RecommendationsPage() {
  const [activeEngine, setActiveEngine] = useState('benchmarks'); // 'benchmarks' | 'aicoach'

  // Date Filter State (Last 7 Days by default)
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  // 1. Standard Benchmarks State
  const [benchmarks, setBenchmarks] = useState([]);
  const [benchmarksLoading, setBenchmarksLoading] = useState(false);
  const [benchmarksError, setBenchmarksError] = useState('');

  // 2. AI Coach State
  const [focusList, setFocusList] = useState([]);
  const [selectedFocusId, setSelectedFocusId] = useState('');
  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    loadFocusList();
  }, []);

  useEffect(() => {
    if (activeEngine === 'benchmarks') {
      fetchBenchmarks();
    }
  }, [activeEngine, startDate, endDate]);

  const loadFocusList = async () => {
    try {
      const res = await axiosClient.get('/focus/my-focus');
      const list = Array.isArray(res.data) ? res.data : res.data?.content || [];
      setFocusList(list);
      if (list.length > 0) {
        setSelectedFocusId(String(list[0].id));
      }
    } catch (err) {
      console.error('Failed to load focus list for AI Coach', err);
    }
  };

  const fetchBenchmarks = async () => {
    try {
      setBenchmarksLoading(true);
      setBenchmarksError('');
      const data = await recommendationService.getStandardBenchmarks(startDate, endDate);
      setBenchmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      setBenchmarksError(err.response?.data?.message || 'Failed to calculate benchmark audits');
    } finally {
      setBenchmarksLoading(false);
    }
  };

  const handleGenerateAICoach = async () => {
    if (!selectedFocusId) {
      setAiError('Please select a focus area first.');
      return;
    }

    try {
      setAiLoading(true);
      setAiError('');
      setAiReport('');
      const report = await recommendationService.getAICoachInsight(
        selectedFocusId,
        startDate,
        endDate
      );
      setAiReport(typeof report === 'string' ? report : JSON.stringify(report));
    } catch (err) {
      setAiError(err.response?.data?.message || 'AI Coach could not generate insights for this window.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      <Topbar title="Recommendations & Coaching" />

      <div className="page-body" style={{ maxWidth: '1000px' }}>
        {/* Navigation Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveEngine('benchmarks')}
            style={{
              padding: '9px 20px',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              cursor: 'pointer',
              border: activeEngine === 'benchmarks' ? '1px solid #4f46e5' : '1px solid #e2e8f0',
              backgroundColor: activeEngine === 'benchmarks' ? '#4f46e5' : '#ffffff',
              color: activeEngine === 'benchmarks' ? '#ffffff' : '#475569',
            }}
          >
            Standard Benchmarks
          </button>
          <button
            type="button"
            onClick={() => setActiveEngine('aicoach')}
            style={{
              padding: '9px 20px',
              fontWeight: 600,
              fontSize: '13px',
              borderRadius: '8px',
              cursor: 'pointer',
              border: activeEngine === 'aicoach' ? '1px solid #7c3aed' : '1px solid #e2e8f0',
              backgroundColor: activeEngine === 'aicoach' ? '#7c3aed' : '#ffffff',
              color: activeEngine === 'aicoach' ? '#ffffff' : '#475569',
            }}
          >
            AI Coach
          </button>
        </div>

        {/* Engine 1: Standard Benchmarks */}
        {activeEngine === 'benchmarks' && (
          <div>
            <div
              className="section-card"
              style={{
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>Audit Time Window</h4>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                  Audits your logged averages against health and focus normative standards based on your age.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block' }}>From</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block' }}>To</label>
                  <input
                    type="date"
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px' }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {benchmarksError && (
              <div className="form-error" style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px' }}>
                {benchmarksError}
              </div>
            )}

            {benchmarksLoading ? (
              <p style={{ color: 'var(--text-secondary)' }}>Comparing against normative standards...</p>
            ) : benchmarks.length === 0 ? (
              <div className="empty-state">
                <h4>No Benchmark Matches Found</h4>
                <p>Ensure age is saved in Profile and activities with reference categories are logged.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {benchmarks.map((item, idx) => {
                  const isMet =
                    item.comparisonType === 'MINIMUM'
                      ? item.actualValue >= item.referenceValue
                      : item.actualValue <= item.referenceValue;

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        border: `1px solid ${isMet ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase' }}>
                            {String(item.referenceCategory).replace(/_/g, ' ')}
                          </span>

                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              backgroundColor: isMet ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: isMet ? '#059669' : '#dc2626',
                            }}
                          >
                            {isMet ? 'OPTIMAL' : 'BELOW BENCHMARK'}
                          </span>
                        </div>

                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: '0 0 12px' }}>
                          {item.message}
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #f1f5f9',
                          fontSize: '12px',
                        }}
                      >
                        <div>
                          <span style={{ color: '#64748b' }}>Your Avg:</span>
                          <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                            {item.actualValue} {String(item.referenceUnit || '').toLowerCase()}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Target Standard:</span>
                          <div style={{ fontWeight: 700, color: '#4f46e5', marginTop: '2px' }}>
                            {item.comparisonType === 'MINIMUM' ? '>= ' : '<= '}
                            {item.referenceValue} {String(item.referenceUnit || '').toLowerCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Engine 2: AI Coach */}
        {activeEngine === 'aicoach' && (
          <div>
            <div
              className="section-card"
              style={{
                padding: '24px',
                marginBottom: '24px',
                borderRadius: '12px',
                background: 'linear-gradient(180deg, rgba(245, 243, 255, 0.6) 0%, #ffffff 100%)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
              }}
            >
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#4c1d95' }}>
                  Habitude AI Coach Setup
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Select a focus area and timeframe to generate contextual, data-backed productivity guidance.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  alignItems: 'flex-end',
                }}
              >
                {/* Focus Dropdown */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Target Focus Area</label>
                  <select
                    className="form-input"
                    value={selectedFocusId}
                    onChange={(e) => setSelectedFocusId(e.target.value)}
                    disabled={focusList.length === 0}
                  >
                    {focusList.length === 0 ? (
                      <option value="">No Focus Areas Found</option>
                    ) : (
                      focusList.map((f) => (
                        <option key={f.id} value={String(f.id)}>
                          {f.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Date Window */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>From</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>To</label>
                  <input
                    type="date"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleGenerateAICoach}
                  disabled={aiLoading || !selectedFocusId || focusList.length === 0}
                  className="btn btn-primary"
                  style={{
                    height: '42px',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: aiLoading || !selectedFocusId ? 'not-allowed' : 'pointer',
                  }}
                >
                  {aiLoading ? 'Analyzing Logs...' : 'Generate Guidance'}
                </button>
              </div>
            </div>

            {aiError && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  color: '#dc2626',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                {aiError}
              </div>
            )}

            {/* AI Report Card */}
            {/* AI Response Presentation */}
            {aiReport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                      }}
                    >
                      AI
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                        Executive Coaching Report
                      </h3>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Focus: {focusList.find((f) => String(f.id) === String(selectedFocusId))?.name || 'Selected'}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(124, 58, 237, 0.1)',
                      color: '#7c3aed',
                    }}
                  >
                    Contextual Audit
                  </span>
                </div>

                {/* Structured Output Card */}
                <div
                  className="section-card"
                  style={{
                    padding: '24px',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                  }}
                >
                  {aiReport
                    .split(/###\s+\d+\.\s+/)
                    .filter(Boolean)
                    .map((section, idx) => {
                      const lines = section.trim().split('\n');
                      const title = lines[0]?.trim();
                      const content = lines.slice(1).join('\n').trim();

                      // Minimal Accent Palettes per section
                      const styles = [
                        { border: '#4f46e5', bg: 'rgba(79, 70, 229, 0.03)', badge: '#4f46e5' }, // 1. Insight (Indigo)
                        { border: '#10b981', bg: 'rgba(16, 185, 129, 0.03)', badge: '#059669' }, // 2. Going Well (Emerald)
                        { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.03)', badge: '#d97706' }, // 3. Improvement (Amber)
                        { border: '#7c3aed', bg: 'rgba(124, 58, 237, 0.03)', badge: '#7c3aed' }, // 4. Action Steps (Violet)
                      ][idx] || { border: '#cbd5e1', bg: '#f8fafc', badge: '#475569' };

                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: idx === 3 ? 0 : '18px',
                            padding: '16px 20px',
                            borderRadius: '10px',
                            backgroundColor: styles.bg,
                            borderLeft: `4px solid ${styles.border}`,
                            borderTop: '1px solid #f1f5f9',
                            borderRight: '1px solid #f1f5f9',
                            borderBottom: '1px solid #f1f5f9',
                          }}
                        >
                          <h4
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: styles.badge,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {title}
                          </h4>
                          <div
                            style={{
                              fontSize: '14px',
                              lineHeight: '1.6',
                              color: '#334155',
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {content.replace(/\*\*/g, '')}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : !aiLoading ? (
              <div className="empty-state">
                <h4>No Coaching Plan Generated</h4>
                <p>Pick a focus area above and click "Generate Guidance" to evaluate your habits and activity volume.</p>
              </div>
            ) : (
              <div className="empty-state">
                <h4>Synthesizing Focus Activities...</h4>
                <p>AI is evaluating active days, logged hours, and habit consistency.</p>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}