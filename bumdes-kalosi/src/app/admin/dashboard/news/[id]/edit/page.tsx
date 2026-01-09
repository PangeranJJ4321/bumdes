"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { NewsForm } from "@/components/news-form"
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
import { trpc as api } from "@/lib/trpc/client"
import { use } from "react"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() for Next.js 15+ compatibility
    const { id } = use(params)

    // Fetch news data
    const { data: newsItem, isLoading } = api.news.getById.useQuery({ id })

    if (isLoading) {
        return <div className="p-8">Loading...</div>
    }

    if (!newsItem) {
        return <div className="p-8">Berita tidak ditemukan</div>
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
                    <div className="flex items-center space-x-2 py-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard/news">Berita</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Berita</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex flex-col gap-8 w-full">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Edit Berita</h2>
                            <p className="text-muted-foreground">
                                Perbarui informasi berita "{newsItem.title}"
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 bg-card">
                            <NewsForm
                                isEdit={true}
                                initialData={{
                                    id: newsItem.id,
                                    title: newsItem.title,
                                    author: newsItem.author,
                                    content: newsItem.content,
                                    thumbnail: newsItem.thumbnail || "",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
