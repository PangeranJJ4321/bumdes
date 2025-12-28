# ✅ Setup Checklist - Next.js dengan tRPC & shadcn/ui

Gunakan checklist ini untuk memastikan semua langkah setup sudah dikerjakan.

## 📋 Prasyarat
- [X] Node.js v18.17+ terinstall
- [X] npm/pnpm terinstall
- [X] PostgreSQL v14+ terinstall dan running
- [X] Git terinstall

## 🚀 Setup Project
- [ ] Next.js project berhasil dibuat (`create-next-app`)
- [ ] Project bisa running (`pnpm dev` → localhost:3000 terbuka)
- [ ] TypeScript configuration OK
- [ ] Tailwind CSS sudah aktif

## 📦 Dependencies
- [ ] tRPC packages terinstall
  - [ ] `@trpc/server`
  - [ ] `@trpc/client`
  - [ ] `@trpc/react-query`
  - [ ] `@trpc/next`
  - [ ] `@tanstack/react-query`
  - [ ] `superjson`
  - [ ] `zod`
- [ ] Database packages terinstall
  - [ ] `@prisma/client`
  - [ ] `prisma` (dev dependency)
- [ ] Utility packages terinstall
  - [ ] `dotenv`
  - [ ] `uuid` + `@types/uuid`
  - [ ] `react-use-cart` (untuk cart)
- [ ] shadcn/ui initialized

## 🎨 shadcn/ui Components
- [ ] Button
- [ ] Card
- [ ] Input
- [ ] Label
- [ ] Dialog
- [ ] Dropdown-menu
- [ ] Select
- [ ] Textarea
- [ ] Badge
- [ ] Table
- [ ] Form
- [ ] Toast
- [ ] Avatar
- [ ] Separator
- [ ] Skeleton

## 🗄️ Database & Prisma
- [ ] Prisma initialized (`prisma init`)
- [ ] Database `bumdes_kalosi` sudah dibuat
- [ ] File `.env` sudah dikonfigurasi dengan `DATABASE_URL` yang benar
- [ ] Prisma schema sudah didefinisikan (products, orders, reviews, admin)
- [ ] Prisma Client generated (`prisma generate`)
- [ ] Migration berhasil (`prisma migrate dev`)
- [ ] Bisa akses Prisma Studio (`prisma studio`)

## 🔧 tRPC Setup
- [ ] Folder structure tRPC sudah dibuat
  - [ ] `src/server/db.ts`
  - [ ] `src/server/trpc.ts`
  - [ ] `src/server/api/routers/_app.ts`
  - [ ] `src/server/api/routers/product.ts`
  - [ ] `src/lib/trpc/client.ts`
  - [ ] `src/lib/trpc/react.tsx`
  - [ ] `src/lib/trpc/server.ts` (optional)
- [ ] API route handler dibuat (`src/app/api/trpc/[trpc]/route.ts`)
- [ ] App sudah di-wrap dengan `TRPCReactProvider`
- [ ] Test tRPC connection berhasil

## ✅ Verifikasi
- [ ] Test page tRPC bisa akses data
- [ ] shadcn/ui components muncul dengan styling yang benar
- [ ] Tidak ada error di console browser
- [ ] Tidak ada error di terminal

## 🔐 Environment Variables
- [ ] File `.env` sudah dikonfigurasi
- [ ] File `.env.example` sudah dibuat
- [ ] `.env` sudah ditambahkan ke `.gitignore`

## 📁 Struktur Folder
- [ ] Folder structure sesuai panduan
- [ ] Semua file penting sudah ada di tempatnya

## 🎯 Siap untuk Development
- [ ] Semua checklist di atas sudah dicentang ✅
- [ ] Ready untuk implementasi fitur!

---

**Catatan:** Jika ada checklist yang belum dicentang, kembali ke file `PANDUAN_SETUP_NEXTJS.md` untuk langkah detailnya.

