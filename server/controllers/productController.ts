import { Request, Response } from 'express';
import prisma from '../db/prisma';

// MOCK_PRODUCTS for DB Seeding if database is empty
const SEED_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'AcousticWave Wireless ANC Headphones',
    description: 'Nikmati kualitas audio kelas studio dengan Active Noise Cancellation tercanggih. Dirancang khusus untuk kenyamanan mendengarkan musik sepanjang hari dengan daya tahan baterai hingga 40 jam dan driver audio kustom 40mm.',
    price: 3499000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    features: JSON.stringify([
      'Hybrid Active Noise Cancellation (ANC)',
      'High-Resolution Audio certified',
      'Hingga 40 jam pemutaran dengan sekali pengisian daya',
      'Konektivitas Bluetooth 5.2 & Multipoint',
      'Bantalan telinga memory foam berlapis kulit premium'
    ]),
    specs: JSON.stringify({
      'Driver': '40mm Dynamic Speaker',
      'Frekuensi': '20Hz - 40kHz',
      'Konektor': 'USB-C (Fast Charging)',
      'Berat': '250 gram',
      'Garansi': '2 Tahun Resmi'
    })
  },
  {
    id: 'prod-2',
    name: 'Horizon Chronograph Minimalist Watch',
    description: 'Jam tangan kronograf klasik bergaya minimalis modern dengan mesin penggerak Japan Quartz presisi tinggi. Dilengkapi dengan casing baja tahan karat 316L dan tali kulit asli buatan tangan dari Italia.',
    price: 1850000,
    category: 'Aksesoris',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.7,
    reviewsCount: 86,
    stock: 8,
    features: JSON.stringify([
      'Mesin Japan Miyota Quartz Chronograph',
      'Kaca Kristal Safir Anti Gores',
      'Casing Stainless Steel 316L (40mm)',
      'Ketahanan air hingga 5 ATM (50 meter)',
      'Tali kulit Italia asli berukuran 20mm dengan sistem quick-release'
    ]),
    specs: JSON.stringify({
      'Diameter Casing': '40 mm',
      'Ketebalan Casing': '8.5 mm',
      'Lebar Tali': '20 mm',
      'Bahan Kaca': 'Sapphire Crystal',
      'Garansi': '1 Tahun Garansi Mesin'
    })
  },
  {
    id: 'prod-3',
    name: 'Siena Premium Full-Grain Leather Tote',
    description: 'Tas jinjing klasik yang mewah dan fungsional, dibuat dari kulit sapi full-grain pilihan yang akan menua dengan indah (patina). Sangat luas, dapat menampung laptop hingga ukuran 15 inci beserta perlengkapan harian Anda.',
    price: 2450000,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.9,
    reviewsCount: 52,
    stock: 5,
    features: JSON.stringify([
      '100% Kulit Sapi Full-Grain Premium',
      'Kompartemen Laptop Empuk Khusus (Hingga 15")',
      'Saku Ritsleting Interior YKK Kuningan',
      'Gantungan Kunci Kulit Terintegrasi',
      'Tali Bahu Kulit Tebal yang Nyaman'
    ]),
    specs: JSON.stringify({
      'Dimensi': '42 x 32 x 14 cm',
      'Bahan': 'Full-Grain Vegetable Tanned Leather',
      'Warna': 'Tan Classic',
      'Berat Kosong': '1.1 kg',
      'Saku Dalam': '1 Ritsleting, 2 Slip-pocket'
    })
  },
  {
    id: 'prod-4',
    name: 'AeroPulse Smart Fitness Watch',
    description: 'Asisten kesehatan pribadi di pergelangan tangan Anda. Dilengkapi dengan sensor detak jantung 24/7, pemantau saturasi oksigen darah (SpO2), pelacak tidur pintar, serta 30+ mode olahraga profesional dengan GPS internal.',
    price: 1599000,
    category: 'Teknologi',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.5,
    reviewsCount: 210,
    stock: 25,
    features: JSON.stringify([
      'Layar Sentuh AMOLED 1.43" Selalu Aktif (Always-On)',
      'Sistem GPS Multi-Satelit Terintegrasi',
      'Daya Tahan Baterai Luar Biasa (Hingga 14 hari)',
      'Waterproof 5 ATM (Aman untuk Berenang)',
      'Pemantauan Stress & Latihan Pernapasan'
    ]),
    specs: JSON.stringify({
      'Layar': '1.43" AMOLED (466x466 px)',
      'Bahan Strap': 'Silikon Medis Anti-Alergi',
      'Konektivitas': 'Bluetooth 5.0, Wi-Fi',
      'Baterai': '420 mAh',
      'Kompatibilitas': 'iOS 11+ & Android 6.0+'
    })
  },
  {
    id: 'prod-5',
    name: 'Lumina Ceramic Artisan Mug',
    description: 'Cangkir keramik buatan tangan seniman lokal yang menawarkan tekstur alami nan artistik. Setiap cangkir dipanggang secara unik sehingga tidak ada dua cangkir yang persis sama. Nyaman digenggam untuk menikmati kopi hangat Anda.',
    price: 249000,
    category: 'Dekorasi',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.6,
    reviewsCount: 45,
    stock: 12,
    features: JSON.stringify([
      '100% Buatan Tangan (Handcrafted)',
      'Bahan Tanah Liat Stoneware Berkualitas Tinggi',
      'Glaze Food-Grade Bebas Timbal dan Kadmium',
      'Aman untuk Microwave dan Pencuci Piring',
      'Kapasitas Nyaman 350ml'
    ]),
    specs: JSON.stringify({
      'Kapasitas': '350 ml',
      'Tinggi': '9.5 cm',
      'Diameter Atas': '8.0 cm',
      'Bahan': 'Stoneware Ceramic',
      'Asal': 'Artisan Kasongan, Yogyakarta'
    })
  },
  {
    id: 'prod-6',
    name: 'Solfeggio Hi-Fi Wooden Bluetooth Speaker',
    description: 'Speaker nirkabel premium berselimut kayu walnut asli yang menghasilkan karakter suara akustik alami hangat dan bass presisi. Mengharmoniskan estetika interior rumah modern Anda dengan kualitas audio tingkat tinggi.',
    price: 1999000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.8,
    reviewsCount: 78,
    stock: 6,
    features: JSON.stringify([
      'Bahan Casing Kayu Walnut Alami Premium',
      'Sistem Speaker Dual 15W dengan Bass Port Pasif',
      'Koneksi Bluetooth 5.0 + Jack AUX 3.5mm',
      'Baterai Lithium Recchargeable 4400mAh (Main 12 jam)',
      'Tombol Kontrol Analog dari Logam Brushed'
    ]),
    specs: JSON.stringify({
      'Output Power': '30W RMS',
      'Bluetooth Range': 'Hingga 15 Meter',
      'Input Daya': 'USB-C (5V/2A)',
      'Dimensi': '24 x 13 x 9.5 cm',
      'Garansi': '1 Tahun Resmi'
    })
  },
  {
    id: 'prod-7',
    name: 'Polaris Classic Tortoise Sunglasses',
    description: 'Kacamata hitam dengan desain bingkai tortoise retro yang tak lekang oleh waktu. Dilengkapi dengan lensa polarized premium berteknologi TAC 9-lapisan yang memberikan perlindungan 100% terhadap sinar UV400 dan mengurangi silau berlebih.',
    price: 649000,
    category: 'Aksesoris',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.4,
    reviewsCount: 39,
    stock: 18,
    features: JSON.stringify([
      'Lensa Polarized TAC Kualitas Tinggi',
      'Perlindungan Maksimal UV400 (UVA & UVB)',
      'Bingkai Polikarbonat Ringan dan Sangat Tangguh',
      'Engsel Logam Ganda Kokoh',
      'Termasuk Kotak Kacamata Kulit dan Kain Pembersih'
    ]),
    specs: JSON.stringify({
      'Lebar Lensa': '52 mm',
      'Jarak Jembatan': '20 mm',
      'Panjang Gagang': '145 mm',
      'Sertifikasi': 'CE / FDA',
      'Warna Bingkai': 'Tortoise Glossy'
    })
  },
  {
    id: 'prod-8',
    name: 'Elysian French Lavender Soy Candle',
    description: 'Lilin aromaterapi mewah yang terbuat dari 100% minyak lilin kedelai murni (soy wax) organik tanpa asap jelaga hitam. Menggunakan minyak esensial lavender murni dari Prancis untuk memberikan ketenangan pikiran setelah hari yang padat.',
    price: 320000,
    category: 'Dekorasi',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80'
    ]),
    rating: 4.7,
    reviewsCount: 63,
    stock: 20,
    features: JSON.stringify([
      '100% Natural Soy Wax (Bebas Parafin)',
      'Minyak Esensial Murni Prancis Organik',
      'Sumbu Kayu Alami yang Mengeluarkan Suara Gemercik Menenangkan',
      'Wadah Stoples Kaca Amber yang Estetik dan Dapat Dipakai Ulang',
      'Waktu Pembakaran Ekstra Lama (Hingga 50 jam)'
    ]),
    specs: JSON.stringify({
      'Berat Bersih': '220 gram / 7.7 oz',
      'Waktu Bakar': '45 - 50 Jam',
      'Sumbu': 'Artisanal Wood Wick',
      'Fragrance Note': 'Lavender, Sweet Vanilla & Chamomile',
      'Bahan Wadah': 'Amber Glass Jar with Matte Cap'
    })
  }
];

