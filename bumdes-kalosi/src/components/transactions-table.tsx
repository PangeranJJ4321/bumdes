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

import { trpc as api } from "@/lib/trpc/client"
import { toast } from "sonner"
import { OrderStatus } from "@prisma/client"

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
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { TransactionStatusDialog } from "./transaction-status-dialog"
import { InvoiceDialog } from "./invoice-dialog"
import { CreateTransactionDialog } from "./create-transaction-dialog"
import { EditTransactionDialog } from "./edit-transaction-dialog"

export type Transaction = {
    id: string
    date: string
    category: string
    customer: {
        name: string
        email: string
    }
    amount: number
    status: OrderStatus
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

            // Derive category from itemsDetail if available
            let displayCategory = "Campuran"
            if (order.itemsDetail && order.itemsDetail.length > 0) {
                const categories = new Set(order.itemsDetail.map((d: any) => d.product.category))
                if (categories.size === 1) {
                    displayCategory = Array.from(categories)[0] as string
                }
            }

            return {
                id: order.id,
                date: order.created_at.toISOString(),
                category: displayCategory,
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

    const { data: session } = useSession()
    const user = session?.user
    const isAdmin = user?.role === 'ADMIN'

    // Table States
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // Dialog States
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [selectedEditTransaction, setSelectedEditTransaction] = React.useState<Transaction | null>(null)
    const [statusDialogOpen, setStatusDialogOpen] = React.useState(false)
    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
    const [invoiceDialogOpen, setInvoiceDialogOpen] = React.useState(false)
    const [selectedInvoiceTransaction, setSelectedInvoiceTransaction] = React.useState<Transaction | null>(null)
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

                const getStatusStyles = (s: string) => {
                    switch (s) {
                        case OrderStatus.PENDING:
                            return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 focus:ring-yellow-500"
                        case OrderStatus.COMPLETED:
                            return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 focus:ring-green-500"
                        case OrderStatus.CANCELLED:
                            return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 focus:ring-red-500"
                        default:
                            return "bg-gray-100 text-gray-800 border-gray-200"
                    }
                }

                return (
                    <Select
                        defaultValue={status}
                        onValueChange={(value) => {
                            updateStatusMutation.mutate({
                                id: row.original.id,
                                status: value as OrderStatus,
                            })
                        }}
                    >
                        <SelectTrigger className={`w-[130px] h-8 font-medium transition-colors ${getStatusStyles(status)}`}>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={OrderStatus.PENDING} className="text-yellow-800 focus:bg-yellow-100 focus:text-yellow-900">
                                Pending
                            </SelectItem>
                            <SelectItem value={OrderStatus.COMPLETED} className="text-green-800 focus:bg-green-100 focus:text-green-900">
                                Completed
                            </SelectItem>
                            <SelectItem value={OrderStatus.CANCELLED} className="text-red-800 focus:bg-red-100 focus:text-red-900">
                                Cancelled
                            </SelectItem>
                        </SelectContent>
                    </Select>
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
                            <DropdownMenuItem onClick={() => {
                                setSelectedEditTransaction(transaction)
                                setEditDialogOpen(true)
                            }}>
                                <IconEdit className="mr-2 h-4 w-4" /> Edit Transaksi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setSelectedInvoiceTransaction(transaction)
                                setInvoiceDialogOpen(true)
                            }}>
                                <IconFileInvoice className="mr-2 h-4 w-4" /> Lihat Invoice
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
                        {isAdmin && (
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
                        )}
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
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                        <Button onClick={() => setCreateDialogOpen(true)}>
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
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
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

            <EditTransactionDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                transaction={selectedEditTransaction}
                onSuccess={() => refetch()}
            />

            <CreateTransactionDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={() => refetch()}
            />

            <TransactionStatusDialog
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                transaction={selectedTransaction}
            />

            <InvoiceDialog
                open={invoiceDialogOpen}
                onOpenChange={setInvoiceDialogOpen}
                transaction={selectedInvoiceTransaction}
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
