import { Bell, Lock, Palette, HelpCircle, LogOut, User, ChevronRight, Crown, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { UserProfile } from '../types';

const settingsSections = [
  {
    title: 'Preferences',
    items: [
      { id: 1, label: 'Push Notifications', icon: Bell, hasToggle: true, enabled: true },
      { id: 2, label: 'Theme & Appearance', icon: Palette, hasToggle: false },
      { id: 3, label: 'Smart Detection', icon: Zap, hasToggle: true, enabled: true },
    ],
  },
  {
    title: 'Security',
    items: [
      { id: 4, label: 'Privacy Settings', icon: Lock, hasToggle: false },
      { id: 5, label: 'Data Protection', icon: Shield, hasToggle: true, enabled: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 6, label: 'Help Center', icon: HelpCircle, hasToggle: false },
    ],
  },
];

interface SettingsScreenProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onNavigateToProfile?: () => void;
}

export function SettingsScreen({ user, onSignOut, onNavigateToProfile }: SettingsScreenProps) {
  const handleItemClick = (item: any) => {
    if (item.action === 'profile' && onNavigateToProfile) {
      onNavigateToProfile();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-white mb-1">Settings</h1>
        <p className="text-[#b3b3b3]">Manage your account</p>
      </motion.header>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
      >
        <Card
          onClick={onNavigateToProfile}
          className="p-5 bg-gradient-to-br from-[#8a70d6]/20 via-[#1e1e1e] to-[#1e1e1e] border-[#8a70d6]/30 relative overflow-hidden cursor-pointer"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 size-32 bg-[#8a70d6]/20 blur-3xl rounded-full" />
          
          <div className="relative flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="size-16 rounded-2xl bg-gradient-to-br from-[#8a70d6] to-[#6a56b1] flex items-center justify-center shadow-lg shadow-[#8a70d6]/30"
            >
              <User className="size-8 text-white" strokeWidth={2} />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white">{user?.full_name || 'User'}</p>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8a70d6] to-[#b4a6e8] flex items-center gap-1"
                >
                  <Crown className="size-3 text-white" />
                  <span className="text-white text-xs">Pro</span>
                </motion.div>
              </div>
              <p className="text-[#b3b3b3] text-sm">{user?.email || ''}</p>
            </div>
            <motion.button
              whileHover={{ x: 4 }}
              className="text-[#8a70d6]"
            >
              <ChevronRight className="size-5" />
            </motion.button>
          </div>
        </Card>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <motion.section
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + sectionIndex * 0.1 }}
        >
          <h2 className="text-white mb-3">{section.title}</h2>
          <Card className="divide-y divide-[#333333] overflow-hidden bg-[#1e1e1e] border-[#333333]">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ x: 4, backgroundColor: 'rgba(138, 112, 214, 0.05)' }}
                  className="flex items-center justify-between p-4 cursor-pointer group transition-colors"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-[#8a70d6]/20 to-[#6a56b1]/20 flex items-center justify-center group-hover:from-[#8a70d6]/30 group-hover:to-[#6a56b1]/30 transition-colors">
                      <Icon className="size-5 text-[#8a70d6]" strokeWidth={2} />
                    </div>
                    <span className="text-white group-hover:text-[#b4a6e8] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  {item.hasToggle ? (
                    <Switch defaultChecked={item.enabled} />
                  ) : (
                    <ChevronRight className="size-5 text-[#b3b3b3] group-hover:text-[#8a70d6] transition-colors" strokeWidth={2} />
                  )}
                </motion.div>
              );
            })}
          </Card>
        </motion.section>
      ))}

      {/* Storage Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-white mb-3">Storage</h2>
        <Card className="p-5 bg-[#1e1e1e] border-[#333333]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white">2.4 GB used</span>
            <span className="text-[#b3b3b3] text-sm">of 15 GB</span>
          </div>
          <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '16%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-[#8a70d6] to-[#b4a6e8] rounded-full"
            />
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-white mb-3">Account</h2>
        <motion.button
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 hover:border-red-500/50 transition-all group"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          >
            <LogOut className="size-5" strokeWidth={2} />
          </motion.div>
          <span className="group-hover:text-red-300 transition-colors">Sign Out</span>
        </motion.button>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-2 pt-4"
      >
        <p className="text-[#b3b3b3] text-sm">Version 1.0.0</p>
        <p className="text-[#b3b3b3] text-xs">Made with ❤️ for productivity</p>
      </motion.div>
    </div>
  );
}