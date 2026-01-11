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


export type CheckoutFormValues = z.infer<typeof checkoutSchema>

export type LoginValues = z.infer<typeof loginSchema>
