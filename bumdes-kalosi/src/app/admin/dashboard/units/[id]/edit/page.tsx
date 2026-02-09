"use client"

import { UnitForm } from "@/components/unit-form"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import { useRouter, useParams } from "next/navigation"
import { trpc as api } from "@/lib/trpc/client"
import { Skeleton } from "@/components/ui/skeleton"
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

export default function EditUnitPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    // Since we don't have a specific getById endpoint yet, we can filter from getAll
    // or better, add getById. But for now, let's just use getAll and find.
    // Ideally we should add getById to the router.
    const { data: units, isLoading } = api.businessUnit.getAll.useQuery()
    const unit = units?.find((u: { id: string }) => u.id === id)

    if (isLoading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="max-w-2xl space-y-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        )
    }

    if (!unit) {
        return (
            <div className="flex-1 p-8 text-center text-muted-foreground">
                Unit tidak ditemukan.
                <Button onClick={() => router.back()} className="ml-4">Kembali</Button>
            </div>
        )
    }

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
                                        <BreadcrumbPage>Edit Unit</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                    <IconArrowLeft className="h-4 w-4" />
                                </Button>
                                <h2 className="text-3xl font-bold tracking-tight">Edit Unit Bisnis</h2>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl">
                        <UnitForm initialData={unit} isEdit />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
