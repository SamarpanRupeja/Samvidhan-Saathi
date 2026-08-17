import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Mic } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function SearchBar({ onSearch, autoFocus = false }) {
  const [query, setQuery] = useState('');
  const { t, language } = useLanguage();

  const samplePrompts = {
    en: [
      "Can police arrest me without telling me why?",
      "Can college ban student protests?",
      "Is internet access a constitutional right?",
      "Can employer force 14-hour workday?"
    ],
    hi: [
      "क्या पुलिस बिना वारंट के गिरफ्तार कर सकती है?",
      "क्या कॉलेज में शांतिपूर्ण प्रदर्शन पर रोक लग सकती है?",
      "निजता (प्राइवेसी) का मौलिक अधिकार क्या है?",
      "मुफ्त कानूनी सहायता कैसे प्राप्त करें?"
    ],
    hinglish: [
      "Mujhe bina bataye police arrest kar sakti hai kya?",
      "College admin peaceful meeting ban kar sakta hai?",
      "Internet shutdown constitutional hai ya illegal?",
      "Property dispute mein mere kya constitutional rights hain?"
    ]
  };

  const currentPrompts = samplePrompts[language] || samplePrompts.en;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  const handlePromptClick = (promptText) => {
    setQuery(promptText);
    onSearch(promptText);
  };

  return (
    <div style={{ width: '100%', maxWidth: '820px', margin: '0 auto' }}>
      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.4rem 0.5rem 0.4rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-active)',
          boxShadow: 'var(--shadow-glow-saffron)',
          gap: '0.75rem',
          background: 'var(--bg-glass-input)'
        }}
      >
        <Search size={22} color="#fbbf24" style={{ flexShrink: 0 }} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          autoFocus={autoFocus}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '1.05rem',
            padding: '0.6rem 0'
          }}
        />

        <button
          type="submit"
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-md)', padding: '0.7rem 1.4rem' }}
        >
          <span>{t.searchBtn}</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {/* Suggested Situation Prompts */}
      <div style={{ marginTop: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <Sparkles size={13} color="#fbbf24" /> Try asking:
        </span>
        {currentPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePromptClick(p)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
              e.currentTarget.style.color = '#fbbf24';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            "{p}"
          </button>
        ))}
      </div>
    </div>
  );
}
