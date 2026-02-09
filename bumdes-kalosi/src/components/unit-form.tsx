"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
    FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { trpc as api } from "@/lib/trpc/client"

const unitFormSchema = z.object({
    name: z.string().min(2, {
        message: "Nama unit harus minimal 2 karakter.",
    }),
    description: z.string().optional(),
})

type UnitFormValues = z.infer<typeof unitFormSchema>

const defaultValues: Partial<UnitFormValues> = {
    name: "",
    description: "",
}

interface UnitFormProps {
    initialData?: {
        id: string;
        name: string;
        description: string | null;
    };
    isEdit?: boolean;
}

export function UnitForm({ initialData, isEdit = false }: UnitFormProps) {
    const router = useRouter()
    const utils = api.useUtils()

    const form = useForm<UnitFormValues>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            description: initialData.description || "",
        } : defaultValues,
    })

    const createMutation = api.businessUnit.create.useMutation({
        onSuccess: () => {
            toast.success("Unit berhasil ditambahkan!")
            utils.businessUnit.getAll.invalidate()
            router.push("/admin/dashboard/units")
        },
        onError: (error) => {
            toast.error(`Gagal menambahkan unit: ${error.message}`)
        }
    })

    const updateMutation = api.businessUnit.update.useMutation({
        onSuccess: () => {
            toast.success("Unit berhasil diperbarui!")
            utils.businessUnit.getAll.invalidate()
            router.push("/admin/dashboard/units")
        },
        onError: (error) => {
            toast.error(`Gagal memperbarui unit: ${error.message}`)
        }
    })

    const isPending = createMutation.isPending || updateMutation.isPending

    function onSubmit(data: UnitFormValues) {
        if (isEdit && initialData?.id) {
            updateMutation.mutate({
                id: initialData.id,
                name: data.name,
                description: data.description,
            })
        } else {
            createMutation.mutate({
                name: data.name,
                description: data.description,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Unit</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: Unit Jasa" {...field} disabled={isPending} />
                                </FormControl>
                                <FormDescription>
                                    Nama unit bisnis yang unik.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Deskripsi singkat tentang unit ini..."
                                        className="resize-none"
                                        {...field}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Menyimpan..." : (isEdit ? "Update Unit" : "Tambah Unit")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
