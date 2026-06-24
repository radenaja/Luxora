import { Product, User, Order, CartItem } from '../types';

// Mock Product Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AcousticWave Wireless ANC Headphones',
    description: 'Nikmati kualitas audio kelas studio dengan Active Noise Cancellation tercanggih. Dirancang khusus untuk kenyamanan mendengarkan musik sepanjang hari dengan daya tahan baterai hingga 40 jam dan driver audio kustom 40mm.',
    price: 3499000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    features: [
      'Hybrid Active Noise Cancellation (ANC)',
      'High-Resolution Audio certified',
      'Hingga 40 jam pemutaran dengan sekali pengisian daya',
      'Konektivitas Bluetooth 5.2 & Multipoint',
      'Bantalan telinga memory foam berlapis kulit premium'
    ],
    specs: {
      'Driver': '40mm Dynamic Speaker',
      'Frekuensi': '20Hz - 40kHz',
      'Konektor': 'USB-C (Fast Charging)',
      'Berat': '250 gram',
      'Garansi': '2 Tahun Resmi'
    }
  },
  {
    id: 'prod-2',
    name: 'Horizon Chronograph Minimalist Watch',
    description: 'Jam tangan kronograf klasik bergaya minimalis modern dengan mesin penggerak Japan Quartz presisi tinggi. Dilengkapi dengan casing baja tahan karat 316L dan tali kulit asli buatan tangan dari Italia.',
    price: 1850000,
    category: 'Aksesoris',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.7,
    reviewsCount: 86,
    stock: 8,
    features: [
      'Mesin Japan Miyota Quartz Chronograph',
      'Kaca Kristal Safir Anti Gores',
      'Casing Stainless Steel 316L (40mm)',
      'Ketahanan air hingga 5 ATM (50 meter)',
      'Tali kulit Italia asli berukuran 20mm dengan sistem quick-release'
    ],
    specs: {
      'Diameter Casing': '40 mm',
      'Ketebalan Casing': '8.5 mm',
      'Lebar Tali': '20 mm',
      'Bahan Kaca': 'Sapphire Crystal',
      'Garansi': '1 Tahun Garansi Mesin'
    }
  },
  {
    id: 'prod-3',
    name: 'Siena Premium Full-Grain Leather Tote',
    description: 'Tas jinjing klasik yang mewah dan fungsional, dibuat dari kulit sapi full-grain pilihan yang akan menua dengan indah (patina). Sangat luas, dapat menampung laptop hingga ukuran 15 inci beserta perlengkapan harian Anda.',
    price: 2450000,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.9,
    reviewsCount: 52,
    stock: 5,
    features: [
      '100% Kulit Sapi Full-Grain Premium',
      'Kompartemen Laptop Empuk Khusus (Hingga 15")',
      'Saku Ritsleting Interior YKK Kuningan',
      'Gantungan Kunci Kulit Terintegrasi',
      'Tali Bahu Kulit Tebal yang Nyaman'
    ],
    specs: {
      'Dimensi': '42 x 32 x 14 cm',
      'Bahan': 'Full-Grain Vegetable Tanned Leather',
      'Warna': 'Tan Classic',
      'Berat Kosong': '1.1 kg',
      'Saku Dalam': '1 Ritsleting, 2 Slip-pocket'
    }
  },
  {
    id: 'prod-4',
    name: 'AeroPulse Smart Fitness Watch',
    description: 'Asisten kesehatan pribadi di pergelangan tangan Anda. Dilengkapi dengan sensor detak jantung 24/7, pemantau saturasi oksigen darah (SpO2), pelacak tidur pintar, serta 30+ mode olahraga profesional dengan GPS internal.',
    price: 1599000,
    category: 'Teknologi',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.5,
    reviewsCount: 210,
    stock: 25,
    features: [
      'Layar Sentuh AMOLED 1.43" Selalu Aktif (Always-On)',
      'Sistem GPS Multi-Satelit Terintegrasi',
      'Daya Tahan Baterai Luar Biasa (Hingga 14 hari)',
      'Waterproof 5 ATM (Aman untuk Berenang)',
      'Pemantauan Stress & Latihan Pernapasan'
    ],
    specs: {
      'Layar': '1.43" AMOLED (466x466 px)',
      'Bahan Strap': 'Silikon Medis Anti-Alergi',
      'Konektivitas': 'Bluetooth 5.0, Wi-Fi',
      'Baterai': '420 mAh',
      'Kompatibilitas': 'iOS 11+ & Android 6.0+'
    }
  },
  {
    id: 'prod-5',
    name: 'Lumina Ceramic Artisan Mug',
    description: 'Cangkir keramik buatan tangan seniman lokal yang menawarkan tekstur alami nan artistik. Setiap cangkir dipanggang secara unik sehingga tidak ada dua cangkir yang persis sama. Nyaman digenggam untuk menikmati kopi hangat Anda.',
    price: 249000,
    category: 'Dekorasi',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.6,
    reviewsCount: 45,
    stock: 12,
    features: [
      '100% Buatan Tangan (Handcrafted)',
      'Bahan Tanah Liat Stoneware Berkualitas Tinggi',
      'Glaze Food-Grade Bebas Timbal dan Kadmium',
      'Aman untuk Microwave dan Pencuci Piring',
      'Kapasitas Nyaman 350ml'
    ],
    specs: {
      'Kapasitas': '350 ml',
      'Tinggi': '9.5 cm',
      'Diameter Atas': '8.0 cm',
      'Bahan': 'Stoneware Ceramic',
      'Asal': 'Artisan Kasongan, Yogyakarta'
    }
  },
  {
    id: 'prod-6',
    name: 'Solfeggio Hi-Fi Wooden Bluetooth Speaker',
    description: 'Speaker nirkabel premium berselimut kayu walnut asli yang menghasilkan karakter suara akustik alami hangat dan bass presisi. Mengharmoniskan estetika interior rumah modern Anda dengan kualitas audio tingkat tinggi.',
    price: 1999000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.8,
    reviewsCount: 78,
    stock: 6,
    features: [
      'Bahan Casing Kayu Walnut Alami Premium',
      'Sistem Speaker Dual 15W dengan Bass Port Pasif',
      'Koneksi Bluetooth 5.0 + Jack AUX 3.5mm',
      'Baterai Lithium Recchargeable 4400mAh (Main 12 jam)',
      'Tombol Kontrol Analog dari Logam Brushed'
    ],
    specs: {
      'Output Power': '30W RMS',
      'Bluetooth Range': 'Hingga 15 Meter',
      'Input Daya': 'USB-C (5V/2A)',
      'Dimensi': '24 x 13 x 9.5 cm',
      'Garansi': '1 Tahun Resmi'
    }
  },
  {
    id: 'prod-7',
    name: 'Polaris Classic Tortoise Sunglasses',
    description: 'Kacamata hitam dengan desain bingkai tortoise retro yang tak lekang oleh waktu. Dilengkapi dengan lensa polarized premium berteknologi TAC 9-lapisan yang memberikan perlindungan 100% terhadap sinar UV400 dan mengurangi silau berlebih.',
    price: 649000,
    category: 'Aksesoris',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.4,
    reviewsCount: 39,
    stock: 18,
    features: [
      'Lensa Polarized TAC Kualitas Tinggi',
      'Perlindungan Maksimal UV400 (UVA & UVB)',
      'Bingkai Polikarbonat Ringan dan Sangat Tangguh',
      'Engsel Logam Ganda Kokoh',
      'Termasuk Kotak Kacamata Kulit dan Kain Pembersih'
    ],
    specs: {
      'Lebar Lensa': '52 mm',
      'Jarak Jembatan': '20 mm',
      'Panjang Gagang': '145 mm',
      'Sertifikasi': 'CE / FDA',
      'Warna Bingkai': 'Tortoise Glossy'
    }
  },
  {
    id: 'prod-8',
    name: 'Elysian French Lavender Soy Candle',
    description: 'Lilin aromaterapi mewah yang terbuat dari 100% minyak lilin kedelai murni (soy wax) organik tanpa asap jelaga hitam. Menggunakan minyak esensial lavender murni dari Prancis untuk memberikan ketenangan pikiran setelah hari yang padat.',
    price: 320000,
    category: 'Dekorasi',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.7,
    reviewsCount: 63,
    stock: 20,
    features: [
      '100% Natural Soy Wax (Bebas Parafin)',
      'Minyak Esensial Murni Prancis Organik',
      'Sumbu Kayu Alami yang Mengeluarkan Suara Gemercik Menenangkan',
      'Wadah Stoples Kaca Amber yang Estetik dan Dapat Dipakai Ulang',
      'Waktu Pembakaran Ekstra Lama (Hingga 50 jam)'
    ],
    specs: {
      'Berat Bersih': '220 gram / 7.7 oz',
      'Waktu Bakar': '45 - 50 Jam',
      'Sumbu': 'Artisanal Wood Wick',
      'Fragrance Note': 'Lavender, Sweet Vanilla & Chamomile',
      'Bahan Wadah': 'Amber Glass Jar with Matte Cap'
    }
  }
];

