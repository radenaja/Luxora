import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetail: (id: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  key?: React.Key;
}

export default function ProductCard({ product, onViewDetail, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image and badges */}
      <div className="relative pt-[100%] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onViewDetail(product.id)}>
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Category Tag */}
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          {/* Title */}
          <h3 
            className="text-slate-800 text-base font-bold tracking-tight line-clamp-1 group-hover:text-slate-900 transition-colors cursor-pointer mb-1"
            onClick={() => onViewDetail(product.id)}
          >
            {product.name}
          </h3>
          {/* Description */}
          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Harga</p>
            <p className="text-slate-950 font-black text-lg">
              {formatPrice(product.price)}
            </p>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-slate-950 text-white rounded-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
