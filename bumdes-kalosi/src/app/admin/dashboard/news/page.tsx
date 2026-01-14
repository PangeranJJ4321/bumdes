"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { NewsTable } from "@/components/news-table"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { trpc as api } from "@/lib/trpc/client"

export default function Page() {
    // Fetch all news, adjust limit as needed or add pagination support later
    const { data: newsData, isLoading } = api.news.getAll.useQuery({ limit: 50 })

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
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <h2 className="text-3xl font-bold tracking-tight">Berita</h2>
                        <div className="flex items-center space-x-2">
                            {/* Optional header actions */}
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <NewsTable data={newsData?.items || []} isLoading={isLoading} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
