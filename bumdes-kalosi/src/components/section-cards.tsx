"use client"

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
import { useSession } from "next-auth/react"

interface Stats {
  pendingOrders: number
  totalProducts: number
  totalNews: number
  completedOrders: number
  totalUsers: number
  totalRevenue?: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

export function SectionCards({ stats }: { stats?: Stats }) {
  const { data: session } = useSession()
  const user = session?.user
  const isGenericStaff = user?.role === 'STAFF'

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Revenue Card - First for Staff (and Admin) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{isGenericStaff ? "Pendapatan Unit" : "Total Pendapatan"}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {formatCurrency(stats?.totalRevenue || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar />
              Revenue
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Akumulasi nilai transaksi <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {isGenericStaff
              ? (user.unit ? `Unit: ${user.unit}` : "Pendapatan Unit Anda")
              : "Seluruh Unit BUMDes"
            }
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pesanan Pending</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
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
            {isGenericStaff
              ? (user.unit ? `Unit: ${user.unit}` : "Pesanan Unit Anda")
              : "Pesanan masuk baru"
            }
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Produk & Layanan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
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
            {isGenericStaff
              ? (user.unit ? `Unit: ${user.unit}` : "Produk Unit Anda")
              : "BUMDes Sumber Kalosi"
            }
          </div>
        </CardFooter>
      </Card>

      {isSuperAdmin && (
        <>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Berita</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
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
              <CardDescription>Total Pengguna</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
                {stats?.totalUsers || 0}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconUsers />
                  Users
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Pengguna Terdaftar <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">Akun Warga</div>
            </CardFooter>
          </Card>
        </>
      )}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pesanan Selesai</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
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
          <div className="text-muted-foreground">
            {isGenericStaff
              ? (user.unit ? `Unit: ${user.unit}` : "Transaksi Unit Anda")
              : "Order Completed"
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
