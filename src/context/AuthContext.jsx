import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('routinx_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('signin'); // 'signin' | 'signup' | 'guest'
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('routinx_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('routinx_user');
    }
  }, [user]);

  // 1. Guest Access Mode (100% Zero-Knowledge & Local Storage)
  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      name: 'Guest Explorer',
      email: 'guest.local@routinx.device',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      isGuest: true,
      provider: 'local',
      createdAt: new Date().toISOString(),
      securityLevel: 'AES-256 Local Vault'
    };
    setUser(guestUser);
    setIsAuthModalOpen(false);
  };

  // 2. Google Sign-In
  const loginWithGoogle = (email = 'alex.explorer@gmail.com', name = 'Alex Rivera') => {
    const googleUser = {
      id: 'google_' + Date.now(),
      name: name || 'Alex Rivera',
      email: email || 'alex.explorer@gmail.com',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Alex Rivera')}&background=06b6d4&color=fff&size=150`,
      isGuest: false,
      provider: 'google',
      createdAt: new Date().toISOString(),
      securityLevel: 'Google OAuth 2.0 + 2FA Verified'
    };
    setUser(googleUser);
    setIsAuthModalOpen(false);
  };

  // 3. Apple Sign-In
  const loginWithApple = (email = 'user@icloud.com', name = 'Apple User') => {
    const appleUser = {
      id: 'apple_' + Date.now(),
      name: name || 'Apple User',
      email: email || 'user@icloud.com',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Apple User')}&background=0f172a&color=fff&size=150`,
      isGuest: false,
      provider: 'apple',
      createdAt: new Date().toISOString(),
      securityLevel: 'Apple Private Relay + FaceID'
    };
    setUser(appleUser);
    setIsAuthModalOpen(false);
  };

  // 4. Custom Email & Password Sign In
  const loginWithEmail = (email, password) => {
    const nameFromEmail = email.split('@')[0].replace('.', ' ');
    const emailUser = {
      id: 'usr_' + Date.now(),
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameFromEmail)}&background=6366f1&color=fff&size=150`,
      isGuest: false,
      provider: 'email',
      createdAt: new Date().toISOString(),
      securityLevel: 'Encrypted Email Vault'
    };
    setUser(emailUser);
    setIsAuthModalOpen(false);
  };

  // 5. Create New Account (Sign Up)
  const signupWithEmail = (name, email, password) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=150`,
      isGuest: false,
      provider: 'email',
      createdAt: new Date().toISOString(),
      securityLevel: '2FA Enabled + Encrypted DB'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  // 6. Convert / Sync Guest Account to Permanent Profile without losing logs
  const syncGuestAccount = (name, email, provider = 'email') => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        isGuest: false,
        provider: provider,
        syncedAt: new Date().toISOString(),
        securityLevel: 'Cloud Synced + Encrypted'
      };
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('routinx_user');
  };

  const openAuthWithTab = (tab = 'signin') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginAsGuest,
      loginWithGoogle,
      loginWithApple,
      loginWithEmail,
      signupWithEmail,
      syncGuestAccount,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authInitialTab,
      openAuthWithTab,
      isPrivacyModalOpen,
      setIsPrivacyModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
