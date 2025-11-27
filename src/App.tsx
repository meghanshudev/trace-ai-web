import { useState, useEffect } from 'react';
import { Home, CheckSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeScreen } from './components/HomeScreen';
import { TasksScreen } from './components/TasksScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { IntegrationsScreen } from './components/IntegrationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AuthScreen } from './components/AuthScreen';
import { getProfile } from './services/user';
import { logout } from './services/auth';
import { UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'settings'>('home');
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleLogin = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch profile', error);
      // Handle profile fetch error, maybe sign out the user
      handleSignOut();
    }
  };

  useEffect(() => {
    // Check if the user is already authenticated (e.g., by checking for a token in localStorage)
    // If authenticated, call handleLogin() to fetch profile
    const token = localStorage.getItem('token');
    if (token) {
      handleLogin();
    }
  }, []);

  const handleSignOut = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('home');
    setShowIntegrations(false);
    setShowProfile(false);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8a70d6] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {showProfile ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ProfileScreen
                user={user}
                onBack={() => setShowProfile(false)}
                onProfileUpdate={handleLogin}
              />
            </motion.div>
          ) : showIntegrations ? (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <IntegrationsScreen onBack={() => setShowIntegrations(false)} />
            </motion.div>
          ) : (
            <>
              {activeTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <HomeScreen onNavigateToIntegrations={() => setShowIntegrations(true)} />
                </motion.div>
              )}
              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <TasksScreen />
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <SettingsScreen
                    user={user}
                    onSignOut={handleSignOut}
                    onNavigateToProfile={() => setShowProfile(true)}
                  />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {!showIntegrations && !showProfile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e]/80 backdrop-blur-xl border-t border-[#333333] z-20">
          <div className="max-w-2xl mx-auto flex justify-around items-center h-20 px-4 relative">
            {/* Active Indicator */}
            <motion.div
              className="absolute top-0 h-0.5 bg-gradient-to-r from-transparent via-[#8a70d6] to-transparent"
              initial={false}
              animate={{
                left: activeTab === 'home' ? '8%' : activeTab === 'tasks' ? '42%' : '75%',
                width: '16%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            
            <button
              onClick={() => setActiveTab('home')}
              className="relative flex flex-col items-center gap-2 py-2 px-8"
            >
              <motion.div
                animate={{
                  scale: activeTab === 'home' ? 1.1 : 1,
                  y: activeTab === 'home' ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`transition-colors ${
                  activeTab === 'home' ? 'text-[#8a70d6]' : 'text-[#b3b3b3]'
                }`}
              >
                <Home className="size-6" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              </motion.div>
              <AnimatePresence>
                {activeTab === 'home' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs text-[#8a70d6] absolute -bottom-1"
                  >
                    Home
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className="relative flex flex-col items-center gap-2 py-2 px-8"
            >
              <motion.div
                animate={{
                  scale: activeTab === 'tasks' ? 1.1 : 1,
                  y: activeTab === 'tasks' ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`transition-colors ${
                  activeTab === 'tasks' ? 'text-[#8a70d6]' : 'text-[#b3b3b3]'
                }`}
              >
                <CheckSquare className="size-6" strokeWidth={activeTab === 'tasks' ? 2.5 : 2} />
              </motion.div>
              <AnimatePresence>
                {activeTab === 'tasks' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs text-[#8a70d6] absolute -bottom-1"
                  >
                    Tasks
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="relative flex flex-col items-center gap-2 py-2 px-8"
            >
              <motion.div
                animate={{
                  scale: activeTab === 'settings' ? 1.1 : 1,
                  y: activeTab === 'settings' ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`transition-colors ${
                  activeTab === 'settings' ? 'text-[#8a70d6]' : 'text-[#b3b3b3]'
                }`}
              >
                <Settings className="size-6" strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
              </motion.div>
              <AnimatePresence>
                {activeTab === 'settings' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-xs text-[#8a70d6] absolute -bottom-1"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}