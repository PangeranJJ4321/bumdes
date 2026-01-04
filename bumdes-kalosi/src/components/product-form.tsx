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

const productFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Nama produk harus minimal 2 karakter.",
        })
        .max(100, {
            message: "Nama produk tidak boleh lebih dari 100 karakter.",
        }),
    category: z.string().min(1, {
        message: "Silakan pilih kategori produk.",
    }),
    price: z.string().min(1, {
        message: "Harga harus diisi.",
    }),
    stock: z.string().min(1, {
        message: "Stok harus diisi.",
    }),
    status: z.string().min(1, {
        message: "Silakan pilih status.",
    }),
    image: z.string().url({
        message: "Masukkan URL gambar yang valid.",
    }).optional().or(z.literal("")),
    description: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

// Default values for the form
const defaultValues: Partial<ProductFormValues> = {
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Tersedia",
    image: "",
    description: "",
}

interface ProductFormProps {
    initialData?: ProductFormValues & { id?: string };
    isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            category: initialData.category,
            price: initialData.price,
            stock: initialData.stock,
            status: initialData.status,
            image: initialData.image,
            description: initialData.description || "",
        } : defaultValues,
    })

    function onSubmit(data: ProductFormValues) {
        toast.success(
            isEdit
                ? "Produk berhasil diperbarui!"
                : "Produk berhasil ditambahkan!"
        )
        console.log(JSON.stringify(data, null, 2))

        // Simulate API delay and redirect
        setTimeout(() => {
            router.push("/admin/dashboard/products")
        }, 1000)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Nama Produk</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Kopi Arabika 200g" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategori</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Kuliner">Kuliner</SelectItem>
                                        <SelectItem value="Bumdes Mart">Bumdes Mart</SelectItem>
                                        <SelectItem value="Perikanan">Perikanan</SelectItem>
                                        <SelectItem value="Agen LPG">Agen LPG</SelectItem>
                                        <SelectItem value="Wisata">Wisata</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Tersedia">Tersedia</SelectItem>
                                        <SelectItem value="Habis">Habis</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harga (Rp)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" {...field} />
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
                                    <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>URL Gambar</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    Link gambar produk.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Deskripsi Produk</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Jelaskan detail produk..."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit">{isEdit ? "Update Produk" : "Simpan Produk"}</Button>
                </div>
            </form>
        </Form>
    )
}
