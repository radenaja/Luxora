import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, Search, Menu, X, ClipboardList } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  currentView: string;
  onNavigate: (view: 'home' | 'products' | 'cart' | 'login' | 'register' | 'orders') => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

export default function Navbar({
  user,
  cartCount,
  currentView,
  onNavigate,
  onLogout,
  // onSearch,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSearch(searchInput);
  //   onNavigate('products');
  // };

  const handleNavClick = (view: 'home' | 'products' | 'cart' | 'login' | 'register' | 'orders') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
              <span className="bg-slate-900 text-white p-2 rounded-xl mr-2 shadow-md">LX</span>
              LUXORA
            </span>
          </div>

          {/* Search Bar - Desktop */}
          {/* <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Cari produk mewah idaman Anda..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </form>
          </div> */}

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-semibold transition-colors duration-200 ${
                currentView === 'home' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`text-sm font-semibold transition-colors duration-200 ${
                currentView === 'products' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Belanja
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('orders')}
                className={`text-sm font-semibold flex items-center gap-1 transition-colors duration-200 ${
                  currentView === 'orders' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Pesanan Saya
              </button>
            )}

            {/* Cart Icon with badge count */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 rounded-full hover:bg-slate-100"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-black leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-amber-600 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4 border-l border-slate-200 pl-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Mobile Cart Icon with badge count */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-4 animate-fadeIn">
          {/* Mobile Search */}
          {/* <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Cari produk mewah..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          </form> */}

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg text-base font-semibold ${
                currentView === 'home' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`text-left px-3 py-2 rounded-lg text-base font-semibold ${
                currentView === 'products' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Belanja
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('orders')}
                className={`text-left px-3 py-2 rounded-lg text-base font-semibold flex items-center gap-2 ${
                  currentView === 'orders' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                Pesanan Saya
              </button>
            )}

            {user ? (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-base font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full px-4 py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Masuk
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full px-4 py-2.5 text-center text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
