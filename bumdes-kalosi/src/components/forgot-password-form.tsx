import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Lupa Password</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Masukkan email Anda untuk menerima link reset password
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder="masukan email" required />
                </Field>
                <Field>
                    <Button className="w-full cursor-pointer" type="submit">
                        Kirim Link Reset
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
