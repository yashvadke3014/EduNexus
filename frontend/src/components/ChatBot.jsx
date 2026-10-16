import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatBot = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      const greeting = `Hey${user ? ' ' + user.name.split(' ')[0] : ''}! 👋 I'm NexBot, your EduNexus mentor.\nI can help you find hackathons, internships, courses, and events.\nWhat are you looking for today?`;
      setMessages([{
        from: 'bot',
        text: greeting,
        chips: ['Show hackathons', 'Find internships', 'Suggest courses', 'Upcoming events'],
        time: now(),
      }]);
    }
  }, [open]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const now = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

  const sendMsg = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { from: 'user', text: msg, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chatbot', { message: msg });
      setMessages(prev => [...prev, {
        from: 'bot',
        text: data.text,
        chips: data.suggestions || [],
        time: now(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: 'Sorry, I ran into an error. Please try again!',
        chips: ['Show hackathons', 'Help'],
        time: now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chatbot-fab" onClick={() => setOpen(o => !o)} title="Chat with NexBot">
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chat-header">
            <div className="chat-avatar">N</div>
            <div className="chat-header-info">
              <h4>NexBot</h4>
              <p>Your EduNexus Mentor</p>
            </div>
            <div className="chat-status" />
          </div>

          <div className="chat-msgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.from}`}>
                <div className="msg-bubble">{m.text}</div>
                <div className="msg-time">{m.time}</div>
                {m.chips?.length > 0 && (
                  <div className="chat-chips">
                    {m.chips.map(c => (
                      <button key={c} className="chat-chip" onClick={() => sendMsg(c)}>{c}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="msg bot">
                <div className="msg-bubble" style={{ color: '#94A3B8' }}>NexBot is typing…</div>
              </div>
            )}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              placeholder="Ask me anything…"
            />
            <button className="chat-send" onClick={() => sendMsg()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
