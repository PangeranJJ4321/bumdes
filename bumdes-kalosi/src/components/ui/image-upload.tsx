"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
    value?: string | null
    onChange: (url: string) => void
    disabled?: boolean
    label?: string
}

export function ImageUpload({ value, onChange, disabled, label = "Upload Image" }: ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false)

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return

        try {
            setIsLoading(true)
            const file = e.target.files[0]

            // Basic validation
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File terlalu besar (Max 5MB)")
                return
            }

            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })

            const data = await res.json()
            if (data.success) {
                onChange(data.url)
                toast.success("Gambar berhasil diupload")
            } else {
                toast.error("Upload gagal: " + data.message)
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat upload")
            console.error(error)
        } finally {
            setIsLoading(false)
            // Reset input so same file can be selected again if needed
            e.target.value = ""
        }
    }

    if (value) {
        return (
            <div className="space-y-2">
                <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                    <div className="absolute top-2 right-2 z-10">
                        <Button
                            type="button"
                            onClick={() => onChange("")}
                            variant="destructive"
                            size="icon"
                            disabled={disabled}
                            className="h-8 w-8 rounded-full shadow-lg"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image
                        fill
                        className="object-cover"
                        alt="Uploaded Image"
                        src={value}
                    />
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground px-1">
                    <span>URL: {value}</span>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onChange("")}>Ganti Gambar</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <label className={`
                flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 Transition-all duration-200
                ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
            `}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isLoading ? (
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
                    ) : (
                        <ImagePlus className="h-10 w-10 text-slate-400 mb-3" />
                    )}
                    <p className="mb-2 text-sm text-slate-500 font-medium">
                        {isLoading ? "Sedang mengupload..." : label}
                    </p>
                    <p className="text-xs text-slate-400">
                        SVG, PNG, JPG or GIF (MAX. 5MB)
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={onUpload}
                    accept="image/*"
                    disabled={disabled || isLoading}
                />
            </label>
        </div>
    )
}
