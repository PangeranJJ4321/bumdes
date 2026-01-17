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
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ImageUpload } from "@/components/ui/image-upload"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function CreateGalleryPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageUrl, setImageUrl] = useState("")

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
    })

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!imageUrl) {
            toast.error("Mohon upload gambar terlebih dahulu")
            return
        }

        setIsSubmitting(true)
        try {
            // Server Action pattern (simulated via API for consistency or direct Prisma if Server Action)
            // Ideally we use Server Actions, but sticking to client-side fetch for consistency with previous steps if needed.
            // Let's use a server action pattern if possible, but actually I haven't defined one.
            // I'll use a simple API route approach or server action in the same file if Next.js allows, 
            // but for safety/cleanliness I'll create a simple API route for gallery or use Server Action in a separate file.
            // Given the context, I will create a server action in a separate file later or inline it?
            // Wait, I can just use an API route `api/gallery`.

            const res = await fetch("/api/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, imageUrl })
            })

            if (!res.ok) throw new Error("Gagal menyimpan foto")

            toast.success("Foto berhasil ditambahkan ke galeri")
            router.push("/admin/dashboard/gallery")
            router.refresh()
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-4 pt-0">
                    <div className="space-y-6 max-w-2xl">
                        <div className="flex items-center justify-between space-y-2 py-4">
                            <div className="flex flex-col gap-2">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/admin/dashboard/gallery">Galeri</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Tambah Baru</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                                <h2 className="text-3xl font-bold tracking-tight">Tambah Foto Galeri</h2>
                                <p className="text-muted-foreground">Upload foto baru untuk ditampilkan di galeri desa.</p>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-8 bg-white p-8 rounded-lg border shadow-sm">

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
                                        aria-invalid={isSubmitting && !formData.title}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, category: val })}>
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
                                    Simpan Foto
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
