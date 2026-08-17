import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import { useLanguage } from '../contexts/LanguageContext';
import { apiService } from '../services/api';

export default function AIChat() {
  const { language, mode, t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: language === 'hi'
        ? "नमस्ते! मैं संविधान साथी (Samvidhan Saathi) AI हूँ। आप मुझसे भारतीय संविधान, मौलिक अधिकारों या किसी भी कानूनी स्थिति के बारे में हिंदी, अंग्रेज़ी या हिंग्लिश में पूछ सकते हैं।"
        : (language === 'hinglish'
          ? "Namaste! Main Samvidhan Saathi AI hoon. Aap mujhse Indian Constitution, Fundamental Rights ya kisi bhi daily life legal situation ke baare mein Hindi, English ya Hinglish mein puch sakte hain. Har answer verified source ke sath aayega!"
          : "Hello! I am Samvidhan Saathi AI, your Constitutional Companion. Ask me anything about your fundamental rights, constitutional protections, or real-life situations. Every answer is grounded directly in verified constitutional articles."),
      confidence: 0.98,
      sources: [
        {
          type: "constitutional_article",
          reference: "Constitution of India",
          text_snippet: "Official constitutional knowledge base comprising Part III, Part IV, and landmark judgments."
        }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQuestions = {
    en: [
      "Can police arrest me without telling me the reason?",
      "Is Right to Privacy a fundamental right?",
      "Can my landlord lock me out without notice?",
      "What are the 5 types of writs under Article 32?"
    ],
    hi: [
      "क्या पुलिस बिना वारंट के गिरफ्तार कर सकती है?",
      "क्या निजता (प्राइवेसी) एक मौलिक अधिकार है?",
      "अनुच्छेद 21 के तहत क्या-क्या अधिकार आते हैं?",
      "मौलिक अधिकार और निर्देशक सिद्धांतों में क्या अंतर है?"
    ],
    hinglish: [
      "Kya police bina warrant ke arrest kar sakti hai?",
      "Article 21 ke under kon kon se rights aate hain?",
      "School mein religious education mandatory ho sakti hai kya?",
      "Habeas corpus writ kab use hoti hai?"
    ]
  };

  const currentQuestions = sampleQuestions[language] || sampleQuestions.en;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: queryText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiService.askAI(queryText.trim(), language, mode);
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        userQuery: queryText.trim(),
        content: response.answer,
        confidence: response.confidence,
        sources: response.sources
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI query failed:", err);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I encountered an issue processing your query. Please try again with a specific constitutional question.",
        confidence: 0.3,
        sources: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: "Chat cleared. What constitutional matter can I help you with today?",
        confidence: 0.98,
        sources: []
      }
    ]);
  };

  return (
    <div style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Chat Header */}
        <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', border: '1px solid var(--border-active)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #1E3A8A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
            }}>
              <Bot size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Constitutional AI Companion
                <span className="badge badge-simple" style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                  <ShieldCheck size={11} /> RAG Verified
                </span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Powered by Google Gemini + Constitutional Bare Act Database
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <Trash2 size={14} />
            <span>Clear Chat</span>
          </button>

        </div>

        {/* Messages Scroll Area */}
        <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '440px', maxHeight: '600px', overflowY: 'auto', marginBottom: '1.5rem' }}>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', color: '#fbbf24', fontSize: '0.9rem' }}>
              <Sparkles size={18} className="animate-spin-slow" />
              <span>Retrieving relevant constitutional articles and generating verified response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              style={{
                fontSize: '0.775rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.color = '#fbbf24';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              💬 "{q}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 0.6rem 0.5rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-active)',
            background: 'var(--bg-glass-input)',
            gap: '0.75rem'
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question or situation in Hindi, English or Hinglish..."
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '1rem'
            }}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn btn-primary"
            style={{
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1.2rem',
              opacity: input.trim() && !loading ? 1 : 0.6
            }}
          >
            <span>Ask</span>
            <Send size={16} />
          </button>
        </form>

      </div>
    </div>
  );
}
