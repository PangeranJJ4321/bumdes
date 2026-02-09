"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProductForm } from "@/components/product-form"
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
    // Unwrap params using React.use()
    const { id } = use(params)

    // Fetch product data
    const { data: product, isLoading } = api.product.getById.useQuery({ id })

    if (isLoading) {
        return <div className="p-8">Loading...</div>
    }

    if (!product) {
        return <div className="p-8">Produk tidak ditemukan</div>
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
                                    <BreadcrumbLink href="/admin/dashboard/products">Produk</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Produk</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex flex-col gap-8 w-full">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Edit Produk</h2>
                            <p className="text-muted-foreground">
                                Perbarui informasi produk "{product.name}"
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 bg-card">
                            <ProductForm
                                initialData={{
                                    id: product.id,
                                    name: product.name,
                                    description: product.description || "",
                                    price: product.price,
                                    stock: product.stock,
                                    businessUnitId: product.businessUnitId,
                                    imageUrl: product.imageUrl || "",
                                    isOnlineOrder: product.isOnlineOrder,
                                }}
                                isEdit
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
