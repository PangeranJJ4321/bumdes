"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { loginAction } from "@/app/actions/auth-actions"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginValues } from "@/lib/schemas"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginValues) {
    setLoading(true)
    const formData = new FormData()
    formData.append("username", data.username)
    formData.append("password", data.password)

    const error = await loginAction(formData)
    setLoading(false)

    if (error) {
      toast.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">BUMDes Sumber Kalosi</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Masuk ke dashboard untuk mengelola BUMDes Sumber Kalosi
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            {...register("username")}
            type="text"
            placeholder="masukan username"
            aria-invalid={!!errors.username}
          />
          <FieldError>{errors.username?.message}</FieldError>
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/admin/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="pr-10"
              placeholder="masukan password"
              aria-invalid={!!errors.password}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          <FieldError>{errors.password?.message}</FieldError>
        </Field>
        <Field>
          <Button className="cursor-pointer w-full" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Masuk"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
