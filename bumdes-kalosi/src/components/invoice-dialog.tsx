"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconPrinter } from "@tabler/icons-react"
import { format } from "date-fns"
import { Transaction } from "./transactions-table"
import { OrderStatus } from "@prisma/client"

interface InvoiceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function InvoiceDialog({
    open,
    onOpenChange,
    transaction,
}: InvoiceDialogProps) {
    if (!transaction) return null

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value)
    }

    const handlePrint = () => {
        window.print()
    }

    const getStatusVariant = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.COMPLETED:
                return "default" // Green-ish usually, or customize
            case OrderStatus.PENDING:
                return "secondary"
            case OrderStatus.CANCELLED:
                return "destructive"
            default:
                return "outline"
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader className="flex-row items-center justify-between space-y-0 pb-6 border-b">
                    <DialogTitle className="text-2xl font-bold">Invoice</DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
                            <IconPrinter className="mr-2 h-4 w-4" /> Cetak
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-8 py-4 print:p-0">
                    {/* Header Details */}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-muted-foreground font-mono">#{transaction.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-lg">BUMDes Sumber Kalosi</p>
                            <p className="text-sm text-muted-foreground">Jl. Poros Kalosi No. 123</p>
                            <p className="text-sm text-muted-foreground">Sidenreng Rappang, Sulawesi Selatan</p>
                        </div>
                    </div>

                    {/* Customer & Transaction Info */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Ditagihkan Kepada</h3>
                            <p className="font-medium text-lg">{transaction.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{transaction.customer.email}</p>
                        </div>
                        <div className="text-right">
                            <div className="mb-4">
                                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Tanggal</h3>
                                <p className="font-medium">{format(new Date(transaction.date), "dd MMMM yyyy")}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</h3>
                                <Badge variant={getStatusVariant(transaction.status)}>
                                    {transaction.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Harga</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Jml</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {transaction.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 font-medium">{item.name}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(item.price)}</td>
                                        <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Total */}
                    <div className="flex justify-end">
                        <div className="w-full md:w-1/2 space-y-2">
                            <div className="flex justify-between py-4 border-t border-b bg-muted/20 px-4 rounded-lg">
                                <span className="font-bold text-lg">Total Pembayaran</span>
                                <span className="font-bold text-lg text-primary">{formatCurrency(transaction.amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="print:hidden">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
