import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Plus, Calendar as CalendarIcon, Flag, CheckCircle2, Circle, Trash2, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Card } from './ui/card';
import { getTasks, updateTask, deleteTask as deleteTaskAPI } from '../services/tasks';
import { Task } from '../types';
import { Calendar } from './ui/calendar';
import { ConfirmationDialog } from './ui/ConfirmationDialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [taskCounts, setTaskCounts] = useState({ total: 0, all_tasks: 0, todays_task: 0, later_tasks: 0 });
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let filterDate;
        if (selectedDate) {
          filterDate = selectedDate.toISOString().split('T')[0];
        } else if (filter === 'today') {
          filterDate = new Date().toISOString().split('T')[0];
        }
        const taskResponse = await getTasks(filterDate);
        setTasks(taskResponse.items);
        setTaskCounts({
          total: taskResponse.total,
          all_tasks: taskResponse.all_tasks,
          todays_task: taskResponse.todays_task,
          later_tasks: taskResponse.later_tasks,
        });
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      }
    };

    fetchTasks();
  }, [filter, selectedDate]);

  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(id, newStatus);
      setTasks(tasks.map(t => (t.id === id ? { ...t, status: newStatus } : t)));
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await deleteTaskAPI(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleDeleteConfirmation = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  const filteredTasks = tasks;

  const getPriorityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-[#b3b3b3] bg-[#2a2a2a]';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // if (date.toDateString() === today.toDateString()) {
    //   return 'Today';
    // }
    // if (date.toDateString() === tomorrow.toDateString()) {
    //   return 'Tomorrow';
    // }
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
      {/* Header with Progress */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-white mb-1">My Tasks</h1>
            <p className="text-[#b3b3b3]">{pendingTasks} pending · {completedTasks} done</p>
          </div>
          <div className="flex gap-2 relative z-10">
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="size-12 rounded-full bg-[#1e1e1e] border border-[#333333] flex items-center justify-center"
                >
                  <CalendarIcon className="size-6 text-white" strokeWidth={2} />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date: Date | undefined) => setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="size-12 rounded-full bg-gradient-to-br from-[#8a70d6] to-[#6a56b1] flex items-center justify-center shadow-lg shadow-[#8a70d6]/30"
            >
              <Plus className="size-6 text-white" strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333333]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Daily Progress</span>
            <span className="text-[#8a70d6]">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#8a70d6] to-[#b4a6e8] rounded-full"
            />
          </div>
        </div>
      </motion.header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setFilter('all')}
          className={`p-3 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-[#8a70d6]/20 border-[#8a70d6]'
              : 'bg-[#1e1e1e] border-[#333333]'
          } border`}
        >
          <p className={filter === 'all' ? 'text-[#8a70d6]' : 'text-[#b3b3b3]'}>All</p>
          <p className="text-white text-xl mt-1">{taskCounts.all_tasks}</p>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setFilter('today')}
          className={`p-3 rounded-xl transition-all ${
            filter === 'today'
              ? 'bg-[#8a70d6]/20 border-[#8a70d6]'
              : 'bg-[#1e1e1e] border-[#333333]'
          } border`}
        >
          <p className={filter === 'today' ? 'text-[#8a70d6]' : 'text-[#b3b3b3]'}>Today</p>
          <p className="text-white text-xl mt-1">{taskCounts.todays_task}</p>
        </motion.button>

        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setFilter('upcoming')}
          className={`p-3 rounded-xl transition-all ${
            filter === 'upcoming'
              ? 'bg-[#8a70d6]/20 border-[#8a70d6]'
              : 'bg-[#1e1e1e] border-[#333333]'
          } border`}
        >
          <p className={filter === 'upcoming' ? 'text-[#8a70d6]' : 'text-[#b3b3b3]'}>Later</p>
          <p className="text-white text-xl mt-1">{taskCounts.later_tasks}</p>
        </motion.button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: -100 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card
                className={`p-4 bg-[#1e1e1e] border-[#333333] hover:border-[#8a70d6]/50 transition-all group ${
                  task.status === 'completed' ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="size-6 text-[#8a70d6]" strokeWidth={2} />
                    ) : (
                      <Circle className="size-6 text-[#b3b3b3] hover:text-[#8a70d6] transition-colors" strokeWidth={2} />
                    )}
                  </motion.button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`mb-2 ${task.status === 'completed' ? 'line-through text-[#b3b3b3]' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-lg text-xs capitalize ${getPriorityColor(task.severity)}`}>
                        <Flag className="size-3 inline mr-1" />
                        {task.severity}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-[#b3b3b3] text-xs">
                              <CalendarIcon className="size-3 inline mr-1" />
                              {formatDueDate(task.due_date)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{new Date(task.due_date).toLocaleString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-2 py-1 rounded-lg bg-[#2a2a2a] text-[#b3b3b3] text-xs ml-2">
                              <Clock className="size-3 inline mr-1" />
                              {new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{new Date(task.due_date).toLocaleString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-[#b3b3b3] text-xs">{task.origin_provider}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setTaskToDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-5 text-[#b3b3b3] hover:text-red-400 transition-colors" strokeWidth={2} />
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="size-20 mx-auto mb-4 rounded-full bg-[#8a70d6]/10 flex items-center justify-center">
            <CheckCircle2 className="size-10 text-[#8a70d6]" strokeWidth={2} />
          </div>
          <h3 className="text-white mb-2">All clear!</h3>
          <p className="text-[#b3b3b3] text-sm">No tasks found for this filter</p>
        </motion.div>
      )}
      <ConfirmationDialog
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirmation}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the task."
      />
    </div>
  );
}
