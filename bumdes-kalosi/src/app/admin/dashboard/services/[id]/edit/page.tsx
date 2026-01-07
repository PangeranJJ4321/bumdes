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
import { ServiceForm } from "@/components/service-form"
import data from "../../data.json"

export function generateStaticParams() {
    return data.map((service) => ({
        id: service.id,
    }))
}

export default function Page({ params }: { params: { id: string } }) {
    const service = data.find((item) => item.id === params.id)

    if (!service) {
        return <div>Layanan tidak ditemukan</div>
    }

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col p-4 pt-0">
                    <div className="flex flex-col gap-4 py-4">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/dashboard/services">Layanan</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Layanan</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="flex flex-col gap-8 w-full">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Edit Layanan</h2>
                                <p className="text-muted-foreground">
                                    Perbarui informasi layanan "{service.name}".
                                </p>
                            </div>
                            <div className="border rounded-lg p-6 bg-card">
                                <ServiceForm initialData={{
                                    ...service,
                                    price: service.price.toString(),
                                }} isEdit />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
