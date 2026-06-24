import React, { useState } from 'react';
import { Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { AuthAPI } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateToRegister,
  showToast,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!email) {
      tempErrors.email = 'Email tidak boleh kosong';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      tempErrors.password = 'Password tidak boleh kosong';
    } else if (password.length < 6) {
      tempErrors.password = 'Password minimal harus 6 karakter';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const loggedUser = await AuthAPI.login(email, password);
      showToast(`Selamat datang kembali, ${loggedUser.name}!`, 'success');
      onLoginSuccess(loggedUser);
    } catch (err: any) {
      showToast(err.message || 'Gagal masuk. Silakan periksa kembali email & password Anda.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12" id="login-page">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-slate-900 to-amber-500" />

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anggota Eksklusif</span>
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Selamat Datang</h2>
          <p className="text-slate-500 text-sm">Masuk untuk mengakses koleksi mewah pribadi Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="contoh@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-200'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              />
              <Mail className={`absolute left-4 top-3.5 w-4 h-4 ${errors.email ? 'text-red-400' : 'text-slate-400'}`} />
            </div>
            {errors.email && <p className="text-xs font-semibold text-red-500">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
              <button type="button" className="text-xs text-amber-600 hover:text-amber-500 font-bold transition-colors">
                Lupa Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.password ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-200'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              />
              <Lock className={`absolute left-4 top-3.5 w-4 h-4 ${errors.password ? 'text-red-400' : 'text-slate-400'}`} />
            </div>
            {errors.password && <p className="text-xs font-semibold text-red-500">{errors.password}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded accent-slate-900"
            />
            <label htmlFor="remember_me" className="ml-2 block text-xs font-semibold text-slate-600">
              Ingat perangkat saya
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Navigation to Register */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Belum memiliki akun?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-amber-600 hover:text-amber-500 font-extrabold transition-colors"
            >
              Daftar disini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
