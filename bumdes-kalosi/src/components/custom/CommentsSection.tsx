"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Loader2, Send, User, Trash2 } from "lucide-react"
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

interface Comment {
    id: string;
    content: string;
    name: string;
    createdAt: string;
}

interface CommentsSectionProps {
    newsId: string;
}

export function CommentsSection({ newsId }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        content: ""
    })
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?newsId=${newsId}`)
            if (res.ok) {
                const data = await res.json()
                setComments(data)
            }
        } catch (error) {
            console.error("Failed to load comments", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [newsId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, newsId })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || "Gagal mengirim komentar")
            }

            toast.success("Komentar berhasil dikirim!");
            setFormData({ name: "", email: "", content: "" })
            fetchComments()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white border-t border-slate-100 pt-12 mt-12">
            <h3 className="font-serif text-2xl font-bold mb-8">Komentar ({comments.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-none border-slate-300 focus:border-black"
                    />
                    <Input
                        type="email"
                        placeholder="Email (tidak akan dipublikasikan)"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-none border-slate-300 focus:border-black"
                    />
                </div>
                <Textarea
                    placeholder="Tulis komentar anda..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    required
                    className="rounded-none border-slate-300 focus:border-black min-h-[120px]"
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-none bg-black text-white hover:bg-slate-800 w-full md:w-auto px-8"
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Kirim Komentar
                </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-6 max-w-3xl">
                {isLoading ? (
                    <div className="text-center py-8 text-black/50">Memuat komentar...</div>
                ) : comments.length === 0 ? (
                    <div className="p-8 bg-slate-50 border border-dashed border-slate-200 text-center text-slate-500 italic">
                        Belum ada komentar. Jadilah yang pertama berkomentar!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-6 bg-slate-50 border border-slate-100 animate-in fade-in slide-in-from-bottom-2 group relative">
                            <div className="shrink-0 w-10 h-10 bg-white border border-black/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-black/40" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-black">{comment.name}</span>
                                        <span className="text-xs text-slate-400">•</span>
                                        <span className="text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: id })}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                        onClick={() => setDeleteId(comment.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-sm pr-8">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Komentar?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Komentar ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                if (!deleteId) return
                                try {
                                    const res = await fetch(`/api/comments?id=${deleteId}`, { method: "DELETE" })
                                    if (res.ok) {
                                        toast.success("Komentar dihapus")
                                        fetchComments()
                                    } else {
                                        throw new Error("Gagal menghapus")
                                    }
                                } catch (err) {
                                    toast.error("Gagal menghapus komentar")
                                } finally {
                                    setDeleteId(null)
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
