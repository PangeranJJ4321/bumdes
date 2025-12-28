import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">BUMDes Kalosi</h1>
        <p className="text-xl text-muted-foreground">
          Website Landing Page BUMDes Sumber Kalosi
        </p>
        <p className="text-sm text-muted-foreground">
          Setup berhasil! ✅ Next.js + tRPC + shadcn/ui sudah siap digunakan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test tRPC</CardTitle>
            <CardDescription>
              Verifikasi koneksi tRPC dengan database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/test-trpc">
              <Button className="w-full">Buka Test Page</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📦 Products</CardTitle>
            <CardDescription>
              Kelola katalog produk BUMDes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛒 Cart & Checkout</CardTitle>
            <CardDescription>
              Sistem keranjang dan checkout via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚀 Tech Stack</CardTitle>
          <CardDescription>
            Teknologi yang digunakan dalam project ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div>✅ Next.js 14+ (App Router)</div>
            <div>✅ tRPC (Type-safe APIs)</div>
            <div>✅ Prisma + PostgreSQL</div>
            <div>✅ shadcn/ui + Tailwind CSS</div>
            <div>✅ TypeScript</div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
