import React, { useState } from 'react';
import { Share2, Download, Heart, Users, Activity, Play, Sparkles, Calendar, MessageCircle, Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

const communityClasses = [
  {
    id: 'cls_1',
    title: 'Sunrise Vinyasa Flow',
    instructor: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    time: '07:30 AM',
    duration: '45 mins',
    level: 'All Levels',
    signedUp: 42,
    category: 'Vinyasa Flow',
    color: '#f97316'
  },
  {
    id: 'cls_2',
    title: 'Restorative Yin & Breathwork',
    instructor: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    time: '06:00 PM',
    duration: '60 mins',
    level: 'Gentle',
    signedUp: 28,
    category: 'Yin Yoga',
    color: '#fb923c'
  },
  {
    id: 'cls_3',
    title: 'Core Strength & Asana Power',
    instructor: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    time: '08:00 PM',
    duration: '30 mins',
    level: 'Intermediate',
    signedUp: 65,
    category: 'Power Yoga',
    color: '#ea580c'
  }
];

const communityPosts = [
  {
    id: 'p_1',
    user: 'Sarah J.',
    tag: '@sarah_zen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    text: 'Morning Vinyasa this morning was pure magic! 🌅 Completed 15 Sun Salutations and feel so centered for the day.',
    time: '2 hours ago',
    likes: 57,
    comments: 12,
    pose: '🧘 Sun Salutation'
  },
  {
    id: 'p_2',
    user: 'Marcus Lee',
    tag: '@marcus_active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    text: 'Hit a 10-day streak with the Routinix mobility flow. Lower back pain is finally gone! 💪',
    time: '4 hours ago',
    likes: 89,
    comments: 24,
    pose: '🌿 Warrior II'
  }
];

export const CommunityFitness = () => {
  const { addWorkoutEntry } = useApp();
  const [joinedClasses, setJoinedClasses] = useState({});
  const [likes, setLikes] = useState({ p_1: 57, p_2: 89 });
  const [likedPosts, setLikedPosts] = useState({});

  const handleJoinClass = (cls) => {
    setJoinedClasses(prev => ({
      ...prev,
      [cls.id]: !prev[cls.id]
    }));

    if (!joinedClasses[cls.id]) {
      addWorkoutEntry({
        name: cls.title,
        category: 'Yoga',
        duration: parseInt(cls.duration) || 45,
        calories: 180,
        notes: `Community Class with ${cls.instructor}`
      });
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    setLikes(prev => ({
      ...prev,
      [postId]: likedPosts[postId] ? prev[postId] - 1 : prev[postId] + 1
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 3D Glassmorphism Header Banner with Warm Peach/Orange Theme */}
      <div 
        className="card" 
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(251, 146, 60, 0.06) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 12px 35px rgba(249, 115, 22, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              🪷
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Community Yoga & Mindfulness</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(249, 115, 22, 0.2)', color: '#f97316' }}>
                  Live Space
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Join live wellness sessions, share mindful routines, and grow collective streaks.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f97316' }}>1,480+</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Yogis</div>
            </div>
            <div style={{
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-primary)',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>98.4%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Positivity Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Classes & Community Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        
        {/* Left: Upcoming Live Yoga Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Calendar size={20} style={{ color: '#f97316' }} />
            Upcoming Live Classes
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {communityClasses.map((cls) => {
              const isJoined = !!joinedClasses[cls.id];
              return (
                <div 
                  key={cls.id}
                  className="card"
                  style={{
                    padding: '1.2rem',
                    background: 'var(--card-bg)',
                    border: '1px solid ' + (isJoined ? 'rgba(249, 115, 22, 0.5)' : 'var(--card-border)'),
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img 
                        src={cls.avatar} 
                        alt={cls.instructor} 
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(249, 115, 22, 0.4)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{cls.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Instructor: {cls.instructor}</div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: cls.color }}>
                      {cls.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--card-border)' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '0.8rem' }}>
                      <span>🕒 {cls.time} ({cls.duration})</span>
                      <span>👥 {cls.signedUp + (isJoined ? 1 : 0)} joined</span>
                    </div>

                    <button 
                      onClick={() => handleJoinClass(cls)}
                      className={isJoined ? "btn-secondary" : "btn-primary"}
                      style={{
                        padding: '0.45rem 1rem',
                        fontSize: '0.82rem',
                        background: isJoined ? 'rgba(249, 115, 22, 0.15)' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: isJoined ? '#f97316' : '#ffffff',
                        border: isJoined ? '1px solid #f97316' : 'none'
                      }}
                    >
                      {isJoined ? '✓ Joined & Logged' : 'Join Session'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Community Activity Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Users size={20} style={{ color: '#f97316' }} />
            Community Activity Feed
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {communityPosts.map((post) => {
              const isLiked = !!likedPosts[post.id];
              return (
                <div 
                  key={post.id} 
                  className="card"
                  style={{
                    padding: '1.25rem',
                    background: 'var(--card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img 
                        src={post.avatar} 
                        alt={post.user}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{post.user}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{post.tag} • {post.time}</div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f97316', background: 'rgba(249, 115, 22, 0.1)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      {post.pose}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-main)', marginBottom: '1rem' }}>
                    {post.text}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--card-border)' }}>
                    <button 
                      onClick={() => handleLike(post.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: isLiked ? '#ef4444' : 'var(--text-muted)',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <Heart size={16} fill={isLiked ? '#ef4444' : 'none'} />
                      <span>{likes[post.id]} Likes</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      <MessageCircle size={16} />
                      <span>{post.comments} Comments</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 3D Lotus Community Tip Card */}
            <div 
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(251, 146, 60, 0.04) 100%)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <span style={{ fontSize: '1.75rem' }}>🪷</span>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text-main)' }}>Daily Mindfulness Tip:</strong> Take 5 slow, deep belly breaths before beginning your workout log to center your focus and maximize physical recovery.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
