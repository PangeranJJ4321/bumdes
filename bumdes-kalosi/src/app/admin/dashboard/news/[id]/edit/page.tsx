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
import newsData from "../../data.json"

export function generateStaticParams() {
    return newsData.map((news) => ({
        id: news.id.toString(),
    }))
}

export default function Page({ params }: { params: { id: string } }) {
    const newsItem = newsData.find((item) => item.id.toString() === params.id)

    if (!newsItem) {
        return <div>Berita tidak ditemukan</div>
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
                    <div className="flex flex-col gap-8 max-w-3xl">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Edit Berita</h2>
                            <p className="text-muted-foreground">
                                Perbarui informasi berita "{newsItem.title}".
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 bg-card">
                            <NewsForm
                                isEdit={true}
                                initialData={{
                                    ...newsItem,
                                    content: `Contoh konten berita untuk ${newsItem.title}. Ini adalah data dummy karena backend belum terhubung.`,
                                    image: newsItem.image || ""
                                }}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
