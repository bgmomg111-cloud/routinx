import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Heart, 
  Share2, 
  Users, 
  Award, 
  Droplet, 
  Dumbbell, 
  Flame, 
  ThumbsUp, 
  MessageCircle, 
  Filter, 
  Bot, 
  Search,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const initialChatMessages = [
  {
    id: 'm_1',
    user: 'Dr. Elena Vance',
    role: 'Hydration Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    tag: 'Hydration Tip',
    category: 'hydration',
    text: '💡 Morning Pro-Tip: Drinking 500ml of room-temperature water with a pinch of pink salt immediately upon waking kickstarts your metabolism and restores cellular hydration much faster than cold water!',
    time: '10:15 AM',
    likes: 34,
    repliesCount: 4,
    isVerified: true,
    isHelpful: true
  },
  {
    id: 'm_2',
    user: 'Liam Chen',
    role: 'Streak Pioneer (45d)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    tag: 'Habit Advice',
    category: 'habits',
    text: 'Question for the community: When you are feeling fatigued after work, what habit stacking technique helps you complete your meditation without falling asleep?',
    time: '11:20 AM',
    likes: 18,
    repliesCount: 6,
    isVerified: false,
    isHelpful: false,
    replies: [
      {
        id: 'r_1',
        user: 'Coach Maya',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        text: 'Try walking meditation or sitting upright on a bolster near an open window! It keeps the physical body engaged while calming the mind.',
        time: '11:28 AM'
      }
    ]
  },
  {
    id: 'm_3',
    user: 'Marcus Thorne',
    role: 'Strength & Conditioning',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    tag: 'Workout Form',
    category: 'workouts',
    text: 'Remember to brace your core like preparing for a light punch during heavy squats. It protects your lower lumbar and allows 15% more power transfer!',
    time: '12:05 PM',
    likes: 29,
    repliesCount: 2,
    isVerified: true,
    isHelpful: true
  }
];

