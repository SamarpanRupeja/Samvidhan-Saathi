import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Award, Sparkles, BookOpen, Scale, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function ScenarioPlayer({ scenario, onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { language, t } = useLanguage();

  if (!scenario) return null;

  const title = (language === 'hi' && scenario.scenario_title_hi)
    ? scenario.scenario_title_hi
    : (scenario.scenario_title_en || scenario.scenario_title_hi || 'Interactive Constitutional Scenario');

  const description = (language === 'hi' && scenario.scenario_description_hi)
    ? scenario.scenario_description_hi
    : (scenario.scenario_description_en || scenario.scenario_description_hi || 'A citizen is facing a constitutional situation. Examine the options below and choose the legally sound decision.');

  const options = (Array.isArray(scenario.options) && scenario.options.length > 0)
    ? scenario.options
    : [
        { option: "A", text: "Accept the restriction without questioning", is_correct: false, feedback: "Incorrect. The Constitution gives you rights to challenge unconstitutional restrictions." },
        { option: "B", text: "Assert your fundamental constitutional rights and legal remedies", is_correct: true, feedback: "Correct! Fundamental rights under Part III protect citizens against arbitrary state action." },
        { option: "C", text: "Retaliate with unlawful actions", is_correct: false, feedback: "Unlawful actions can lead to criminal penalties. Always use constitutional and legal remedies." },
        { option: "D", text: "Ignore the situation completely", is_correct: false, feedback: "Exercising your constitutional rights is essential for democracy and justice." }
      ];

  const handleSelect = (optLetter) => {
    if (result) return; // Prevent changing after submission
    setSelectedOption(optLetter);
  };

  const handleSubmit = async () => {
    if (!selectedOption || loading) return;
    setLoading(true);
    try {
      const res = await apiService.submitScenario(scenario.scenario_id, selectedOption);
      setResult(res);

      if (res.is_correct) {
        apiService.addLocalPoints(res.points_earned || scenario.points_value || 50);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#FFFFFF']
        });
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setResult(null);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '820px', margin: '0 auto', border: '1px solid var(--border-active)' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-saffron">
            <Scale size={13} /> Scenario #{scenario.scenario_id || 1}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
            {'⭐'.repeat(scenario.difficulty_level || 2)}
          </span>
        </div>
        <span className="badge badge-blue">
          <Award size={13} /> +{scenario.points_value || 50} Points
        </span>
      </div>

      {/* Title & Description */}
      <h2 style={{ fontSize: '1.45rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
        {title}
      </h2>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderLeft: '4px solid #f59e0b',
        padding: '1rem 1.25rem',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        marginBottom: '1.75rem',
        fontSize: '1.025rem',
        lineHeight: 1.6,
        color: 'var(--text-main)'
      }}>
        {description}
      </div>

      {/* Decision Prompt */}
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Sparkles size={16} /> What would you do in this situation?
      </h4>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {options.map((opt) => {
          const isSelected = selectedOption === opt.option;
          let borderStyle = '1px solid var(--border-light)';
          let bgStyle = 'var(--bg-glass-card)';
          let textColor = 'var(--text-main)';

          if (result) {
            if (opt.option === result.correct_option) {
              borderStyle = '1.5px solid #10b981';
              bgStyle = 'rgba(16, 185, 129, 0.15)';
            } else if (isSelected && !result.is_correct) {
              borderStyle = '1.5px solid #ef4444';
              bgStyle = 'rgba(239, 68, 68, 0.15)';
            }
          } else if (isSelected) {
            borderStyle = '1.5px solid #f59e0b';
            bgStyle = 'rgba(245, 158, 11, 0.15)';
          }

          return (
            <button
              key={opt.option}
              type="button"
              onClick={() => handleSelect(opt.option)}
              disabled={!!result}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: bgStyle,
                border: borderStyle,
                color: textColor,
                textAlign: 'left',
                cursor: result ? 'default' : 'pointer',
                transition: 'var(--transition)',
                boxShadow: isSelected ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'none'
              }}
            >
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                color: isSelected ? '#0b0f19' : 'var(--text-main)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.9rem'
              }}>
                {opt.option}
              </span>
              <span style={{ fontSize: '0.95rem', lineHeight: 1.45, flex: 1 }}>
                {opt.text}
              </span>
              {result && opt.option === result.correct_option && (
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
              )}
              {result && isSelected && !result.is_correct && (
                <XCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit Action */}
      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || loading}
          className="btn btn-primary btn-lg"
          style={{
            width: '100%',
            opacity: selectedOption ? 1 : 0.6,
            cursor: selectedOption ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? 'Evaluating...' : 'Submit Decision'}
        </button>
      ) : (
        /* Result & Feedback Box */
        <div style={{
          background: result.is_correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: result.is_correct ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginTop: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            {result.is_correct ? (
              <>
                <CheckCircle2 size={24} color="#10b981" />
                <h3 style={{ color: '#34d399', fontSize: '1.2rem' }}>
                  Correct Decision! (+{result.points_earned} Points)
                </h3>
              </>
            ) : (
              <>
                <XCircle size={24} color="#ef4444" />
                <h3 style={{ color: '#f87171', fontSize: '1.2rem' }}>
                  Incorrect. Correct was ({result.correct_option})
                </h3>
              </>
            )}
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: 1.55 }}>
            {result.feedback}
          </p>

          {/* Deep Constitutional Dive */}
          {result.explanation_en && (
            <div style={{ background: 'var(--bg-glass-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '0.4rem', fontWeight: 600 }}>
                📜 Constitutional Explanation:
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {language === 'hi' && result.explanation_hi ? result.explanation_hi : result.explanation_en}
              </p>
            </div>
          )}

          {/* Landmark Case Callout */}
          {result.related_case_law && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <Scale size={16} color="#fbbf24" />
              <span><strong>Landmark Ruling:</strong> {result.related_case_law}</span>
            </div>
          )}

          {/* Bottom Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
              <RotateCcw size={14} /> Retry
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {scenario.primary_article_id && (
                <Link to={`/explore`} className="btn btn-outline-saffron btn-sm" style={{ gap: '0.35rem' }}>
                  <BookOpen size={14} /> Related Article
                </Link>
              )}
              {onNext && (
                <button onClick={onNext} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                  <span>Next Scenario</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
