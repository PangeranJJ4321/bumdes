"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    IconDotsVertical,
    IconSearch,
    IconFileInvoice,
    IconEdit,
    IconTrash,
    IconFilter,
} from "@tabler/icons-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { TransactionStatusDialog } from "./transaction-status-dialog"

export type Transaction = {
    id: string
    date: string
    category: string
    customer: {
        name: string
        email: string
    }
    amount: number
    status: string
    items: {
        name: string
        quantity: number
        price: number
    }[]
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}


import { trpc as api } from "@/lib/trpc/client"
import { toast } from "sonner"
import { OrderStatus } from "@prisma/client"

// ... imports remain same ...

export function TransactionsTable() {
    // 1. Fetch Data
    const { data: orders, isLoading, refetch } = api.order.getAll.useQuery()

    // 2. Mutations
    const deleteMutation = api.order.delete.useMutation({
        onSuccess: () => {
            toast.success("Transaksi berhasil dihapus")
            refetch()
        },
        onError: (err) => toast.error("Gagal menghapus: " + err.message)
    })

    const updateStatusMutation = api.order.updateStatus.useMutation({
        onSuccess: () => {
            toast.success("Status berhasil diperbarui")
            refetch()
        },
        onError: (err) => toast.error("Gagal update status: " + err.message)
    })

    // 3. Transform Data to Table Format
    const data = React.useMemo(() => {
        if (!orders) return []
        return orders.map((order) => {
            // Parse items from JSON
            const items = (order.items as any[]) || []

            return {
                id: order.id,
                date: order.created_at.toISOString(),
                category: "Campuran", // Simplified logic, could be derived from items
                customer: {
                    name: order.customerName,
                    email: order.customerPhone || "-", // Using phone as identifier/contact
                },
                amount: order.totalPrice,
                status: order.status,
                items: items.map((i: any) => ({
                    name: i.title,
                    quantity: i.quantity,
                    price: i.price
                }))
            }
        })
    }, [orders])

    // Table States
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // Dialog States
    const [statusDialogOpen, setStatusDialogOpen] = React.useState(false)
    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
    const [deleteWarningOpen, setDeleteWarningOpen] = React.useState(false)
    const [transactionToDelete, setTransactionToDelete] = React.useState<Transaction | null>(null)
    const [bulkDeleteWarningOpen, setBulkDeleteWarningOpen] = React.useState(false)

    const handleEditStatus = (transaction: Transaction) => {
        // We will pass the transaction but the dialog needs to call mutation
        // For simplicity, let's keep the dialog but we need to inject the update function to it
        // Or handle update here if the dialog returns the new status
        setSelectedTransaction(transaction)
        setStatusDialogOpen(true)
    }

    const handleDeleteClick = (transaction: Transaction) => {
        setTransactionToDelete(transaction)
        setDeleteWarningOpen(true)
    }

    const confirmDelete = () => {
        if (transactionToDelete) {
            deleteMutation.mutate({ id: transactionToDelete.id })
            setDeleteWarningOpen(false)
            setTransactionToDelete(null)
        }
    }

    const handleBulkDeleteClick = () => {
        setBulkDeleteWarningOpen(true)
    }

    const confirmBulkDelete = () => {
        // Bulk delete logic not yet implemented in backend, loop for now or add bulkDelete endpoint
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const promises = selectedRows.map(row =>
            deleteMutation.mutateAsync({ id: row.original.id })
        )

        Promise.all(promises)
            .then(() => {
                toast.success(`${selectedRows.length} transaksi dihapus`)
                setRowSelection({})
                setBulkDeleteWarningOpen(false)
                refetch()
            })
            .catch(err => toast.error("Gagal menghapus beberapa item"))
    }

    const columns: ColumnDef<Transaction>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            header: "ID Transaksi",
            cell: ({ row }) => <div className="font-medium text-xs text-muted-foreground">{row.getValue("id")}</div>,
        },
        {
            accessorKey: "date",
            header: "Tanggal",
            cell: ({ row }) => (
                <div className="text-sm">
                    {format(new Date(row.getValue("date")), "dd MMM yyyy HH:mm")}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: "Kategori",
            cell: ({ row }) => (
                <Badge variant="outline">{row.getValue("category")}</Badge>
            ),
        },
        {
            accessorKey: "customer.name",
            id: "customerName",
            header: "Pelanggan",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.customer.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.customer.email}</span>
                </div>
            ),
        },
        {
            id: "items",
            header: "Items",
            cell: ({ row }) => {
                const items = row.original.items
                const count = items.reduce((acc, item) => acc + item.quantity, 0)
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{items.length > 0 ? items[0].name : "No items"}</span>
                        {items.length > 1 && (
                            <span className="text-xs text-muted-foreground">+{items.length - 1} lainnya ({count} total)</span>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "amount",
            header: "Total",
            cell: ({ row }) => <div className="font-medium">{formatCurrency(row.getValue("amount"))}</div>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                let variant: "default" | "secondary" | "destructive" | "outline" = "default"

                switch (status.toLowerCase()) {
                    case "pending": variant = "secondary"; break;
                    case "success": variant = "default"; break;
                    case "failed": variant = "destructive"; break;
                    case "cancelled": variant = "outline"; break;
                    default: variant = "outline"; break;
                }

                return (
                    <Badge variant={variant}>
                        {status}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const transaction = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <IconDotsVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(transaction.id)}
                            >
                                Copy ID Transaksi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/dashboard/transactions/${transaction.id}`}>
                                    <IconFileInvoice className="mr-2 h-4 w-4" /> Lihat Invoice
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStatus(transaction)}>
                                <IconEdit className="mr-2 h-4 w-4" /> Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteClick(transaction)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <IconTrash className="mr-2 h-4 w-4" /> Hapus Transaksi
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <>
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 md:max-w-sm">
                            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari pelanggan..."
                                value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("customerName")?.setFilterValue(event.target.value)
                                }
                                className="pl-8 w-full"
                            />
                        </div>
                        <div className="w-[150px]">
                            <Select
                                value={(table.getColumn("category")?.getFilterValue() as string) ?? "all"}
                                onValueChange={(value) =>
                                    table.getColumn("category")?.setFilterValue(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <IconFilter className="h-4 w-4" />
                                        <SelectValue placeholder="Kategori" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="Kuliner">Kuliner</SelectItem>
                                    <SelectItem value="Bumdes Mart">Bumdes Mart</SelectItem>
                                    <SelectItem value="Perikanan">Perikanan</SelectItem>
                                    <SelectItem value="Agen LPG">Agen LPG</SelectItem>
                                    <SelectItem value="Wisata">Wisata</SelectItem>
                                    <SelectItem value="Jasa">Jasa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[150px]">
                            <Select
                                value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                                onValueChange={(value) =>
                                    table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <IconFilter className="h-4 w-4" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {table.getFilteredSelectedRowModel().rows.length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDeleteClick}>
                                <IconTrash className="mr-2 h-4 w-4" />
                                Hapus ({table.getFilteredSelectedRowModel().rows.length})
                            </Button>
                        )}
                        <Button>
                            Tambah Transaksi
                        </Button>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Tidak ada transaksi ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <TransactionStatusDialog
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                transaction={selectedTransaction}
            />

            <AlertDialog open={deleteWarningOpen} onOpenChange={setDeleteWarningOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Transaksi ini akan dihapus secara permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={bulkDeleteWarningOpen} onOpenChange={setBulkDeleteWarningOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. {table.getFilteredSelectedRowModel().rows.length} transaksi yang dipilih akan dihapus secara permanen dari sistem.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