// Network delay simulation helper
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductAPI = {
  /**
   * Mengambil semua produk dengan filter opsional
   */
  getAll: async (filters?: { category?: string; search?: string; sort?: string }): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'Semua') {
      params.append('category', filters.category);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.sort) {
      params.append('sort', filters.sort);
    }

    const res = await fetch(`/api/products?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Gagal mengambil daftar produk dari server');
    }
    return res.json();
  },

  /**
   * Mengambil produk berdasarkan ID
   */
  getById: async (id: string): Promise<Product | null> => {
    const res = await fetch(`/api/products/${id}`);
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error('Gagal mengambil detail produk dari server');
    }
    return res.json();
  },

  /**
   * Mengambil semua kategori produk yang unik
   */
  getCategories: async (): Promise<string[]> => {
    const res = await fetch('/api/products/categories');
    if (!res.ok) {
      throw new Error('Gagal mengambil daftar kategori');
    }
    return res.json();
  }
};

export const AuthAPI = {
  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<User> => {
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Email atau password salah');
    }

    localStorage.setItem('luxora_token', data.token);
    localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
    return data.user;
  },

  /**
   * Registrasi user baru
   */
  register: async (name: string, email: string, password: string): Promise<User> => {
    if (!name || !email || !password) {
      throw new Error('Semua bidang (nama, email, password) wajib diisi');
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registrasi gagal');
    }

    localStorage.setItem('luxora_token', data.token);
    localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
    return data.user;
  },

  /**
   * Mengambil user saat ini dari session local storage
   */
  getCurrentUser: (): User | null => {
    const storedUser = localStorage.getItem('ecommerce_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('ecommerce_user');
    localStorage.removeItem('luxora_token');
  }
};

export const CartAPI = {
  /**
   * Mengambil semua item di keranjang belanja user dari database
   */
  getCart: async (): Promise<CartItem[]> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) return [];

    const res = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return [];
    }
    return res.json();
  },

  /**
   * Menambahkan item ke keranjang belanja user
   */
  addToCart: async (productId: string, quantity = 1): Promise<CartItem> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) throw new Error('Silakan login terlebih dahulu');

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal menambahkan produk ke keranjang');
    }
    return data.item;
  },

  /**
   * Mengubah jumlah item di keranjang belanja user
   */
  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) return;

    const res = await fetch(`/api/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Gagal mengubah kuantitas');
    }
  },

  /**
   * Menghapus item dari keranjang belanja user
   */
  removeFromCart: async (productId: string): Promise<void> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) return;

    const res = await fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Gagal menghapus produk dari keranjang');
    }
  },

  /**
   * Mengosongkan keranjang belanja user
   */
  clearCart: async (): Promise<void> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) return;

    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Gagal mengosongkan keranjang belanja');
    }
  }
};

export const OrderAPI = {
  /**
   * Pembuatan pesanan / checkout (membuat data pesanan baru)
   */
  createOrder: async (orderData: Omit<Order, 'id' | 'date' | 'status'>): Promise<Order> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) {
      throw new Error('Harap masuk/login terlebih dahulu sebelum checkout');
    }

    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Gagal memproses pesanan / checkout');
    }

    return data.order;
  },

  /**
   * Mengambil riwayat pesanan user
   */
  getUserOrders: async (): Promise<Order[]> => {
    const token = localStorage.getItem('luxora_token');
    if (!token) return [];

    const res = await fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil riwayat pesanan');
    }

    return res.json();
  }
};
