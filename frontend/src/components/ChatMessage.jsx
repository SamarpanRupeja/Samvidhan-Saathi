import React, { useState } from 'react';
import { Bot, User, ShieldCheck, BookOpen, ExternalLink, Bookmark, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SourceCitation from './SourceCitation';
import { apiService } from '../services/api';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveAnswer = () => {
    apiService.saveAnswer({
      query: message.userQuery || 'Constitutional Query',
      answer: message.content,
      sources: message.sources || [],
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '0.85rem',
      padding: '1.25rem 0',
      borderBottom: '1px solid var(--border-light)',
      alignItems: 'flex-start'
    }}>
      {/* Avatar */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: isUser
          ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
          : 'linear-gradient(135deg, #F59E0B, #1E3A8A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isUser ? '0 0 10px rgba(59, 130, 246, 0.3)' : '0 0 10px rgba(245, 158, 11, 0.3)'
      }}>
        {isUser ? <User size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
      </div>

      {/* Message Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Role Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isUser ? '#60a5fa' : '#fbbf24' }}>
            {isUser ? 'You' : 'Samvidhan Saathi AI'}
          </span>
          {!isUser && message.confidence && (
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              background: message.confidence > 0.7 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: message.confidence > 0.7 ? '#34d399' : '#fbbf24',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <ShieldCheck size={10} />
              {Math.round(message.confidence * 100)}% Verified
            </span>
          )}
        </div>

        {/* Message Content */}
        {isUser ? (
          <div style={{
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            lineHeight: 1.6,
          }}>
            {message.content}
          </div>
        ) : (
          <div className="ai-response-markdown" style={{
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            lineHeight: 1.7,
          }}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24', margin: '1rem 0 0.5rem 0' }}>{children}</h3>,
                h2: ({ children }) => <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', margin: '0.85rem 0 0.4rem 0' }}>{children}</h4>,
                h3: ({ children }) => <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#60a5fa', margin: '0.75rem 0 0.35rem 0' }}>{children}</h5>,
                h4: ({ children }) => <h6 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#34d399', margin: '0.6rem 0 0.3rem 0' }}>{children}</h6>,
                p: ({ children }) => <p style={{ margin: '0.4rem 0', lineHeight: 1.65 }}>{children}</p>,
                strong: ({ children }) => <strong style={{ color: '#fbbf24', fontWeight: 700 }}>{children}</strong>,
                em: ({ children }) => <em style={{ color: '#a5b4fc', fontStyle: 'italic' }}>{children}</em>,
                ul: ({ children }) => <ul style={{ margin: '0.4rem 0', paddingLeft: '1.25rem' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ margin: '0.4rem 0', paddingLeft: '1.25rem' }}>{children}</ol>,
                li: ({ children }) => <li style={{ margin: '0.2rem 0', lineHeight: 1.55 }}>{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '3px solid #f59e0b',
                    paddingLeft: '1rem',
                    margin: '0.75rem 0',
                    color: '#cbd5e1',
                    fontStyle: 'italic',
                    background: 'rgba(245, 158, 11, 0.05)',
                    padding: '0.75rem 1rem',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    {children}
                  </blockquote>
                ),
                code: ({ inline, children }) => inline ? (
                  <code style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    fontSize: '0.85em',
                    color: '#fbbf24'
                  }}>
                    {children}
                  </code>
                ) : (
                  <pre style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    overflow: 'auto',
                    fontSize: '0.85rem',
                    border: '1px solid var(--border-light)',
                    margin: '0.5rem 0'
                  }}>
                    <code>{children}</code>
                  </pre>
                ),
                hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '1rem 0' }} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Actions & Source Citations */}
        {!isUser && (
          <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {message.sources && message.sources.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                  <BookOpen size={12} /> Verified Constitutional Sources:
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {message.sources.map((src, idx) => (
                    <SourceCitation key={idx} source={src} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Row */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={handleSaveAnswer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.725rem',
                  fontWeight: 600,
                  background: isSaved ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSaved ? '#fbbf24' : 'var(--text-dim)',
                  border: isSaved ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {isSaved ? <Check size={12} color="#10b981" /> : <Bookmark size={12} />}
                <span>{isSaved ? 'Saved in Vault' : 'Save to Vault'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
