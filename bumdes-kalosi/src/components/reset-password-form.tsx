"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password minimal 8 karakter." }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama.",
    path: ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const onSubmit = async (data: ResetPasswordValues) => {
        if (!token) {
            toast.error("Token tidak valid atau tidak ditemukan.")
            return
        }

        setIsSubmitting(true)
        try {
            const { resetPassword } = await import("@/app/actions/auth-actions")
            const response = await resetPassword(token, data.password)

            if (response.error) {
                toast.error(response.error)
            } else {
                toast.success("Password berhasil direset. Silakan login.")
                router.push("/admin/login")
            }
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat mereset password.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!token) {
        return (
            <div className="flex flex-col gap-6 text-center">
                <h1 className="text-2xl font-bold text-destructive">Token Invalid</h1>
                <p className="text-muted-foreground">
                    Link reset password tidak valid atau sudah kadaluarsa.
                </p>
                <Button asChild>
                    <Link href="/admin/forgot-password">Kirim Ulang Link</Link>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Masukkan password baru Anda
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="password">Password Baru</FieldLabel>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <FieldError errors={[{ message: errors.password?.message }]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirmPassword">Konfirmasi Password</FieldLabel>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="********"
                            aria-invalid={!!errors.confirmPassword}
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <FieldError errors={[{ message: errors.confirmPassword?.message }]} />
                </Field>
                <Field>
                    <Button className="w-full cursor-pointer" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Menyimpan..." : "Simpan Password Baru"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
