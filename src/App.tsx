import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Award, RotateCcw, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';
import { Product, CartItem, User, Order } from './types';
import { AuthAPI, ProductAPI, CartAPI } from './services/api';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Toast from './components/Toast';
import ProductCard from './components/ProductCard';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'products' | 'detail' | 'cart' | 'checkout' | 'login' | 'register' | 'orders'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Checkout calculations passed from Cart to Checkout
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Home Featured Products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Initialize session and cart
  useEffect(() => {
    // Current user
    const currentUser = AuthAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Load Cart from database (server)
      CartAPI.getCart().then(setCart).catch(() => console.error('Failed to load cart'));
    }

    // Fetch featured products for Homepage (first 4 products)
    const fetchFeatured = async () => {
      try {
        const prods = await ProductAPI.getAll();
        setFeaturedProducts(prods.slice(0, 4));
      } catch (e) {
        console.error('Failed to fetch featured products');
      }
    };
    fetchFeatured();
  }, []);

  // Refresh cart from database (server)
  const refreshCart = async () => {
    try {
      const serverCart = await CartAPI.getCart();
      setCart(serverCart);
    } catch (e) {
      console.error('Failed to refresh cart', e);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Cart operations (now synced to database via CartAPI)
  const handleAddToCart = async (product: Product, quantity = 1) => {
    if (!user) {
      showToast('Silakan login terlebih dahulu sebelum menambahkan ke keranjang', 'error');
      setCurrentView('login');
      return;
    }
    try {
      await CartAPI.addToCart(product.id, quantity);
      await refreshCart();
      showToast(`Berhasil menambahkan ${product.name} ke keranjang`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal menambahkan ke keranjang', 'error');
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await CartAPI.updateQuantity(productId, quantity);
      await refreshCart();
    } catch (e: any) {
      showToast(e.message || 'Gagal mengubah kuantitas', 'error');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await CartAPI.removeFromCart(productId);
      await refreshCart();
    } catch (e: any) {
      showToast(e.message || 'Gagal menghapus produk', 'error');
    }
  };

  const handleProceedToCheckout = (appliedDiscount: number, code: string) => {
    if (!user) {
      showToast('Harap masuk/login terlebih dahulu sebelum checkout', 'error');
      setCurrentView('login');
      return;
    }
    setDiscountAmount(appliedDiscount);
    setVoucherCode(code);
    setCurrentView('checkout');
  };

  const handleCheckoutSuccess = (order: Order) => {
    // Cart already cleared in database by backend transaction
    setCart([]);
    setDiscountAmount(0);
    setVoucherCode('');
  };

  const handleLogout = async () => {
    try {
      await AuthAPI.logout();
      setUser(null);
      setCart([]);
      showToast('Berhasil keluar akun', 'success');
      setCurrentView('home');
    } catch (e) {
      showToast('Gagal logout', 'error');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('home');
    refreshCart();
  };

  const handleRegisterSuccess = (registeredUser: User) => {
    setUser(registeredUser);
    setCurrentView('home');
    refreshCart();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('Semua');
    setCurrentView('products');
  };

  const handleViewDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('detail');
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSearchQuery('');
    setCurrentView('products');
  };

  // Quick navigation helpers
  const handleNavigate = (view: 'home' | 'products' | 'cart' | 'login' | 'register' | 'orders') => {
    if (view === 'products') {
      setSelectedCategory('Semua');
      setSearchQuery('');
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-amber-100 selection:text-slate-900">
      {/* Sticky Top Header & Navbar */}
      <Navbar
        user={user}
        cartCount={cartItemsCount}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Render Views Dynamically */}
        {currentView === 'home' && (
          <div className="space-y-16 animate-fadeIn" id="home-view">
            {/* Hero Block */}
            <HeroSection onShopNow={() => handleNavigate('products')} />

            {/* Category Quick Browse */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">Kategori Terkurasi</h2>
                <p className="text-slate-500 text-sm mt-1">Pilih kategori barang mewah yang sesuai dengan keunikan diri Anda</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', count: '2 Produk' },
                  { name: 'Aksesoris', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80', count: '2 Produk' },
                  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80', count: '1 Produk' },
                  { name: 'Dekorasi', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80', count: '2 Produk' }
                ].map((category) => (
                  <div
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-100"
                  >
                    <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-extrabold text-base tracking-tight">{category.name}</h4>
                      <p className="text-[10px] text-slate-300 font-bold tracking-wider uppercase mt-0.5">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Featured Products */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-center sm:text-left">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">Koleksi Terpopuler</h2>
                  <p className="text-slate-500 text-sm mt-1">Produk-produk paling dicari dan disukai oleh para pelanggan setia kami</p>
                </div>
                <button
                  onClick={() => handleNavigate('products')}
                  className="text-sm font-extrabold text-amber-600 hover:text-amber-500 inline-flex items-center gap-1.5 transition-colors self-center sm:self-end group cursor-pointer"
                >
                  <span>Lihat Seluruh Koleksi</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetail={handleViewDetail}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-60 border border-slate-100 bg-white rounded-3xl flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-bold">Membuka katalog koleksi mewah...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Luxe Promo Block */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-10" />
              <div className="relative z-10 max-w-xl space-y-5">
                <span className="text-xs font-bold text-amber-400 bg-slate-800 px-3 py-1.5 rounded-full uppercase tracking-wider">Layanan Premium</span>
                <h3 className="text-3xl font-black tracking-tight leading-tight">Pengalaman Belanja Eksklusif yang Dipersonalisasi</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                  Dapatkan layanan concierge 24/7, rekomendasi gaya pribadi dari kurator ahli, asuransi pengiriman penuh, gratis penukaran produk selama 14 hari, dan kemudahan cicilan nol persen untuk seluruh produk kami.
                </p>
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">Kualitas Bintang 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">14 Hari Pengembalian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">Dukungan Concierge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'products' && (
          <ProductListPage
            onViewDetail={handleViewDetail}
            onAddToCart={handleAddToCart}
            initialSearchQuery={searchQuery}
            initialCategory={selectedCategory}
          />
        )}

        {currentView === 'detail' && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => handleNavigate('products')}
            onAddToCart={handleAddToCart}
            showToast={showToast}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigateToProducts={() => handleNavigate('products')}
            onProceedToCheckout={handleProceedToCheckout}
            showToast={showToast}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            cart={cart}
            user={user}
            discountAmount={discountAmount}
            voucherCode={voucherCode}
            onBackToCart={() => handleNavigate('cart')}
            onCheckoutSuccess={handleCheckoutSuccess}
            showToast={showToast}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage onNavigateToProducts={() => handleNavigate('products')} />
        )}

        {currentView === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => setCurrentView('register')}
            showToast={showToast}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={() => setCurrentView('login')}
            showToast={showToast}
          />
        )}

      </main>

      {/* High-End Brand Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Column 1 - Brand Info */}
            <div className="md:col-span-5 space-y-4 text-center md:text-left">
              <span className="text-2xl font-black tracking-tight text-white flex items-center justify-center md:justify-start">
                <span className="bg-white text-slate-950 px-2 py-1.5 rounded-xl mr-2 shadow-lg font-bold">LX</span>
                LUXORA
              </span>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal max-w-sm mx-auto md:mx-0">
                Luxora adalah destinasi belanja online terdepan untuk produk gaya hidup kurasi premium, audio berkelas tinggi, fungsionalitas teknologi mutakhir, serta dekorasi rumah berselera tinggi.
              </p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest pt-2">
                © 2026 LUXORA E-COMMERCE. Seluruh hak cipta dilindungi.
              </p>
            </div>

            {/* Column 2 - Links */}
            <div className="col-span-1 md:col-span-2 text-center md:text-left space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Belanja</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-semibold">
                <li><button onClick={() => handleCategoryClick('Audio')} className="hover:text-white transition-colors cursor-pointer">Audio Premium</button></li>
                <li><button onClick={() => handleCategoryClick('Aksesoris')} className="hover:text-white transition-colors cursor-pointer">Aksesoris Eksklusif</button></li>
                <li><button onClick={() => handleCategoryClick('Fashion')} className="hover:text-white transition-colors cursor-pointer">Fashion Kulit</button></li>
                <li><button onClick={() => handleCategoryClick('Dekorasi')} className="hover:text-white transition-colors cursor-pointer">Artisan Living</button></li>
              </ul>
            </div>

            {/* Column 3 - Corporate Links */}
            <div className="col-span-1 md:col-span-2 text-center md:text-left space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Bantuan</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-semibold">
                <li><button className="hover:text-white transition-colors cursor-pointer">Lacak Pengiriman</button></li>
                <li><button className="hover:text-white transition-colors cursor-pointer">Kebijakan Retur</button></li>
                <li><button className="hover:text-white transition-colors cursor-pointer">Pusat Bantuan (FAQ)</button></li>
                <li><button className="hover:text-white transition-colors cursor-pointer">Kontak Kami</button></li>
              </ul>
            </div>

            {/* Column 4 - Address / Contact */}
            <div className="col-span-1 md:col-span-3 text-center md:text-left space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Lokasi Kantor</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Menara Luxora, Lantai 45<br />
                Jl. Jenderal Sudirman Kav. 21-22<br />
                Kuningan, Jakarta Selatan, 12920<br />
                Indonesia
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
