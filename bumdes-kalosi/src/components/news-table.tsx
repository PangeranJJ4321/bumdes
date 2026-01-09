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
    IconFilter,
    IconChevronDown,
    IconPlus,
    IconTrash,
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

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
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
import { useRouter } from "next/navigation"

export type NewsItem = {
    id: string
    title: string
    slug: string
    content: string
    thumbnail: string | null
    author: string
    publishedAt: Date
    createdAt: Date
    updatedAt: Date
}

export const columns: ColumnDef<NewsItem>[] = [
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
        accessorKey: "thumbnail",
        header: "Gambar",
        cell: ({ row }) => (
            <div className="h-12 w-20 overflow-hidden rounded-md border bg-muted">
                {row.original.thumbnail ? (
                    <img
                        src={row.original.thumbnail}
                        alt={row.original.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No Image
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: "Judul Berita",
        cell: ({ row }) => <div className="font-medium line-clamp-2 max-w-[300px]">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "author",
        header: "Penulis",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("author")}</div>,
    },
    {
        accessorKey: "publishedAt",
        header: "Tanggal",
        cell: ({ row }) => <div className="text-muted-foreground">{new Date(row.getValue("publishedAt")).toLocaleDateString("id-ID")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const news = row.original
            const utils = api.useUtils();
            const deleteMutation = api.news.delete.useMutation({
                onSuccess: () => {
                    toast.success("Berita berhasil dihapus")
                    utils.news.getAll.invalidate()
                    utils.news.getRecent.invalidate()
                    utils.dashboard.getStats.invalidate()
                },
                onError: (error) => {
                    toast.error(`Gagal menghapus berita: ${error.message}`)
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
                                onClick={() => navigator.clipboard.writeText(news.title)}
                            >
                                Copy title
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/dashboard/news/${news.id}/edit`}>
                                    Edit news
                                </Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Berita "{news.title}" akan dihapus permanen dari server.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => deleteMutation.mutate({ id: news.id })}
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

export function NewsTable({ data: initialData }: { data: NewsItem[] }) {
    const [data, setData] = React.useState<NewsItem[]>(initialData)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    // Update local state when initialData changes
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
        <div className="w-full">
            <div className="flex items-center gap-4 py-4">
                <Input
                    placeholder="Filter judul..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                    disabled={!table.getColumn("title")}
                />

                <div className="flex items-center gap-2 ml-auto">
                    <Button variant="default" size="sm" asChild>
                        <Link href="/admin/dashboard/news/create">
                            <IconPlus className="mr-2 h-4 w-4" /> Tambah Berita
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
                                    Tidak ada berita ditemukan.
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