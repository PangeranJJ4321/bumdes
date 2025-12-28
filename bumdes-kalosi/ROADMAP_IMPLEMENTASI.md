# 🗺️ Roadmap Implementasi BUMDes Landing Page

Berdasarkan PRD di `proker1.md`, berikut adalah roadmap step-by-step untuk implementasi fitur.

---

## ✅ Status Setup (Selesai)

- [x] Next.js project dengan App Router
- [x] tRPC setup (server & client)
- [x] Prisma + PostgreSQL dengan adapter
- [x] shadcn/ui components
- [x] Database schema dengan enum
- [x] tRPC routers (product, order, review)

---

## 🚀 Fase 1: Home Page & Product Catalog (Priority: High)

### 1.1 Home Page dengan Hero Section
**File yang perlu dibuat/dimodifikasi:**
- `src/app/page.tsx` (sudah ada, perlu di-update)
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/home/HeroSection.tsx`

**Fitur:**
- Hero section dengan video/slider Wisata Malam
- Navigation bar (Home, Produk, Wisata, About)
- Section "Kategori Produk" dengan preview
- Footer dengan kontak & informasi

### 1.2 Product Catalog Page
**File:**
- `src/app/products/page.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/product/ProductGrid.tsx`
- `src/components/product/CategoryFilter.tsx`

**Fitur:**
- Grid layout responsif
- Filter by category (Kuliner, Wisata, Mart, Ketapang)
- Product card dengan gambar, nama, harga, promo badge
- Loading states & error handling

### 1.3 Product Detail Page
**File:**
- `src/app/products/[id]/page.tsx`
- `src/components/product/ProductDetail.tsx`
- `src/components/product/ProductReviews.tsx`

**Fitur:**
- Detail produk lengkap
- Gallery gambar
- Varian (jika ada, misal: Pedas/Tidak Pedas)
- Tombol "Tambah ke Keranjang"
- Review section

**Tugas:**
- [ ] Update router product.ts untuk menggunakan enum ProductCategory
- [ ] Buat komponen ProductCard
- [ ] Buat halaman products listing
- [ ] Buat halaman product detail

---

## 🛒 Fase 2: Shopping Cart & Checkout (Priority: High)

### 2.1 Cart System dengan react-use-cart
**File:**
- `src/components/cart/CartProvider.tsx` (wrapper untuk react-use-cart)
- `src/components/cart/CartButton.tsx` (icon di header)
- `src/components/cart/CartSidebar.tsx` (drawer/sidebar cart)
- `src/components/cart/CartItem.tsx`

**Fitur:**
- Add to cart dari product detail
- Cart sidebar yang bisa dibuka/tutup
- Update quantity, remove item
- Total harga real-time
- Persist cart di LocalStorage

### 2.2 Checkout Form & WhatsApp Integration
**File:**
- `src/app/checkout/page.tsx`
- `src/components/checkout/CheckoutForm.tsx`
- `src/components/checkout/OrderSummary.tsx`

**Fitur:**
- Form: Nama, Alamat/Dusun (Dropdown), No. HP, Catatan
- Order summary dengan items
- Logic: Save Order ke DB → Generate WA Link → Redirect

**Logika:**
```typescript
// Pseudocode
1. User klik "Checkout"
2. Validate form
3. Save order ke database (status: PENDING) via tRPC
4. Generate WhatsApp URL dengan format:
   https://wa.me/6281234567890?text=[Order Details]
