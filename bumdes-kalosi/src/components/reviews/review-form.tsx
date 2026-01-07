
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Mohon berikan bintang.");
            return;
        }
        if (!comment.trim()) {
            toast.error("Mohon isi komentar Anda.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment,
                    authorName: name || "Pengunjung"
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Ulasan berhasil dikirim!");
                setRating(0);
                setComment("");
                setName("");
                router.refresh(); // Refresh to show new review
            } else {
                toast.error("Gagal mengirim ulasan.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tulis Ulasan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-colors"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={`w-6 h-6 ${star <= (hoverRating || rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-slate-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Nama (Opsional)</Label>
                    <Input
                        id="name"
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="comment">Komentar</Label>
                    <Textarea
                        id="comment"
                        placeholder="Bagaimana pengalaman Anda dengan produk ini?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-white min-h-[100px]"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </Button>
            </form>
        </div>
    );
}
