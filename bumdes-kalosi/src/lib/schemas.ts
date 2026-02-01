import { z } from "zod"

export const loginSchema = z.object({
    username: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
})

export const checkoutSchema = z.object({
    nama: z.string().min(3, "Nama harus diisi minimal 3 karakter"),
    noHp: z.string().min(10, "Nomor HP tidak valid (min 10 digit)").max(15, "Nomor HP terlalu panjang"),
    alamatLengkap: z.string().optional(),
    metodePengiriman: z.enum(["PICKUP", "COURIER"]),
    waOptIn: z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (data.metodePengiriman === 'COURIER') {
        if (!data.alamatLengkap || data.alamatLengkap.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Alamat harus detail (min 10 karakter) untuk pengiriman kurir",
                path: ["alamatLengkap"],
            });
        }
    }
});

export const profileFormSchema = z.object({
    name: z.string().min(1, {
        message: "Nama lengkap wajib diisi.",
    }),
    username: z.string().min(3, {
        message: "Username minimal 3 karakter.",
    }),
    email: z.string().email("Alamat email tidak valid."),
    phone: z.string().optional(),
    image: z.string().optional(),
})

export const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, {
        message: "Kata sandi saat ini wajib diisi.",
    }),
    newPassword: z.string().min(6, {
        message: "Kata sandi baru minimal 6 karakter.",
    }),
    confirmPassword: z.string().min(1, {
        message: "Konfirmasi kata sandi wajib diisi.",
    }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi tidak cocok.",
    path: ["confirmPassword"],
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

export type PasswordFormValues = z.infer<typeof passwordFormSchema>



export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export type LoginValues = z.infer<typeof loginSchema>
