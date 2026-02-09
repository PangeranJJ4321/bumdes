"use client"

import { UnitForm } from "@/components/unit-form"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
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

export default function CreateUnitPage() {
    const router = useRouter()

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
                                        <BreadcrumbLink href="/admin/dashboard/units">Unit Bisnis</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Tambah Unit</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                    <IconArrowLeft className="h-4 w-4" />
                                </Button>
                                <h2 className="text-3xl font-bold tracking-tight">Tambah Unit Bisnis</h2>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl">
                        <UnitForm />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
