import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, HelpCircle, Check, Percent } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigateToProducts: () => void;
  onProceedToCheckout: (appliedDiscount: number, voucherCode: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateToProducts,
  onProceedToCheckout,
  showToast,
}: CartPageProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'LUXORA10') {
      setAppliedVoucher('LUXORA10');
      setDiscountPercent(10);
      showToast('Kupon LUXORA10 berhasil diterapkan! Anda menghemat 10%', 'success');
    } else {
      showToast('Kupon tidak valid atau telah kedaluwarsa', 'error');
    }
    setVoucherCode('');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountPercent(0);
    showToast('Kupon berhasil dihapus', 'success');
  };

  const handleQuantityAdjust = (productId: string, currentQty: number, change: number, stock: number) => {
    const nextQty = currentQty + change;
    if (nextQty < 1) {
      onRemoveItem(productId);
      showToast('Produk dihapus dari keranjang', 'success');
    } else if (nextQty > stock) {
      showToast('Batas stok maksimal tercapai', 'error');
    } else {
      onUpdateQuantity(productId, nextQty);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm space-y-5 animate-fadeIn" id="cart-page-empty">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-950 tracking-tight">Keranjang Anda Kosong</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          Sepertinya Anda belum menambahkan produk apapun ke dalam keranjang belanja Anda. Jelajahi katalog mewah kami sekarang!
        </p>
        <button
          onClick={onNavigateToProducts}
          className="px-8 py-3.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md inline-flex items-center gap-2 group cursor-pointer"
        >
          <span>Mulai Belanja</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discountAmount = subtotal * (discountPercent / 100);
  const shippingFee = subtotal > 2000000 ? 0 : 45000; // Free shipping over 2M IDR
  const finalTotal = subtotal - discountAmount + shippingFee;

  return (
    <div className="space-y-8" id="cart-page">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-950 tracking-tight">Keranjang Belanja</h2>
        <p className="text-slate-500 text-sm mt-1">Selesaikan pembelanjaan produk mewah kurasi pilihan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List - Left Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm p-4 sm:p-6 divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.product.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-20 sm:h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Product Meta */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">{item.product.category}</span>
                  <h4 className="text-slate-900 text-sm sm:text-base font-bold truncate mb-1">{item.product.name}</h4>
                  <p className="text-slate-900 text-sm font-black">{formatPrice(item.product.price)}</p>
                </div>

                {/* Controls (Qty & Remove) */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                  {/* Qty Picker */}
                  <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50 shrink-0">
                    <button
                      onClick={() => handleQuantityAdjust(item.product.id, item.quantity, -1, item.product.stock)}
                      className="p-1 rounded text-slate-500 hover:bg-white transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-900 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityAdjust(item.product.id, item.quantity, 1, item.product.stock)}
                      className="p-1 rounded text-slate-500 hover:bg-white transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal of Item */}
                  <div className="text-right hidden md:block min-w-[100px]">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Subtotal</p>
                    <p className="text-slate-900 text-sm font-black">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>

                  {/* Trash Icon */}
                  <button
                    onClick={() => {
                      onRemoveItem(item.product.id);
                      showToast('Produk dihapus dari keranjang', 'success');
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={onNavigateToProducts}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali Berbelanja Produk Lain</span>
          </button>
        </div>

        {/* Order Summary & Coupon Code - Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4.5 h-4.5 text-amber-500" />
              <span>Kode Voucher</span>
            </h3>

            {appliedVoucher ? (
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-800 uppercase">{appliedVoucher}</p>
                    <p className="text-[10px] font-semibold text-emerald-600">Diskon 10% Terpasang</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveVoucher}
                  className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Contoh: LUXORA10"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Gunakan
                </button>
              </form>
            )}
            {!appliedVoucher && (
              <p className="text-[10px] text-slate-400 font-medium">
                * Gunakan kode kupon <span className="font-extrabold text-amber-600">LUXORA10</span> untuk potongan harga 10% dari total pembelian.
              </p>
            )}
          </div>

          {/* Checkout Calculations Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Ringkasan Pesanan
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Subtotal Barang ({cart.reduce((s, c) => s + c.quantity, 0)} item)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>Diskon Voucher ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Estimasi Biaya Pengiriman</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-extrabold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Gratis Ongkir</span>
                ) : (
                  <span>{formatPrice(shippingFee)}</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">Total Harga</span>
                <span className="text-slate-950 font-black text-xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={() => onProceedToCheckout(discountAmount, appliedVoucher || '')}
              className="w-full py-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Guarantees footer */}
            {subtotal <= 2000000 && (
              <p className="text-[10px] text-slate-400 font-semibold text-center mt-2 leading-relaxed">
                * Tambah belanjaan hingga total <span className="text-slate-800 font-black">{formatPrice(2000000)}</span> untuk menikmati penawaran <span className="text-emerald-600 font-extrabold">GRATIS ONGKIR</span>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
