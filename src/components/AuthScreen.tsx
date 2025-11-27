import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Chrome, Apple, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { login, signup } from '../services/auth';

interface AuthScreenProps {
  onLogin: () => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [view, setView] = useState<'login' | 'signup' | 'forgot' | 'reset-sent'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      try {
        await login({
          email: formData.email,
          password: formData.password,
        });
        onLogin();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      }
    } else if (view === 'forgot') {
      // Show success message
      setView('reset-sent');
      setTimeout(() => {
        setView('login');
      }, 3000);
    } else if (view === 'signup') {
      try {
        await signup({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
        });
        onLogin();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Signup failed. Please try again.');
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    // In real app, this would trigger OAuth flow
    console.log(`Logging in with ${provider}`);
    onLogin();
  };

  const isLogin = view === 'login';
  const isSignup = view === 'signup';
  const isForgot = view === 'forgot';
  const isResetSent = view === 'reset-sent';

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-5 py-8 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8a70d6] opacity-10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#b4a6e8] opacity-5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="size-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8a70d6] to-[#6a56b1] flex items-center justify-center shadow-2xl shadow-[#8a70d6]/30"
          >
            <Sparkles className="size-8 text-white" strokeWidth={2} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h1 className="text-white mb-2">
                {isResetSent ? 'Check Your Email' : isForgot ? 'Reset Password' : 'Welcome Back'}
              </h1>
              <p className="text-[#b3b3b3]">
                {isResetSent 
                  ? 'Password reset link has been sent'
                  : isForgot 
                  ? 'Enter your email to reset password'
                  : 'Manage all your tasks in one place'
                }
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {isResetSent ? (
            // Reset Link Sent Success Screen
            <motion.div
              key="reset-sent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-8 bg-[#1e1e1e]/80 backdrop-blur-xl border-[#333333] text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="size-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#8a70d6]/20 to-[#6a56b1]/20 border border-[#8a70d6]/30 flex items-center justify-center"
                >
                  <CheckCircle2 className="size-10 text-[#8a70d6]" strokeWidth={2} />
                </motion.div>
                <p className="text-white mb-2">Email Sent Successfully!</p>
                <p className="text-[#b3b3b3] text-sm mb-4">
                  We've sent a password reset link to <span className="text-[#8a70d6]">{formData.email}</span>
                </p>
                <p className="text-[#b3b3b3] text-xs">
                  Didn't receive the email? Check your spam folder
                </p>
              </Card>
            </motion.div>
          ) : (
            // Auth Card (Login/Signup/Forgot)
            <motion.div
              key="auth-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="p-6 bg-[#1e1e1e]/80 backdrop-blur-xl border-[#333333]">
                {/* Back Button for Forgot Password */}
                {isForgot && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setView('login')}
                    className="flex items-center gap-2 text-[#b3b3b3] hover:text-white transition-colors mb-4"
                  >
                    <ArrowLeft className="size-4" strokeWidth={2} />
                    <span className="text-sm">Back to login</span>
                  </motion.button>
                )}

                {/* Tab Switcher - Only show for login/signup */}
                {!isForgot && (
                  <div className="flex gap-2 p-1 bg-[#121212] rounded-xl mb-6">
                    <button
                      onClick={() => setView('login')}
                      className="flex-1 relative"
                    >
                      <motion.div
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isLogin ? 'text-white' : 'text-[#b3b3b3]'
                        }`}
                      >
                        Sign In
                      </motion.div>
                      {isLogin && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] rounded-lg -z-10"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setView('signup')}
                      className="flex-1 relative"
                    >
                      <motion.div
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isSignup ? 'text-white' : 'text-[#b3b3b3]'
                        }`}
                      >
                        Sign Up
                      </motion.div>
                      {isSignup && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] rounded-lg -z-10"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm rounded-lg p-3 text-center">
                      {error}
                    </div>
                  )}
                  <AnimatePresence mode="wait">
                    {isSignup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-[#b3b3b3] text-sm mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-[#b3b3b3] text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  {!isForgot && (
                    <div>
                      <label className="block text-[#b3b3b3] text-sm mb-2">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#b3b3b3]" strokeWidth={2} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-12 pr-12 py-3 bg-[#121212] border border-[#333333] rounded-xl text-white placeholder:text-[#b3b3b3] focus:border-[#8a70d6] focus:outline-none transition-colors"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="size-5" strokeWidth={2} />
                          ) : (
                            <Eye className="size-5" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="size-4 rounded bg-[#121212] border-[#333333] text-[#8a70d6] focus:ring-[#8a70d6] focus:ring-offset-0"
                        />
                        <span className="text-[#b3b3b3] text-sm">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setView('forgot')}
                        className="text-[#8a70d6] text-sm hover:text-[#b4a6e8] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#8a70d6] to-[#6a56b1] hover:from-[#b4a6e8] hover:to-[#8a70d6] text-white border-0 py-6 shadow-lg shadow-[#8a70d6]/30"
                    >
                      {isForgot ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                  </motion.div>
                </form>

                {/* Social Login - Only show for login/signup */}
                {!isForgot && (
                  <>
                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-[#333333]" />
                      <span className="text-[#b3b3b3] text-sm">or continue with</span>
                      <div className="flex-1 h-px bg-[#333333]" />
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-3 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialLogin('Google')}
                        className="p-4 rounded-xl bg-[#121212] border border-[#333333] hover:border-[#8a70d6] transition-all group"
                      >
                        <Chrome className="size-6 text-[#b3b3b3] group-hover:text-white transition-colors mx-auto" strokeWidth={2} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialLogin('GitHub')}
                        className="p-4 rounded-xl bg-[#121212] border border-[#333333] hover:border-[#8a70d6] transition-all group"
                      >
                        <Github className="size-6 text-[#b3b3b3] group-hover:text-white transition-colors mx-auto" strokeWidth={2} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSocialLogin('Apple')}
                        className="p-4 rounded-xl bg-[#121212] border border-[#333333] hover:border-[#8a70d6] transition-all group"
                      >
                        <Apple className="size-6 text-[#b3b3b3] group-hover:text-white transition-colors mx-auto" strokeWidth={2} />
                      </motion.button>
                    </div>

                    {/* Terms */}
                    <p className="text-center text-[#b3b3b3] text-xs mt-6">
                      By continuing, you agree to our{' '}
                      <button className="text-[#8a70d6] hover:text-[#b4a6e8] transition-colors">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button className="text-[#8a70d6] hover:text-[#b4a6e8] transition-colors">
                        Privacy Policy
                      </button>
                    </p>
                  </>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Info */}
        {!isForgot && !isResetSent && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <p className="text-[#b3b3b3] text-sm">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setView(isLogin ? 'signup' : 'login')}
                className="text-[#8a70d6] hover:text-[#b4a6e8] transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}