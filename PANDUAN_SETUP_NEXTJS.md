# Panduan Setup Next.js dengan tRPC & shadcn/ui untuk BUMDes Landing Page

**Project:** Website Landing Page BUMDes Kalosi  
**Tech Stack:** Next.js 14+ (App Router), tRPC, shadcn/ui, PostgreSQL, Tailwind CSS

---

## 📋 Prasyarat

Pastikan sudah terinstall:
- **Node.js** (v18.17 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** atau **pnpm** (disarankan pnpm untuk performa lebih baik)
- **PostgreSQL** (v14+) - [Download](https://www.postgresql.org/download/) atau gunakan Docker
- **Git** - [Download](https://git-scm.com/)

Verifikasi instalasi:
```bash
node --version    # Harus >= v18.17
npm --version     # atau pnpm --version
psql --version    # Harus >= v14
git --version
```

---

## 🚀 Step 1: Initialize Next.js Project

### 1.1 Buat Project Baru

```bash
# Menggunakan pnpm (disarankan)
pnpm create next-app@latest bumdes-kalosi

# Atau menggunakan npm
npx create-next-app@latest bumdes-kalosi
```

**Pilihan saat setup:**
- ✅ **TypeScript**: Yes
- ✅ **ESLint**: Yes
- ✅ **Tailwind CSS**: Yes
- ✅ **App Router**: Yes (default di Next.js 14+)
- ✅ **src/ directory**: Yes (untuk struktur lebih rapi)
- ✅ **Import alias**: Yes (menggunakan `@/`)
- ❌ **Turbopack**: Optional (bisa diaktifkan nanti)

### 1.2 Masuk ke Folder Project

```bash
cd bumdes-kalosi
```

### 1.3 Verifikasi Project Berhasil

```bash
pnpm dev
# atau npm run dev
```

Buka `http://localhost:3000` di browser. Jika muncul halaman Next.js default, setup berhasil!

---

## 📦 Step 2: Install Dependencies Utama

### 2.1 Dependencies untuk tRPC

```bash
# Core tRPC packages
pnpm add @trpc/server @trpc/client @trpc/react-query @trpc/next
pnpm add @tanstack/react-query
pnpm add superjson        # Untuk serialization data yang lebih baik

# Type helpers
pnpm add zod              # Untuk validation & type inference
```

### 2.2 Dependencies untuk Database & ORM

```bash
# Prisma sebagai ORM (pilihan umum untuk tRPC)
pnpm add @prisma/client
pnpm add -D prisma

# Atau bisa juga menggunakan Drizzle ORM (lebih ringan)
# pnpm add drizzle-orm drizzle-kit
# pnpm add postgres
```

### 2.3 Dependencies untuk Authentication & Utilities

```bash
# Environment variables
pnpm add dotenv

# UUID untuk ID
pnpm add uuid
pnpm add -D @types/uuid

# Date handling (opsional)
pnpm add date-fns
```

### 2.4 Dependencies untuk Cart & State Management

```bash
# Cart management (sesuai PRD)
pnpm add react-use-cart
pnpm add zustand              # Alternatif untuk state management (lebih modern)
```

---

## 🎨 Step 3: Setup shadcn/ui

### 3.1 Initialize shadcn/ui

```bash
npx shadcn-ui@latest init
```

**Pilihan saat init:**
- **Style**: Default (atau pilih New York jika lebih suka)
- **Base color**: Slate (atau sesuai preferensi)
- **CSS variables**: Yes
- **Where are your component files?**: `src/components/ui`
- **Are you using TypeScript?**: Yes

### 3.2 Install Komponen yang Diperlukan (Install On-Demand)

```bash
# Komponen dasar yang akan sering dipakai
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form        # Untuk form handling
npx shadcn-ui@latest add toast       # Untuk notifikasi
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton    # Untuk loading states
```

**Catatan:** shadcn/ui menggunakan pendekatan copy-paste, jadi semua komponen akan ada di folder `src/components/ui` dan bisa langsung dimodifikasi sesuai kebutuhan.

---

## 🗄️ Step 4: Setup PostgreSQL & Prisma

### 4.1 Setup Prisma

```bash
# Initialize Prisma
npx prisma init
```

Perintah ini akan membuat:
- Folder `prisma/` dengan `schema.prisma`
- File `.env` (jika belum ada)

### 4.2 Konfigurasi Database Connection

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bumdes_kalosi?schema=public"

# Next Auth (untuk admin login nanti - opsional)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials (sementara untuk development)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

**Untuk PostgreSQL lokal:**
1. Buat database baru:
```bash
createdb bumdes_kalosi
# atau via psql:
psql -U postgres
CREATE DATABASE bumdes_kalosi;
\q
```

2. Update `DATABASE_URL` di `.env` dengan credentials yang benar.

### 4.3 Define Prisma Schema

Edit `prisma/schema.prisma` sesuai dengan ERD di PRD:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(uuid())
  name        String
  price       Int
  promoPrice  Int?     @map("promo_price")
  isPromo     Boolean  @default(false) @map("is_promo")
  description String?
  category    String   // "kuliner", "wisata", "mart", "ketapang"
  imageUrl    String?  @map("image_url")
  stock       Int?     @default(null)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  reviews Review[]
  orderItems OrderItem[]

  @@map("products")
}

model Order {
  id            String   @id @default(uuid())
  customerName  String   @map("customer_name")
  customerAddress String @map("customer_address")
  customerPhone String?  @map("customer_phone")
  items         Json     // Snapshot items yang dibeli
  totalPrice    Int      @map("total_price")
  status        String   @default("pending") // "pending", "completed", "cancelled"
  notes         String?
  whatsappUrl   String?  @map("whatsapp_url")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  itemsDetail OrderItem[]

  @@map("orders")
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String   @map("order_id")
  productId String   @map("product_id")
  quantity  Int
  price     Int      // Harga saat checkout (snapshot)
  
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Review {
  id        String   @id @default(uuid())
  productId String   @map("product_id")
  rating    Int      // 1-5
  comment   String?
  authorName String  @map("author_name") @default("Anonymous")
  status    String   @default("pending") // "pending", "approved", "rejected"
  createdAt DateTime @default(now()) @map("created_at")

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("reviews")
}

model Admin {
  id       String   @id @default(uuid())
  username String   @unique
  password String   // Hashed password
  createdAt DateTime @default(now()) @map("created_at")

  @@map("admins")
}
```

### 4.4 Generate Prisma Client & Migrate Database

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# (Optional) Buka Prisma Studio untuk melihat database secara visual
npx prisma studio
```

---

## 🔧 Step 5: Setup tRPC

### 5.1 Struktur Folder tRPC

Buat struktur folder berikut:

```
src/
├── app/
├── components/
├── server/
│   ├── api/
│   │   └── routers/
│   │       ├── _app.ts          # Root router
│   │       ├── product.ts       # Product router
│   │       ├── order.ts         # Order router
│   │       └── review.ts        # Review router
│   ├── db.ts                    # Prisma client instance
│   └── trpc.ts                  # tRPC initialization
├── lib/
│   └── trpc/
│       ├── client.ts            # tRPC client untuk client components
│       ├── server.ts            # tRPC server utilities
│       └── react.tsx            # tRPC React provider
└── ...
```

### 5.2 Setup Prisma Client Instance

Buat file `src/server/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 5.3 Setup tRPC Context & Initialization

Buat file `src/server/trpc.ts`:

```typescript
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { prisma } from './db'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    prisma,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
```

### 5.4 Buat Product Router (Contoh)

Buat file `src/server/api/routers/product.ts`:

```typescript
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../../trpc'

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          reviews: {
            where: { status: 'approved' },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findMany({
        where: { category: input.category },
        orderBy: { createdAt: 'desc' },
      })
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().int().positive(),
        promoPrice: z.number().int().positive().optional(),
        isPromo: z.boolean().default(false),
        description: z.string().optional(),
        category: z.string(),
        imageUrl: z.string().url().optional(),
        stock: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: input,
      })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        price: z.number().int().positive().optional(),
        promoPrice: z.number().int().positive().optional(),
        isPromo: z.boolean().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().url().optional(),
        stock: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.product.update({
        where: { id },
        data,
      })
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.delete({
        where: { id: input.id },
      })
    }),
})
```

### 5.5 Buat Root Router

Buat file `src/server/api/routers/_app.ts`:

```typescript
import { createTRPCRouter } from '../../trpc'
import { productRouter } from './product'
// Import router lain nanti (order, review, etc.)

