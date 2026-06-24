import React, { useState } from 'react';
import { Truck, CreditCard, ClipboardCheck, ArrowLeft, Loader2, Sparkles, CheckCircle2, ShoppingBag, MapPin } from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { OrderAPI } from '../services/api';

interface CheckoutPageProps {
  cart: CartItem[];
  user: User | null;
  discountAmount: number;
  voucherCode: string;
  onBackToCart: () => void;
  onCheckoutSuccess: (order: Order) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function CheckoutPage({
  cart,
  user,
  discountAmount,
  voucherCode,
  onBackToCart,
  onCheckoutSuccess,
  showToast,
}: CheckoutPageProps) {
  // Shipping Address State
  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  
  // Form Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

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

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!fullName.trim()) tempErrors.fullName = 'Nama lengkap penerima wajib diisi';
    if (!address.trim()) tempErrors.address = 'Alamat pengiriman lengkap wajib diisi';
    if (!city.trim()) tempErrors.city = 'Kota tujuan wajib diisi';
    
    if (!postalCode.trim()) {
      tempErrors.postalCode = 'Kode pos wajib diisi';
    } else if (!/^\d{5}$/.test(postalCode.trim())) {
      tempErrors.postalCode = 'Kode pos tidak valid (harus 5 digit angka)';
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^\+?([0-9]{10,14})$/.test(phone.trim().replace(/[- ]/g, ''))) {
      tempErrors.phone = 'Nomor telepon tidak valid (minimal 10 digit)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Harap lengkapi semua bidang isian dengan benar', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const subtotal = calculateSubtotal();
      const shippingFee = subtotal > 2000000 ? 0 : 45000;
      const total = subtotal - discountAmount + shippingFee;

      const orderData = {
        items: cart,
        total: total,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          phone,
        },
        paymentMethod,
      };

      const order = await OrderAPI.createOrder(orderData);
      setCreatedOrder(order);
      showToast('Transaksi Berhasil! Pesanan Anda sedang diproses.', 'success');
      onCheckoutSuccess(order);
    } catch (err: any) {
      showToast(err.message || 'Gagal memproses pesanan Anda. Silakan coba kembali.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal > 2000000 ? 0 : 45000;
  const finalTotal = subtotal - discountAmount + shippingFee;

  // Render Success View
  if (createdOrder) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 sm:p-12 bg-white border border-slate-100 rounded-3xl shadow-2xl space-y-6 animate-scaleIn" id="checkout-success">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pembayaran Berhasil</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Terima Kasih Atas Pesanan Anda!</h2>
          <p className="text-slate-500 text-sm">Pesanan Anda telah kami terima dan akan segera disiapkan oleh tim kurator kami.</p>
        </div>

        {/* Order Details Summary card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left divide-y divide-slate-100 space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-500 pb-2">
            <span>Nomor Pesanan</span>
            <span className="text-slate-900 font-extrabold uppercase">{createdOrder.id}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 pt-3 pb-2">
            <span>Metode Pembayaran</span>
            <span className="text-slate-900 font-extrabold">{createdOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 pt-3 pb-2">
            <span>Pengiriman Ke</span>
            <span className="text-slate-900 font-extrabold text-right max-w-[200px] truncate">{createdOrder.shippingAddress.fullName} ({createdOrder.shippingAddress.city})</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 pt-3">
            <span>Total Transaksi</span>
            <span className="text-amber-600 font-black text-sm">{formatPrice(createdOrder.total)}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBackToCart} // This goes back, app state will reset cart and show list
            className="flex-1 py-3 px-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
          >
            Lanjut Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="checkout-page">
      {/* Back Button */}
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Keranjang Belanja</span>
      </button>

      {/* Checkout Form */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Forms */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address Section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-950 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Informasi Pengiriman</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Penerima</label>
                <input
                  type="text"
                  placeholder="Contoh: John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    errors.fullName ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-slate-100'
                  } rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.fullName && <p className="text-xs font-semibold text-red-500">{errors.fullName}</p>}
              </div>

              {/* Shipping Address Details */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Alamat Lengkap Pengiriman</label>
                <textarea
                  placeholder="Sebutkan jalan, nomor rumah, RT/RW, kelurahan, kecamatan secara rinci..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    errors.address ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-slate-100'
                  } rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all resize-none`}
                />
                {errors.address && <p className="text-xs font-semibold text-red-500">{errors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kota / Kabupaten</label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta Selatan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    errors.city ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-slate-100'
                  } rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.city && <p className="text-xs font-semibold text-red-500">{errors.city}</p>}
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Kode Pos</label>
                <input
                  type="text"
                  placeholder="Maksimal 5 digit"
                  maxLength={5}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    errors.postalCode ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-slate-100'
                  } rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.postalCode && <p className="text-xs font-semibold text-red-500">{errors.postalCode}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nomor Telepon / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-slate-100'
                  } rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 transition-all`}
                />
                {errors.phone && <p className="text-xs font-semibold text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-950 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span>Metode Pembayaran</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'Bank Transfer', name: 'Transfer Virtual Account', desc: 'Instan & otomatis via Mandiri/BCA' },
                { id: 'Credit Card', name: 'Kartu Kredit / Debit', desc: 'Mendukung Visa, Mastercard & JCB' },
                { id: 'GoPay', name: 'E-Wallet (GoPay & OVO)', desc: 'Scan kode QR instan' },
                { id: 'COD', name: 'Bayar di Tempat (COD)', desc: 'Bayar saat kurir mengantarkan barang' }
              ].map((pm) => (
                <label
                  key={pm.id}
                  className={`border rounded-2xl p-4 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-all ${
                    paymentMethod === pm.id ? 'border-slate-900 bg-slate-50/50' : 'border-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={pm.id}
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id)}
                    className="mt-1 accent-slate-900"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{pm.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{pm.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Review Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardCheck className="w-5 h-5 text-amber-500" />
              <span>Tinjau Pesanan</span>
            </h3>

            {/* List of checkout items */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1.5 scrollbar-thin">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{item.quantity} x {formatPrice(item.product.price)}</p>
                  </div>
                  <span className="text-xs font-black text-slate-950 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations Review */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Subtotal Pesanan</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Voucher ({voucherCode})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Biaya Pengiriman</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-extrabold uppercase text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">Gratis Ongkir</span>
                ) : (
                  <span>{formatPrice(shippingFee)}</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">Total Pembayaran</span>
                <span className="text-slate-950 font-black text-lg">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses Transaksi...</span>
                </>
              ) : (
                <>
                  <span>Bayar Sekarang</span>
                  <Truck className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
