import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageCircle, Slack, ArrowLeft,
  CheckCircle2, Link2, MessageSquare, Send, Hash, Users,
  Phone,
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { getIntegrations, startAuthentication } from '../services/integrations';
import { Integration } from '../types';

const recentChats = [
  { id: 1, app: 'Gmail', channel: 'Inbox', from: 'Sarah Chen', message: 'Q4 Planning Meeting notes attached', time: '10m', unread: true, appColor: '#EA4335' },
  { id: 2, app: 'Slack', channel: '#design', from: 'Alex Kumar', message: 'Can you review the new mockups?', time: '1h', unread: true, appColor: '#4A154B' },
  { id: 3, app: 'WhatsApp', channel: 'Work', from: 'Team Lead', message: 'Great work on the presentation!', time: '2h', unread: false, appColor: '#25D366' },
  { id: 4, app: 'Teams', channel: 'Product Team', from: 'John Doe', message: 'Meeting starts in 15 minutes', time: '3h', unread: true, appColor: '#6264A7' },
  { id: 5, app: 'SMS', channel: 'All', from: '+1 234 567 890', message: 'Your verification code is 123456', time: '4h', unread: true, appColor: '#34C759' },
];

interface IntegrationsScreenProps {
  onBack: () => void;
}

const allIntegrations = [
  { id: 1, name: 'Gmail', icon: Mail, color: '#EA4335', description: 'Connect your email' },
  { id: 2, name: 'WhatsApp', icon: MessageCircle, color: '#25D366', description: 'Personal & business chats' },
  { id: 3, name: 'Slack', icon: Slack, color: '#4A154B', description: 'Team communication' },
  { id: 4, name: 'Discord', icon: MessageSquare, color: '#5865F2', description: 'Community servers' },
  { id: 5, name: 'Teams', icon: Users, color: '#6264A7', description: 'Microsoft Teams' },
  { id: 6, name: 'Telegram', icon: Send, color: '#0088cc', description: 'Secure messaging' },
  { id: 7, name: 'SMS', icon: Phone, color: '#34C759', description: 'Text messages' },
  { id: 8, name: 'Messenger', icon: MessageCircle, color: '#0084FF', description: 'Facebook Messenger' },
];

export function IntegrationsScreen({ onBack }: IntegrationsScreenProps) {
  const [selectedApp, setSelectedApp] = useState<number | null>(null);
  const [connectedIntegrations, setConnectedIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const integrations = await getIntegrations();
        setConnectedIntegrations(integrations);
      } catch (error) {
        console.error('Failed to fetch integrations', error);
      }
    };

    fetchIntegrations();
  }, []);

  const isConnected = (provider: string) => {
    return connectedIntegrations.some(integration => integration.provider.toLowerCase() === provider.toLowerCase());
  };

  const handleConnect = async (provider: string) => {
    try {
      const { redirect_url } = await startAuthentication(provider.toLowerCase());
      if (redirect_url) {
        window.open(redirect_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to start authentication', error);
    }
  };

  const connectedCount = connectedIntegrations.length;
  const totalChannels = 0; // Placeholder, as channel data is not available from the API

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="size-10 rounded-full bg-[#1e1e1e] border border-[#333333] flex items-center justify-center hover:border-[#8a70d6] transition-colors"
          >
            <ArrowLeft className="size-5 text-[#b3b3b3]" />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-white">Integrations</h1>
            <p className="text-[#b3b3b3]">{connectedCount} connected · {totalChannels} channels</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333333]"
          >
            <div className="flex items-center gap-2 text-[#8a70d6] mb-1">
              <Link2 className="size-4" strokeWidth={2} />
              <span className="text-sm">Connected</span>
            </div>
            <p className="text-white text-2xl">{connectedCount}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333333]"
          >
            <div className="flex items-center gap-2 text-[#b4a6e8] mb-1">
              <Hash className="size-4" strokeWidth={2} />
              <span className="text-sm">Channels</span>
            </div>
            <p className="text-white text-2xl">{totalChannels}</p>
          </motion.div>
        </div>
      </motion.header>

      {/* Available Integrations */}
      <section>
        <h2 className="text-white mb-4">Available Apps</h2>
        <div className="grid grid-cols-2 gap-3">
          {allIntegrations.map((app, index) => {
            const Icon = app.icon;
            const connected = isConnected(app.name);
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 bg-[#1e1e1e] border-[#333333] hover:border-[#8a70d6]/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="size-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${app.color}15` }}
                    >
                      <Icon 
                        className="size-6" 
                        strokeWidth={2}
                        style={{ color: app.color }}
                      />
                    </div>
                    {connected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <CheckCircle2 className="size-5 text-[#8a70d6]" strokeWidth={2} />
                      </motion.div>
                    )}
                  </div>
                  
                  <h3 className="text-white mb-1">{app.name}</h3>
                  <p className="text-[#b3b3b3] text-sm mb-3">{app.description}</p>
                  
                  {connected ? (
                    <Button
                      variant="outline"
                      className="w-full border-[#8a70d6]/50 text-[#8a70d6] hover:bg-[#8a70d6]/10 hover:text-[#b4a6e8]"
                      size="sm"
                    >
                      Connected
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleConnect(app.name)}
                      className="w-full bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] hover:from-[#b4a6e8] hover:to-[#8a70d6] text-white border-0"
                      size="sm"
                    >
                      Connect
                    </Button>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Selected App Channels */}
      <AnimatePresence>
        {selectedApp && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-5 bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border-[#8a70d6]/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white">
                  {allIntegrations.find(i => i.id === selectedApp)?.name} Channels
                </h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={() => setSelectedApp(null)}
                  className="text-[#b3b3b3] hover:text-white"
                >
                  ✕
                </motion.button>
              </div>
              <div className="space-y-2">
                {/* Channel data is not available from the API, so this section is empty */}
              </div>
            </Card>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Recent Messages Across All Apps */}
      <section>
        <h2 className="text-white mb-4">Recent Messages</h2>
        <div className="space-y-2">
          {recentChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <Card className="p-4 bg-[#1e1e1e] border-[#333333] hover:border-[#8a70d6]/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div 
                    className="mt-1 size-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chat.unread ? chat.appColor : '#333333' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${chat.appColor}20`, 
                          color: chat.appColor 
                        }}
                      >
                        {chat.app}
                      </span>
                      <span className="text-[#b3b3b3] text-xs">{chat.channel}</span>
                    </div>
                    <p className="text-white text-sm mb-1">{chat.from}</p>
                    <p className="text-[#b3b3b3] text-sm truncate group-hover:text-white transition-colors">
                      {chat.message}
                    </p>
                  </div>
                  <span className="text-[#b3b3b3] text-xs flex-shrink-0">{chat.time}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
