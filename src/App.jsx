import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// 3D Background, Startup & Layout Components
import { Background3D } from './components/Background3D';
import { StartupAnimation } from './components/StartupAnimation';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

// Page Views & Modules
import { HomeOverview } from './components/HomeOverview';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { HydrationTracker } from './components/HydrationTracker';
import { ExerciseTracker } from './components/ExerciseTracker';
import { HabitTracker } from './components/HabitTracker';
import { RoutineTimeline } from './components/RoutineTimeline';
import { TrekkingHighlightCard } from './components/TrekkingHighlightCard';
import { CommunityFitness } from './components/CommunityFitness';
import { CommunityChat } from './components/CommunityChat';

// Global Modals
import { AuthModal } from './components/AuthModal';
import { QuickAddModal } from './components/QuickAddModal';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';

const MainLayout = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStartup, setShowStartup] = useState(() => {
    // Show startup animation on first fresh visit
    const hasSeen = sessionStorage.getItem('routinix_seen_startup');
    return !hasSeen;
  });
  const contentRef = useRef(null);

  const handleStartupComplete = () => {
    sessionStorage.setItem('routinix_seen_startup', 'true');
    setShowStartup(false);
  };

  // Tab Title Mapping for Breadcrumbs
  const tabTitles = {
    dashboard: 'Full Dashboard & Live Overview',
    finances: 'Finances, Budgets & 2FA Security',
    hydration: 'Hydration Intake & Reminders',
    workouts: 'Workout & Fitness Logger',
    habits: 'Habit Streaks & Timeline Routine',
    community: 'Community Yoga & Fitness Routines',
    advice_chat: 'Community Help & Advice Chat'
  };

  // Animate view transition when tab changes
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 15, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="dashboard-app-layout" style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* 3D Startup Animation Overlay */}
      {showStartup && (
        <StartupAnimation onComplete={handleStartupComplete} />
      )}

      {/* 3D Three.js Dynamic Parallax Background */}
      <Background3D />

      {/* Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab || 'dashboard'} 
        onTabChange={(tab) => setActiveTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div 
        className="main-dashboard-body"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Top Navbar */}
        <Navbar 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTabTitle={tabTitles[activeTab || 'dashboard']}
          onReplayIntro={() => setShowStartup(true)}
        />

        {/* Dynamic Tab Views */}
        <main 
          ref={contentRef}
          style={{
            flex: 1,
            padding: '2rem 2.5rem 6rem 2.5rem',
            maxWidth: '1350px',
            width: '100%',
            margin: '0 auto'
          }}
        >
          {/* 1. Full Dashboard Home Overview */}
          {(!activeTab || activeTab === 'dashboard' || activeTab === 'all') && (
            <HomeOverview onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {/* 2. Finances & 2FA */}
          {activeTab === 'finances' && (
            <AnalyticsDashboard />
          )}

          {/* 3. Hydration Module */}
          {activeTab === 'hydration' && (
            <HydrationTracker />
          )}

          {/* 4. Workouts Module */}
          {activeTab === 'workouts' && (
            <ExerciseTracker />
          )}

          {/* 5. Habit Streaks & Timeline */}
          {activeTab === 'habits' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
              <HabitTracker />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <RoutineTimeline />
                <TrekkingHighlightCard />
              </div>
            </div>
          )}

          {/* 6. Community Yoga */}
          {activeTab === 'community' && (
            <CommunityFitness />
          )}

          {/* 7. Community Advice Chat */}
          {activeTab === 'advice_chat' && (
            <CommunityChat />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal />
      <QuickAddModal />
      <SettingsModal />
      <PrivacyPolicyModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
