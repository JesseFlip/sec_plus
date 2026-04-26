import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth, useUser, UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { STUDY_DATA, PORTS, ACRONYM_FLASH } from "./data/studyData";
import "./App.css";

// --- COMPONENTS ---

const ChatBot = ({ completedCount, totalTopics, isVisible, setIsVisible }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome! I'm SecBot, your Security+ accountability partner. Ready to tackle some domains today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (overrideInput) => {
    const userMessage = overrideInput || input;
    if (!userMessage.trim() || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          progress: { completed: completedCount, total: totalTopics }
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", text: "Error: " + data.error }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: data.text }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "I'm having trouble connecting to my brain (the server). Is it running?" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <motion.button 
        className="chat-toggle-btn glass"
        onClick={() => setIsVisible(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        🛡️
      </motion.button>
    );
  }

  return (
    <motion.div 
      className="chatbot glass"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
    >
      <div className="chatbot-header">
        <div className="header-bot-info">
          <div className="bot-avatar">🛡️</div>
          <div>
            <h3>SecBot</h3>
            <p>Security+ AI Coach</p>
          </div>
        </div>
        <button className="minimize-btn" onClick={() => setIsVisible(false)}>—</button>
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="message-content">{m.text}</div>
          </div>
        ))}
        {loading && <div className="message assistant loading">...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-footer">
        <div className="chat-input">
          <input 
            type="text" 
            placeholder={t('ask_question')} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={loading}>Send</button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const { t, i18n } = useTranslation();
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("sec-plus-completed");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeDay, setActiveDay] = useState(1);
  const [view, setView] = useState("map");
  const [flashMode, setFlashMode] = useState("ports");
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashRevealed, setFlashRevealed] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedData, setTranslatedData] = useState(null);
  const [isChatVisible, setIsChatVisible] = useState(true);

  // Sync with Backend if logged in
  useEffect(() => {
    if (isLoaded && userId) {
      fetch("/api/progress")
        .then(res => res.json())
        .then(data => {
          if (data && Object.keys(data).length > 0) {
            setCompleted(data);
          }
        })
        .catch(err => console.error("Error fetching progress:", err));
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    localStorage.setItem("sec-plus-completed", JSON.stringify(completed));
    if (isLoaded && userId) {
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      }).catch(err => console.error("Error saving progress:", err));
    }
  }, [completed, isLoaded, userId]);

  // Dynamic Translation for Study Data
  useEffect(() => {
    const translateContent = async () => {
      if (i18n.language === 'en') {
        setTranslatedData(null);
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            targetLanguage: i18n.language,
            content: STUDY_DATA 
          })
        });
        const data = await response.json();
        if (data.translated) {
          setTranslatedData(data.translated);
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [i18n.language]);

  const currentStudyData = translatedData || STUDY_DATA;

  const toggleTopic = (id) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalTopics = STUDY_DATA.days.flatMap(d => d.blocks.flatMap(b => b.topics)).length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalTopics) * 100);

    const dayData = currentStudyData.days.find(d => d.day === activeDay);

    const flashCards = flashMode === "ports" ? PORTS : ACRONYM_FLASH;

    return (
      <div className="app-container">
        <main className="content">
          <header className="main-header">
            <div className="header-top">
              <div className="header-left">
                <span className="badge">{t('sy0_701_prep')}</span>
                <h1>{t('app_title')}</h1>
              </div>
              <div className="header-actions">
                <select 
                  className="lang-select glass" 
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  value={i18n.language}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                  <option value="pt">Português</option>
                </select>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="auth-btn glass">Sign In</button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>

            <SignedOut>
              <motion.div 
                className="guest-warning glass"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
              >
                <span>⚠️ <strong>Guest Mode:</strong> Your progress is saved in this browser, but you must <strong>Sign In</strong> to sync across devices.</span>
              </motion.div>
            </SignedOut>
            <div className="stats-grid">
              <div className="stat-card glass">
                <span className="stat-label">{t('total_progress')}</span>
                <span className="stat-value">{progressPct}%</span>
                <div className="stat-progress-bar">
                  <div className="bar-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>
              <div className="stat-card glass">
                <span className="stat-label">{t('topics_done')}</span>
                <span className="stat-value">{completedCount}/{totalTopics}</span>
              </div>
              <div className="stat-card glass">
                <span className="stat-label">{t('daily_streak')}</span>
                <span className="stat-value">🔥 1</span>
              </div>
            </div>
          </header>

          <nav className="view-nav">
            <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>{t('study_map')}</button>
            <button className={view === "flash" ? "active" : ""} onClick={() => setView("flash")}>{t('flashcards')}</button>
          </nav>

          {isTranslating && (
            <div className="loading-overlay glass">
              <div className="spinner"></div>
              <p>Translating study plan into {i18n.language === 'es' ? 'Español' : i18n.language === 'fr' ? 'Français' : 'selected language'}...</p>
            </div>
          )}

          {view === "map" && (
            <div className="study-map-view fade-in">
              <div className="day-selector">
                {currentStudyData.days.map(d => (
                  <button 
                    key={d.day} 
                    className={activeDay === d.day ? "active" : ""} 
                    onClick={() => setActiveDay(d.day)}
                  >
                    Day {d.day}
                  </button>
                ))}
              </div>

              <div className="day-content">
                <h2>{dayData.title}</h2>
              <p className="subtitle">{dayData.subtitle}</p>

              <div className="blocks-list">
                {dayData.blocks.map(block => (
                  <div key={block.id} className="block-card glass" style={{ borderLeftColor: STUDY_DATA.exam.domains.find(d => d.id === block.domain)?.color }}>
                    <div className="block-header">
                      <span className="block-time">{block.time}</span>
                      <h3>{block.title}</h3>
                    </div>
                    <div className="topics-list">
                      {block.topics.map(topic => (
                        <div key={topic.id} className={`topic-item ${completed[topic.id] ? "done" : ""}`} onClick={() => toggleTopic(topic.id)}>
                          <div className="checkbox">{completed[topic.id] && "✓"}</div>
                          <span>{topic.key && "★ "}{topic.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="block-footer">
                      <span className="guide">📘 {block.guide}</span>
                      <p className="tip">💡 {block.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "flash" && (
          <div className="flashcard-view fade-in">
            <div className="flash-tabs">
              <button className={flashMode === "ports" ? "active" : ""} onClick={() => { setFlashMode("ports"); setFlashIndex(0); setFlashRevealed(false); }}>Ports</button>
              <button className={flashMode === "acronyms" ? "active" : ""} onClick={() => { setFlashMode("acronyms"); setFlashIndex(0); setFlashRevealed(false); }}>Acronyms</button>
            </div>
            
            <div className="flash-card-container">
              <div 
                className={`flash-card glass ${flashRevealed ? "revealed" : ""}`}
                onClick={() => setFlashRevealed(!flashRevealed)}
              >
                <div className="card-front">
                  <span className="category">{flashMode === "ports" ? "PORT" : "ACRONYM"}</span>
                  <div className="term">{flashCards[flashIndex].port || flashCards[flashIndex].a}</div>
                  <span className="hint">Tap to reveal</span>
                </div>
                <div className="card-back">
                  <div className="definition">{flashCards[flashIndex].service || flashCards[flashIndex].f}</div>
                  <div className="note">{flashCards[flashIndex].note || ""}</div>
                </div>
              </div>
              <div className="flash-nav">
                <button onClick={() => { setFlashIndex(Math.max(0, flashIndex - 1)); setFlashRevealed(false); }}>{t('prev')}</button>
                <button onClick={() => { setFlashIndex((flashIndex + 1) % flashCards.length); setFlashRevealed(false); }}>{t('next')}</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <aside className={`sidebar ${!isChatVisible ? 'minimized' : ''}`}>
        <AnimatePresence mode="wait">
          <ChatBot 
            completedCount={completedCount} 
            totalTopics={totalTopics} 
            isVisible={isChatVisible}
            setIsVisible={setIsChatVisible}
          />
        </AnimatePresence>
      </aside>
    </div>
  );
}
