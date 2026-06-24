import { useState, useEffect } from 'react';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Heart, Share2, Plus, Minus, CheckCircle, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { ProductAPI } from '../services/api';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function ProductDetailPage({
  productId,
  onBack,
  onAddToCart,
  showToast,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs'>('features');
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const prod = await ProductAPI.getById(productId);
        if (prod) {
          setProduct(prod);
          setActiveImage(prod.image);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500">Membuka detail eksklusif produk...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm space-y-4">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Produk Tidak Ditemukan</h3>
        <p className="text-slate-500 text-sm">Produk yang Anda cari tidak tersedia atau telah dihapus.</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (type: 'plus' | 'minus') => {
    if (type === 'plus') {
      if (quantity < product.stock) {
        setQuantity(quantity + 1);
      } else {
        showToast('Batas stok maksimal tercapai', 'error');
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    showToast(`Berhasil menambahkan ${quantity} ${product.name} ke keranjang`, 'success');
  };

  return (
    <div className="space-y-8" id="product-detail-page">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Katalog Belanja</span>
      </button>

      {/* Product Information Detail */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.stock <= 5 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm animate-pulse">
                Stok Terbatas: Tinggal {product.stock}
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-slate-50 border-2 transition-all cursor-pointer ${
                    activeImage === img ? 'border-slate-900 scale-[1.03]' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Meta */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Icons */}
            <div className="flex items-center justify-between">
              <span className="text-amber-600 text-xs font-extrabold uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    showToast(isWishlisted ? 'Dihapus dari daftar keinginan' : 'Ditambahkan ke daftar keinginan', 'success');
                  }}
                  className={`p-2 rounded-xl border transition-all ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-red-500' 
                      : 'border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Tambah ke Daftar Keinginan"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Tautan produk berhasil disalin!', 'success');
                  }}
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  title="Bagikan Produk"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings / Review summary */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4.5 h-4.5 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-500 hover:underline cursor-pointer">
                {product.reviewsCount} Ulasan Pembeli
              </span>
            </div>

            {/* Price display */}
            <div className="py-4 border-y border-slate-100 flex items-baseline gap-4">
              <span className="text-slate-950 font-black text-3xl">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Tersedia Stok: {product.stock} pcs
              </span>
            </div>

            {/* Description Paragraph */}
            <p className="text-slate-500 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Hub tabs */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            {/* Tabs for Features vs Specs */}
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab('features')}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'features' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
                }`}
              >
                Fitur Unggulan
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'specs' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
                }`}
              >
                Spesifikasi
              </button>
            </div>

            {/* Tab content */}
            <div className="min-h-[120px]">
              {activeTab === 'features' ? (
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-3 text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider">{key}</span>
                      <span className="col-span-2 text-slate-700 font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity and CTA Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-slate-100">
              {/* Quantity Picker */}
              <div className="flex items-center justify-between border border-slate-200 rounded-xl p-2 sm:w-36 shrink-0 bg-slate-50">
                <button
                  onClick={() => handleQuantityChange('minus')}
                  disabled={quantity <= 1}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-black text-slate-900 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('plus')}
                  disabled={quantity >= product.stock}
                  className="p-1 rounded-lg text-slate-500 hover:bg-white disabled:opacity-30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add To Cart Button */}
              <button
                onClick={handleAddToCartClick}
                className="flex-1 py-4 px-6 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Tambahkan ke Keranjang</span>
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="flex items-center gap-6 justify-center sm:justify-start text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Garansi Resmi 100%
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Cicilan 0% s/d 12 Bulan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
