"use client"

import { Skeleton } from "@/components/ui/skeleton"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { trpc } from "@/lib/trpc/client"
import { Transaction } from "./transactions-table"

const formSchema = z.object({
    customerName: z.string().min(1, "Nama pelanggan harus diisi"),
    customerPhone: z.string().optional(),
    items: z.array(z.object({
        productId: z.string().min(1, "Produk harus dipilih"),
        quantity: z.number().min(1, "Jumlah minimal 1"),
        price: z.number(), // Tracked for UI calculation
    })).min(1, "Minimal satu produk"),
})

interface EditTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
    onSuccess?: () => void
}

export function EditTransactionDialog({
    open,
    onOpenChange,
    transaction,
    onSuccess
}: EditTransactionDialogProps) {
    const { data: products } = trpc.product.getAll.useQuery()
    const utils = trpc.useUtils()
    const updateMutation = trpc.order.update.useMutation({
        onSuccess: () => {
            toast.success("Transaksi berhasil diperbarui")
            utils.order.getAll.invalidate()
            onSuccess?.()
            onOpenChange(false)
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            items: [{ productId: "", quantity: 1, price: 0 }]
        }
    })

    // Reset form when transaction changes
    React.useEffect(() => {
        if (transaction && products) {
            // Map existing items to form items
            // We need to match product IDs. Since existing items only store name/price snapshot in generic JSON,
            // we have to try to match or just use the snapshot.
            // Wait, the API `items` JSON snapshot has `id` which corresponds to `productId` usually 
            // from my Create logic: id: product.id.

            const formItems = transaction.items.map((item: any) => {
                // Find matching product in current catalog if possible
                // The item.id from snapshot should be productId
                // Check TransactionsTable mapping: 
                // items: items.map((i: any) => ({ name: i.title, quantity: i.quantity, price: i.price }))
                // The `transaction` object passed here is from the table's processed data, which MIGHT NOT have productId
                // Let's check TransactionsTable transformation again.
                // It only maps name, quantity, price. It MISSES productId or raw item ID.
                // I need to update TransactionsTable to include productId in items first.
                return {
                    productId: "", // PROBLEM: We don't have productId in the frontend Transaction type yet
                    quantity: item.quantity,
                    price: item.price
                }
            })

            // FIXME: This logic is flawed because we don't have product IDs in the Table data.
            // I should fetch the order details by ID from the API inside this dialog for full editing capability.
            // For now, I will optimistically try to match by Name or just leave blank?
            // Actually, best practice: Let's fetch the specific order details inside this component.
        }
    }, [transaction, products, open])

    // Better approach: Fetch single order details when dialog opens
    const { data: orderDetails, isLoading: isLoadingDetails } = trpc.order.getById.useQuery(
        { id: transaction?.id || "" },
        { enabled: !!transaction && open }
    )

    React.useEffect(() => {
        if (orderDetails && products) {
            form.reset({
                customerName: orderDetails.customerName,
                customerPhone: orderDetails.customerPhone || "",
                items: orderDetails.itemsDetail.map(detail => ({
                    productId: detail.productId,
                    quantity: detail.quantity,
                    price: detail.price
                }))
            })
        }
    }, [orderDetails, products, form])


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    const watchItems = form.watch("items")
    const totalAmount = watchItems.reduce((acc, item) => {
        return acc + (item.price * item.quantity)
    }, 0)

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!transaction) return

        updateMutation.mutate({
            id: transaction.id,
            customerName: values.customerName,
            customerPhone: values.customerPhone,
            items: values.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity
            }))
        })
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Transaksi</DialogTitle>
                </DialogHeader>

                {isLoadingDetails ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <div className="border p-3 rounded-md bg-muted/20 flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="pt-8">
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customerName">Nama Pelanggan</Label>
                                <Input
                                    id="customerName"
                                    {...form.register("customerName")}
                                    placeholder="Cth. John Doe"
                                    aria-invalid={!!form.formState.errors.customerName}
                                />
                                {form.formState.errors.customerName && (
                                    <p className="text-xs text-red-500">{form.formState.errors.customerName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerPhone">No. Telepon (Opsional)</Label>
                                <Input
                                    id="customerPhone"
                                    {...form.register("customerPhone")}
                                    placeholder="0821..."
                                    aria-invalid={!!form.formState.errors.customerPhone}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Item Belanja</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ productId: "", quantity: 1, price: 0 })}
                                >
                                    <IconPlus className="h-4 w-4 mr-2" /> Tambah Item
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start border p-3 rounded-md bg-muted/20">
                                    <div className="flex-1 space-y-2">
                                        <Label className="text-xs">Produk</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                const product = products?.find(p => p.id === value)
                                                const price = product ? (product.isPromo && product.promoPrice ? product.promoPrice : product.price) : 0

                                                // Update form value
                                                form.setValue(`items.${index}.productId`, value)
                                                form.setValue(`items.${index}.price`, price)
                                            }}
                                            value={form.watch(`items.${index}.productId`)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih produk" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products?.map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.formState.errors.items?.[index]?.productId && (
                                            <p className="text-xs text-red-500">Pilih produk</p>
                                        )}
                                    </div>
                                    <div className="w-24 space-y-2">
                                        <Label className="text-xs">Jumlah</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div className="pt-8">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <IconTrash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <div className="text-lg font-semibold">Total</div>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(totalAmount)}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
