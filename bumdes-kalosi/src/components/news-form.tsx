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

const newsFormSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Judul harus minimal 2 karakter.",
        })
        .max(100, {
            message: "Judul tidak boleh lebih dari 100 karakter.",
        }),
    category: z.string().min(1, {
        message: "Silakan pilih kategori.",
    }),
    author: z.string().min(2, {
        message: "Penulis harus diisi.",
    }),
    status: z.string().min(1, {
        message: "Silakan pilih status.",
    }),
    date: z.string().min(1, {
        message: "Tanggal harus diisi.",
    }),
    image: z.string().url({
        message: "Masukkan URL gambar yang valid.",
    }).optional().or(z.literal("")),
    content: z.string().min(10, {
        message: "Konten berita minimal 10 karakter.",
    }),
})

type NewsFormValues = z.infer<typeof newsFormSchema>

// Default values for the form
const defaultValues: Partial<NewsFormValues> = {
    title: "",
    category: "",
    author: "",
    status: "Draft",
    date: new Date().toISOString().split('T')[0], // Default today yyyy-mm-dd
    image: "",
    content: "",
}

interface NewsFormProps {
    initialData?: NewsFormValues & { id?: number };
    isEdit?: boolean;
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
    const router = useRouter()
    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: initialData || defaultValues,
    })

    function onSubmit(data: NewsFormValues) {
        toast.success(
            isEdit
                ? "Berita berhasil diperbarui!"
                : "Berita berhasil ditambahkan!"
        )
        console.log(JSON.stringify(data, null, 2))

        // Simulate API delay and redirect
        setTimeout(() => {
            router.push("/admin/dashboard/news")
        }, 1000)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Judul Berita</FormLabel>
                                <FormControl>
                                    <Input placeholder="Masukkan judul berita..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    Judul utama berita yang akan ditampilkan di halaman depan.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Konten Berita</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tulis isi berita di sini..."
                                        className="min-h-[400px]"
                                        {...field}
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
                                            <SelectItem value="Berita">Berita</SelectItem>
                                            <SelectItem value="Pengumuman">Pengumuman</SelectItem>
                                            <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                                            <SelectItem value="Agenda">Agenda</SelectItem>
                                            <SelectItem value="Laporan">Laporan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Penulis</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama penulis..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                    <h2 className="text-2xl font-bold">Media</h2>
                    
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL Gambar</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Gambar sampul untuk berita ini.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <SelectItem value="Published">Published</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tanggal</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit">{isEdit ? "Update" : "Simpan"}</Button>
                </div>
            </form>
        </Form>
    )
}