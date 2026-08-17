import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Article from './pages/Article';
import Scenarios from './pages/Scenarios';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Header />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/article/:id" element={<Article />} />
                  <Route path="/scenarios" element={<Scenarios />} />
                  <Route path="/ai-chat" element={<AIChat />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              {/* Global Auth Modal */}
              <AuthModal />

              {/* Global Footer */}
              <footer style={{
                borderTop: '1px solid var(--border-light)',
                padding: '2rem 0',
                background: 'var(--bg-secondary)',
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--text-dim)'
              }}>
                <div className="container">
                  <p style={{ marginBottom: '0.4rem' }}>
                    <strong>Samvidhan Saathi (संविधान साथी)</strong> — Your Constitutional Companion
                  </p>
                  <p>
                    Dedicated to empowering every Indian citizen with accessible, source-grounded constitutional knowledge 🇮🇳
                  </p>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
