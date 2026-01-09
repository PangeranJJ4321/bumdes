"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { trpc as api } from "@/lib/trpc/client"
import { useEffect } from "react"

const settingsFormSchema = z.object({
    contactName: z.string().min(1, "Nama Kontak wajib diisi"),
    contactEmail: z.string().email("Email tidak valid").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    address: z.string().optional(),
    operatingHours: z.string().optional(),
    facebookUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
    instagramUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
    youtubeUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function SettingsForm() {
    const utils = api.useUtils()
    const { data: settings, isLoading } = api.settings.get.useQuery()

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: {
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
            operatingHours: "",
            facebookUrl: "",
            instagramUrl: "",
            youtubeUrl: "",
        },
    })

    useEffect(() => {
        if (settings) {
            form.reset({
                contactName: settings.contactName || "",
                contactEmail: settings.contactEmail || "",
                contactPhone: settings.contactPhone || "",
                address: settings.address || "",
                operatingHours: settings.operatingHours || "",
                facebookUrl: settings.facebookUrl || "",
                instagramUrl: settings.instagramUrl || "",
                youtubeUrl: settings.youtubeUrl || "",
            })
        }
    }, [settings, form])

    const updateMutation = api.settings.update.useMutation({
        onSuccess: () => {
            toast.success("Pengaturan berhasil disimpan!")
            utils.settings.get.invalidate()
        },
        onError: (error) => {
            toast.error(`Gagal menyimpan pengaturan: ${error.message}`)
        }
    })

    function onSubmit(data: SettingsFormValues) {
        updateMutation.mutate(data)
    }

    if (isLoading) {
        return <div>Loading settings...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Kontak & Alamat</CardTitle>
                        <CardDescription>
                            Informasi ini akan ditampilkan di Footer website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Organisasi</FormLabel>
                                        <FormControl>
                                            <Input placeholder="BUMDes Kalosi" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Telepon/WA</FormLabel>
                                        <FormControl>
                                            <Input placeholder="628..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="admin@bumdes.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Alamat Lengkap</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Jl. Poros..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Jam Operasional</CardTitle>
                        <CardDescription>
                            Jadwal buka/tutup kantor atau layanan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="operatingHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jadwal Operasional</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Senin - Jumat: 08:00 - 16:00" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Tuliskan secara singkat jadwal operasional.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social Media</CardTitle>
                        <CardDescription>
                            Link ke akun media sosial BUMDes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="facebookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facebook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://facebook.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="instagramUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://instagram.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="youtubeUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>YouTube URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://youtube.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
