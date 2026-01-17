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

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Email tidak valid." }),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordValues) => {
        setIsSubmitting(true)
        try {
            // 1. Generate Token from Server
            const { generateResetToken } = await import("@/app/actions/auth-actions")
            const response = await generateResetToken(data.email)

            // 2. If token returned, send email via EmailJS
            if (response.token && response.name) {
                const emailjs = (await import("@emailjs/browser")).default

                const resetLink = `${window.location.origin}/admin/reset-password?token=${response.token}`

                // NOTE: User must replace these with their own EmailJS credentials
                await emailjs.send(
                    "service_ckprzze",
                    "template_1q1ag0e",
                    {
                        to_name: response.name,
                        to_email: data.email,
                        reset_link: resetLink,
                    },
                    "ieplyVNwVH2q1I8lv"
                )

                toast.success("Link reset password telah dikirim ke email Anda.")
            } else {
                // Even if user not found, we show success to avoid enumeration
                toast.success("Jika email terdaftar, link reset password telah dikirim.")
            }

        } catch (error) {
            console.error("Forgot Password Error:", error)

            // Coba parsing error EmailJS (biasanya object { status, text })
            let errorMessage = "Gagal mengirim email reset password."
            if (typeof error === "object" && error !== null && "text" in error) {
                errorMessage = `Gagal: ${(error as any).text}`
            } else if (error instanceof Error) {
                errorMessage = error.message
            }

            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Lupa Password</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Masukkan email Anda untuk menerima link reset password
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="masukan email"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />
                    <FieldError errors={[{ message: errors.email?.message }]} />
                </Field>
                <Field>
                    <Button className="w-full cursor-pointer" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
                    </Button>
                </Field>
                <div className="text-center text-sm">
                    Kembali ke{" "}
                    <Link href="/admin/login" className="underline underline-offset-4 hover:text-primary">
                        Halaman Login
                    </Link>
                </div>
            </FieldGroup>
        </form>
    )
}
