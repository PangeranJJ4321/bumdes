"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { trpc as api } from "@/lib/trpc/client"
import { toast } from "sonner"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { profileFormSchema, passwordFormSchema, ProfileFormValues, PasswordFormValues } from "@/lib/schemas"

export default function ProfilePage() {
    const { data: user, refetch } = api.user.getProfile.useQuery()

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
                <div className="flex flex-1 flex-col gap-6 p-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola pengaturan akun dan preferensi Anda.
                        </p>
                    </div>

                    <Separator />

                    {/* Cards Grid */}
                    <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
                        {user ? (
                            <>
                                <PersonalInfoCard user={user} onSuccess={refetch} />
                                <SecurityCard />
                            </>
                        ) : (
                            <div className="col-span-2 text-center py-10">Memuat profil...</div>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function PersonalInfoCard({ user, onSuccess }: { user: any, onSuccess: () => void }) {
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [isResetOpen, setIsResetOpen] = React.useState(false)
    const [pendingData, setPendingData] = React.useState<ProfileFormValues | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name || "",
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
        },
    })

    // Update form defaults when user data loads/changes
    React.useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
            })
        }
    }, [user, form])

    const updateProfile = api.user.updateProfile.useMutation({
        onSuccess: () => {
            toast.success("Profil berhasil diperbarui")
            onSuccess()
            setIsConfirmOpen(false)
        },
        onError: (err) => {
            toast.error(err.message)
            setIsConfirmOpen(false)
        }
    })

    const onPreSubmit = (data: ProfileFormValues) => {
        setPendingData(data)
        setIsConfirmOpen(true)
    }

    const handleSave = () => {
        if (pendingData) {
            updateProfile.mutate(pendingData)
        }
    }

    const handleReset = () => {
        form.reset({
            name: user.name || "",
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
        })
        setIsResetOpen(false)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error("Gagal mengunggah gambar")

            const data = await res.json()
            if (data.success && data.url) {
                updateProfile.mutate({ image: data.url })
            } else {
                toast.error("Gagal menyimpan gambar")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat mengunggah")
            console.error(error)
        } finally {
            setIsUploading(false)
            // Reset input so validation doesn't block selecting same file again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>
                    Perbarui detail pribadi Anda di sini.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onPreSubmit)}>
                    <CardContent className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.image || "/avatars/avatar.png"} alt={user.name} />
                                <AvatarFallback className="text-lg">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">Foto Profil</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {isUploading ? "Mengunggah..." : "Ubah Avatar"}
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan nama lengkap" {...field} />
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
                                            <Input placeholder="username" {...field} />
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
                                        <FormLabel>Alamat Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@contoh.com" type="email" {...field} />
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
                                        <FormLabel>Nomor WhatsApp</FormLabel>
                                        <FormControl>
                                            <Input placeholder="contoh: 62812345678" type="tel" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Digunakan untuk tombol "Chat Penjual"
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Peran</FormLabel>
                                <Input
                                    value={user.role}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Hubungi admin untuk mengubah peran Anda
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" type="button" onClick={() => setIsResetOpen(true)}>Reset</Button>
                        <Button type="submit" disabled={updateProfile.isPending}>Simpan</Button>
                    </CardFooter>
                </form>
            </Form>

            <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Perubahan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mereset perubahan? Ini akan mengembalikan formulir ke data profil Anda saat ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">Reset</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Simpan Perubahan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin memperbarui informasi profil Anda?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave}>Simpan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

function SecurityCard() {
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [isResetOpen, setIsResetOpen] = React.useState(false)
    const [pendingData, setPendingData] = React.useState<PasswordFormValues | null>(null)

    // Visibility States
    const [showCurrent, setShowCurrent] = React.useState(false)
    const [showNew, setShowNew] = React.useState(false)
    const [showConfirm, setShowConfirm] = React.useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const changePassword = api.user.changePassword.useMutation({
        onSuccess: () => {
            toast.success("Kata sandi berhasil diubah")
            form.reset()
            setIsConfirmOpen(false)
        },
        onError: (err) => {
            toast.error(err.message)
            setIsConfirmOpen(false)
        }
    })

    const onPreSubmit = (data: PasswordFormValues) => {
        setPendingData(data)
        setIsConfirmOpen(true)
    }

    const handleUpdatePassword = () => {
        if (pendingData) {
            changePassword.mutate({
                oldPassword: pendingData.currentPassword,
                newPassword: pendingData.newPassword,
            })
        }
    }

    const handleReset = () => {
        form.reset()
        setIsResetOpen(false)
    }

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Keamanan</CardTitle>
                <CardDescription>
                    Kelola kata sandi dan keamanan akun Anda.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onPreSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kata Sandi Saat Ini</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showCurrent ? "text" : "password"}
                                                placeholder="Masukkan kata sandi saat ini"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                            >
                                                {showCurrent ? (
                                                    <IconEyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <IconEye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kata Sandi Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showNew ? "text" : "password"}
                                                placeholder="Masukkan kata sandi baru"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowNew(!showNew)}
                                            >
                                                {showNew ? (
                                                    <IconEyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <IconEye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="Konfirmasi kata sandi baru"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                            >
                                                {showConfirm ? (
                                                    <IconEyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <IconEye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" type="button" onClick={() => setIsResetOpen(true)}>Bersihkan</Button>
                        <Button type="submit" disabled={changePassword.isPending}>Perbarui Kata Sandi</Button>
                    </CardFooter>
                </form>
            </Form>

            <AlertDialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bersihkan Kolom?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus semua isian kata sandi?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">Bersihkan</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Perbarui Kata Sandi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin mengubah kata sandi? Anda harus menggunakan kata sandi baru untuk login berikutnya.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdatePassword}>Perbarui</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}