export const appRouter = createTRPCRouter({
  product: productRouter,
  // Tambahkan router lain di sini
})

export type AppRouter = typeof appRouter
```

### 5.6 Setup tRPC API Route Handler

Buat file `src/app/api/trpc/[trpc]/route.ts`:

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/api/routers/_app'
import { createTRPCContext } from '@/server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            )
          }
        : undefined,
  })

export { handler as GET, handler as POST }
```

### 5.7 Setup tRPC Client untuk Client Components

Buat file `src/lib/trpc/client.ts`:

```typescript
import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@/server/api/routers/_app'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
})
```

Buat file `src/lib/trpc/react.tsx`:

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { trpc, trpcClient } from './client'

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000, // 5 seconds
      },
    },
  }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  )
}
```

### 5.8 Setup tRPC untuk Server Components (Opsional - Next.js 14+)

Buat file `src/lib/trpc/server.ts`:

```typescript
import { cache } from 'react'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@/server/api/routers/_app'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // Browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const api = cache(() =>
  createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  })
)
```

### 5.9 Wrap App dengan tRPC Provider

Edit `src/app/layout.tsx`:

```typescript
import { TRPCReactProvider } from '@/lib/trpc/react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BUMDes Kalosi - Landing Page',
  description: 'Website resmi BUMDes Sumber Kalosi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  )
}
```

---

## 📁 Step 6: Struktur Folder Final

Setelah semua setup, struktur folder Anda akan seperti ini:

```
bumdes-kalosi/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── images/          # Gambar produk
│   └── ...
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       └── [trpc]/
│   │   │           └── route.ts
│   │   ├── admin/       # Admin dashboard (nanti)
│   │   ├── layout.tsx
│   │   ├── page.tsx     # Home page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/          # shadcn components
│   │   ├── cart/        # Cart components
│   │   ├── product/     # Product components
│   │   └── layout/      # Layout components
│   ├── lib/
│   │   ├── trpc/
│   │   │   ├── client.ts
│   │   │   ├── react.tsx
│   │   │   └── server.ts
│   │   └── utils.ts
│   ├── server/
│   │   ├── api/
│   │   │   └── routers/
│   │   │       ├── _app.ts
│   │   │       ├── product.ts
│   │   │       ├── order.ts
│   │   │       └── review.ts
│   │   ├── db.ts
│   │   └── trpc.ts
│   └── types/           # TypeScript types
├── .env
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## ✅ Step 7: Verifikasi Setup

