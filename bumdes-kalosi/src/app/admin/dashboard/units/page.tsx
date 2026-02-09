"use client"

import { UnitsTable } from "@/components/units-table"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { trpc as api } from "@/lib/trpc/client"
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function UnitsPage() {
    const { data: units, isLoading } = api.businessUnit.getAll.useQuery()

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-4 pt-0">
                    <div className="flex items-center justify-between space-y-2 py-4">
                        <div className="flex flex-col gap-2">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Unit Bisnis</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <h2 className="text-3xl font-bold tracking-tight">Unit Bisnis</h2>
                        </div>
                    </div>

                    <UnitsTable data={units || []} isLoading={isLoading} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
