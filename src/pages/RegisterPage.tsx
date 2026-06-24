import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { AuthAPI } from '../services/api';
import { User } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function RegisterPage({
  onRegisterSuccess,
  onNavigateToLogin,
  showToast,
}: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};

    if (!name.trim()) {
      tempErrors.name = 'Nama lengkap wajib diisi';
    } else if (name.trim().length < 3) {
      tempErrors.name = 'Nama minimal harus 3 karakter';
    }

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

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newUser = await AuthAPI.register(name, email, password);
      showToast(`Pendaftaran berhasil! Selamat datang, ${newUser.name}.`, 'success');
      onRegisterSuccess(newUser);
    } catch (err: any) {
      showToast(err.message || 'Pendaftaran gagal. Silakan coba kembali.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12" id="register-page">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-8 sm:p-10 relative">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-slate-900 to-amber-500" />

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anggota Baru</span>
          </div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Buat Akun Baru</h2>
          <p className="text-slate-500 text-sm">Bergabunglah dan nikmati kemudahan berbelanja produk terkurasi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nama Lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.name ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-200'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              />
              <UserIcon className={`absolute left-4 top-3.5 w-4 h-4 ${errors.name ? 'text-red-400' : 'text-slate-400'}`} />
            </div>
            {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name}</p>}
          </div>

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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Minimal 6 karakter"
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

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Konfirmasi Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-slate-200'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all`}
              />
              <Lock className={`absolute left-4 top-3.5 w-4 h-4 ${errors.confirmPassword ? 'text-red-400' : 'text-slate-400'}`} />
            </div>
            {errors.confirmPassword && <p className="text-xs font-semibold text-red-500">{errors.confirmPassword}</p>}
          </div>

          {/* Terms & Conditions Agreement */}
          <div className="flex items-start">
            <input
              id="terms_agree"
              name="terms_agree"
              type="checkbox"
              required
              className="h-4 w-4 mt-0.5 text-slate-900 focus:ring-slate-900 border-slate-300 rounded accent-slate-900"
            />
            <label htmlFor="terms_agree" className="ml-2 block text-xs text-slate-500 font-medium">
              Saya menyetujui <span className="text-amber-600 font-bold hover:underline cursor-pointer">Syarat & Ketentuan</span> serta <span className="text-amber-600 font-bold hover:underline cursor-pointer">Kebijakan Privasi</span> Luxora.
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
                <span>Membuat Akun...</span>
              </>
            ) : (
              <span>Daftar Sekarang</span>
            )}
          </button>
        </form>

        {/* Navigation to Login */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Sudah memiliki akun?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-amber-600 hover:text-amber-500 font-extrabold transition-colors"
            >
              Masuk disini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
