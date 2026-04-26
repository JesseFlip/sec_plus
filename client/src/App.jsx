import { useState, useEffect, useCallback, useRef } from "react";
import { STUDY_DATA, PORTS, ACRONYM_FLASH } from "./data/studyData";
import "./App.css";

// --- COMPONENTS ---

const ChatBot = ({ completedCount, totalTopics }) => {
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

  const handleCheckIn = () => {
    const status = progressPct >= 80 ? "crushing it" : progressPct >= 50 ? "making good progress" : "just getting started";
    const msg = `Checking in! I've completed ${completedCount} topics so far. How am I doing?`;
    setInput(msg);
    // Auto-send after a brief delay
    setTimeout(() => handleSend(msg), 100);
  };

  const handleSend = async (overrideInput) => {
    const userMessage = overrideInput || input;
    if (!userMessage.trim() || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
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

  return (
    <div className="chatbot glass">
      <div className="chatbot-header">
        <div className="bot-avatar">🛡️</div>
        <div>
          <h3>SecBot</h3>
          <p>Security+ AI Coach</p>
        </div>
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
        <button className="check-in-btn" onClick={handleCheckIn} disabled={loading}>📅 Daily Check-in</button>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Ask a question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem("sec-plus-completed");
    return saved ? JSON.parse(saved) : {};
  });
  const [activeDay, setActiveDay] = useState(1);
  const [view, setView] = useState("map");
  const [flashMode, setFlashMode] = useState("ports");
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashRevealed, setFlashRevealed] = useState(false);

  useEffect(() => {
    localStorage.setItem("sec-plus-completed", JSON.stringify(completed));
  }, [completed]);

  const toggleTopic = (id) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalTopics = STUDY_DATA.days.flatMap(d => d.blocks.flatMap(b => b.topics)).length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalTopics) * 100);

  const dayData = STUDY_DATA.days.find(d => d.day === activeDay);

  const flashCards = flashMode === "ports" ? PORTS : ACRONYM_FLASH;

  return (
    <div className="app-container">
      <main className="content">
        <header className="main-header">
          <div className="header-top">
            <span className="badge">SY0-701 PREP</span>
            <h1>Security+ Sprint</h1>
          </div>
          <div className="stats-grid">
            <div className="stat-card glass">
              <span className="stat-label">Total Progress</span>
              <span className="stat-value">{progressPct}%</span>
              <div className="stat-progress-bar">
                <div className="bar-fill" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>
            <div className="stat-card glass">
              <span className="stat-label">Topics Done</span>
              <span className="stat-value">{completedCount}/{totalTopics}</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-label">Daily Streak</span>
              <span className="stat-value">🔥 1</span>
            </div>
          </div>
        </header>

        <nav className="view-nav">
          <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>Study Map</button>
          <button className={view === "flash" ? "active" : ""} onClick={() => setView("flash")}>Flashcards</button>
        </nav>

        {view === "map" && (
          <div className="study-map-view fade-in">
            <div className="day-selector">
              {STUDY_DATA.days.map(d => (
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
                <button onClick={() => { setFlashIndex(Math.max(0, flashIndex - 1)); setFlashRevealed(false); }}>Prev</button>
                <button onClick={() => { setFlashIndex((flashIndex + 1) % flashCards.length); setFlashRevealed(false); }}>Next</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <aside className="sidebar">
        <ChatBot completedCount={completedCount} totalTopics={totalTopics} />
      </aside>
    </div>
  );
}
