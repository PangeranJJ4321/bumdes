"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Download, Filter, Loader2 } from "lucide-react"
import * as XLSX from "xlsx"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { trpc as api } from "@/lib/trpc/client"
import { ProductCategory } from "@prisma/client"
import { useSession } from "next-auth/react"

export function DashboardReports() {
    const { data: session } = useSession()
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN"

    const [date, setDate] = React.useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of month
        to: new Date(),
    })

    const [selectedUnit, setSelectedUnit] = React.useState<ProductCategory | "ALL">("ALL")

    const { data: report, isLoading } = api.dashboard.getReport.useQuery({
        startDate: date.from,
        endDate: date.to,
        unit: selectedUnit === "ALL" ? undefined : selectedUnit,
    })

    // Export handle
    const handleExport = () => {
        if (!report?.transactions) return

        const exportData = report.transactions.map(item => ({
            Tanggal: format(new Date(item.date), "dd/MM/yyyy HH:mm"),
            "ID Order": item.orderId.slice(0, 8),
            Produk: item.productName,
            ...(isSuperAdmin ? { "Unit Asal": item.unit } : {}), // Only show unit for Admin
            Ref: item.customer,
            Jumlah: item.quantity,
            Harga: item.price,
            "Total (Rp)": item.total,
            Status: item.status
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan")

        // Auto fit column width
        const max_width = exportData.reduce((w, r) => Math.max(w, r.Produk.length), 10);
        worksheet["!cols"] = [{ wch: 20 }, { wch: 10 }, { wch: max_width }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }];

        XLSX.writeFile(workbook, `Laporan_BUMDes_${format(new Date(), "yyyyMMdd")}.xlsx`)
    }

    return (
        <div className="flex flex-1 flex-col gap-4 px-4 lg:px-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Rekap Laporan</h3>
                <p className="text-sm text-muted-foreground">Laporan ringkasan penjualan dan transaksi sesuai periode terpilih.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-2">
                    {/* Date Picker */}
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-[260px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date as any}
                                    onSelect={(val: any) => setDate(val || { from: new Date(), to: new Date() })}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Unit Filter (Admin Only) */}
                    {isSuperAdmin && (
                        <Select value={selectedUnit} onValueChange={(val) => setSelectedUnit(val as any)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Unit</SelectItem>
                                {Object.values(ProductCategory).map((unit) => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <Button onClick={handleExport} disabled={isLoading || !report?.transactions.length}>
                    <Download className="mr-2 h-4 w-4" /> Export Excel
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                        <span className="text-muted-foreground font-bold">Rp</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(report?.summary.totalRevenue || 0)
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : report?.summary.totalTransactions || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">{report?.summary.count || 0} produk terjual</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detail Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>ID Order</TableHead>
                            <TableHead>Produk</TableHead>
                            {isSuperAdmin && <TableHead>Unit</TableHead>}
                            <TableHead className="text-right">Harga</TableHead>
                            <TableHead className="text-center">Qty</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Pembeli</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={isSuperAdmin ? 8 : 7} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Loading data...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : report?.transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isSuperAdmin ? 8 : 7} className="h-24 text-center">
                                    Tidak ada transaksi pada periode ini.
                                </TableCell>
                            </TableRow>
                        ) : (
                            report?.transactions.map((item, i) => (
                                <TableRow key={`${item.orderId}-${i}`}>
                                    <TableCell>{format(new Date(item.date), "dd/MM/yyyy")}</TableCell>
                                    <TableCell className="font-mono text-xs">{item.orderId.slice(0, 8)}</TableCell>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    {isSuperAdmin && (
                                        <TableCell>
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {item.unit}
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat("id-ID").format(item.price)}
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-bold">
                                        {new Intl.NumberFormat("id-ID").format(item.total)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{item.customer}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
