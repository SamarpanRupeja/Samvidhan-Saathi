import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award, Sparkles, Flame, BookOpen, CheckCircle2, ShieldCheck, Trophy,
  User, ArrowRight, Bookmark, MessageSquareQuote, Settings, LogOut,
  Share2, Check, RefreshCw, Star, ShieldAlert, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function Profile() {
  const { user, isAuthenticated, logout, openLogin, openRegister, updateUserProfile, addPoints } = useAuth();
  const { language, setLanguage, mode, setMode } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // overview, vault, history, leaderboard, settings
  const [stats, setStats] = useState(apiService.getUserPoints());
  const [bookmarks, setBookmarks] = useState([]);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('all_time');
  const [copiedPassport, setCopiedPassport] = useState(false);

  // Settings form
  const [editName, setEditName] = useState(user?.name || 'Citizen of Bharat');
  const [editLang, setEditLang] = useState(language);
  const [editMode, setEditMode] = useState(mode);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Daily Quests state
  const [quests, setQuests] = useState([
    { id: 1, title: 'Solve 1 Constitutional Scenario', reward: 30, completed: true, claimed: false },
    { id: 2, title: 'Read 1 Fundamental Rights Article', reward: 20, completed: true, claimed: false },
    { id: 3, title: 'Ask AI 1 Real-Life Question', reward: 25, completed: false, claimed: false },
  ]);

  useEffect(() => {
    setStats(apiService.getUserPoints());
    setBookmarks(apiService.getBookmarks());
    setSavedAnswers(apiService.getSavedAnswers());
    
    async function loadLeaderboard() {
      const data = await apiService.getLeaderboard(leaderboardPeriod);
      setLeaderboard(data);
    }
    loadLeaderboard();
  }, [leaderboardPeriod]);

  // Determine Level Title
  const totalPoints = user?.total_points || stats.total_points;
  const getLevelInfo = (pts) => {
    if (pts >= 500) return { level: 4, title: 'Samvidhan Ratna (संविधान रत्न)', next: 1000, color: '#f59e0b', icon: '👑' };
    if (pts >= 300) return { level: 3, title: 'Rights Guardian (अधिकार रक्षक)', next: 500, color: '#10b981', icon: '🛡️' };
    if (pts >= 150) return { level: 2, title: 'Constitutional Scholar (संविधान विद्यार्थी)', next: 300, color: '#3b82f6', icon: '📚' };
    return { level: 1, title: 'Active Citizen (सजग नागरिक)', next: 150, color: '#6366f1', icon: '🇮🇳' };
  };

  const levelInfo = getLevelInfo(totalPoints);
  const levelProgress = Math.min(100, Math.round((totalPoints / levelInfo.next) * 100));

  const badgesList = [
    { type: 'first_search', name: 'Explorer', desc: 'Searched your first constitutional situation', icon: '🔍', unlocked: true },
    { type: 'first_scenario', name: 'Dilemma Solver', desc: 'Completed your first What Would You Do scenario', icon: '🎭', unlocked: true },
    { type: 'rights_guardian', name: 'Rights Guardian', desc: 'Explored Part III Fundamental Freedoms', icon: '🛡️', unlocked: totalPoints >= 150 },
    { type: 'streak_7', name: 'Week Warrior', desc: 'Maintained a 7-day constitutional learning streak', icon: '🔥', unlocked: stats.streak_days >= 7 },
    { type: 'points_500', name: 'Constitution Scholar', desc: 'Earned 500+ constitutional awareness points', icon: '📚', unlocked: totalPoints >= 500 },
    { type: 'ai_explorer', name: 'AI Explorer', desc: 'Asked 10+ questions to the RAG AI assistant', icon: '🤖', unlocked: true },
  ];

  const learningPillars = [
    { title: 'Part III — Fundamental Rights', progress: 85, color: '#34d399', count: '6 / 6 Freedoms' },
    { title: 'Part IV — Directive Principles', progress: 50, color: '#fbbf24', count: '8 / 16 Principles' },
    { title: 'Part IVA — Fundamental Duties', progress: 70, color: '#60a5fa', count: '8 / 11 Duties' },
    { title: 'Landmark Supreme Court Judgments', progress: 60, color: '#f87171', count: '6 / 10 Cases' },
  ];

  const handleClaimQuest = (questId, reward) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    addPoints(reward);
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
  };

  const handleSharePassport = () => {
    const text = `🏛️ My Samvidhan Saathi Citizen Passport:\nLevel ${levelInfo.level}: ${levelInfo.title}\nPoints: ${totalPoints} XP | Streak: ${stats.streak_days} Days 🔥\nEmpowering Bharat with Constitutional Literacy! 🇮🇳`;
    navigator.clipboard.writeText(text);
    setCopiedPassport(true);
    setTimeout(() => setCopiedPassport(false), 2000);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateUserProfile({ name: editName, preferred_language: editLang, preferred_mode: editMode });
    setLanguage(editLang);
    setMode(editMode);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleDeleteBookmark = (articleId) => {
    apiService.removeBookmark(articleId);
    setBookmarks(apiService.getBookmarks());
  };

  const handleDeleteSavedAnswer = (id) => {
    apiService.removeSavedAnswer(id);
    setSavedAnswers(apiService.getSavedAnswers());
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">

        {/* Guest CTA Banner (if not logged in) */}
        {!isAuthenticated && (
          <div
            className="glass-panel"
            style={{
              padding: '1.25rem 1.75rem',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(30, 58, 138, 0.35))',
              border: '1px solid var(--border-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
              }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24' }}>
                  You are currently exploring in Guest Mode
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Create an account to save your {totalPoints} XP, maintain your {stats.streak_days}-day streak, and unlock your official Digital Citizen Passport!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={openLogin} className="btn btn-secondary btn-sm">
                Sign In
              </button>
              <button onClick={openRegister} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
                <span>Create Passport</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            DIGITAL CITIZEN PASSPORT CARD
            ========================================================================= */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%)',
            border: '1px solid var(--border-glow)',
            boxShadow: 'var(--shadow-glow-blue)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle background emblem watermark */}
          <div style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-20px',
            fontSize: '12rem',
            opacity: 0.05,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            🏛️
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            
            {/* User Info Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                fontSize: '2rem',
              }}>
                {levelInfo.icon}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                    {user?.name || 'Citizen of Bharat'}
                  </h1>
                  <span className="badge badge-saffron" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                    Level {levelInfo.level}
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: 700, marginTop: '0.2rem' }}>
                  {levelInfo.title}
                </p>

                <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  {user?.email || 'Official Citizen ID • Grounded in Part III of the Constitution'}
                </p>
              </div>
            </div>

            {/* Quick Stat Badges Right */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass-input)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                  <Sparkles size={13} color="#fbbf24" /> Total XP
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                  {totalPoints}
                </div>
              </div>

              <div style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass-input)',
                border: '1px solid var(--border-light)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                  <Flame size={13} color="#ef4444" /> Daily Streak
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>
                  {stats.streak_days} <span style={{ fontSize: '0.8rem' }}>Days</span>
                </div>
              </div>

              <button
                onClick={handleSharePassport}
                className="btn btn-secondary"
                style={{ alignSelf: 'center', gap: '0.35rem', padding: '0.75rem 1rem' }}
              >
                {copiedPassport ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
                <span>{copiedPassport ? 'Copied Card!' : 'Share Passport'}</span>
              </button>
            </div>

          </div>

          {/* Level Progress Bar */}
          <div style={{ marginTop: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
              <span>Level Progress ({totalPoints} / {levelInfo.next} XP)</span>
              <span>{levelProgress}% towards next citizen rank</span>
            </div>
            <div style={{
              height: '8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${levelProgress}%`,
                background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>

        </div>

        {/* =========================================================================
            DASHBOARD TAB NAVIGATION
            ========================================================================= */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {[
            { key: 'overview', label: 'Overview & Quests', icon: Sparkles },
            { key: 'vault', label: `Pocket Vault (${bookmarks.length + savedAnswers.length})`, icon: Bookmark },
            { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
            { key: 'settings', label: 'Settings & Preferences', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                  color: isActive ? '#fbbf24' : 'var(--text-muted)',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW & QUESTS
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div>
            
            {/* Daily Quests Widget */}
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={18} color="#fbbf24" /> Today's Constitutional Quests
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Complete daily civic tasks to maintain your learning streak and earn bonus XP
                  </p>
                </div>
                <span className="badge badge-saffron" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                  Resets in 6h 30m
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {quests.map(q => (
                  <div
                    key={q.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      background: 'var(--bg-glass-input)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: q.completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <CheckCircle2 size={16} color={q.completed ? '#34d399' : 'var(--text-dim)'} />
                      </div>
                      <span style={{ fontSize: '0.9rem', color: q.claimed ? 'var(--text-dim)' : 'var(--text-main)', textDecoration: q.claimed ? 'line-through' : 'none' }}>
                        {q.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
                        +{q.reward} XP
                      </span>

                      {q.claimed ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                          Claimed ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleClaimQuest(q.id, q.reward)}
                          disabled={!q.completed}
                          className={q.completed ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                          style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', opacity: q.completed ? 1 : 0.5 }}
                        >
                          Claim XP
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constitutional Mastery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              
              {/* Learning Pillars */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={18} color="#60a5fa" /> Constitutional Mastery Matrix
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  {learningPillars.map((p, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>{p.title}</span>
                        <span style={{ color: 'var(--text-dim)' }}>{p.count}</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.progress}%`, background: p.color, borderRadius: 'var(--radius-full)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges Collection */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={18} color="#fbbf24" /> Badges & Honors ({badgesList.filter(b => b.unlocked).length} / {badgesList.length})
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  {badgesList.map((badge, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: badge.unlocked ? 'var(--bg-glass-input)' : 'rgba(255, 255, 255, 0.02)',
                        border: badge.unlocked ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-light)',
                        textAlign: 'center',
                        opacity: badge.unlocked ? 1 : 0.45,
                        filter: badge.unlocked ? 'none' : 'grayscale(80%)',
                      }}
                    >
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{badge.icon}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: badge.unlocked ? 'var(--text-main)' : 'var(--text-dim)' }}>
                        {badge.name}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '0.2rem', lineHeight: 1.3 }}>
                        {badge.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: POCKET VAULT (Saved Articles & AI Answers)
            ========================================================================= */}
        {activeTab === 'vault' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Bookmark size={20} color="#fbbf24" /> Your Personal Constitutional Vault
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Quick reference for constitutional articles and AI explanations you bookmarked for later
              </p>
            </div>

            {/* Bookmarked Articles */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#60a5fa', marginBottom: '0.75rem' }}>
                Saved Articles ({bookmarks.length})
              </h4>

              {bookmarks.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <p>No articles bookmarked yet.</p>
                  <Link to="/explore" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
                    Explore & Bookmark Articles
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {bookmarks.map(b => (
                    <div
                      key={b.article_id}
                      className="glass-card"
                      style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span className="badge badge-saffron" style={{ fontSize: '0.75rem' }}>
                            {b.article_number === 'Preamble' ? 'Preamble' : `Article ${b.article_number}`}
                          </span>
                          <button
                            onClick={() => handleDeleteBookmark(b.article_id)}
                            style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                        <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                          {b.article_title}
                        </h5>
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {b.part_name}
                        </p>
                      </div>

                      <Link
                        to={`/article/${b.article_number}`}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '1rem', width: '100%', gap: '0.3rem', fontSize: '0.775rem' }}
                      >
                        <span>Open Article</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved AI Q&As */}
            <div>
              <h4 style={{ fontSize: '1rem', color: '#fbbf24', marginBottom: '0.75rem' }}>
                Saved AI Explanations ({savedAnswers.length})
              </h4>

              {savedAnswers.length === 0 ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  <p>No AI Q&A answers saved yet.</p>
                  <Link to="/ai-chat" className="btn btn-secondary btn-sm" style={{ marginTop: '0.75rem' }}>
                    Ask AI & Bookmark Answers
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {savedAnswers.map(item => (
                    <div key={item.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                          💬 "{item.query}"
                        </div>
                        <button
                          onClick={() => handleDeleteSavedAnswer(item.id)}
                          style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: LEADERBOARD
            ========================================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Trophy size={20} color="#fbbf24" /> National Citizen Leaderboard
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Top constitutional learners across Bharat
                </p>
              </div>

              <div style={{ display: 'flex', background: 'var(--bg-glass-input)', borderRadius: 'var(--radius-sm)', padding: '0.2rem' }}>
                {['weekly', 'all_time'].map(p => (
                  <button
                    key={p}
                    onClick={() => setLeaderboardPeriod(p)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: leaderboardPeriod === p ? 700 : 500,
                      background: leaderboardPeriod === p ? '#fbbf24' : 'transparent',
                      color: leaderboardPeriod === p ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {p === 'weekly' ? 'This Week' : 'All Time'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {leaderboard.map(entry => (
                <div
                  key={entry.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    background: entry.rank <= 3 ? 'rgba(245, 158, 11, 0.08)' : 'var(--bg-glass-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: entry.rank === 1 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: entry.rank === 1 ? '#f59e0b' : (entry.rank === 2 ? '#94a3b8' : (entry.rank === 3 ? '#b45309' : 'rgba(255,255,255,0.06)')),
                      color: entry.rank <= 3 ? '#000' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                    }}>
                      {entry.rank}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {entry.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                        {entry.badges_count} Badges Earned
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fbbf24' }}>
                    {entry.points} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SETTINGS & PREFERENCES
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Settings size={18} color="#fbbf24" /> Account & Preferences
            </h3>

            {settingsSaved && (
              <div style={{
                padding: '0.65rem 1rem',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--radius-sm)',
                color: '#34d399',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
              }}>
                Preferences saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-glass-input)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Default Language
                </label>
                <select
                  value={editLang}
                  onChange={(e) => setEditLang(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-glass-input)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Default Explanation Mode
                </label>
                <select
                  value={editMode}
                  onChange={(e) => setEditMode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-glass-input)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="simple">🟢 Simple (Class 6-10 / Common Citizen)</option>
                  <option value="student">🟡 Student (Class 11-Grad)</option>
                  <option value="detailed">🔴 Detailed (Aspirants / Legal Research)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '0.5rem', padding: '0.75rem' }}
              >
                Save Preferences
              </button>
            </form>

            {isAuthenticated && (
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                <button
                  onClick={logout}
                  className="btn btn-secondary"
                  style={{ width: '100%', color: '#f87171', gap: '0.4rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                >
                  <LogOut size={16} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
