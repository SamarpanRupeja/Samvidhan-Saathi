import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, BookOpen } from 'lucide-react';

export default function SourceCitation({ source }) {
  return (
    <div style={{
      background: 'var(--bg-glass-input)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.75rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <ShieldCheck size={16} color="#10b981" />
        <div>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fbbf24' }}>
            {source.reference || 'Constitutional Article'}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '480px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {source.text_snippet || 'Verified text from official Constitution of India database.'}
          </p>
        </div>
      </div>

      <Link
        to={source.reference ? `/article/${source.reference.replace(/[^0-9a-zA-Z]/g, '')}` : '/explore'}
        className="btn btn-outline-saffron btn-sm"
        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', gap: '0.25rem' }}
      >
        <BookOpen size={12} />
        <span>View Article</span>
        <ExternalLink size={11} />
      </Link>
    </div>
  );
}
