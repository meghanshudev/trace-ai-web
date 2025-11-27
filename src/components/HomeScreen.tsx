import { useState, useEffect } from 'react';
import { Mail, Calendar, Slack, Github, TrendingUp, Zap, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { getIntegrations } from '../services/integrations';
import { getTasks } from '../services/tasks';
import { Integration, Task } from '../types';

const recentMessages = [
  { id: 1, from: 'Sarah Chen', subject: 'Q4 Planning Meeting', time: '10m', unread: true, priority: 'high' },
  { id: 2, from: 'Alex Kumar', subject: 'Design Review Feedback', time: '1h', unread: true, priority: 'medium' },
  { id: 3, from: 'Team Updates', subject: 'Weekly Summary', time: '3h', unread: false, priority: 'low' },
];

const stats = {
  tasksCompleted: 24,
  streak: 7,
  productivity: 85,
};

interface HomeScreenProps {
  onNavigateToIntegrations?: () => void;
}

const appIcons: { [key: string]: React.ElementType } = {
  gmail: Mail,
  calendar: Calendar,
  slack: Slack,
  github: Github,
};

const appGradients: { [key: string]: string } = {
  gmail: 'from-red-500/20 to-red-600/20',
  calendar: 'from-blue-500/20 to-blue-600/20',
  slack: 'from-purple-500/20 to-purple-600/20',
  github: 'from-gray-500/20 to-gray-600/20',
};

export function HomeScreen({ onNavigateToIntegrations }: HomeScreenProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const fetchedIntegrations = await getIntegrations(4);
        setIntegrations(fetchedIntegrations);
      } catch (error) {
        console.error('Failed to fetch integrations', error);
      }
    };

    const fetchTasks = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const taskResponse = await getTasks(today, 3);
        setTasks(taskResponse.items);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };

    fetchIntegrations();
    fetchTasks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
      {/* Header with Stats */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-white mb-1">Good evening</h1>
            <p className="text-[#b3b3b3]">You're doing great today</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="size-12 rounded-full bg-gradient-to-br from-[#8a70d6] to-[#6a56b1] flex items-center justify-center cursor-pointer shadow-lg shadow-[#8a70d6]/20"
          >
            <Sparkles className="size-6 text-white" strokeWidth={2} />
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333333]"
          >
            <div className="flex items-center gap-2 text-[#8a70d6] mb-1">
              <TrendingUp className="size-4" strokeWidth={2} />
              <span className="text-sm">Tasks</span>
            </div>
            <p className="text-white text-2xl">{stats.tasksCompleted}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333333]"
          >
            <div className="flex items-center gap-2 text-[#b4a6e8] mb-1">
              <Zap className="size-4" strokeWidth={2} />
              <span className="text-sm">Streak</span>
            </div>
            <p className="text-white text-2xl">{stats.streak}d</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333333]"
          >
            <div className="flex items-center gap-2 text-[#8a70d6] mb-1">
              <Sparkles className="size-4" strokeWidth={2} />
              <span className="text-sm">Score</span>
            </div>
            <p className="text-white text-2xl">{stats.productivity}%</p>
          </motion.div>
        </div>
      </motion.header>

      {/* Connected Apps */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white">Connected Apps</h2>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={onNavigateToIntegrations}
            className="text-[#b3b3b3] text-sm hover:text-[#8a70d6] transition-colors flex items-center gap-1"
          >
            Manage
            <ChevronRight className="size-4" />
          </motion.button>
        </div>
        {integrations.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {integrations.map((app, index) => {
              const Icon = appIcons[app.provider.toLowerCase()] || Zap;
              const gradient = appGradients[app.provider.toLowerCase()] || 'from-gray-500/20 to-gray-600/20';
              return (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-5 rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-xl border border-[#333333] hover:border-[#8a70d6]/50 transition-all overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8a70d6]/0 to-[#8a70d6]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="size-6 text-[#8a70d6]" strokeWidth={2} />
                      <div className="text-left">
                        <p className="text-white">{app.provider}</p>
                        <p className="text-[#b3b3b3] text-sm">Connected</p>
                      </div>
                    </div>
                    <motion.div
                      className="size-2 rounded-full bg-[#8a70d6]"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-[#1e1e1e]/80 backdrop-blur-xl border border-[#333333] rounded-2xl"
          >
            <h3 className="text-white text-lg mb-2">Connect Your Apps</h3>
            <p className="text-[#b3b3b3] mb-4">
              Supercharge your productivity by connecting your favorite apps.
            </p>
            <Button
              onClick={onNavigateToIntegrations}
              className="bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] hover:from-[#b4a6e8] hover:to-[#8a70d6] text-white border-0"
            >
              Connect Apps
            </Button>
          </motion.div>
        )}
      </section>

      {integrations.length > 0 ? (
        <>
          {/* Recent Messages */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white">Recent Messages</h2>
              <motion.button
                whileHover={{ x: 4 }}
                className="text-[#b3b3b3] text-sm hover:text-[#8a70d6] transition-colors flex items-center gap-1"
              >
                View all
                <ChevronRight className="size-4" />
              </motion.button>
            </div>
            <div className="space-y-2">
              {recentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <Card className="p-4 bg-[#1e1e1e] border-[#333333] hover:border-[#8a70d6]/50 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`mt-1 size-2 rounded-full flex-shrink-0 ${
                          message.unread ? 'bg-[#8a70d6]' : 'bg-[#333333]'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white truncate">{message.from}</p>
                            {message.priority === 'high' && (
                              <span className="px-2 py-0.5 rounded-full bg-[#8a70d6]/20 text-[#8a70d6] text-xs">
                                High
                              </span>
                            )}
                          </div>
                          <p className="text-[#b3b3b3] text-sm truncate group-hover:text-white transition-colors">
                            {message.subject}
                          </p>
                        </div>
                      </div>
                      <span className="text-[#b3b3b3] text-sm flex-shrink-0">{message.time}</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* AI-Detected Tasks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-white">Smart Tasks</h2>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                >
                  <Sparkles className="size-4 text-[#8a70d6]" />
                </motion.div>
              </div>
              <span className="text-[#b3b3b3] text-sm">{tasks.length} detected</span>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="p-4 bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border-[#333333] hover:border-[#8a70d6]/50 transition-all cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        whileTap={{ scale: 0.9 }}
                        className="mt-0.5 size-6 rounded-full border-2 border-[#8a70d6] hover:bg-[#8a70d6] transition-all flex-shrink-0 flex items-center justify-center group-hover:border-[#b4a6e8]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white mb-2 group-hover:text-[#b4a6e8] transition-colors">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-[#b3b3b3] text-sm">{task.origin_provider}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}