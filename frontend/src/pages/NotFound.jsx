import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, BookOpen, MessageSquareQuote } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ padding: '5rem 0', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <AlertTriangle size={36} color="#fbbf24" />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          <span className="gradient-text-saffron">404</span>
        </h1>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          This page doesn't exist in the Constitution of our app.
          But don't worry — your constitutional rights are still intact!
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Home size={16} />
            <span>Go Home</span>
          </Link>
          <Link to="/explore" className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            <BookOpen size={16} />
            <span>Explore Articles</span>
          </Link>
          <Link to="/ai-chat" className="btn btn-outline-saffron" style={{ gap: '0.4rem' }}>
            <MessageSquareQuote size={16} />
            <span>Ask AI</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
