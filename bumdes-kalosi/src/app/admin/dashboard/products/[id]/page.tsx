import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { IconEdit, IconArrowLeft } from "@tabler/icons-react"
import data from "../data.json"

export function generateStaticParams() {
    return data.map((product) => ({
        id: product.id,
    }))
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}

export default function Page({ params }: { params: { id: string } }) {
    const product = data.find((item) => item.id === params.id)

    if (!product) {
        return <div>Produk tidak ditemukan</div>
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-4 pt-0">
                    <div className="flex items-center space-x-2 py-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard/products">Produk</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{product.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="max-w-4xl space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{product.category}</Badge>
                                    <Badge variant={product.status === "Tersedia" ? "default" : "secondary"}>
                                        {product.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/dashboard/products">
                                        <IconArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link href={`/admin/dashboard/products/${product.id}/edit`}>
                                        <IconEdit className="mr-2 h-4 w-4" /> Edit Produk
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border rounded-lg bg-card text-card-foreground">
                                        <div className="text-sm font-medium text-muted-foreground">Harga</div>
                                        <div className="text-2xl font-bold">{formatCurrency(product.price)}</div>
                                    </div>
                                    <div className="p-4 border rounded-lg bg-card text-card-foreground">
                                        <div className="text-sm font-medium text-muted-foreground">Stok</div>
                                        <div className="text-2xl font-bold">{product.stock} Unit</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {/* Mock description since it's not in the data yet */}
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
