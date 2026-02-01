"use client";

import { Star, User, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    authorName: string;
    createdAt: Date;
}

interface ReviewListProps {
    reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">Belum ada ulasan untuk produk ini.</p>
                <p className="text-sm text-slate-400">Jadilah yang pertama memberikan ulasan!</p>
            </div>
        );
    }

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`/api/reviews?id=${deleteId}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Ulasan dihapus");
                router.refresh();
            } else {
                throw new Error("Gagal menghapus");
            }
        } catch (err) {
            toast.error("Gagal menghapus ulasan");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 group relative">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{review.authorName}</h4>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: idLocale })}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                onClick={() => setDeleteId(review.id)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mt-2 pl-10">
                        {review.comment}
                    </p>
                </div>
            ))}

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Ulasan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ulasan ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
