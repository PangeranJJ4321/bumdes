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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconArrowLeft, IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import data from "../data.json"

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
                                    <BreadcrumbPage>{service.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="max-w-4xl space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">{service.name}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline">{service.category}</Badge>
                                        <Badge variant={service.status === "Aktif" ? "default" : "secondary"}>
                                            {service.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/dashboard/services">
                                            <IconArrowLeft className="mr-2 h-4 w-4" /> Kembali
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={`/admin/dashboard/services/${service.id}/edit`}>
                                            <IconEdit className="mr-2 h-4 w-4" /> Edit Layanan
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid gap-2">
                                        <h3 className="font-semibold text-lg">Harga Mulai</h3>
                                        <p className="text-2xl font-bold text-primary">
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                                minimumFractionDigits: 0,
                                            }).format(service.price)}
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        <h3 className="font-semibold text-lg">Deskripsi</h3>
                                        <div className="prose prose-sm max-w-none text-muted-foreground">
                                            <p>{service.description || "Tidak ada deskripsi."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
