# LUXORA — E-Commerce Website

Aplikasi E-Commerce full-stack yang dibuat sebagai pengerjaan **Coding Test Web Developer**. LUXORA adalah platform belanja online untuk produk gaya hidup premium (audio, aksesoris, fashion, teknologi, dan dekorasi), lengkap dengan autentikasi pengguna, katalog produk, keranjang belanja, dan proses checkout yang terhubung langsung ke database.

🔗 **Live Demo:** _(isi link deployment di sini setelah deploy)_
🔗 **Repository:** _(isi link GitHub repo di sini)_

---

## ✨ Fitur

- **Autentikasi** — Register & Login dengan password yang di-hash (bcrypt) dan sesi berbasis JWT
- **Katalog Produk** — Daftar produk dengan filter kategori, pencarian, dan sorting
- **Detail Produk** — Halaman detail lengkap dengan galeri gambar, spesifikasi, dan fitur produk
- **Keranjang Belanja** — Tambah, ubah jumlah, dan hapus item; tersimpan permanen di database per akun pengguna
- **Checkout** — Proses pemesanan yang aman menggunakan database transaction (mengurangi stok, membuat order, mengosongkan cart secara atomik)
- **Riwayat Pesanan** — Pengguna dapat melihat riwayat transaksi yang pernah dilakukan

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Autentikasi | JSON Web Token (JWT) + bcrypt |
| Database | MySQL |
| ORM | Prisma |

---

## 📁 Struktur Folder

```
.
├── prisma/
│   ├── schema.prisma          # Schema aktif yang digunakan aplikasi
│   └── schema.mysql.prisma    # Schema untuk provider MySQL
├── server/
│   ├── controllers/           # Logika bisnis (auth, product, cart, order)
│   ├── routes/                # Definisi endpoint API
│   ├── middleware/             # Middleware autentikasi JWT
│   ├── db/                    # Prisma Client instance
│   └── server.ts              # Entry point server Express
├── src/
│   ├── components/             # Komponen UI reusable (Navbar, ProductCard, dll)
│   ├── pages/                  # Halaman aplikasi (Login, ProductList, Cart, Checkout, dll)
│   ├── services/
│   │   └── api.ts             # Kumpulan fungsi pemanggilan API ke backend
│   ├── types.ts                # TypeScript interfaces
│   └── App.tsx                 # Root component & routing antar halaman
├── .env.example                # Contoh format environment variable
└── package.json
```

---

## 🚀 Cara Menjalankan Aplikasi (Local Setup)

### Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru
- MySQL Server (bisa lewat [XAMPP](https://www.apachefriends.org/), [Laragon](https://laragon.org/), atau instalasi MySQL biasa)

### Langkah-langkah

**1. Clone repository**
```bash
git clone <url-repo-anda>
cd luxora-ecommerce
```

**2. Install dependencies**
```bash
npm install
```

**3. Siapkan database MySQL**

Nyalakan MySQL Server, lalu buat database baru (misal lewat phpMyAdmin):
```sql
CREATE DATABASE luxora_db;
```

**4. Konfigurasi environment variable**

Copy `.env.example` menjadi `.env`, lalu isi sesuai kredensial MySQL Anda:
```env
DATABASE_URL="mysql://root:password@localhost:3306/luxora_db"
JWT_SECRET="ganti_dengan_string_acak_yang_panjang_dan_aman"
```

**5. Migrasi schema ke database**
```bash
npx prisma generate
npx prisma db push
```

**6. (Opsional) Seed data contoh produk**
```bash
npx prisma db seed
```

**7. Jalankan aplikasi**
```bash
npm run dev
```

**8. Buka di browser**

```
http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Deskripsi | Contoh |
|---|---|---|
| `DATABASE_URL` | Connection string ke database MySQL | `mysql://user:pass@host:3306/dbname` |
| `JWT_SECRET` | Secret key untuk signing/verifikasi token JWT | string acak yang panjang |

> ⚠️ File `.env` berisi kredensial sensitif dan **tidak boleh ikut di-commit ke GitHub**. Pastikan `.env` sudah masuk ke dalam `.gitignore`. Gunakan `.env.example` sebagai referensi format tanpa nilai asli.

---

## 📡 Ringkasan API Endpoint

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi akun baru |
| POST | `/api/auth/login` | Login dan mendapatkan JWT token |
| GET | `/api/products` | Mengambil daftar produk (dengan filter) |
| GET | `/api/products/:id` | Mengambil detail satu produk |
| GET | `/api/cart` | Mengambil isi keranjang milik user yang login |
| POST | `/api/cart` | Menambahkan produk ke keranjang |
| PUT | `/api/cart/:productId` | Mengubah jumlah item di keranjang |
| DELETE | `/api/cart/:productId` | Menghapus item dari keranjang |
| POST | `/api/orders/checkout` | Memproses checkout dan membuat pesanan baru |
| GET | `/api/orders` | Mengambil riwayat pesanan milik user |

Seluruh endpoint di atas (kecuali register/login) memerlukan header autentikasi:
```
Authorization: Bearer <jwt_token>
```

---

## 👤 Author

Dibuat oleh **Raden Aradeya Risqi Jagat Pertala** sebagai bagian dari Coding Test Web Developer — Bilcode Technology.
