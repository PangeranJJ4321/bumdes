```

import { prisma } from "@/server/db"
import { notFound } from "next/navigation"
import { EditGalleryForm } from "./edit-form"
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

export default async function EditGalleryPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const galleryItem = await prisma.gallery.findUnique({
        where: { id: params.id }
    })

    if (!galleryItem) {
        notFound()
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
                                                <BreadcrumbPage>Edit Foto</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                                <h2 className="text-3xl font-bold tracking-tight">Edit Foto Galeri</h2>
                                <p className="text-muted-foreground">Ubah informasi foto dalam galeri.</p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg border shadow-sm">
                            <EditGalleryForm item={galleryItem} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
```
