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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { trpc as api } from "@/lib/trpc/client"
import { ImageUpload } from "@/components/ui/image-upload"
import { TiptapEditor } from "@/components/ui/tiptap-editor"

// Schema matching backend requirements more closely
const newsFormSchema = z.object({
    title: z.string().min(2, { message: "Judul harus minimal 2 karakter." }),
    author: z.string().min(2, { message: "Penulis harus diisi." }),
    thumbnail: z.string().optional(),
    content: z.string().min(10, { message: "Konten berita minimal 10 karakter." }),
})

type NewsFormValues = z.infer<typeof newsFormSchema>

const defaultValues: Partial<NewsFormValues> = {
    title: "",
    author: "Admin BUMDes",
    thumbnail: "",
    content: "",
}

interface NewsFormProps {
    initialData?: NewsFormValues & { id?: string };
    isEdit?: boolean;
}

export function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
    const router = useRouter()

    // TRPC Mutations
    const createMutation = api.news.create.useMutation({
        onSuccess: () => {
            toast.success("Berita berhasil ditambahkan!")
            router.push("/admin/dashboard/news")
            router.refresh()
        },
        onError: (error) => {
            toast.error(`Gagal membuat berita: ${error.message}`)
        }
    })

    const updateMutation = api.news.update.useMutation({
        onSuccess: () => {
            toast.success("Berita berhasil diperbarui!")
            router.push("/admin/dashboard/news")
            router.refresh()
        },
        onError: (error) => {
            toast.error(`Gagal memperbarui berita: ${error.message}`)
        }
    })

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: initialData ? {
            title: initialData.title,
            author: initialData.author,
            thumbnail: initialData.thumbnail || "",
            content: initialData.content
        } : defaultValues,
    })

    function onSubmit(data: NewsFormValues) {
        if (isEdit && initialData?.id) {
            updateMutation.mutate({
                id: initialData.id,
                title: data.title,
                content: data.content,
                thumbnail: data.thumbnail || undefined, // Send undefined if empty string
                author: data.author
            })
        } else {
            createMutation.mutate({
                title: data.title,
                content: data.content,
                thumbnail: data.thumbnail || undefined,
                author: data.author
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
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Judul Berita</FormLabel>
                                <FormControl>
                                    <Input placeholder="Masukkan judul berita..." {...field} disabled={isPending} />
                                </FormControl>
                                <FormDescription>
                                    Judul utama berita.
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
                                    <TiptapEditor
                                        placeholder="Tulis isi berita di sini..."
                                        value={field.value}
                                        onChange={field.onChange}
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
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Penulis</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama penulis..." {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail Berita</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={(url) => field.onChange(url)}
                                            disabled={isPending}
                                            label="Klik untuk upload cover berita"
                                        />
                                    </FormControl>
                                    <FormDescription>Gambar utama yang akan muncul di daftar berita.</FormDescription>
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
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Menyimpan..." : (isEdit ? "Update" : "Simpan")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}