export const seedProductsIfEmpty = async (): Promise<void> => {
  try {
    const count = await prisma.product.count();
    if (count === 0) {
      console.log('Database product table is empty. Seeding products...');
      for (const item of SEED_PRODUCTS) {
        await prisma.product.create({
          data: item
        });
      }
      console.log('Seeding products completed successfully!');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sort } = req.query as { category?: string; search?: string; sort?: string };

    let whereClause: any = {};

    if (category && category !== 'Semua') {
      whereClause.category = {
        equals: category
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } }
      ];
    }

    let orderByClause: any = undefined;

    if (sort) {
      if (sort === 'price-asc') {
        orderByClause = { price: 'asc' };
      } else if (sort === 'price-desc') {
        orderByClause = { price: 'desc' };
      } else if (sort === 'rating') {
        orderByClause = { rating: 'desc' };
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause
    });

    // Map serialized fields back to arrays/objects
    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images),
      features: JSON.parse(product.features),
      specs: JSON.parse(product.specs),
    }));

    res.status(200).json(formattedProducts);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Gagal mengambil produk', error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images),
      features: JSON.parse(product.features),
      specs: JSON.parse(product.specs),
    };

    res.status(200).json(formattedProduct);
  } catch (error: any) {
    console.error('Error fetching product detail:', error);
    res.status(500).json({ message: 'Gagal mengambil detail produk', error: error.message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });

    const categories = products.map(p => p.category);
    res.status(200).json(['Semua', ...categories]);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Gagal mengambil kategori', error: error.message });
  }
};
