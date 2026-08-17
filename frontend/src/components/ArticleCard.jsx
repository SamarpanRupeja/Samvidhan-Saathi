import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ArticleCard({ article }) {
  const { language, mode } = useLanguage();

  if (!article) return null;

  const getExplanation = () => {
    if (mode === 'simple') {
      return language === 'hi'
        ? (article.simplified_text_hi || article.simplified_text_en)
        : (language === 'hinglish' ? (article.simplified_text_hinglish || article.simplified_text_en) : article.simplified_text_en);
    } else if (mode === 'student') {
      return article.student_text_en || article.simplified_text_en;
    }
    return article.detailed_text || article.original_text;
  };

  const explanation = getExplanation() || article.original_text || article.article_title || '';
  const snippet = explanation.length > 170 ? explanation.slice(0, 170) + '...' : explanation;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <span className="badge badge-saffron" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
            {article.article_number === 'Preamble' ? 'Preamble' : `Article ${article.article_number}`}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>
            {article.part_name || 'Part III'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          {article.article_title}
        </h3>

        {/* Snippet */}
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
          {snippet}
        </p>

        {/* Keywords */}
        {article.keywords && article.keywords.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {article.keywords.slice(0, 3).map((kw, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-dim)'
                }}
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.9rem' }}>
        <Link
          to={`/article/${article.article_number}`}
          className="btn btn-outline-saffron btn-sm"
          style={{ gap: '0.35rem' }}
        >
          <BookOpen size={14} />
          <span>Read in 3 Modes</span>
          <ArrowRight size={13} />
        </Link>
        <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <ShieldCheck size={14} /> Verified
        </span>
      </div>
    </div>
  );
}
