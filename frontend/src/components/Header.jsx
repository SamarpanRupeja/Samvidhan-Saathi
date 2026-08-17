import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, Compass, Award, MessageSquareQuote, ShieldAlert, Sparkles,
  Scale, Menu, X, User, LogIn, ShieldCheck, Flame
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import SOSPocketModal from './SOSPocketModal';

export default function Header() {
  const location = useLocation();
  const { language, setLanguage, mode, setMode, t } = useLanguage();
  const { user, isAuthenticated, openLogin } = useAuth();
  const userStats = apiService.getUserPoints();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t.home, icon: Compass },
    { path: '/explore', label: t.explore, icon: BookOpen },
    { path: '/scenarios', label: t.scenarios, icon: ShieldAlert },
    { path: '/ai-chat', label: t.aiAssistant, icon: MessageSquareQuote },
    { path: '/profile', label: isAuthenticated ? 'My Passport' : t.profile, icon: Award },
  ];

  const totalPoints = user?.total_points || userStats.total_points;

  return (
    <>
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '0.65rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Logo & Emblem */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #1E3A8A 50%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              <Scale size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text-saffron">
                  {t.appName}
                </span>
              </div>
              <p className="hide-mobile" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.7rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#fbbf24' : 'var(--text-muted)',
                    background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                    transition: 'var(--transition)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

            {/* SOS Emergency Pocket Rights Button */}
            <button
              onClick={() => setSosModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
              title="Instant Emergency Rights Pocket Card"
            >
              <ShieldAlert size={14} color="#ef4444" />
              <span>SOS Rights</span>
            </button>

            {/* Language Selector */}
            <div style={{ display: 'flex', background: 'var(--bg-glass-input)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              {['en', 'hi', 'hinglish'].map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.725rem',
                    fontWeight: language === l ? 700 : 500,
                    background: language === l ? '#fbbf24' : 'transparent',
                    color: language === l ? '#0b0f19' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {l === 'en' ? 'EN' : (l === 'hi' ? 'HI' : 'Hing')}
                </button>
              ))}
            </div>

            {/* Points / Auth Widget */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  fontSize: '0.775rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <User size={13} />
                <span className="hide-mobile">{user.name.split(' ')[0]}</span>
                <span style={{ color: 'var(--text-dim)' }}>•</span>
                <span>{totalPoints} XP</span>
              </Link>
            ) : (
              <button
                onClick={openLogin}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', gap: '0.3rem' }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-light)'
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Out Menu */}
        {mobileOpen && (
          <div className="mobile-nav-overlay" style={{
            position: 'fixed',
            top: '65px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 14, 23, 0.97)',
            backdropFilter: 'blur(16px)',
            zIndex: 99,
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease',
            overflowY: 'auto'
          }}>
            {/* Mobile Nav Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '1.05rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#fbbf24' : 'var(--text-main)',
                      background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-light)'
                    }}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setSosModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#fca5a5',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <ShieldAlert size={20} color="#ef4444" />
                <span>SOS Pocket Emergency Rights</span>
              </button>
            </nav>

            {/* Mobile Mode Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 600 }}>Explanation Mode:</p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[
                  { key: 'simple', label: 'Simple', color: '#34d399' },
                  { key: 'student', label: 'Student', color: '#fbbf24' },
                  { key: 'detailed', label: 'Detailed', color: '#f87171' },
                ].map(m => (
                  <button
                    key={m.key}
                    onClick={() => { setMode(m.key); setMobileOpen(false); }}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: mode === m.key ? 700 : 500,
                      background: mode === m.key ? `${m.color}22` : 'var(--bg-tertiary)',
                      color: mode === m.key ? m.color : 'var(--text-muted)',
                      border: mode === m.key ? `1px solid ${m.color}55` : '1px solid var(--border-light)'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* SOS Pocket Rights Modal */}
      <SOSPocketModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />
    </>
  );
}
