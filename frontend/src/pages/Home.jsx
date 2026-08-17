import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, BookOpen, ShieldAlert, Sparkles, Award, ArrowRight, ShieldCheck, CheckCircle2, Flame, HelpCircle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';
import ScenarioPlayer from '../components/ScenarioPlayer';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [dailyScenario, setDailyScenario] = useState(null);
  const [myths, setMyths] = useState([]);
  const [activeMythIdx, setActiveMythIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      const articles = await apiService.getArticles();
      setFeaturedArticles(articles.slice(0, 3));

      const scenario = await apiService.getDailyScenario();
      setDailyScenario(scenario);

      setMyths(apiService.getMyths());
    }
    loadData();
  }, []);

  const handleSearch = (queryText) => {
    navigate(`/explore?q=${encodeURIComponent(queryText)}`);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section style={{
        padding: '4.5rem 0 3.5rem 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          
          {/* Top Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-saffron" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
              <Sparkles size={14} /> AI-Powered Constitutional Literacy for Bharat 🇮🇳
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 800,
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em',
            maxWidth: '960px',
            margin: '0 auto 1.25rem auto'
          }}>
            Know Your Rights. <br />
            <span className="gradient-text-saffron">Defend Your Freedoms.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            {t.subtitle}
          </p>

          {/* Central Situation Search Bar */}
          <SearchBar onSearch={handleSearch} autoFocus={false} />

          {/* Quick Stats Grid */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
            marginTop: '3.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>395+</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Articles Explained
              </p>
            </div>
            <div style={{ width: '1px', height: '35px', background: 'var(--border-light)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>3 Tiers</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simple • Student • Detailed
              </p>
            </div>
            <div style={{ width: '1px', height: '35px', background: 'var(--border-light)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>100%</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Source Grounded
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          4 PILLARS / ENTRY POINTS
          ========================================================================= */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div className="grid-4">
            
            <Link to="/explore" className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#fbbf24' }}>
                <BookOpen size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3-Tier Articles</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Read any Article in Simple (6-10th), Student, or Detailed modes with landmark judgments.
              </p>
            </Link>

            <Link to="/scenarios" className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#34d399' }}>
                <ShieldAlert size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>What Would You Do?</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Step into interactive real-life cases, make decisions, earn badges, and test legal instincts.
              </p>
            </Link>

            <Link to="/ai-chat" className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#60a5fa' }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Source-Grounded AI</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Ask in Hindi, English or Hinglish. Every AI response directly links to verified constitutional articles.
              </p>
            </Link>

            <Link to="/profile" className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#f87171' }}>
                <Award size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Gamified Mastery</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Track your constitutional literacy streak, earn Rights Guardian badges, and climb leaderboards.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED ARTICLES SECTION
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-saffron" style={{ marginBottom: '0.5rem' }}>Essential Articles</span>
              <h2 style={{ fontSize: '1.85rem' }}>Most Searched Constitutional Rights</h2>
            </div>
            <Link to="/explore" className="btn btn-outline-saffron btn-sm" style={{ gap: '0.4rem' }}>
              <span>View All 395+ Articles</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.article_id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          DAILY SCENARIO SPOTLIGHT
          ========================================================================= */}
      {dailyScenario && (
        <section style={{ padding: '3.5rem 0', background: 'rgba(245, 158, 11, 0.02)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="badge badge-saffron" style={{ marginBottom: '0.5rem' }}>
                <Flame size={14} color="#f59e0b" /> Daily Interactive Challenge
              </span>
              <h2 style={{ fontSize: '1.85rem' }}>{t.dailyChallenge}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Put yourself in Ramesh's shoes. Test what the law actually says.
              </p>
            </div>

            <ScenarioPlayer scenario={dailyScenario} onNext={() => navigate('/scenarios')} />
          </div>
        </section>
      )}

      {/* =========================================================================
          MYTH VS REALITY SECTION
          ========================================================================= */}
      {myths.length > 0 && (
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Busting WhatsApp Forwards</span>
              <h2 style={{ fontSize: '1.85rem' }}>Constitutional Myth vs. Reality</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Clear facts directly grounded in constitutional provisions and Supreme Court precedents.
              </p>
            </div>

            <div className="grid-3">
              {myths.map((m, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
                  
                  {/* Myth Block */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ❌ Common Myth:
                    </span>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.35rem' }}>
                      "{language === 'hi' ? m.myth_hi : m.myth_en}"
                    </p>
                  </div>

                  {/* Reality Block */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={13} /> Verified Constitutional Reality:
                    </span>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      {language === 'hi' ? m.reality_hi : m.reality_en}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* =========================================================================
          CALL TO ACTION / FOOTER TEASER
          ========================================================================= */}
      <section style={{ padding: '3.5rem 0', textAlign: 'center' }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '3.5rem 2rem', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(17, 24, 39, 0.8) 100%)', border: '1px solid var(--border-glow)' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Have a Legal Situation You Need Clarity On?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
              Talk to our source-grounded AI companion in Hindi, English or Hinglish and get verified Article citations instantly.
            </p>
            <Link to="/ai-chat" className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }}>
              <Sparkles size={20} />
              <span>Start Constitutional AI Chat</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
