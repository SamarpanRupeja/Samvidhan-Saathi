import React, { useState, useEffect } from 'react';
import { ShieldAlert, Award, Filter, Sparkles, Scale, ArrowRight } from 'lucide-react';
import ScenarioPlayer from '../components/ScenarioPlayer';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function Scenarios() {
  const { language, t } = useLanguage();
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScenarios() {
      setLoading(true);
      try {
        const data = await apiService.getScenarios();
        setScenarios(data);
        if (data.length > 0) {
          setActiveScenario(data[0]);
        }
      } catch (err) {
        console.error("Failed to load scenarios:", err);
      } finally {
        setLoading(false);
      }
    }
    loadScenarios();
  }, []);

  const filteredScenarios = scenarios.filter((s) => {
    if (difficultyFilter === 'all') return true;
    return String(s.difficulty_level) === difficultyFilter;
  });

  const handleNextScenario = () => {
    if (!activeScenario || scenarios.length === 0) return;
    const currentIndex = scenarios.findIndex(s => s.scenario_id === activeScenario.scenario_id);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    setActiveScenario(scenarios[nextIndex]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-saffron" style={{ marginBottom: '0.5rem' }}>
            <ShieldAlert size={14} /> Interactive Scenario Simulator
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '0.5rem' }}>
            What Would You Do?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Step into real-life legal dilemmas, make your decision, earn points, and discover the exact constitutional protection that applies.
          </p>
        </div>

        {/* Active Scenario Player */}
        {activeScenario && (
          <div style={{ marginBottom: '3.5rem' }}>
            <ScenarioPlayer
              key={activeScenario.scenario_id}
              scenario={activeScenario}
              onNext={handleNextScenario}
            />
          </div>
        )}

        {/* Browse All Scenarios Section */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Explore All Scenarios</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Select any case below to practice your constitutional awareness
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-glass-input)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              {[
                { label: 'All', val: 'all' },
                { label: '⭐ Easy', val: '1' },
                { label: '⭐⭐ Medium', val: '2' },
                { label: '⭐⭐⭐ Hard', val: '3' },
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setDifficultyFilter(f.val)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: difficultyFilter === f.val ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: difficultyFilter === f.val ? '#fbbf24' : 'var(--text-muted)',
                    border: difficultyFilter === f.val ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scenarios Grid */}
          <div className="grid-3">
            {filteredScenarios.map((sc) => {
              const isCurrent = activeScenario?.scenario_id === sc.scenario_id;
              const title = (language === 'hi' && sc.scenario_title_hi) ? sc.scenario_title_hi : sc.scenario_title_en;
              return (
                <div
                  key={sc.scenario_id}
                  className="glass-card"
                  onClick={() => {
                    setActiveScenario(sc);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    borderColor: isCurrent ? '#f59e0b' : 'var(--border-light)',
                    boxShadow: isCurrent ? 'var(--shadow-glow-saffron)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
                        Scenario #{sc.scenario_id}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                        {'⭐'.repeat(sc.difficulty_level || 2)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: isCurrent ? '#fbbf24' : 'var(--text-main)' }}>
                      {title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1rem' }}>
                      {(sc.scenario_description_en || '').slice(0, 110)}...
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                      +{sc.points_value || 50} pts
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                      {isCurrent ? 'Playing Now' : 'Play Scenario'} <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
