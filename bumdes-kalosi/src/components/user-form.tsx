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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    email: z.string().email({
        message: "Email tidak valid.",
    }),
    role: z.string().min(1, {
        message: "Silakan pilih role.",
    }),
    position: z.string().optional(),
    status: z.string().min(1, {
        message: "Silakan pilih status.",
    }),
    password: z.string().min(6, {
        message: "Password minimal 6 karakter.",
    }).optional().or(z.literal("")),
})

type UserFormValues = z.infer<typeof userFormSchema>

// Default values for the form
const defaultValues: Partial<UserFormValues> = {
    name: "",
    email: "",
    role: "Admin",
    position: "",
    status: "Active",
    password: "",
}

interface UserFormProps {
    initialData?: UserFormValues & { id?: string };
    isEdit?: boolean;
}

export function UserForm({ initialData, isEdit = false }: UserFormProps) {
    const router = useRouter()
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            email: initialData.email,
            role: initialData.role,
            position: initialData.position || "",
            status: initialData.status,
            password: "", // Don't fill password on edit
        } : defaultValues,
    })

    function onSubmit(data: UserFormValues) {
        toast.success(
            isEdit
                ? "User berhasil diperbarui!"
                : "User berhasil ditambahkan!"
        )
        console.log(JSON.stringify(data, null, 2))

        // Simulate API delay and redirect
        setTimeout(() => {
            router.push("/admin/dashboard/users")
        }, 1000)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Informasi User</h2>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nama Lengkap</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contoh: John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="nama@perusahaan.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!isEdit && (
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Password awal untuk user baru.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className="space-y-4 pt-6">
                    <h2 className="text-2xl font-bold">Role & Jabatan</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Staff">Staff</SelectItem>
                                            <SelectItem value="User">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jabatan</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Contoh: Staff Keuangan" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-6">
                    <h2 className="text-2xl font-bold">Status</h2>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status Akun</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-6">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit">{isEdit ? "Update User" : "Tambah User"}</Button>
                </div>
            </form>
        </Form>
    )
}
