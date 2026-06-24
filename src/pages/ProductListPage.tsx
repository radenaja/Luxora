import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RefreshCw, X, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { ProductAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

interface ProductListPageProps {
  onViewDetail: (id: string) => void;
  onAddToCart: (product: Product) => void;
  initialSearchQuery?: string;
  initialCategory?: string;
}

export default function ProductListPage({
  onViewDetail,
  onAddToCart,
  initialSearchQuery = '',
  initialCategory = 'Semua',
}: ProductListPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState('popular');
  const [isLoading, setIsLoading] = useState(true);

  // Sync initial query updates if any
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await ProductAPI.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const filters = {
          category: selectedCategory,
          search: searchQuery,
          sort: sortBy,
        };
        const fetchedProducts = await ProductAPI.getAll(filters);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSortBy('popular');
  };

  return (
    <div className="space-y-8" id="product-list-page">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">Katalog Produk</h2>
          <p className="text-slate-500 text-sm mt-1">Jelajahi keindahan produk-produk terkurasi dengan standar tertinggi</p>
        </div>

        {/* Quick info if searching */}
        {searchQuery && (
          <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
            <span>Pencarian: "{searchQuery}"</span>
            <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Panel */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Internal Page Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari di halaman ini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
          </div>

          {/* Sort Selector */}
          <div className="relative w-full sm:w-auto shrink-0 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-700 py-1.5 focus:outline-none cursor-pointer pr-4"
            >
              <option value="popular">Terapkan Populer</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Display Area */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
          <p className="text-sm font-bold text-slate-500">Menyelaraskan koleksi eksklusif kami...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Produk Tidak Ditemukan</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Maaf, kami tidak dapat menemukan produk yang sesuai dengan filter atau kata kunci Anda saat ini. Cobalah menyetel ulang saringan untuk melihat seluruh koleksi kami.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-3 bg-slate-950 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            Atur Ulang Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