### 7.1 Test tRPC Connection

Buat file test `src/app/test-tRPC/page.tsx`:

```typescript
'use client'

import { trpc } from '@/lib/trpc/client'

export default function TestTRPC() {
  const { data, isLoading } = trpc.product.getAll.useQuery()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test tRPC - Products</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

Akses `http://localhost:3000/test-tRPC`. Jika muncul data (kosong jika belum ada produk), berarti tRPC sudah bekerja!

### 7.2 Test shadcn/ui Component

Edit `src/app/page.tsx`:

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>BUMDes Kalosi</CardTitle>
          <CardDescription>Test shadcn/ui Components</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Click Me</Button>
        </CardContent>
      </Card>
    </main>
  )
}
```

Jika button dan card muncul dengan styling yang benar, shadcn/ui sudah siap!

---

## 🔐 Step 8: Setup Environment Variables (Final)

Pastikan file `.env` sudah lengkap:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bumdes_kalosi?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# WhatsApp (untuk checkout nanti)
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"

# Optional: NextAuth (jika pakai untuk admin login)
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**⚠️ Jangan commit file `.env` ke Git!** Pastikan `.env` ada di `.gitignore`.

Buat file `.env.example` sebagai template:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bumdes_kalosi?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
```

---

## 📝 Step 9: Scripts yang Berguna

Tambahkan script berikut di `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🎯 Next Steps

Setelah setup selesai, langkah selanjutnya:

1. **Buat Router tRPC untuk Order & Review** (mengikuti pattern `product.ts`)
2. **Implementasi Cart dengan `react-use-cart`**
3. **Buat Home Page dengan Hero Section**
4. **Buat Product Catalog Page**
5. **Implementasi WhatsApp Checkout Logic**
6. **Buat Admin Dashboard** (CRUD Products, View Orders)
7. **Implementasi Review System**

---

## 🐛 Troubleshooting

### Error: Prisma Client not generated
```bash
npx prisma generate
```

### Error: Database connection failed
- Pastikan PostgreSQL sudah running
- Check `DATABASE_URL` di `.env` sudah benar
- Test koneksi: `psql postgresql://username:password@localhost:5432/bumdes_kalosi`

### Error: Module not found (shadcn/ui)
```bash
# Reinstall component
npx shadcn-ui@latest add [component-name]
```

### Error: tRPC client error
- Pastikan sudah wrap app dengan `TRPCReactProvider`
- Check apakah route `/api/trpc` sudah dibuat
- Pastikan semua dependencies sudah terinstall

---

## 📚 Referensi

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

---

**Selamat coding! 🚀**

