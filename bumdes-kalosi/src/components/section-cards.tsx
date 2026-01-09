import { IconTrendingDown, IconTrendingUp, IconShoppingBag, IconNews, IconBuildingStore, IconCurrencyDollar, IconUsers } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Stats {
  pendingOrders: number
  totalProducts: number
  totalNews: number
  completedOrders: number
  totalUsers: number
}

export function SectionCards({ stats }: { stats?: Stats }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pesanan Pending</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.pendingOrders || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconShoppingBag />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Perlu diproses <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Pesanan masuk baru
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Produk & Layanan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalProducts || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBuildingStore />
              Available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Unit Usaha Terdaftar <IconBuildingStore className="size-4" />
          </div>
          <div className="text-muted-foreground">
            BUMDes Kalosi
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Berita</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalNews || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconNews />
              Published
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Informasi Desa <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Artikel & Pengumuman</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pesanan Selesai</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.completedOrders || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconShoppingBag />
              Done
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total Transaksi Sukses <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Order Completed</div>
        </CardFooter>
      </Card>
    </div>
  )
}
