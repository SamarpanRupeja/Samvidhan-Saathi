import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function AuthModal() {
  const { authModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register, loading } = useAuth();
  const { language: currentLang, mode: currentMode, setLanguage, setMode } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prefLang, setPrefLang] = useState(currentLang || 'en');
  const [prefTier, setPrefTier] = useState(currentMode || 'simple');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (isLogin) {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error);
      }
    } else {
      const res = await register(name, email, password, prefLang, prefTier);
      if (res.success) {
        setLanguage(prefLang);
        setMode(prefTier);
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-active)',
          boxShadow: 'var(--shadow-glow-saffron)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-light)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #1e3a8a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
          }}>
            <ShieldCheck size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            {isLogin ? 'Welcome Back, Citizen' : 'Create Your Citizen Passport'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {isLogin
              ? 'Sign in to access your streaks, bookmarks & progress'
              : 'Save your points, earn national badges & track mastery'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-glass-input)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-light)',
        }}>
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: isLogin ? 700 : 500,
              background: isLogin ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: isLogin ? '#fbbf24' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: !isLogin ? 700 : 500,
              background: !isLogin ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: !isLogin ? '#fbbf24' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
          >
            Register
          </button>
        </div>

        {/* Error / Feedback Banner */}
        {error && (
          <div style={{
            padding: '0.65rem 0.85rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-sm)',
            color: '#fca5a5',
            fontSize: '0.825rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                background: 'var(--bg-glass-input)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <User size={16} color="var(--text-dim)" />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    width: '100%',
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.85rem',
              background: 'var(--bg-glass-input)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <Mail size={16} color="var(--text-dim)" />
              <input
                type="email"
                placeholder="citizen@bharat.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.85rem',
              background: 'var(--bg-glass-input)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <Lock size={16} color="var(--text-dim)" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Preferred Language
                </label>
                <select
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'var(--bg-glass-input)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    outline: 'none',
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="hinglish">Hinglish</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                  Learning Depth
                </label>
                <select
                  value={prefTier}
                  onChange={(e) => setPrefTier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    background: 'var(--bg-glass-input)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.825rem',
                    outline: 'none',
                  }}
                >
                  <option value="simple">🟢 Simple</option>
                  <option value="student">🟡 Student</option>
                  <option value="detailed">🔴 Detailed</option>
                </select>
              </div>
            </div>
          )}

          {/* Guest Points Merge Notice */}
          {!isLogin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.65rem',
              background: 'rgba(245, 158, 11, 0.08)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: '#fbbf24',
            }}>
              <Sparkles size={13} />
              <span>Your guest points & badges will automatically sync to your account!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              marginTop: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            <span>{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Passport')}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer switch prompt */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {isLogin ? (
            <span>
              New to Samvidhan Saathi?{' '}
              <button
                type="button"
                onClick={() => { setAuthModalMode('register'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Create Account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthModalMode('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Log In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
