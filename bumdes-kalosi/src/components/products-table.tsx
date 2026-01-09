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
        header: "Harga",
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
        header: "Stok",
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
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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

export function ProductsTable({ data: initialData }: { data: Product[] }) {
    const [data, setData] = React.useState<Product[]>(initialData)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [categoryFilter, setCategoryFilter] = React.useState<string>("all")

    // Update local state when initialData changes
    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

    // Filter data based on category
    const filteredData = React.useMemo(() => {
        if (categoryFilter === "all") return data
        return data.filter((item) => item.category === categoryFilter)
    }, [data, categoryFilter])

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

    return (
        <div className="w-full space-y-4">
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
                    <div className="w-[180px]">
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
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {Object.values(ProductCategory).map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="default" asChild>
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
                                    Tidak ada produk ditemukan.
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
    )
}
