"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Gallery } from "@prisma/client"
import { ImageUpload } from "@/components/ui/image-upload"

interface EditGalleryFormProps {
    item: Gallery
}

export function EditGalleryForm({ item }: EditGalleryFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageUrl, setImageUrl] = useState(item.imageUrl)

    const [formData, setFormData] = useState({
        title: item.title,
        category: item.category || "",
        description: item.description || "",
    })

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imageUrl) {
            toast.error("Mohon upload gambar terlebih dahulu")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/gallery/${item.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, imageUrl })
            })

            if (!res.ok) throw new Error("Gagal menyimpan perubahan")

            toast.success("Foto berhasil diperbarui")
            router.push("/admin/dashboard/gallery")
            router.refresh()
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-2">
                <Label>Foto Galeri</Label>
                <div className="max-w-xl">
                    <ImageUpload
                        value={imageUrl}
                        onChange={(url) => setImageUrl(url)}
                        disabled={isSubmitting}
                        label="Upload Foto Galeri"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Judul Foto</Label>
                    <Input
                        id="title"
                        placeholder="Contoh: Panen Raya 2025"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALAM">Alam & Wisata</SelectItem>
                            <SelectItem value="KEGIATAN">Kegiatan Warga</SelectItem>
                            <SelectItem value="BUDAYA">Seni & Budaya</SelectItem>
                            <SelectItem value="PEMBANGUNAN">Pembangunan Desa</SelectItem>
                            <SelectItem value="LAINNYA">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi (Opsional)</Label>
                    <Textarea
                        id="description"
                        placeholder="Ceritakan sedikit tentang foto ini..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="min-h-[100px]"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Batal
                </Button>
                <Button type="submit" disabled={isSubmitting || !imageUrl} className="bg-black text-white hover:bg-slate-800">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Perubahan
                </Button>
            </div>
        </form>
    )
}
