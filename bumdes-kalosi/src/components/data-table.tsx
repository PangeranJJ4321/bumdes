"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconFilter,
  IconX,
} from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// ... imports

// Simplified schema for our needs or just use any for now to bridge the gap
// We can update the schema to match the actual order data structure later
export const schema = z.object({
  id: z.string().or(z.number()),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number | string }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },

  {
    accessorKey: "header",
    header: "Item Transaksi",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Layanan",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Lunas" || row.original.status === "Done" || row.original.status === "COMPLETED" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Total (Rp)</div>,
    cell: ({ row }) => (
      <div className="w-full text-right font-medium tabular-nums">
        {row.original.target}
      </div>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Tanggal</div>,
    cell: ({ row }) => (
      <div className="w-full text-right text-muted-foreground">
        {row.original.limit}
      </div>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Pelanggan",
    cell: ({ row }) => {
      return <span>{row.original.reviewer}</span>
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Print Invoice</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Cancel Order</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
export function DataTable({
  data: initialData,
  reviews: initialReviews = [],
  onUnitChange,
  selectedUnit,
}: {
  data: any[]
  reviews?: any[]
  onUnitChange?: (unit: string | undefined) => void
  selectedUnit?: string
}) {
  const [activeTab, setActiveTab] = React.useState("transactions")
  const [statusFilter, setStatusFilter] = React.useState("all")

  // Mapper to transform real Order data to the table's expected format
  const mappedTransactions = React.useMemo(() => {
    return initialData.map((order: any) => ({
      id: order.id,
      header: `Order #${order.id.slice(0, 8)}`,
      type: "Pesanan",
      status: order.status,
      target: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(order.totalPrice),
      limit: new Date(order.created_at).toLocaleDateString("id-ID"),
      reviewer: order.customerName,
    }))
  }, [initialData])

  const mappedReviews = React.useMemo(() => {
    return initialReviews.map((review: any) => ({
      id: review.id,
      header: `Review #${review.id.slice(0, 8)}`,
      type: "Ulasan",
      status: `${review.rating} ★`,
      target: review.product?.name || "Unknown Product",
      limit: new Date(review.createdAt).toLocaleDateString("id-ID"),
      reviewer: review.comment || "No comment",
    }))
  }, [initialReviews])

  const currentData = React.useMemo(() => {
    if (activeTab === "reviews") return mappedReviews

    // Filter Transactions by Status
    if (statusFilter === "all") return mappedTransactions
    if (statusFilter === "pending") return mappedTransactions.filter(t => t.status === "PENDING")
    if (statusFilter === "completed") return mappedTransactions.filter(t => t.status === "COMPLETED" || t.status === "Done" || t.status === "Lunas")

    return mappedTransactions
  }, [activeTab, mappedTransactions, mappedReviews, statusFilter])

  // Dynamic Column Headers based on activeTab
  const dynamicColumns = React.useMemo(() => {
    return columns.map(col => {
      if (col.accessorKey === 'status') {
        return { ...col, header: activeTab === 'transactions' ? 'Status' : 'Rating' }
      }
      if (col.accessorKey === 'target') {
        return { ...col, header: () => <div className="w-full text-right">{activeTab === 'transactions' ? 'Total (Rp)' : 'Produk'}</div> }
      }
      if (col.accessorKey === 'reviewer') {
        return { ...col, header: activeTab === 'transactions' ? 'Pelanggan' : 'Komentar' }
      }
      return col
    })
  }, [activeTab])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => currentData?.map(({ id }) => id) || [],
    [currentData]
  )

  const table = useReactTable({
    data: currentData,
    columns: dynamicColumns as any,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    // No-op for derived data
  }

  const { data: session } = useSession()
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN"

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Aktivitas Terbaru</h3>
              {isSuperAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1 ml-2">
                      <IconFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {selectedUnit ? selectedUnit : "Semua Unit"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Filter Unit</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === undefined}
                      onCheckedChange={() => onUnitChange && onUnitChange(undefined)}
                    >
                      Semua Unit
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === "MART"}
                      onCheckedChange={() => onUnitChange && onUnitChange("MART")}
                    >
                      Mart
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === "WISATA"}
                      onCheckedChange={() => onUnitChange && onUnitChange("WISATA")}
                    >
                      Wisata
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === "PERIKANAN"}
                      onCheckedChange={() => onUnitChange && onUnitChange("PERIKANAN")}
                    >
                      Perikanan
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === "LPG"}
                      onCheckedChange={() => onUnitChange && onUnitChange("LPG")}
                    >
                      LPG
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === "AGEN"}
                      onCheckedChange={() => onUnitChange && onUnitChange("AGEN")}
                    >
                      Agen
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedUnit === "KETAPANG"}
                      onCheckedChange={() => onUnitChange && onUnitChange("KETAPANG")}
                    >
                      Ketapang
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {isSuperAdmin && selectedUnit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onUnitChange && onUnitChange(undefined)}
                  title="Clear Filter"
                >
                  <IconX className="h-4 w-4" />
                  <span className="sr-only">Clear filter</span>
                </Button>
              )}
            </div>
            <TabsList>
              <TabsTrigger value="transactions">Transaksi</TabsTrigger>
              <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {activeTab === "transactions" && (
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="bg-transparent p-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 pb-2 pt-2">Semua</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 pb-2 pt-2">Perlu Diproses</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 pb-2 pt-2">Selesai</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Content Area - Always Visible */}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
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
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Tidak ada data transaksi.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-end px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Order ID / Item</Label>
              <Input id="header" value={item.header} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Input id="type" value={item.type} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Input id="status" value={item.status} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Total</Label>
                <Input id="target" value={item.target} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Tanggal</Label>
                <Input id="limit" value={item.limit} readOnly />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Pelanggan</Label>
              <Input id="reviewer" value={item.reviewer} readOnly />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
