import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Search, Filter, Sparkles, Scale } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  const partsTabs = [
    { key: 'all', label: 'All Articles' },
    { key: 'preamble', label: 'Preamble' },
    { key: 'fundamental_rights', label: 'Part III: Rights' },
    { key: 'dpsp', label: 'Part IV: DPSP' },
    { key: 'duties', label: 'Part IVA: Duties' },
    { key: 'emergency', label: 'Part XVIII: Emergency' },
  ];

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const data = await apiService.getArticles();
        setArticles(data || []);
      } catch (err) {
        console.error("Failed to load articles:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  useEffect(() => {
    let result = articles || [];

    // Filter by Part tab
    if (activeTab !== 'all') {
      if (activeTab === 'preamble') {
        result = result.filter(a => a?.article_number === 'Preamble');
      } else if (activeTab === 'fundamental_rights') {
        result = result.filter(a => a?.part_name?.includes('Fundamental Rights'));
      } else if (activeTab === 'dpsp') {
        result = result.filter(a => a?.part_name?.includes('Directive Principles'));
      } else if (activeTab === 'duties') {
        result = result.filter(a => a?.part_name?.includes('Fundamental Duties'));
      } else if (activeTab === 'emergency') {
        result = result.filter(a => a?.part_name?.includes('Emergency'));
      }
    }

    // Filter by search query (safe null-check on all fields)
    if (query && query.trim()) {
      const qLower = query.trim().toLowerCase();
      const qWords = qLower.split(/\s+/).filter(w => w.length > 2);

      result = result.filter(a => {
        if (!a) return false;
        const num = (a.article_number || '').toLowerCase();
        const title = (a.article_title || '').toLowerCase();
        const orig = (a.original_text || '').toLowerCase();
        const simpEn = (a.simplified_text_en || '').toLowerCase();
        const simpHi = (a.simplified_text_hi || '').toLowerCase();
        const simpHing = (a.simplified_text_hinglish || '').toLowerCase();
        const kws = Array.isArray(a.keywords) ? a.keywords.map(k => String(k).toLowerCase()) : [];

        // Exact substring match in any field
        if (
          num.includes(qLower) ||
          title.includes(qLower) ||
          orig.includes(qLower) ||
          simpEn.includes(qLower) ||
          simpHi.includes(qLower) ||
          simpHing.includes(qLower) ||
          kws.some(k => k.includes(qLower))
        ) {
          return true;
        }

        // Word-level matching for situation descriptions (e.g. "police arrest without warrant")
        if (qWords.length > 0) {
          const matchCount = qWords.filter(word =>
            title.includes(word) ||
            simpEn.includes(word) ||
            simpHi.includes(word) ||
            simpHing.includes(word) ||
            kws.some(k => k.includes(word))
          ).length;
          return matchCount >= 1;
        }

        return false;
      });
    }

    setFilteredArticles(result);
  }, [query, activeTab, articles]);

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-saffron" style={{ marginBottom: '0.5rem' }}>
            <BookOpen size={14} /> Constitutional Articles Catalog
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '0.5rem' }}>
            Explore the Constitution of India
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Search across Articles, Parts, and Keywords. Every article is equipped with 3 explanation tiers and Bare Act text.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-glass-input)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            gap: '0.75rem'
          }}>
            <Search size={20} color="#fbbf24" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by article number (e.g. 21), title, or keyword (e.g. privacy, arrest, equality)..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '1rem'
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ fontSize: '0.8rem', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Part Category Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {partsTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab.key ? 700 : 500,
                  background: activeTab === tab.key ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : 'var(--bg-tertiary)',
                  color: activeTab === tab.key ? '#0b0f19' : 'var(--text-muted)',
                  border: activeTab === tab.key ? '1px solid #f59e0b' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredArticles.length}</strong> articles
            {query && <span> for "<em>{query}</em>"</span>}
          </span>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading constitutional articles...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.article_id || article.article_number} article={article} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No articles matched your search query: "{query}"
            </p>
            <button onClick={() => { setQuery(''); setActiveTab('all'); }} className="btn btn-secondary btn-sm">
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