export const CommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('routinix_community_chat');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [postType, setPostType] = useState('Advice Request');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedMap, setLikedMap] = useState({});
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('routinix_community_chat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsgText = inputMessage.trim();
    const newMsg = {
      id: 'm_' + Date.now(),
      user: user ? user.name : 'Routinix Member',
      role: user && !user.isGuest ? 'Community Member' : 'Active Explorer',
      avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      tag: postType,
      category: selectedCategory === 'all' ? 'general' : selectedCategory,
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 1,
      repliesCount: 0,
      isVerified: false,
      isHelpful: false
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Trigger an AI Assistant Community Advice Reply after a brief delay
    setIsAiTyping(true);
    setTimeout(() => {
      let aiResponseText = "Great question! Staying consistent with small, daily incremental milestones is the secret to lasting habits. Feel free to log this in your Routinix streak tracker!";
      
      const lower = userMsgText.toLowerCase();
      if (lower.includes('water') || lower.includes('hydration') || lower.includes('drink')) {
        aiResponseText = "💧 Hydration Assistant Tip: Setting a 45-min interval reminder in the Routinix Hydration tab will help you steadily reach your daily goal without feeling overwhelmed!";
      } else if (lower.includes('workout') || lower.includes('squat') || lower.includes('gym') || lower.includes('exercise')) {
        aiResponseText = "🏋️ Workout Coach Tip: Focus on progressive overload and prioritizing 7-8 hours of sleep for optimal muscular recovery after this session.";
      } else if (lower.includes('habit') || lower.includes('streak') || lower.includes('motivation')) {
        aiResponseText = "🔥 Habit Mastery Tip: The 2-minute rule works wonders: make starting your new habit take less than two minutes (e.g. putting on running shoes). The streak will follow naturally!";
      }

      const aiMsg = {
        id: 'ai_' + Date.now(),
        user: 'Routinix Community Bot',
        role: 'AI Wellness Advisor',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
        tag: 'Instant Assistance',
        category: 'assistant',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        likes: 12,
        repliesCount: 0,
        isVerified: true,
        isHelpful: true,
        isBot: true
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 1400);
  };

  const handleLike = (id) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setMessages((prev) => prev.map((m) => {
      if (m.id === id) {
        const currentlyLiked = !!likedMap[id];
        return { ...m, likes: currentlyLiked ? m.likes - 1 : m.likes + 1 };
      }
      return m;
    }));
  };

  const toggleHelpful = (id) => {
    setMessages((prev) => prev.map((m) => {
      if (m.id === id) {
        return { ...m, isHelpful: !m.isHelpful };
      }
      return m;
    }));
  };

  const filteredMessages = messages.filter((m) => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory || (m.category === 'assistant');
    const matchesSearch = !searchQuery || m.text.toLowerCase().includes(searchQuery.toLowerCase()) || m.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Community Help Hero Banner */}
      <div 
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 12px 35px rgba(6, 182, 212, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              💬
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Community Help & Advice Chat</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}>
                  Live Peer Support
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Ask questions, share advice on workouts & hydration, and get instant answers from peers and AI guides.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem 1.2rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid rgba(6, 182, 212, 0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#06b6d4' }}>2,450+</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Helpful Solutions</div>
            </div>
            <div style={{ padding: '0.75rem 1.2rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#8b5cf6' }}>&lt; 2 mins</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Layout: Left Filters/Topics & Right Live Message Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
        
        {/* Left Side: Topic Channels & Quick Advice Starters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search Advice */}
          <div className="card" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                className="form-input"
                placeholder="Search advice, tips, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          {/* Channels Filter */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Filter size={18} style={{ color: '#06b6d4' }} />
              Advice Categories
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { id: 'all', label: '🌐 All Community Advice', count: messages.length },
                { id: 'hydration', label: '💧 Hydration & Reminders', count: messages.filter(m => m.category === 'hydration').length },
                { id: 'workouts', label: '🏋️ Workout Form & Fitness', count: messages.filter(m => m.category === 'workouts').length },
                { id: 'habits', label: '🔥 Habit Streaks & Focus', count: messages.filter(m => m.category === 'habits').length },
                { id: 'general', label: '🧘 Wellness & Lifestyle', count: messages.filter(m => m.category === 'general').length }
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                      border: '1px solid ' + (isActive ? '#06b6d4' : 'transparent'),
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.88rem'
                    }}
                  >
                    <span>{cat.label}</span>
                    <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-secondary)' }}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Helper Tips */}
          <div 
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: '#10b981', fontWeight: 700, fontSize: '0.92rem' }}>
              <Sparkles size={16} />
              <span>Community Guidelines</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Be encouraging, share science-backed health insights, and mark the most helpful replies with the <strong>"Helpful"</strong> badge to help fellow members!
            </p>
          </div>
        </div>

        {/* Right Side: Live Interactive Chat & Message Feed */}
        <div 
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '680px',
            padding: '1.25rem',
            background: 'var(--card-bg)'
          }}
        >
          {/* Chat Feed Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Live Advice Stream</span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {filteredMessages.length} Messages Displayed
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem', paddingRight: '0.5rem' }}>
            {filteredMessages.map((msg) => {
              const isLiked = !!likedMap[msg.id];
              return (
                <div 
                  key={msg.id}
                  style={{
                    padding: '1rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    background: msg.isBot ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)' : 'var(--bg-primary)',
                    border: msg.isHelpful ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid var(--card-border)',
                    boxShadow: msg.isHelpful ? '0 4px 15px rgba(16, 185, 129, 0.12)' : 'none'
                  }}
                >
                  {/* Message Author Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img 
                        src={msg.avatar} 
                        alt={msg.user}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: msg.isBot ? '2px solid #06b6d4' : 'none' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{msg.user}</span>
                          {msg.isVerified && (
                            <span title="Verified Advisor" style={{ color: '#06b6d4', display: 'flex', alignItems: 'center' }}>
                              <CheckCircle2 size={14} />
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {msg.role} • {msg.time}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}>
                        {msg.tag}
                      </span>
                      {msg.isHelpful && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          ✓ Helpful
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Body */}
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-main)', margin: '0.6rem 0' }}>
                    {msg.text}
                  </p>

                  {/* Message Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid var(--card-border)', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <button 
                        onClick={() => handleLike(msg.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: isLiked ? '#ef4444' : 'var(--text-muted)'
                        }}
                      >
                        <Heart size={14} fill={isLiked ? '#ef4444' : 'none'} />
                        <span>{msg.likes}</span>
                      </button>

                      <button 
                        onClick={() => toggleHelpful(msg.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: msg.isHelpful ? '#10b981' : 'var(--text-muted)'
                        }}
                      >
                        <ThumbsUp size={14} />
                        <span>{msg.isHelpful ? 'Marked Helpful' : 'Mark as Helpful'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Nested Replies if present */}
                  {msg.replies && msg.replies.map((reply) => (
                    <div key={reply.id} style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.6rem', fontSize: '0.82rem' }}>
                      <img src={reply.avatar} alt={reply.user} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <strong>{reply.user}:</strong> {reply.text}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontSize: '0.85rem' }}>
                <Bot size={18} />
                <span>Routinix Wellness Advisor is typing a helpful response...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Message Input & Action Bar */}
          <form onSubmit={handleSendMessage} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
              >
                <option value="Advice Request">❓ Advice Request</option>
                <option value="Tip Shared">💡 Tip Shared</option>
                <option value="Question">🙋 Question</option>
                <option value="Milestone">🏆 Milestone</option>
              </select>

              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="Ask for advice or share a routine tip..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  style={{ paddingRight: '3.5rem' }}
                />
                <button 
                  type="submit"
                  className="btn-primary"
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '4px',
                    bottom: '4px',
                    padding: '0 0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
