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
import newsData from "../data.json"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft, IconPencil } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

export function generateStaticParams() {
    return newsData.map((news) => ({
        id: news.id.toString(),
    }))
}

export default function Page({ params }: { params: { id: string } }) {
    const newsItem = newsData.find((item) => item.id.toString() === params.id)

    if (!newsItem) {
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
                    <div className="flex flex-1 flex-col items-center justify-center p-4">
                        <h2 className="text-2xl font-bold">Berita tidak ditemukan</h2>
                        <Button className="mt-4" asChild>
                            <Link href="/admin/dashboard/news">Kembali ke Daftar Berita</Link>
                        </Button>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
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
                                    <BreadcrumbPage>Detail Berita</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-10">
                        <div className="flex items-center justify-between">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/dashboard/news">
                                    <IconArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                </Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={`/admin/dashboard/news/${newsItem.id}/edit`}>
                                    <IconPencil className="mr-2 h-4 w-4" /> Edit Berita
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                                <img
                                    src={newsItem.image}
                                    alt={newsItem.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge>{newsItem.category}</Badge>
                                <Badge variant={newsItem.status === "Published" ? "default" : "secondary"}>
                                    {newsItem.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground ml-auto">
                                    {newsItem.date} by <span className="font-medium text-foreground">{newsItem.author}</span>
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                {newsItem.title}
                            </h1>

                            <div className="prose dark:prose-invert max-w-none">
                                <p className="leading-7">
                                    {/* Mock Content if real content is missing in simple data */}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p className="leading-7 mt-4">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <p className="leading-7 mt-4">
                                    Catatan: Halaman ini menampilkan detail berita ID {newsItem.id}. Konten lengkap saat ini masih menggunakan dummy text karena keterbatasan data JSON.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
