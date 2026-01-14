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
    IconPlus,
    IconSearch,
    IconTrash,
    IconFilter,
    IconArrowsSort,
} from "@tabler/icons-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
import { trpc as api } from "@/lib/trpc/client"
import { ProductCategory } from "@prisma/client"
import { useSession } from "next-auth/react"

export type Product = {
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    category: ProductCategory
    imageUrl: string | null
    promoPrice: number | null
    isPromo: boolean
    createdAt: Date
    updatedAt: Date
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value)
}

export const columns: ColumnDef<Product>[] = [
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
        accessorKey: "imageUrl",
        header: "Gambar",
        cell: ({ row }) => (
            <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                {row.original.imageUrl ? (
                    <img
                        src={row.original.imageUrl}
                        alt={row.original.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xs text-muted-foreground">No Img</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "Nama Produk",
        cell: ({ row }) => <div className="font-medium line-clamp-2">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Kategori",
        cell: ({ row }) => (
            <div className="flex flex-col gap-1">
                <Badge variant="outline" className="w-fit">{row.getValue("category")}</Badge>
                {row.original.isPromo && (
                    <Badge variant="default" className="w-fit bg-red-500 hover:bg-red-600 text-white border-red-600">
                        Promo
                    </Badge>
                )}
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 hover:bg-transparent"
                >
                    Harga
                    <IconArrowsSort className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div>
                {row.original.isPromo && row.original.promoPrice ? (
                    <div className="flex flex-col">
                        <span className="text-destructive font-bold">{formatCurrency(row.original.promoPrice)}</span>
                        <span className="text-muted-foreground line-through text-xs">{formatCurrency(row.original.price)}</span>
                    </div>
                ) : (
                    formatCurrency(row.getValue("price"))
                )}
            </div>
        ),
    },
    {
        accessorKey: "stock",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4 hover:bg-transparent"
                >
                    Stok
                    <IconArrowsSort className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original
            const utils = api.useUtils();
            const deleteMutation = api.product.delete.useMutation({
                onSuccess: () => {
                    toast.success("Produk berhasil dihapus")
                    utils.product.getAll.invalidate()
                    utils.product.getProductsGroup.invalidate()
                    utils.product.getServices.invalidate()
                    utils.dashboard.getStats.invalidate()
                },
                onError: (error) => {
                    toast.error(`Gagal menghapus produk: ${error.message}`)
                }
            })

            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <IconDotsVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(product.name)}
                            >
                                Copy nama
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/dashboard/products/${product.id}/edit`}>
                                    Edit Produk
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    Hapus
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Produk "{product.name}" akan dihapus permanen dari database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                                onClick={() => deleteMutation.mutate({ id: product.id })}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        },
    },
]

import { Skeleton } from "@/components/ui/skeleton"

export function ProductsTable({ data: initialData, isLoading }: { data: Product[]; isLoading?: boolean }) {
    const [data, setData] = React.useState<Product[]>(initialData)
    // ... hooks
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
    const [stockFilter, setStockFilter] = React.useState<string>("all")
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false)

    const { data: session } = useSession()
    const user = session?.user
    const isSuperAdmin = user?.role === 'SUPER_ADMIN'
    const showCategoryFilter = isSuperAdmin // Only Super Admin needs to switch categories

    // Update local state when initialData changes
    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    // Filter data based on category and stock
    const filteredData = React.useMemo(() => {
        let result = data

        // Category filter
        if (categoryFilter !== "all") {
            result = result.filter((item) => item.category === categoryFilter)
        }

        // Stock filter
        if (stockFilter === "available") {
            result = result.filter((item) => item.stock > 0)
        } else if (stockFilter === "out_of_stock") {
            result = result.filter((item) => item.stock === 0)
        } else if (stockFilter === "low_stock") {
            result = result.filter((item) => item.stock > 0 && item.stock < 10)
        }

        return result
    }, [data, categoryFilter, stockFilter])

    const table = useReactTable({
        data: filteredData,
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

    const utils = api.useUtils()
    const deleteMutation = api.product.delete.useMutation({
        onSuccess: () => {
            // Handled in bulk delete
        },
        onError: (error) => {
            toast.error(`Gagal menghapus produk: ${error.message}`)
        }
    })

    const executeBulkDelete = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        if (selectedRows.length === 0) return

        setIsBulkDeleteOpen(false)

        const toastId = toast.loading("Menghapus produk...")

        try {
            await Promise.all(selectedRows.map(row =>
                deleteMutation.mutateAsync({ id: row.original.id })
            ))

            toast.success(`${selectedRows.length} produk berhasil dihapus`, { id: toastId })
            setRowSelection({})
            utils.product.getDashboardProducts.invalidate()
            utils.dashboard.getStats.invalidate()
        } catch (error) {
            toast.error("Gagal menghapus beberapa produk", { id: toastId })
        }
    }

    return (
        <div className="w-full space-y-4">
            <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk Terpilih?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan menghapus {table.getFilteredSelectedRowModel().rows.length} produk. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                            onClick={executeBulkDelete}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* ... header controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1 md:max-w-sm">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari produk..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="pl-8 w-full"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-[150px] mr-2">
                        <Select
                            value={stockFilter}
                            onValueChange={setStockFilter}
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <IconFilter className="h-4 w-4" />
                                    <SelectValue placeholder="Stok" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Stok</SelectItem>
                                <SelectItem value="available">Tersedia</SelectItem>
                                <SelectItem value="low_stock">Menipis ({'<'} 10)</SelectItem>
                                <SelectItem value="out_of_stock">Habis</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {showCategoryFilter && (
                        <div className="w-[180px] mr-4">
                            <Select
                                value={categoryFilter}
                                onValueChange={setCategoryFilter}
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <IconFilter className="h-4 w-4" />
                                        <SelectValue placeholder="Kategori" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-sm">Semua Kategori</SelectItem>
                                    {Object.values(ProductCategory).map((category) => (
                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteOpen(true)}>
                            <IconTrash className="mr-2 h-4 w-4" />
                            Hapus ({table.getFilteredSelectedRowModel().rows.length})
                        </Button>
                    )}
                    <Button variant="default" size="sm" asChild>
                        <Link href="/admin/dashboard/products/create">
                            <IconPlus className="mr-2 h-4 w-4" /> Tambah Produk
                        </Link>
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
                                    <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
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
                                    Tidak ada produk ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* ... pagination */}
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
    )
}
