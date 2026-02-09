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
    IconTrash,
    IconPlus,
    IconEdit,
    IconDatabase
} from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
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
import { format } from "date-fns"
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
import Link from "next/link"
import { trpc as api } from "@/lib/trpc/client"

export type BusinessUnit = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count?: {
        products: number
        users: number
    }
}

export const columns: ColumnDef<BusinessUnit>[] = [
    {
        accessorKey: "name",
        header: "Nama Unit",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <IconDatabase size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => <div className="text-muted-foreground truncate max-w-[300px]">{row.getValue("description") || "-"}</div>,
    },
    {
        id: "stats",
        header: "Statistik",
        cell: ({ row }) => {
            const counts = row.original._count
            return (
                <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                        {counts?.products || 0} Produk
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {counts?.users || 0} Staff
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "updatedAt",
        header: "Terakhir Diupdate",
        cell: ({ row }) => (
            <div className="text-sm">
                {format(new Date(row.original.updatedAt), "dd MMM yyyy")}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const unit = row.original
            const utils = api.useUtils()
            const deleteMutation = api.businessUnit.delete.useMutation({
                onSuccess: () => {
                    toast.success("Unit berhasil dihapus")
                    utils.businessUnit.getAll.invalidate()
                },
                onError: (error) => {
                    toast.error(`Gagal menghapus unit: ${error.message}`)
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
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/dashboard/units/${unit.id}/edit`}>
                                    <IconEdit className="mr-2 h-4 w-4" /> Edit Unit
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    <IconTrash className="mr-2 h-4 w-4" /> Hapus Unit
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Unit "{unit.name}" akan dihapus permanen.
                                <br />
                                <span className="font-bold text-destructive mt-2 block">
                                    Pastikan tidak ada produk atau staff yang terhubung ke unit ini sebelum menghapus.
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteMutation.mutate({ id: unit.id })}
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

export function UnitsTable({ data: initialData, isLoading }: { data: BusinessUnit[]; isLoading?: boolean }) {
    const [data, setData] = React.useState<BusinessUnit[]>(initialData)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    React.useEffect(() => {
        setData(initialData)
    }, [initialData])

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
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1 md:max-w-sm">
                        <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari unit..."
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                            className="pl-8 w-full"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild>
                        <Link href="/admin/dashboard/units/create">
                            <IconPlus className="mr-2 h-4 w-4" /> Tambah Unit
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
                            Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
                                    Tidak ada unit bisnis ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
