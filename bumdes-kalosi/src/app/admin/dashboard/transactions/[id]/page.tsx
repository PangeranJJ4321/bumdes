import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconArrowLeft, IconPrinter } from "@tabler/icons-react"
import Link from "next/link"
import data from "../data.json"
import { format } from "date-fns"

export function generateStaticParams() {
    return data.map((transaction) => ({
        id: transaction.id,
    }))
}

export default function Page({ params }: { params: { id: string } }) {
    const transaction = data.find((item) => item.id === params.id)

    if (!transaction) {
        return <div>Transaksi tidak ditemukan</div>
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value)
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-4 pt-0">
                    <div className="flex flex-col gap-4 py-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard/transactions">Transaksi</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{transaction.id}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="max-w-3xl mx-auto w-full space-y-6">
                            <div className="flex items-center justify-between">
                                <Button variant="outline" asChild>
                                    <Link href="/admin/dashboard/transactions">
                                        <IconArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                    </Link>
                                </Button>
                                <Button variant="default">
                                    <IconPrinter className="mr-2 h-4 w-4" /> Cetak Invoice
                                </Button>
                            </div>

                            <div className="border rounded-lg bg-card p-8 shadow-sm">
                                <div className="flex justify-between items-start border-b pb-6 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight mb-1">Invoice</h2>
                                        <p className="text-muted-foreground font-mono">{transaction.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-lg">BUMDes Sumber Kalosi</p>
                                        <p className="text-sm text-muted-foreground">Jl. Poros Kalosi No. 123</p>
                                        <p className="text-sm text-muted-foreground">Sidenreng Rappang, Sulawesi Selatan</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">DITAGIHKAN KEPADA</h3>
                                        <p className="font-medium text-lg">{transaction.customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{transaction.customer.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="mb-2">
                                            <h3 className="font-semibold text-sm text-muted-foreground">TANGGAL</h3>
                                            <p>{format(new Date(transaction.date), "dd MMMM yyyy")}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm text-muted-foreground">STATUS</h3>
                                            <Badge variant={
                                                transaction.status === "Success" ? "default" :
                                                    transaction.status === "Pending" ? "secondary" :
                                                        "destructive"
                                            }>{transaction.status}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg overflow-hidden mb-6">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Item</th>
                                                <th className="px-4 py-3 text-right font-medium">Harga Satuan</th>
                                                <th className="px-4 py-3 text-right font-medium">Jumlah</th>
                                                <th className="px-4 py-3 text-right font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {transaction.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3">{item.name}</td>
                                                    <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                                                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end">
                                    <div className="w-1/2 space-y-2">
                                        <div className="flex justify-between py-2 font-bold text-lg border-t border-b">
                                            <span>Total Pembayaran</span>
                                            <span>{formatCurrency(transaction.amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
