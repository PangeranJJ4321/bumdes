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
import data from "../../data.json"

export function generateStaticParams() {
    return data.map((product) => ({
        id: product.id,
    }))
}

export default function Page({ params }: { params: { id: string } }) {
    const product = data.find((item) => item.id === params.id)

    if (!product) {
        return <div>Produk tidak ditemukan</div>
    }

    // Transform string ID to number/string based on form requirement (Form uses string/number coercion)
    // Actually our form schema expects defaults but values come from DB usually.
    // Let's rely on coercion in DefaultValues or just pass as is if compatible.
    // Product in JSON: id (string), price (number), stock (number).
    // Form expects: price(number), stock(number). So it matches.

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
                                Perbarui informasi produk "{product.name}".
                            </p>
                        </div>
                        <div className="border rounded-lg p-6 bg-card">
                            <ProductForm
                                initialData={{
                                    ...product,
                                    price: product.price.toString(),
                                    stock: product.stock.toString(),
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
