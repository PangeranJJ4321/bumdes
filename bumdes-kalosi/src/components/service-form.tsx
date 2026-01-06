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

const serviceFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Nama layanan harus minimal 2 karakter.",
        })
        .max(100, {
            message: "Nama layanan tidak boleh lebih dari 100 karakter.",
        }),
    category: z.string().min(1, {
        message: "Silakan pilih kategori layanan.",
    }),
    price: z.string().min(1, {
        message: "Harga harus diisi.",
    }),
    status: z.string().min(1, {
        message: "Silakan pilih status.",
    }),
    image: z.string().url({
        message: "Masukkan URL gambar yang valid.",
    }).optional().or(z.literal("")),
    description: z.string().optional(),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>

// Default values for the form
const defaultValues: Partial<ServiceFormValues> = {
    name: "",
    category: "",
    price: "",
    status: "Aktif",
    image: "",
    description: "",
}

interface ServiceFormProps {
    initialData?: ServiceFormValues & { id?: string };
    isEdit?: boolean;
}

export function ServiceForm({ initialData, isEdit = false }: ServiceFormProps) {
    const router = useRouter()
    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            category: initialData.category,
            price: initialData.price,
            status: initialData.status,
            image: initialData.image,
            description: initialData.description || "",
        } : defaultValues,
    })

    function onSubmit(data: ServiceFormValues) {
        toast.success(
            isEdit
                ? "Layanan berhasil diperbarui!"
                : "Layanan berhasil ditambahkan!"
        )
        console.log(JSON.stringify(data, null, 2))

        // Simulate API delay and redirect
        setTimeout(() => {
            router.push("/admin/dashboard/services")
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
                                <FormLabel>Nama Layanan</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Paket Wisata Alam" {...field} />
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
                                        <SelectItem value="Wisata">Wisata</SelectItem>
                                        <SelectItem value="Penyewaan">Penyewaan</SelectItem>
                                        <SelectItem value="Jasa">Jasa</SelectItem>
                                        <SelectItem value="Edukasi">Edukasi</SelectItem>
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
                                        <SelectItem value="Aktif">Aktif</SelectItem>
                                        <SelectItem value="Nonaktif">Nonaktif</SelectItem>
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
                                <FormLabel>Harga Mulai (Rp)</FormLabel>
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
                                    Link gambar layanan.
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
                                <FormLabel>Deskripsi Layanan</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Jelaskan detail layanan..."
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
                    <Button type="submit">{isEdit ? "Update Layanan" : "Simpan Layanan"}</Button>
                </div>
            </form>
        </Form>
    )
}
