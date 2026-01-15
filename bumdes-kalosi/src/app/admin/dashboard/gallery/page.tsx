
import { prisma } from "@/server/db";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
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

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
    const galleryItems = await prisma.gallery.findMany({
        orderBy: { createdAt: "desc" },
    });

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
                    <div className="space-y-6">
                        <div className="flex items-center justify-between space-y-2 py-4">
                            <div className="flex flex-col gap-2">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Galeri</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                                <h2 className="text-3xl font-bold tracking-tight">Manajemen Galeri</h2>
                                <p className="text-muted-foreground">Kelola foto dan konten galeri desa.</p>
                            </div>
                            <Link href="/admin/dashboard/gallery/create">
                                <Button className="bg-black text-white hover:bg-slate-800">
                                    <Plus className="mr-2 h-4 w-4" /> Tambah Foto
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryItems.map((item) => (
                                <div key={item.id} className="group relative bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-all">
                                    <div className="aspect-[4/3] relative bg-slate-100">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-800 rounded-md">
                                                {item.category || "Umum"}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {format(new Date(item.createdAt), "d MMM yyyy", { locale: id })}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 truncate" title={item.title}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-2">
                                            {item.description || "Tidak ada deskripsi"}
                                        </p>

                                        <div className="mt-4 flex gap-2 pt-4 border-t border-slate-100">
                                            <Link href={`/admin/dashboard/gallery/${item.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Pencil className="w-3 h-3 mr-2" /> Edit
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                "use server"
                                                await prisma.gallery.delete({ where: { id: item.id } })
                                                revalidatePath("/admin/dashboard/gallery")
                                            }}>
                                                <Button variant="destructive" size="sm" type="submit" className="w-full">
                                                    <Trash className="w-3 h-3 mr-2" /> Hapus
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {galleryItems.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-lg">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">Belum ada foto</h3>
                                <p className="text-sm text-slate-500 mb-6">Mulai tambahkan foto ke galeri desa.</p>
                                <Link href="/admin/dashboard/gallery/create">
                                    <Button variant="outline">
                                        <Plus className="mr-2 h-4 w-4" /> Tambah Foto Pertama
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
