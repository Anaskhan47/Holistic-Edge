import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Calendar,
  Cloud,
  Mail,
  Lock,
  ArrowRight,
  Headphones,
  CheckCircle2
} from 'lucide-react';

export function LoginPage() {
  const { isAuthenticated, login, resetPassword, isLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Invalid email or password.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first, then click Forgot password.');
      return;
    }
    setError('');
    setResetSuccess('');
    setSubmitting(true);
    const res = await resetPassword(email);
    setSubmitting(false);
    if (res.success) {
      setResetSuccess(res.message || 'Password reset email sent! Check your inbox.');
    } else {
      setError(res.error || 'Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#061122] font-sans overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* ── LEFT BRAND & OPERATIONS PANEL (Perfectly Scaled & Aligned) ── */}
      <div className="w-full lg:w-[440px] xl:w-[480px] 2xl:w-[520px] lg:h-full flex-shrink-0 bg-[#061122] text-white p-5 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#132644]">
        {/* Ambient Decorative Background Arcs */}
        <svg
          className="absolute left-0 bottom-0 w-72 h-72 pointer-events-none opacity-15 text-[#1A365D]"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="0" cy="400" r="120" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="400" r="200" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="400" r="280" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="400" r="360" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* 1. TOP BRANDING ARE• */}
        <div className="relative z-10 space-y-3 sm:space-y-4">
          <Link to="/" className="inline-block group focus:outline-none">
            <div className="rounded-2xl bg-white p-2 shadow-md inline-flex items-center justify-center max-w-[240px] sm:max-w-[270px]">
              <img
                src="/brand/admin-login-logo.png"
                alt="Holistic Edge Wellness Centre"
                className="w-full h-auto object-contain max-h-[42px] sm:max-h-[48px]"
              />
            </div>
          </Link>

          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#081F38] text-[#93C5FD] border border-[#1A385C]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Staff Operations Portal
            </span>
          </div>
        </div>

        {/* 2. MIDDLE CONTENT & FEATURE CARDS */}
        <div className="relative z-10 space-y-3.5 my-4 lg:my-auto py-2">
          {/* Headline */}
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-serif font-normal text-[#F8FAFC] leading-[1.25] tracking-tight">
            Integrated Patient Care & Clinic Management
          </h1>
          
          {/* Description */}
          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm font-normal">
            Unified operations for Reception, Appointments, Follow-ups, and Master Patient Directory.
          </p>

          {/* Feature Cards Stack */}
          <div className="space-y-2.5 pt-1">
            {/* Feature Card 1: Locked Patient Lifecycle */}
            <div className="bg-[#07182E] border border-[#142944] rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#081F3E] border border-[#3B82F6]/30 flex items-center justify-center text-[#38BDF8] flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  Locked Patient Lifecycle
                </h3>
                <p className="text-[11px] text-[#94A3B8]">
                  HE Token & Concurrency Mutex
                </p>
              </div>
            </div>

            {/* Feature Card 2: Real Google Cloud Providers */}
            <div className="bg-[#07182E] border border-[#142944] rounded-xl p-3 sm:p-3.5 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#05281E] border border-[#10B981]/30 flex items-center justify-center text-[#34D399] flex-shrink-0">
                <Cloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                  Real Google Cloud Providers
                </h3>
                <p className="text-[11px] text-[#94A3B8]">
                  Sheets, Drive, SMTP & Firebase
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOOTER */}
        <div className="relative z-10 pt-3 border-t border-[#132644] text-[11px] text-[#64748B] flex items-center justify-between">
          <span>Holistic Edge Operations</span>
          <span className="text-[#38BDF8] font-semibold">v2.5</span>
        </div>
      </div>

      {/* ── RIGHT AUTHENTICATION WORKSPACE (Centrally Aligned & Fit) ── */}
      <div className="flex-1 lg:h-full bg-[#F8FAF9] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
        {/* Subtle Decorative Arc Background */}
        <svg
          className="absolute right-0 top-0 w-72 h-72 pointer-events-none opacity-30 text-slate-200"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="400" cy="0" r="180" stroke="currentColor" strokeWidth="1" />
          <circle cx="400" cy="0" r="280" stroke="currentColor" strokeWidth="1" />
          <circle cx="400" cy="0" r="380" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="max-w-md w-full my-auto py-2 relative z-10">
          {/* Main Login Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/60">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Sign in to continue to{' '}
                <span className="text-[#0284C7] font-semibold block sm:inline">
                  Holistic Edge Clinic Operations
                </span>
              </p>

              {/* Icon Divider */}
              <div className="relative my-3 text-center" aria-hidden="true">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative inline-flex px-3 bg-white text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="username"
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#0284C7] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password•
                </button>
              </div>

              {/* Success Message */}
              {resetSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#026aa2] text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-600/30 transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help & System Support Footnote */}
          <div className="mt-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
              <Headphones className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Need help• Contact system administrator</span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Secure access to Holistic Edge systems</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
