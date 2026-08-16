import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import logoImg from '../../../../Logo.png';

export function LoginPage() {
  const { isAuthenticated, login, isLoading } = useAdminAuth();
  const [email, setEmail] = useState('admin@holisticedge.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F7F4]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-[#111110] p-10">
        <img src={logoImg} alt="Holistic Edge" className="h-10 w-auto object-contain self-start brightness-[1.2]" />

        <div className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#0F2747] flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            Clinic Operations<br />Command Center
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Manage appointments, leads, testimonials, and clinic content from one unified platform.
          </p>
        </div>

        <div className="space-y-3">
          {[
            'Real-time appointment management',
            'CRM for patient leads',
            'Testimonial moderation',
            'Full audit trail',
          ].map(item => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#0F2747]/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F2747]" />
              </div>
              <span className="text-white/60 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logoImg} alt="Holistic Edge" className="h-10 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Sign in</h2>
            <p className="text-sm text-[#9E968C] mt-1">Admin access only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#5A544E] mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@holisticedge.in"
                className="w-full h-11 px-3.5 rounded-xl border border-[#E5E2DC] bg-white text-sm text-[#1A1A1A] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#0F2747] focus:ring-2 focus:ring-[#0F2747]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#5A544E] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-[#E5E2DC] bg-white text-sm text-[#1A1A1A] placeholder:text-[#C4BDB4] focus:outline-none focus:border-[#0F2747] focus:ring-2 focus:ring-[#0F2747]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E968C] hover:text-[#1A1A1A]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full h-11 rounded-xl bg-[#0F2747] hover:bg-[#0B1D3A] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3.5 rounded-xl bg-[#F4F1EA] border border-[#E8E4DC]">
            <p className="text-[11.5px] text-[#9E968C] text-center leading-relaxed">
              Default: <span className="font-mono text-[#5A544E]">admin@holisticedge.in</span><br />
              Password: <span className="font-mono text-[#5A544E]">HolisticEdge@2025</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