5. Redirect user ke WhatsApp
```

**Tugas:**
- [ ] Setup react-use-cart provider
- [ ] Buat cart sidebar component
- [ ] Buat checkout form page
- [ ] Implementasi save order logic
- [ ] Generate WhatsApp URL function
- [ ] Update order router untuk handle create order

---

## 👨‍💼 Fase 3: Admin Dashboard (Priority: Medium)

### 3.1 Admin Authentication
**File:**
- `src/app/admin/login/page.tsx`
- `src/lib/auth/admin.ts` (simple password check)

**Fitur:**
- Simple password-based login (untuk MVP)
- Session dengan cookie/localStorage
- Protect admin routes

### 3.2 Admin Dashboard Home
**File:**
- `src/app/admin/page.tsx`
- `src/components/admin/DashboardStats.tsx`

**Fitur:**
- Overview stats (Total Orders, Pending Orders, Products, etc.)
- Recent orders list
- Quick actions

### 3.3 Product Management (CRUD)
**File:**
- `src/app/admin/products/page.tsx` (list)
- `src/app/admin/products/new/page.tsx` (create)
- `src/app/admin/products/[id]/edit/page.tsx` (edit)
- `src/components/admin/products/ProductForm.tsx`
- `src/components/admin/products/ProductTable.tsx`

**Fitur:**
- List products dengan table (shadcn Table)
- Create product (form dengan upload gambar)
- Edit product
- Delete product (dengan konfirmasi)
- Upload gambar (gunakan service seperti Cloudinary/Uploadthing, atau simpan di public/images)

### 3.4 Order Management
**File:**
- `src/app/admin/orders/page.tsx`
- `src/components/admin/orders/OrderTable.tsx`
- `src/components/admin/orders/OrderDetail.tsx`

**Fitur:**
- List semua orders dengan filter by status
- Update order status (Pending → Completed/Cancelled)
- View order detail
- Export order (opsional)

### 3.5 Review Moderation
**File:**
- `src/app/admin/reviews/page.tsx`
- `src/components/admin/reviews/ReviewTable.tsx`

**Fitur:**
- List reviews dengan status PENDING
- Approve/Reject review
- View approved reviews per product

**Tugas:**
- [ ] Buat admin login page
- [ ] Setup auth protection untuk admin routes
- [ ] Buat admin dashboard layout
- [ ] Implementasi CRUD products
- [ ] Implementasi order management
- [ ] Implementasi review moderation
- [ ] Update routers untuk admin-only procedures

---

## ⭐ Fase 4: Review System (Priority: Low)

### 4.1 Guest Review Form
**File:**
- `src/components/product/ReviewForm.tsx`
- Update: `src/components/product/ProductReviews.tsx`

**Fitur:**
- Form: Rating (1-5 stars), Comment, Author Name
- Submit review (status: PENDING)
- Display approved reviews only
- Average rating calculation

**Tugas:**
- [ ] Buat review form component
- [ ] Update product detail untuk show reviews
- [ ] Update review router untuk handle create

---

## 🎨 Fase 5: Polish & Enhancement (Priority: Low)

### 5.1 UI/UX Improvements
- Loading skeletons
- Error boundaries
- Toast notifications (sudah ada Sonner)
- Responsive design untuk mobile
- Image optimization

### 5.2 Additional Features
- Search produk
- Sort produk (harga, nama, terbaru)
- Pagination untuk product list
- Image gallery untuk produk
- WhatsApp link preview

---

## 📋 Checklist Implementasi (Urutan Prioritas)

### Week 1: Core Features
- [ ] **Day 1-2**: Update routers untuk enum & buat Product Catalog page
- [ ] **Day 3-4**: Implementasi Cart dengan react-use-cart
- [ ] **Day 5-7**: Checkout form & WhatsApp integration

### Week 2: Admin Dashboard
- [ ] **Day 1-2**: Admin login & dashboard layout
- [ ] **Day 3-5**: Product CRUD
- [ ] **Day 6-7**: Order management

### Week 3: Reviews & Polish
- [ ] **Day 1-3**: Review system
- [ ] **Day 4-7**: UI/UX improvements & testing

### Week 4: Deployment & Data Input
- [ ] **Day 1-3**: Deploy ke VPS
- [ ] **Day 4-7**: Input data real (produk, gambar, dll)

---

## 🛠️ Tips & Best Practices

1. **Start Small**: Mulai dari fitur yang paling penting (Catalog → Cart → Checkout)
2. **Component Reusability**: Buat komponen yang bisa dipakai ulang
3. **Type Safety**: Manfaatkan TypeScript & tRPC untuk type safety
4. **Error Handling**: Selalu handle error dengan baik (try-catch, error boundaries)
5. **Loading States**: Jangan lupa loading states untuk UX yang baik
6. **Mobile First**: Design untuk mobile dulu, kemudian desktop

---

## 📝 Notes

- Untuk image upload, bisa gunakan:
  - **Cloudinary** (gratis tier tersedia)
  - **Uploadthing** (gratis untuk development)
  - **Public folder** (simpan di `public/images/products/`)

- Untuk WhatsApp integration, format URL:
  ```
  https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20memesan:%0A[Order%20Details]
  ```

- Admin authentication bisa diperbaiki nanti dengan:
  - NextAuth.js
  - JWT tokens
  - Session management

---

**Selamat coding! 🚀**

Mulai dari Fase 1, step by step sesuai checklist. Jika ada pertanyaan atau butuh bantuan, jangan ragu untuk tanya!

