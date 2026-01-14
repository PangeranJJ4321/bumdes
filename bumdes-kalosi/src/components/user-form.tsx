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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { trpc as api } from "@/lib/trpc/client"
import { UserRole, ProductCategory } from "@prisma/client"

const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    username: z.string().min(3, {
        message: "Username harus minimal 3 karakter.",
    }),
    email: z.string().email({
        message: "Email tidak valid.",
    }),
    phone: z.string().optional(),
    role: z.nativeEnum(UserRole),
    isActive: z.boolean(),
    password: z.string().min(6, {
        message: "Password minimal 6 karakter.",
    }).optional().or(z.literal("")),
    unit: z.nativeEnum(ProductCategory).optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

const defaultValues: Partial<UserFormValues> = {
    name: "",
    username: "",
    email: "",
    phone: "",
    role: UserRole.STAFF,
    isActive: true,
    password: "",
}

interface UserFormProps {
    initialData?: {
        id?: string;
        name: string | null;
        username: string | null;
        email: string | null;
        phone: string | null;
        role: UserRole;
        isActive: boolean;
        unit: ProductCategory | null;
    };
    isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
    const router = useRouter()
    const utils = api.useUtils()

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialData ? {
            name: initialData.name || "",
            username: initialData.username || "",
            email: initialData.email || "",
            phone: initialData.phone || "",
            role: initialData.role,
            isActive: initialData.isActive,
            password: "",
            unit: initialData.unit || undefined,
        } : defaultValues,
    })

    const createMutation = api.user.create.useMutation({
        onSuccess: () => {
            toast.success("User berhasil ditambahkan!")
            utils.user.getAll.invalidate()
            router.push("/admin/dashboard/users")
        },
        onError: (error) => {
            toast.error(`Gagal menambahkan user: ${error.message}`)
        }
    })

    const updateMutation = api.user.update.useMutation({
        onSuccess: () => {
            toast.success("User berhasil diperbarui!")
            utils.user.getAll.invalidate()
            router.push("/admin/dashboard/users")
        },
        onError: (error) => {
            toast.error(`Gagal memperbarui user: ${error.message}`)
        }
    })

    const isPending = createMutation.isPending || updateMutation.isPending

    function onSubmit(data: UserFormValues) {
        if (isEdit && initialData?.id) {
            const updateData: any = {
                id: initialData.id,
                name: data.name,
                username: data.username,
                email: data.email,
                phone: data.phone,
                role: data.role,
                isActive: data.isActive,
                unit: data.role === UserRole.STAFF ? data.unit : null,
            }
            // Only send password if it's not empty, otherwise undefined
            if (data.password && data.password.length > 0) {
                updateData.password = data.password
            }

            updateMutation.mutate(updateData)
        } else {
            // Create requires password
            if (!data.password) {
                form.setError("password", { message: "Password wajib diisi untuk user baru." })
                return
            }
            createMutation.mutate({
                name: data.name,
                username: data.username,
                email: data.email,
                phone: data.phone,
                role: data.role,
                isActive: data.isActive,
                password: data.password,
                unit: data.role === UserRole.STAFF ? data.unit : undefined,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Informasi User</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Lengkap</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: John Doe" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username123" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="nama@perusahaan.com" type="email" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nomor HP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="081234567890" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{isEdit ? "Password Baru (Opsional)" : "Password"}</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} disabled={isPending} />
                                </FormControl>
                                <FormDescription>
                                    {isEdit ? "Kosongkan jika tidak ingin mengubah password." : "Password awal untuk user baru."}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4 pt-6">
                    <h2 className="text-2xl font-bold">Role & Status</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(UserRole).map((role) => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch("role") === UserRole.STAFF && (
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit Bisnis (Toko)</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value || undefined}
                                            disabled={isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih unit bisnis" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ProductCategory).map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Pilih unit bisnis yang akan dikelola oleh staff ini.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status Akun</FormLabel>
                                    <Select
                                        onValueChange={(val) => field.onChange(val === "true")}
                                        defaultValue={field.value ? "true" : "false"}
                                        disabled={isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Active</SelectItem>
                                            <SelectItem value="false">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Menyimpan..." : (isEdit ? "Update User" : "Tambah User")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
