import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Scale, Volume2, VolumeX, ArrowLeft, ArrowRight, Share2, Sparkles, AlertCircle, Bookmark, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function Article() {
  const { id } = useParams();
  const { language, setLanguage, mode, setMode } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const data = await apiService.getArticleByNumber(id || '21');
        setArticle(data);
        if (data) {
          setBookmarked(apiService.isBookmarked(data.article_id));
        }
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleToggleBookmark = () => {
    if (!article) return;
    if (bookmarked) {
      apiService.removeBookmark(article.article_id);
      setBookmarked(false);
    } else {
      apiService.addBookmark(article);
      setBookmarked(true);
    }
  };

  const getExplanationText = () => {
    if (!article) return "";
    if (mode === 'simple') {
      return language === 'hi'
        ? (article.simplified_text_hi || article.simplified_text_en)
        : (language === 'hinglish' ? (article.simplified_text_hinglish || article.simplified_text_en) : article.simplified_text_en);
    } else if (mode === 'student') {
      return language === 'hi'
        ? (article.student_text_hi || article.student_text_en)
        : article.student_text_en;
    }
    return article.detailed_text || article.original_text;
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = getExplanationText();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Constitutional Article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <Link to="/explore" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Explore
        </Link>
      </div>
    );
  }

  const currentExplanation = getExplanationText();

  return (
    <div style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Articles Explorer</span>
          </Link>
        </div>

        {/* Article Header Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-saffron" style={{ fontSize: '1rem', padding: '0.4rem 0.9rem', fontWeight: 800 }}>
                {article.article_number === 'Preamble' ? 'Preamble' : `Article ${article.article_number}`}
              </span>
              <span className="badge badge-blue">
                {article.part_name || 'Part III (Fundamental Rights)'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Bookmark to Pocket Vault */}
              <button
                onClick={handleToggleBookmark}
                className="btn btn-secondary btn-sm"
                style={{
                  gap: '0.4rem',
                  color: bookmarked ? '#fbbf24' : 'var(--text-main)',
                  border: bookmarked ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-light)',
                  background: bookmarked ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                }}
              >
                <Bookmark size={15} fill={bookmarked ? '#fbbf24' : 'none'} />
                <span>{bookmarked ? 'Saved to Vault' : 'Save to Vault'}</span>
              </button>

              {/* Audio Reader Button */}
              <button
                onClick={handleSpeak}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.4rem', color: isPlayingAudio ? '#10b981' : 'var(--text-main)' }}
              >
                {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isPlayingAudio ? 'Stop Audio' : 'Listen Explanation'}</span>
              </button>
            </div>

          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '0.75rem' }}>
            {article.article_title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Keywords:</span>
            {(article.keywords || []).map((kw, i) => (
              <span key={i} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* 3-Tier Mode Selector Bar */}
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Explanation Tier:
            </span>
            <div style={{ display: 'flex', background: 'var(--bg-glass-input)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', gap: '0.3rem' }}>
              <button
                onClick={() => setMode('simple')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  background: mode === 'simple' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: mode === 'simple' ? '#34d399' : 'var(--text-muted)',
                  border: mode === 'simple' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent'
                }}
              >
                🟢 Simple (Class 6-10)
              </button>
              <button
                onClick={() => setMode('student')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  background: mode === 'student' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  color: mode === 'student' ? '#fbbf24' : 'var(--text-muted)',
                  border: mode === 'student' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent'
                }}
              >
                🟡 Student (Class 11-Grad)
              </button>
              <button
                onClick={() => setMode('detailed')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  background: mode === 'detailed' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                  color: mode === 'detailed' ? '#f87171' : 'var(--text-muted)',
                  border: mode === 'detailed' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent'
                }}
              >
                🔴 Detailed (Aspirants)
              </button>
            </div>
          </div>

          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Language:</span>
            <div style={{ display: 'flex', background: 'var(--bg-glass-input)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              {['en', 'hi', 'hinglish'].map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.8rem',
                    fontWeight: language === l ? 700 : 500,
                    background: language === l ? '#fbbf24' : 'transparent',
                    color: language === l ? '#0b0f19' : 'var(--text-muted)'
                  }}
                >
                  {l === 'en' ? 'English' : (l === 'hi' ? 'हिंदी' : 'Hinglish')}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Main Content Grid */}
        <div className="article-grid">
          
          {/* Left: Active Explanation */}
          <div>
            
            {/* Explanation Box */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1.2rem', color: '#fbbf24' }}>
                  {mode === 'simple' ? 'Simplified Explanation' : (mode === 'student' ? 'Student Deep Dive' : 'Scholarly Constitutional Analysis')}
                </h3>
              </div>

              <div style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                {currentExplanation}
              </div>
            </div>

            {/* Original Constitutional Text Collapsible */}
            <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(15, 23, 42, 0.6)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={16} /> Official Constitutional Text (Bare Act)
              </h4>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: '#cbd5e1', lineHeight: 1.6, borderLeft: '3px solid #3b82f6', paddingLeft: '1rem' }}>
                "{article.original_text}"
              </p>
            </div>

          </div>

          {/* Right: Sidebar with Landmark Cases & Actions */}
          <div>
            
            {/* Action Box: Try a Scenario */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(17, 24, 39, 0.7) 100%)' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: '#fbbf24' }}>
                Test Your Understanding
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Put yourself in a real-life situation involving Article {article.article_number} and see if you make the right legal call.
              </p>
              <Link to="/scenarios" className="btn btn-primary btn-sm" style={{ width: '100%', gap: '0.4rem' }}>
                <span>Try a Scenario</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Landmark Cases Card */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa' }}>
                <Scale size={16} /> Landmark Supreme Court Judgments
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-glass-input)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Maneka Gandhi v. Union of India (1978)
                  </span>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Golden Triangle doctrine linking Articles 14, 19, and 21. Procedure must be fair, just and reasonable.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-glass-input)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    K.S. Puttaswamy v. UOI (2017)
                  </span>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    9-Judge bench unanimously declared Right to Privacy a fundamental right under Article 21.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Related Articles
              </h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['14', '19', '21', '22', '32'].map(num => (
                  <Link
                    key={num}
                    to={`/article/${num}`}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.8rem',
                      color: num === article.article_number ? '#fbbf24' : 'var(--text-muted)',
                      fontWeight: 600
                    }}
                  >
                    Art {num}
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
