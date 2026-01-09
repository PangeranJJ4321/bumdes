"use client"

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
import { ProductCategory } from "@prisma/client"

const productFormSchema = z.object({
    name: z.string().min(2, { message: "Nama produk harus minimal 2 karakter." }),
    description: z.string().optional(),
    price: z.coerce.number().min(0, { message: "Harga tidak boleh negatif." }),
    stock: z.coerce.number().min(0, { message: "Stok tidak boleh negatif." }),
    category: z.nativeEnum(ProductCategory),
    imageUrl: z.string().url({ message: "URL gambar tidak valid." }).optional().or(z.literal("")),
})

type ProductFormValues = z.infer<typeof productFormSchema>

const defaultValues: Partial<ProductFormValues> = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    imageUrl: "",
}

interface ProductFormProps {
    initialData?: ProductFormValues & { id?: string };
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()

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
        resolver: zodResolver(productFormSchema),
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

    const isPending = createMutation.isPending || updateMutation.isPending

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ProductCategory).map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL Gambar</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} disabled={isPending} />
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