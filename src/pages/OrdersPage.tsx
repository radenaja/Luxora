import { useState, useEffect } from 'react';
import { Package, ClipboardList, Clock, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';
import { Order } from '../types';
import { OrderAPI } from '../services/api';

interface OrdersPageProps {
  onNavigateToProducts: () => void;
}

export default function OrdersPage({ onNavigateToProducts }: OrdersPageProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const fetched = await OrderAPI.getUserOrders();
      setOrders(fetched);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Menyelaraskan riwayat pesanan Anda...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm space-y-5 animate-fadeIn" id="orders-page-empty">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto">
          <Package className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-950 tracking-tight">Belum Ada Pesanan</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
          Anda belum pernah melakukan transaksi di platform Luxora. Ayo lakukan pembelian pertama Anda hari ini!
        </p>
        <button
          onClick={onNavigateToProducts}
          className="px-8 py-3.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md inline-flex items-center gap-2 group cursor-pointer"
        >
          <span>Mulai Berbelanja</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn" id="orders-page">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-950 tracking-tight">Pesanan Saya</h2>
        <p className="text-slate-500 text-sm mt-1">Lacak dan tinjau riwayat pemesanan produk mewah Anda</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
            {/* Order Header / Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">ID: {order.id}</h4>
                  <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(order.date)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Status Pesanan:</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-full">
                  {order.status === 'Pending' ? 'Menunggu Pembayaran' : order.status}
                </span>
              </div>
            </div>

            {/* Order Items List */}
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.product.id} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.product.name}</h5>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{item.quantity} x {formatPrice(item.product.price)}</p>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-950 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Footer summary */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-bold">
                Metode Pembayaran: <span className="text-slate-800 font-black">{order.paymentMethod}</span>
              </div>
              <div className="flex items-baseline gap-2 justify-between sm:justify-end">
                <span className="text-xs font-bold text-slate-500">Total Belanja:</span>
                <span className="text-slate-950 font-black text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
