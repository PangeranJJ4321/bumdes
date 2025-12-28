'use client'

import { trpc } from '@/lib/trpc/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function TestTRPC() {
  const { data: products, isLoading: productsLoading } = trpc.product.getAll.useQuery()
  const { data: orders, isLoading: ordersLoading } = trpc.order.getAll.useQuery()
  const { data: reviews, isLoading: reviewsLoading } = trpc.review.getAll.useQuery()

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">🧪 Test tRPC Connection</h1>
        <p className="text-muted-foreground">
          Halaman ini untuk memverifikasi bahwa tRPC sudah terhubung dengan baik.
        </p>
      </div>

      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Data produk dari database</CardDescription>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Total: {products?.length ?? 0} produk
              </p>
              {products && products.length > 0 ? (
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(products.slice(0, 3), null, 2)}
                  {products.length > 3 && `\n... dan ${products.length - 3} produk lainnya`}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada produk. Silakan tambahkan produk melalui admin dashboard.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Data pesanan dari database</CardDescription>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Total: {orders?.length ?? 0} pesanan
              </p>
              {orders && orders.length > 0 ? (
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(orders.slice(0, 2), null, 2)}
                  {orders.length > 2 && `\n... dan ${orders.length - 2} pesanan lainnya`}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada pesanan.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>Data ulasan dari database</CardDescription>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Total: {reviews?.length ?? 0} ulasan
              </p>
              {reviews && reviews.length > 0 ? (
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(reviews.slice(0, 2), null, 2)}
                  {reviews.length > 2 && `\n... dan ${reviews.length - 2} ulasan lainnya`}
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada ulasan.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              {!productsLoading && !ordersLoading && !reviewsLoading
                ? '✅ tRPC terhubung dengan baik!'
                : '🔄 Memuat data...'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Jika semua data berhasil dimuat tanpa error, berarti setup tRPC sudah benar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

