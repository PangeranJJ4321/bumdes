"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    id: string;
    title: string;
    description: string;
    price?: number;
    category: string;
    imageUrl: string;
    isPromo?: boolean;
    promoPrice?: number;
    rating?: number;
    reviewCount?: number;
}

export function ProductCard({
    id,
    title,
    description,
    price,
    category,
    imageUrl,
    isPromo,
    promoPrice,
    rating = 0,
    reviewCount = 0
}: ProductCardProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Link href={`/layanan/${id}`} className="block h-full">
            <div className="group bg-white rounded-none shadow-sm hover:shadow-md border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className={cn(
                            "object-cover group-hover:scale-110 transition-all duration-700 ease-in-out",
                            isLoading ? "scale-110 blur-xl grayscale" : "scale-100 blur-0 grayscale-0"
                        )}
                        onLoad={() => setIsLoading(false)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-10">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-semibold shadow-none border border-black/10 rounded-none text-black">
                            {category}
                        </Badge>
                        {isPromo && (
                            <Badge className="bg-black text-white border-black animate-pulse shadow-none rounded-none">
                                Promo!
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    {reviewCount > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-slate-700">{rating.toFixed(1)}</span>
                            <span className="text-xs text-slate-400">({reviewCount})</span>
                        </div>
                    )}

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                        {description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            {price ? (
                                <div className="flex flex-col">
                                    {isPromo && promoPrice ? (
                                        <>
                                            <span className="text-xs text-muted-foreground line-through decoration-black/50">
                                                Rp {price.toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-lg font-bold text-black">
                                                Rp {promoPrice.toLocaleString('id-ID')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-lg font-bold text-slate-900">
                                            Rp {price.toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-sm font-medium text-primary">
                                    Hubungi Kami
                                </span>
                            )}
                        </div>

                        <Button
                            size="icon"
                            className="h-9 w-9 rounded-none shadow-sm hover:scale-105 transition-transform"
                            disabled={["Wisata", "Perikanan", "WISATA", "KETAPANG"].includes(category)}
                            title={["Wisata", "Perikanan", "WISATA", "KETAPANG"].includes(category) ? "Pembelian hanya tersedia di lokasi" : "Tambah ke Keranjang"}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
