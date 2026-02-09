"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { trpc as api } from "@/lib/trpc/client"
import { ImageUpload } from "@/components/ui/image-upload"
import { Switch } from "@/components/ui/switch"

const productFormSchema = z.object({
    name: z.string().min(2, { message: "Nama produk harus minimal 2 karakter." }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, { message: "Harga tidak boleh negatif." }),
    stock: z.coerce.number().min(0, { message: "Stok tidak boleh negatif." }),
    businessUnitId: z.string().min(1, { message: "Unit bisnis harus dipilih." }),
    imageUrl: z.string().optional().or(z.literal("")),
    isOnlineOrder: z.boolean().default(true),
})

type ProductFormValues = z.infer<typeof productFormSchema>

const defaultValues: Partial<ProductFormValues> = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    isOnlineOrder: true,
}

interface ProductFormProps {
    initialData?: ProductFormValues & { id?: string };
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const { data: units, isLoading: isLoadingUnits } = api.businessUnit.getAll.useQuery()

    const createMutation = api.product.create.useMutation({
        onSuccess: () => {
            toast.success("Produk berhasil ditambahkan!")
            router.push("/admin/dashboard/products")
            router.refresh()
        },
        onError: (error) => {
            toast.error(`Gagal menambahkan produk: ${error.message}`)
        }
    })

    const updateMutation = api.product.update.useMutation({
        onSuccess: () => {
            toast.success("Produk berhasil diperbarui!")
            router.push("/admin/dashboard/products")
            router.refresh()
        },
        onError: (error) => {
            toast.error(`Gagal memperbarui produk: ${error.message}`)
        }
    })

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema) as any,
        defaultValues: initialData || defaultValues,
    })

    function onSubmit(data: ProductFormValues) {
        if (isEdit && initialData?.id) {
            updateMutation.mutate({
                id: initialData.id,
                ...data,
                imageUrl: data.imageUrl || undefined,
            })
        } else {
            createMutation.mutate({
                ...data,
                imageUrl: data.imageUrl || undefined,
            })
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending || isLoadingUnits

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Produk / Layanan</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Kopi Arabika 200g" {...field} disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Jelaskan detail produk..."
                                        className="min-h-[120px]"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Harga (Rp)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stok</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormDescription>Gunakan angka besar jika stok tidak terbatas (misal: jasa)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <FormField
                            control={form.control}
                            name="isOnlineOrder"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Bisa Dipesan Online?</FormLabel>
                                        <FormDescription>
                                            Jika dimatikan, tombol "Tambah ke Keranjang" akan diganti "Datang Langsung".
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="businessUnitId"
                            render={({ field }) => {
                                const { data: session } = useSession()
                                const user = session?.user

                                const availableUnits = React.useMemo(() => {
                                    if (user?.role === 'STAFF' && user?.unitId) {
                                        return units?.filter(u => u.id === user.unitId) || []
                                    }
                                    return units || []
                                }, [user, units])

                                // Auto-select if only one option and no value
                                React.useEffect(() => {
                                    if (availableUnits.length === 1 && !field.value) {
                                        field.onChange(availableUnits[0].id)
                                    }
                                }, [availableUnits, field])

                                return (
                                    <FormItem>
                                        <FormLabel>Unit Bisnis</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending || (availableUnits.length === 1)}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih unit bisnis" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableUnits.map((unit) => (
                                                    <SelectItem key={unit.id} value={unit.id}>
                                                        {unit.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gambar Produk</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={(url) => field.onChange(url)}
                                            disabled={isPending}
                                            label="Upload Gambar Produk"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>{isEdit ? "Update Produk" : "Simpan Produk"}</Button>
                </div>
            </form>
        </Form>
    )
}