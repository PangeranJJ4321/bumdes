import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">BUMDes Sumber Kalosi</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masuk ke dashboard untuk mengelola BUMDes Sumber Kalosi
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Lupa Password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button className="cursor-pointer" type="submit">Masuk</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
