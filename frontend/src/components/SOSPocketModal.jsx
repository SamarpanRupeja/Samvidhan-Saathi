import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, Volume2, VolumeX, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';

export default function SOSPocketModal({ isOpen, onClose }) {
  const guides = apiService.getSOSPocketGuides();
  const [activeGuideId, setActiveGuideId] = useState(guides[0]?.id || 'police_arrest');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const currentGuide = guides.find(g => g.id === activeGuideId) || guides[0];

  const handleCopy = () => {
    const text = `${currentGuide.title}\nRelevant Articles: ${currentGuide.articles.join(', ')}\n\n` +
      currentGuide.key_rules.map((r, i) => `${i + 1}. ${r}`).join('\n') +
      `\n\nEmergency Helpline: ${currentGuide.emergency_helpline}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const textToRead = `${currentGuide.title}. Key Constitutional Safeguards: ` + currentGuide.key_rules.join('. ');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 14, 23, 0.88)',
      backdropFilter: 'blur(14px)',
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
          maxWidth: '720px',
          maxHeight: '90vh',
          borderRadius: 'var(--radius-lg)',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Modal Top Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.9))',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
            }}>
              <ShieldAlert size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                SOS Pocket Rights
                <span className="badge badge-saffron" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                  Offline Ready
                </span>
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Instant, legally-verified rights cheat-sheets for high-stress situations
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setIsPlaying(false);
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          padding: '0.75rem 1.25rem',
          background: 'var(--bg-glass-input)',
          borderBottom: '1px solid var(--border-light)',
          overflowX: 'auto',
        }}>
          {guides.map(g => (
            <button
              key={g.id}
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsPlaying(false);
                setActiveGuideId(g.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: activeGuideId === g.id ? 700 : 500,
                background: activeGuideId === g.id ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                color: activeGuideId === g.id ? '#fca5a5' : 'var(--text-muted)',
                border: activeGuideId === g.id ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
              }}
            >
              <span>{g.icon}</span>
              <span>{g.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{currentGuide.icon}</span>
              <span>{currentGuide.title}</span>
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleSpeak}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.775rem', gap: '0.3rem', color: isPlaying ? '#10b981' : 'var(--text-main)' }}
              >
                {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isPlaying ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.775rem', gap: '0.3rem' }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Constitutional Protection Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Constitutional Articles:</span>
            {currentGuide.articles.map(art => (
              <span key={art} className="badge badge-saffron" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                Art {art}
              </span>
            ))}
          </div>

          {/* Checklist Rules */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
            {currentGuide.key_rules.map((rule, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-glass-input)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid #ef4444',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: 'var(--text-main)',
                }}
              >
                <span style={{ fontWeight: 800, color: '#f87171', fontSize: '0.85rem' }}>#{idx + 1}</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>

          {/* Emergency Helpline Banner */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.15))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PhoneCall size={18} color="#fca5a5" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Helpline</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>
                  {currentGuide.emergency_helpline}
                </div>
              </div>
            </div>
            <a
              href={`tel:${currentGuide.emergency_helpline.split(' ')[0]}`}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            >
              Call Now
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
