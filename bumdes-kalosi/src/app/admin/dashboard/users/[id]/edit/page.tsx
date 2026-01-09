"use client"

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
import { UserForm } from "@/components/user-form"
import { trpc as api } from "@/lib/trpc/client"
import { use } from "react"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: user, isLoading } = api.user.getById.useQuery({ id })

    if (isLoading) {
        return <div className="p-8">Loading...</div>
    }

    if (!user) {
        return <div className="p-8">User tidak ditemukan</div>
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
                                        <BreadcrumbLink href="/admin/dashboard/users">Users</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Edit User</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 w-full">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
                            <p className="text-muted-foreground">
                                Perbarui informasi user yang terdaftar.
                            </p>
                        </div>
                        <UserForm
                            initialData={{
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                email: user.email,
                                phone: user.phone || "",
                                role: user.role,
                                isActive: user.isActive,
                            }}
                            isEdit
                        />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
