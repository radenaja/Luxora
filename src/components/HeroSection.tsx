import { ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

interface HeroSectionProps {
  onShopNow: () => void;
}

export default function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl mb-12">
      {/* Decorative Grid Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Visual background lights */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-10 animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500 rounded-full blur-3xl opacity-10 animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 md:px-12 lg:px-16 flex flex-col md:flex-row items-center gap-12">
        {/* Hero Text */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700/50 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koleksi Eksklusif Terbaru</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Ubah Hidup Anda dengan <span className="text-amber-400">Kemewahan</span> Sejati
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed font-normal">
            Pilihan terkurasi produk aksesoris, audio premium, fashion kulit mewah, dan dekorasi rumah artisan dari desainer terkemuka dunia. Rasakan kesempurnaan pengerjaan yang tiada banding.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button
              onClick={onShopNow}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-slate-950 font-extrabold rounded-xl hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              <span>Belanja Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onShopNow}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-slate-700 text-slate-100 font-bold rounded-xl hover:bg-slate-800/50 transition-all text-center"
            >
              Lihat Kategori
            </button>
          </div>

          {/* Quick trust badges */}
          <div className="pt-8 grid grid-cols-2 gap-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-100">Gratis Ongkir</h4>
                <p className="text-[10px] text-slate-400">Seluruh Wilayah Indonesia</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-100">100% Produk Asli</h4>
                <p className="text-[10px] text-slate-400">Garansi Uang Kembali</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Block / Banner Showcase */}
        <div className="flex-1 relative w-full max-w-md md:max-w-none">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-800/80">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
              alt="Premium lifestyle products"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            {/* Promo Float Box */}
            <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="text-amber-400 font-extrabold text-xs tracking-wider uppercase">Terlaris Bulan Ini</p>
                <h4 className="font-bold text-sm text-slate-100 line-clamp-1">AcousticWave Wireless Headphones</h4>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[10px] line-through">Rp 3.999.000</p>
                <p className="font-extrabold text-white text-sm text-amber-400">Rp 3.499.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
