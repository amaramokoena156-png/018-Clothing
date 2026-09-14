import React, { useEffect, useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, KeyRound, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    register,
    resetPassword,
    showToast,
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setMode('register');
      setPassword('');
      setConfirmPassword('');
      setBusy(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      showToast('Please provide a valid email address.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'forgot') {
        await resetPassword(cleanEmail);
        return;
      }

      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters.');
        return;
      }

      if (mode === 'register') {
        if (!name.trim()) {
          showToast('Please enter your full name.');
          return;
        }
        if (password !== confirmPassword) {
          showToast('Passwords do not match.');
          return;
        }
        await register(name, cleanEmail, password);
      } else {
        await login(cleanEmail, password);
      }
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'forgot'
    ? 'Reset Your Password'
    : mode === 'login'
      ? 'Welcome Back to 018'
      : 'Join the 018 Family';

  const subtitle = mode === 'forgot'
    ? 'Enter your email and we will send you a secure password reset link.'
    : mode === 'login'
      ? 'Access your orders, track parcels, and manage your wishlist.'
      : 'Create your account to unlock member drops, order tracking, and a faster checkout.';

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <BrandLogo size="md" />
          </div>
          <h2 className="text-xl font-bold font-['Syne'] text-neutral-900 dark:text-white">{title}</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-medium text-neutral-600 dark:text-neutral-400">Full Name</label>
              <div className="relative mt-1">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-medium text-neutral-600 dark:text-neutral-400">Email Address</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-neutral-600 dark:text-neutral-400">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[#f35d1f] font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="font-medium text-neutral-600 dark:text-neutral-400">Confirm Password</label>
              <div className="relative mt-1">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] disabled:opacity-60 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            {mode === 'forgot' ? <KeyRound className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            <span>
              {busy ? 'Please wait...' : mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </span>
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 space-y-2">
          {mode === 'forgot' ? (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="inline-flex items-center gap-1.5 text-[#f35d1f] font-bold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          ) : mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('register')} className="text-[#f35d1f] font-bold hover:underline">
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-[#f35d1f] font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
